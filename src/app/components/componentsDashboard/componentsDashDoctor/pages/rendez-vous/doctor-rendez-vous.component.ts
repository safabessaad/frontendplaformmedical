import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type AppointmentStatus = 'Confirme' | 'En attente' | 'Reporte' | 'Annule';
type AppointmentType = 'Consultation generale' | 'Suivi' | 'Urgence' | 'Teleconsultation';

interface AppointmentItem {
  id: string;
  time: string;
  date: string;
  patient: string;
  type: AppointmentType;
  room: string;
  status: AppointmentStatus;
  notes: string;
}

@Component({
  selector: 'app-doctor-rendez-vous',
  templateUrl: './doctor-rendez-vous.component.html',
  styleUrl: './doctor-rendez-vous.component.scss',
  standalone: false,
})
export class DoctorRendezVousComponent {
  protected readonly statuses: Array<AppointmentStatus | 'Tous'> = ['Tous', 'Confirme', 'En attente', 'Reporte', 'Annule'];
  protected selectedStatus: AppointmentStatus | 'Tous' = 'Tous';
  protected searchTerm = '';
  protected showForm = false;
  protected editingId: string | null = null;

  protected readonly appointmentForm = this.fb.group({
    patient: ['', [Validators.required]],
    date: ['', [Validators.required]],
    time: ['09:00', [Validators.required]],
    type: ['Consultation generale' as AppointmentType, [Validators.required]],
    room: ['Cabinet 1', [Validators.required]],
    status: ['En attente' as AppointmentStatus, [Validators.required]],
    notes: ['']
  });

  protected appointments: AppointmentItem[] = [
    {
      id: 'RDV-1',
      time: '09:00',
      date: '2026-03-16',
      patient: 'Youssef El Idrissi',
      type: 'Suivi',
      room: 'Cabinet 1',
      status: 'Confirme',
      notes: 'Controle diabete'
    },
    {
      id: 'RDV-2',
      time: '10:20',
      date: '2026-03-16',
      patient: 'Imane Bennani',
      type: 'Consultation generale',
      room: 'Cabinet 2',
      status: 'En attente',
      notes: 'Douleurs thoraciques'
    },
    {
      id: 'RDV-3',
      time: '11:10',
      date: '2026-03-16',
      patient: 'Fatima Rachidi',
      type: 'Teleconsultation',
      room: 'Visio',
      status: 'Reporte',
      notes: 'Suivi tension'
    },
    {
      id: 'RDV-4',
      time: '14:00',
      date: '2026-03-17',
      patient: 'Khalid A.',
      type: 'Urgence',
      room: 'Cabinet 1',
      status: 'Annule',
      notes: ''
    }
  ];

  protected selectedAppointment: AppointmentItem | null = this.appointments[0] ?? null;

  constructor(private readonly fb: FormBuilder) {}

  protected get filteredAppointments(): AppointmentItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.appointments.filter((item) => {
      const statusMatch = this.selectedStatus === 'Tous' || item.status === this.selectedStatus;
      const searchMatch = !term || item.patient.toLowerCase().includes(term);
      return statusMatch && searchMatch;
    });
  }

  protected get todayCount(): number {
    return this.appointments.filter((item) => item.date === '2026-03-16').length;
  }

  protected get confirmedCount(): number {
    return this.appointments.filter((item) => item.status === 'Confirme').length;
  }

  protected get pendingCount(): number {
    return this.appointments.filter((item) => item.status === 'En attente').length;
  }

  protected get cancelledCount(): number {
    return this.appointments.filter((item) => item.status === 'Annule').length;
  }

  protected toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  protected selectAppointment(item: AppointmentItem): void {
    this.selectedAppointment = item;
    this.showForm = true;
    this.editingId = item.id;
    this.appointmentForm.patchValue(item);
  }

  protected saveAppointment(): void {
    if (this.appointmentForm.invalid) return;
    const value = this.appointmentForm.getRawValue();
    const normalized = {
      patient: value.patient ?? '',
      date: value.date ?? '',
      time: value.time ?? '09:00',
      type: (value.type ?? 'Consultation generale') as AppointmentType,
      room: value.room ?? 'Cabinet 1',
      status: (value.status ?? 'En attente') as AppointmentStatus,
      notes: value.notes ?? ''
    };
    if (this.editingId) {
      this.appointments = this.appointments.map((item) =>
        item.id === this.editingId ? { ...item, ...normalized } : item
      );
    } else {
      this.appointments = [{ id: `RDV-${Date.now()}`, ...normalized }, ...this.appointments];
    }
    this.selectedAppointment = this.appointments[0] ?? null;
    this.resetForm();
  }

  protected resetForm(): void {
    this.editingId = null;
    this.appointmentForm.reset({
      patient: '',
      date: '',
      time: '09:00',
      type: 'Consultation generale',
      room: 'Cabinet 1',
      status: 'En attente',
      notes: ''
    });
  }

  protected setStatus(item: AppointmentItem, status: AppointmentStatus): void {
    item.status = status;
  }

  protected statusClass(status: AppointmentStatus): string {
    switch (status) {
      case 'Confirme':
        return 'confirmed';
      case 'En attente':
        return 'pending';
      case 'Reporte':
        return 'postponed';
      default:
        return 'cancelled';
    }
  }
}
