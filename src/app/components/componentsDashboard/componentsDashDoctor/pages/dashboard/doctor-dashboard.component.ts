import { Component } from '@angular/core';
import { Router } from '@angular/router';

export type AgendaStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export type StatNavKey = 'appointments' | 'patients' | 'revenue' | 'satisfaction';

export interface AgendaItem {
  id: string;
  patientId: string;
  time: string;
  patientName: string;
  type: string;
  status: AgendaStatus;
}

export interface RecentPatient {
  id: string;
  initials: string;
  name: string;
  condition: string;
  avatarClass: string;
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: false,
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
})
export class DoctorDashboardComponent {
  constructor(private readonly router: Router) {}

  readonly statCards: Array<{
    navKey: StatNavKey;
    title: string;
    value: string;
    trend: string;
    trendLabel: string;
    icon: string;
    iconWrapClass: string;
    iconColorClass: string;
  }> = [
    {
      navKey: 'appointments',
      title: "Today's Appointments",
      value: '24',
      trend: '+12%',
      trendLabel: 'vs last week',
      icon: 'ri-calendar-check-line',
      iconWrapClass: 'doctor-stat-icon-wrap--blue',
      iconColorClass: 'doctor-stat-icon--blue',
    },
    {
      navKey: 'patients',
      title: 'Total Patients',
      value: '1,248',
      trend: '+5%',
      trendLabel: 'vs last week',
      icon: 'ri-team-line',
      iconWrapClass: 'doctor-stat-icon-wrap--teal',
      iconColorClass: 'doctor-stat-icon--teal',
    },
    {
      navKey: 'revenue',
      title: 'Revenue',
      value: '$48,920',
      trend: '+8%',
      trendLabel: 'vs last month',
      icon: 'ri-money-dollar-circle-line',
      iconWrapClass: 'doctor-stat-icon-wrap--amber',
      iconColorClass: 'doctor-stat-icon--amber',
    },
    {
      navKey: 'satisfaction',
      title: 'Satisfaction',
      value: '4.9/5',
      trend: '+0.2',
      trendLabel: 'vs last month',
      icon: 'ri-emotion-happy-line',
      iconWrapClass: 'doctor-stat-icon-wrap--violet',
      iconColorClass: 'doctor-stat-icon--violet',
    },
  ];

  readonly agendaItems: AgendaItem[] = [
    {
      id: 'apt-1',
      patientId: 'pat-1',
      time: '09:00 AM',
      patientName: 'John Smith',
      type: 'Follow-up',
      status: 'Confirmed',
    },
    {
      id: 'apt-2',
      patientId: 'pat-2',
      time: '10:30 AM',
      patientName: 'Maria Garcia',
      type: 'Consultation',
      status: 'Pending',
    },
    {
      id: 'apt-3',
      patientId: 'pat-3',
      time: '02:00 PM',
      patientName: 'David Chen',
      type: 'Check-up',
      status: 'Cancelled',
    },
    {
      id: 'apt-4',
      patientId: 'pat-4',
      time: '03:30 PM',
      patientName: 'Emma Wilson',
      type: 'Follow-up',
      status: 'Confirmed',
    },
    {
      id: 'apt-5',
      patientId: 'pat-5',
      time: '04:45 PM',
      patientName: 'James Brown',
      type: 'Consultation',
      status: 'Pending',
    },
  ];

  readonly recentPatients: RecentPatient[] = [
    {
      id: 'rp-1',
      initials: 'JD',
      name: 'John Doe',
      condition: 'Hypertension',
      avatarClass: 'doctor-avatar--blue',
    },
    {
      id: 'rp-2',
      initials: 'SK',
      name: 'Sarah Kim',
      condition: 'Type 2 Diabetes',
      avatarClass: 'doctor-avatar--teal',
    },
    {
      id: 'rp-3',
      initials: 'MR',
      name: 'Mike Ross',
      condition: 'Annual physical',
      avatarClass: 'doctor-avatar--amber',
    },
    {
      id: 'rp-4',
      initials: 'LW',
      name: 'Lisa Wong',
      condition: 'Post-op follow-up',
      avatarClass: 'doctor-avatar--rose',
    },
  ];

  navigateStat(key: StatNavKey): void {
    switch (key) {
      case 'appointments':
        this.router.navigate(['/doctor', 'rendez-vous']);
        break;
      case 'patients':
        this.router.navigate(['/doctor', 'patients']);
        break;
      case 'revenue':
        this.router.navigate(['/doctor', 'facturation']);
        break;
      case 'satisfaction':
        this.router.navigate(['/doctor', 'reclamations', 'view', '1']);
        break;
    }
  }

  onAgendaRowClick(_item: AgendaItem): void {}

  onAgendaPatientNameClick(event: Event, _item: AgendaItem): void {
    event.stopPropagation();
  }

  navigateWeekView(): void {
    this.router.navigate(['/doctor', 'agenda']);
  }

  navigateAddAppointment(): void {
    this.router.navigate(['/doctor', 'agenda']);
  }

  navigateAiAssistance(): void {
    this.router.navigate(['/doctor', 'ia-assistance']);
  }

  onRecentPatientClick(_p: RecentPatient): void {}

  navigateTeleconsultation(): void {
    this.router.navigate(['/doctor', 'teleconsultation']);
  }

  navigateRendezVous(): void {
    this.router.navigate(['/doctor', 'rendez-vous']);
  }

  onAgendaMoreClick(event: Event): void {
    event.stopPropagation();
  }
}
