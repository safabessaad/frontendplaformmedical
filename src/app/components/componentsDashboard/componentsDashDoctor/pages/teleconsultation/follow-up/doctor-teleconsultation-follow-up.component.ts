import { Component } from '@angular/core';

type FollowUpStatus = 'Pending' | 'In Progress' | 'Completed';
interface FollowUpItem {
  id: string;
  patient: string;
  sessionId: string;
  nextDate: string;
  treatmentPlan: string;
  status: FollowUpStatus;
}

@Component({
  selector: 'app-doctor-teleconsultation-follow-up',
  templateUrl: './doctor-teleconsultation-follow-up.component.html',
  styleUrl: './doctor-teleconsultation-follow-up.component.scss',
  standalone: false,
})
export class DoctorTeleconsultationFollowUpComponent {
  protected followUps: FollowUpItem[] = [
    {
      id: 'FU-101',
      patient: 'Fatima Rachidi',
      sessionId: 'TEL-101',
      nextDate: '2026-03-20',
      treatmentPlan: 'Suivi tension',
      status: 'In Progress',
    },
    {
      id: 'FU-102',
      patient: 'Imane Bennani',
      sessionId: 'TEL-102',
      nextDate: '2026-03-25',
      treatmentPlan: 'Résultats biologie',
      status: 'Pending',
    },
    {
      id: 'FU-100',
      patient: 'Karim Idrissi',
      sessionId: 'TEL-098',
      nextDate: '2026-03-10',
      treatmentPlan: 'Bilan post-op',
      status: 'Completed',
    },
  ];

  protected get kpiInProgress(): number {
    return this.followUps.filter((f) => f.status === 'In Progress').length;
  }

  protected get kpiPending(): number {
    return this.followUps.filter((f) => f.status === 'Pending').length;
  }

  protected get kpiCompleted(): number {
    return this.followUps.filter((f) => f.status === 'Completed').length;
  }

  protected initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  protected followUpLabel(status: FollowUpStatus): string {
    const map: Record<FollowUpStatus, string> = {
      Pending: 'En attente',
      'In Progress': 'En cours',
      Completed: 'Terminé',
    };
    return map[status];
  }

  protected followUpStatusClass(status: FollowUpStatus): string {
    const map: Record<FollowUpStatus, string> = {
      Pending: 'tc-fu-badge--pending',
      'In Progress': 'tc-fu-badge--progress',
      Completed: 'tc-fu-badge--done',
    };
    return map[status];
  }
}
