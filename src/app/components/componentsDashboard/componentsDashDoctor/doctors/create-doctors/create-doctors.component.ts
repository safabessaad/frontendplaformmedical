import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type DoctorStatus = 'Active' | 'On leave' | 'Inactive';
interface DoctorItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  yearsExperience: number;
  availability: string;
  status: DoctorStatus;
}

@Component({
  selector: 'app-create-doctors',
  standalone: false,
  templateUrl: './create-doctors.component.html',
  styleUrl: './create-doctors.component.scss',
})
export class CreateDoctorsComponent {
  protected searchTerm = '';
  protected showForm = false;
  protected editingId: string | null = null;

  protected readonly doctorForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    specialty: ['', [Validators.required]],
    yearsExperience: [3, [Validators.required, Validators.min(0)]],
    availability: ['Mon-Fri 09:00-17:00', [Validators.required]],
    status: ['Active' as DoctorStatus, [Validators.required]]
  });

  protected doctors: DoctorItem[] = [
    {
      id: 'DOC-001',
      firstName: 'Sami',
      lastName: 'Khiari',
      email: 'sami.khiari@clinic.com',
      phone: '+216 55 221 144',
      specialty: 'General medicine',
      yearsExperience: 10,
      availability: 'Mon-Fri 09:00-17:00',
      status: 'Active'
    },
    {
      id: 'DOC-002',
      firstName: 'Nour',
      lastName: 'Ben Ali',
      email: 'nour.benali@clinic.com',
      phone: '+216 58 110 778',
      specialty: 'Cardiology',
      yearsExperience: 7,
      availability: 'Mon-Thu 08:30-15:30',
      status: 'On leave'
    }
  ];
  protected selectedDoctor: DoctorItem | null = this.doctors[0] ?? null;

  constructor(private readonly fb: FormBuilder) {}

  protected get filteredDoctors(): DoctorItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.doctors;
    }
    return this.doctors.filter((doctor) =>
      `${doctor.id} ${doctor.firstName} ${doctor.lastName} ${doctor.specialty}`.toLowerCase().includes(term)
    );
  }

  protected get activeCount(): number {
    return this.doctors.filter((doctor) => doctor.status === 'Active').length;
  }

  protected get onLeaveCount(): number {
    return this.doctors.filter((doctor) => doctor.status === 'On leave').length;
  }

  protected get totalCount(): number {
    return this.doctors.length;
  }

  protected selectDoctor(doctor: DoctorItem): void {
    this.selectedDoctor = doctor;
  }

  protected toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  protected saveDoctor(): void {
    if (this.doctorForm.invalid) {
      return;
    }
    const value = this.doctorForm.getRawValue();
    const payload = {
      firstName: value.firstName ?? '',
      lastName: value.lastName ?? '',
      email: value.email ?? '',
      phone: value.phone ?? '',
      specialty: value.specialty ?? '',
      yearsExperience: Number(value.yearsExperience ?? 0),
      availability: value.availability ?? '',
      status: (value.status ?? 'Active') as DoctorStatus
    };

    if (this.editingId) {
      this.doctors = this.doctors.map((doctor) => doctor.id === this.editingId ? { ...doctor, ...payload } : doctor);
      this.selectedDoctor = this.doctors.find((doctor) => doctor.id === this.editingId) ?? null;
    } else {
      const created: DoctorItem = { id: `DOC-${Date.now().toString().slice(-4)}`, ...payload };
      this.doctors = [created, ...this.doctors];
      this.selectedDoctor = created;
    }

    this.showForm = false;
    this.resetForm();
  }

  protected editSelectedDoctor(): void {
    if (!this.selectedDoctor) {
      return;
    }
    this.editingId = this.selectedDoctor.id;
    this.showForm = true;
    this.doctorForm.patchValue({
      firstName: this.selectedDoctor.firstName,
      lastName: this.selectedDoctor.lastName,
      email: this.selectedDoctor.email,
      phone: this.selectedDoctor.phone,
      specialty: this.selectedDoctor.specialty,
      yearsExperience: this.selectedDoctor.yearsExperience,
      availability: this.selectedDoctor.availability,
      status: this.selectedDoctor.status
    });
  }

  protected deleteSelectedDoctor(): void {
    if (!this.selectedDoctor) {
      return;
    }
    const id = this.selectedDoctor.id;
    this.doctors = this.doctors.filter((doctor) => doctor.id !== id);
    this.selectedDoctor = this.doctors[0] ?? null;
    if (this.editingId === id) {
      this.showForm = false;
      this.resetForm();
    }
  }

  protected statusClass(status: DoctorStatus): 'active' | 'leave' | 'inactive' {
    if (status === 'Active') return 'active';
    if (status === 'On leave') return 'leave';
    return 'inactive';
  }

  private resetForm(): void {
    this.editingId = null;
    this.doctorForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialty: '',
      yearsExperience: 3,
      availability: 'Mon-Fri 09:00-17:00',
      status: 'Active'
    });
  }
}
