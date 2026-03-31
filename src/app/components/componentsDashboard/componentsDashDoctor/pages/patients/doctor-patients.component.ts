import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PatientModel } from './models/patient.model';
import { PatientsService } from './services/patients.service';

@Component({
  selector: 'app-doctor-patients',
  templateUrl: './doctor-patients.component.html',
  styleUrl: './doctor-patients.component.scss',
  standalone: false,
})
export class DoctorPatientsComponent {
  protected readonly patientForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    age: [30, [Validators.required, Validators.min(0)]],
    gender: ['F' as 'F' | 'M', [Validators.required]],
    phone: ['', [Validators.required]],
    bloodGroup: ['A+'],
    chronicDisease: ['Aucune'],
    lastVisitDate: ['', [Validators.required]],
    nextAppointmentDate: ['', [Validators.required]],
    riskLevel: ['low' as 'low' | 'medium' | 'high', [Validators.required]]
  });

  protected patients: PatientModel[] = [];
  protected selectedPatient: PatientModel | null = null;
  protected showForm = false;
  protected editingId: string | null = null;

  constructor(private readonly fb: FormBuilder, private readonly patientsService: PatientsService) {
    this.patients = this.patientsService.list();
    this.selectedPatient = this.patients[0] ?? null;
  }

  protected selectPatient(patient: PatientModel): void {
    this.selectedPatient = patient;
  }

  protected toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  protected createPatient(): void {
    if (this.patientForm.invalid) return;

    const value = this.patientForm.getRawValue();
    const payload = {
      firstName: value.firstName ?? '',
      lastName: value.lastName ?? '',
      age: Number(value.age ?? 0),
      gender: (value.gender ?? 'F') as 'F' | 'M',
      phone: value.phone ?? '',
      bloodGroup: value.bloodGroup ?? '',
      chronicDisease: value.chronicDisease ?? '',
      lastVisitDate: value.lastVisitDate ?? '',
      nextAppointmentDate: value.nextAppointmentDate ?? '',
      riskLevel: (value.riskLevel ?? 'low') as 'low' | 'medium' | 'high'
    };

    if (this.editingId) {
      this.patients = this.patients.map((patient) => patient.id === this.editingId ? { ...patient, ...payload } : patient);
      this.selectedPatient = this.patients.find((patient) => patient.id === this.editingId) ?? null;
    } else {
      const patient = this.patientsService.add(payload);
      this.patients = this.patientsService.list();
      this.selectedPatient = patient;
    }
    this.showForm = false;
    this.resetForm();
  }

  protected editSelectedPatient(): void {
    if (!this.selectedPatient) {
      return;
    }
    this.editingId = this.selectedPatient.id;
    this.showForm = true;
    this.patientForm.patchValue({
      firstName: this.selectedPatient.firstName,
      lastName: this.selectedPatient.lastName,
      age: this.selectedPatient.age,
      gender: this.selectedPatient.gender,
      phone: this.selectedPatient.phone,
      bloodGroup: this.selectedPatient.bloodGroup,
      chronicDisease: this.selectedPatient.chronicDisease,
      lastVisitDate: this.selectedPatient.lastVisitDate,
      nextAppointmentDate: this.selectedPatient.nextAppointmentDate,
      riskLevel: this.selectedPatient.riskLevel
    });
  }

  protected deleteSelectedPatient(): void {
    if (!this.selectedPatient) {
      return;
    }
    const selectedId = this.selectedPatient.id;
    this.patients = this.patients.filter((patient) => patient.id !== selectedId);
    this.selectedPatient = this.patients[0] ?? null;
    if (this.editingId === selectedId) {
      this.showForm = false;
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.editingId = null;
    this.patientForm.reset({
      firstName: '',
      lastName: '',
      age: 30,
      gender: 'F',
      phone: '',
      bloodGroup: 'A+',
      chronicDisease: 'Aucune',
      lastVisitDate: '',
      nextAppointmentDate: '',
      riskLevel: 'low'
    });
  }
}
