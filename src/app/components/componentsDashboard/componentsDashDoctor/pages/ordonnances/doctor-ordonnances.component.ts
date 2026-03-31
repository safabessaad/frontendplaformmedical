import { Component } from '@angular/core';
import type { ShellMetric } from '../../../commonComponentsDash/dashboard-shell/dashboard-shell.component';

export type PrescriptionStatus = 'active' | 'expiring' | 'alert' | 'expired';

export interface PrescriptionRow {
  id: string;
  patient: string;
  medication: string;
  dosage: string;
  duration: string;
  status: PrescriptionStatus;
  endsOn: string;
}

@Component({
  selector: 'app-doctor-ordonnances',
  templateUrl: './doctor-ordonnances.component.html',
  styleUrl: './doctor-ordonnances.component.scss',
  standalone: false,
})
export class DoctorOrdonnancesComponent {
  searchTerm = '';
  filterStatus: 'all' | PrescriptionStatus = 'all';

  readonly kpiMetrics: ShellMetric[] = [
    { label: 'Active prescriptions', value: '66', icon: 'ri-medicine-bottle-line', variant: 'primary' },
    { label: 'Renewals today', value: '9', icon: 'ri-refresh-line', variant: 'success' },
    { label: 'Interaction alerts', value: '2', icon: 'ri-alarm-warning-line', variant: 'warning' },
    { label: 'Expired this week', value: '5', icon: 'ri-time-line', variant: 'danger' },
  ];

  prescriptions: PrescriptionRow[] = [
    {
      id: 'rx-1',
      patient: 'John Smith',
      medication: 'Amlodipine',
      dosage: '5 mg',
      duration: '30 days',
      status: 'active',
      endsOn: '12 Apr 2026',
    },
    {
      id: 'rx-2',
      patient: 'Maria Garcia',
      medication: 'Metformin',
      dosage: '500 mg',
      duration: '90 days',
      status: 'expiring',
      endsOn: '02 Apr 2026',
    },
    {
      id: 'rx-3',
      patient: 'David Chen',
      medication: 'Warfarin',
      dosage: '2.5 mg',
      duration: '14 days',
      status: 'alert',
      endsOn: '28 Mar 2026',
    },
    {
      id: 'rx-4',
      patient: 'Emma Wilson',
      medication: 'Atorvastatin',
      dosage: '20 mg',
      duration: '60 days',
      status: 'expired',
      endsOn: '15 Mar 2026',
    },
  ];

  get filteredPrescriptions(): PrescriptionRow[] {
    let rows = this.prescriptions;
    if (this.filterStatus !== 'all') {
      rows = rows.filter((r) => r.status === this.filterStatus);
    }
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      return rows;
    }
    return rows.filter(
      (r) =>
        r.patient.toLowerCase().includes(q) ||
        r.medication.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }

  statusLabel(s: PrescriptionStatus): string {
    const map: Record<PrescriptionStatus, string> = {
      active: 'Active',
      expiring: 'Expiring soon',
      alert: 'Interaction alert',
      expired: 'Expired',
    };
    return map[s];
  }

  statusClass(s: PrescriptionStatus): string {
    return `rx-badge rx-badge--${s}`;
  }

  createPrescription(): void {}

  importPrescriptions(): void {}

  openTemplates(): void {}

  exportPdf(): void {}

  openHistory(): void {}

  renew(row: PrescriptionRow): void {
    void row;
  }

  viewRow(row: PrescriptionRow): void {
    void row;
  }

  editRow(row: PrescriptionRow): void {
    void row;
  }

  duplicateRow(row: PrescriptionRow): void {
    void row;
  }

  stopTreatment(row: PrescriptionRow): void {
    void row;
  }

  printRow(row: PrescriptionRow): void {
    void row;
  }
}
