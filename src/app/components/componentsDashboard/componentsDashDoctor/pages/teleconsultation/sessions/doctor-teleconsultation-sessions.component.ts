import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type SessionStatus = 'Planned' | 'Live' | 'Finished' | 'Cancelled';
interface TeleconsultationSession {
  id: string;
  patient: string;
  date: string;
  startTime: string;
  duration: number;
  status: SessionStatus;
  roomUrl: string;
}

@Component({
  selector: 'app-doctor-teleconsultation-sessions',
  templateUrl: './doctor-teleconsultation-sessions.component.html',
  styleUrl: './doctor-teleconsultation-sessions.component.scss',
  standalone: false,
})
export class DoctorTeleconsultationSessionsComponent {
  protected showForm = false;
  protected readonly sessionForm = this.fb.group({
    patient: ['', [Validators.required]],
    date: ['', [Validators.required]],
    startTime: ['09:00', [Validators.required]],
    duration: [30, [Validators.required]],
  });

  protected sessions: TeleconsultationSession[] = [
    {
      id: 'TEL-101',
      patient: 'Fatima Rachidi',
      date: '2026-03-16',
      startTime: '11:00',
      duration: 30,
      status: 'Live',
      roomUrl: 'https://tele.msk.local/room/TEL-101',
    },
    {
      id: 'TEL-102',
      patient: 'Imane Bennani',
      date: '2026-03-17',
      startTime: '10:30',
      duration: 25,
      status: 'Planned',
      roomUrl: 'https://tele.msk.local/room/TEL-102',
    },
    {
      id: 'TEL-103',
      patient: 'Youssef Alami',
      date: '2026-03-31',
      startTime: '14:00',
      duration: 20,
      status: 'Planned',
      roomUrl: 'https://tele.msk.local/room/TEL-103',
    },
  ];

  constructor(private readonly fb: FormBuilder) {}

  /** Jour courant (YYYY-MM-DD) pour les KPI — démo statique. */
  protected get kpiToday(): number {
    const today = new Date().toISOString().slice(0, 10);
    return this.sessions.filter((s) => s.date === today).length;
  }

  protected get kpiLive(): number {
    return this.sessions.filter((s) => s.status === 'Live').length;
  }

  protected get kpiPlanned(): number {
    return this.sessions.filter((s) => s.status === 'Planned').length;
  }

  protected initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  protected sessionStatusLabel(status: SessionStatus): string {
    const map: Record<SessionStatus, string> = {
      Live: 'En direct',
      Planned: 'Planifiée',
      Finished: 'Terminée',
      Cancelled: 'Annulée',
    };
    return map[status];
  }

  protected sessionStatusClass(status: SessionStatus): string {
    const map: Record<SessionStatus, string> = {
      Live: 'tc-badge--live',
      Planned: 'tc-badge--planned',
      Finished: 'tc-badge--finished',
      Cancelled: 'tc-badge--cancelled',
    };
    return map[status];
  }

  protected createSession(): void {
    if (this.sessionForm.invalid) return;
    const value = this.sessionForm.getRawValue();
    const id = `TEL-${Date.now().toString().slice(-4)}`;
    this.sessions = [
      {
        id,
        patient: value.patient ?? '',
        date: value.date ?? '',
        startTime: value.startTime ?? '09:00',
        duration: Number(value.duration ?? 30),
        status: 'Planned',
        roomUrl: `https://tele.msk.local/room/${id}`,
      },
      ...this.sessions,
    ];
    this.showForm = false;
    this.sessionForm.reset({ patient: '', date: '', startTime: '09:00', duration: 30 });
  }
}
