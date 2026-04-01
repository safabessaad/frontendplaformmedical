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

interface PrescriptionEditorModel {
  patient: string;
  medication: string;
  dosage: string;
  duration: string;
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
  actionMessage = '';
  selectedRow: PrescriptionRow | null = null;
  showHistory = false;
  showEditor = false;
  isEditMode = false;
  editingId: string | null = null;

  editor: PrescriptionEditorModel = {
    patient: '',
    medication: '',
    dosage: '',
    duration: '30 days',
    endsOn: this.formatDateInput(new Date()),
  };

  readonly history: string[] = [];

  private prescriptions: PrescriptionRow[] = [
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

  get kpiMetrics(): ShellMetric[] {
    const active = this.prescriptions.filter((r) => r.status === 'active').length;
    const expiring = this.prescriptions.filter((r) => r.status === 'expiring').length;
    const alert = this.prescriptions.filter((r) => r.status === 'alert').length;
    const expired = this.prescriptions.filter((r) => r.status === 'expired').length;
    return [
      { label: 'Active prescriptions', value: String(active), icon: 'ri-medicine-bottle-line', variant: 'primary' },
      { label: 'Renewals today', value: String(expiring), icon: 'ri-refresh-line', variant: 'success' },
      { label: 'Interaction alerts', value: String(alert), icon: 'ri-alarm-warning-line', variant: 'warning' },
      { label: 'Expired this week', value: String(expired), icon: 'ri-time-line', variant: 'danger' },
    ];
  }

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

  createPrescription(): void {
    this.showEditor = true;
    this.isEditMode = false;
    this.editingId = null;
    this.editor = {
      patient: '',
      medication: '',
      dosage: '',
      duration: '30 days',
      endsOn: this.formatDateInput(new Date()),
    };
    this.actionMessage = 'Create a new prescription.';
  }

  importPrescriptions(): void {
    const batch: PrescriptionRow[] = [
      {
        id: this.nextId(),
        patient: 'Sofia Benali',
        medication: 'Levothyroxine',
        dosage: '50 mcg',
        duration: '30 days',
        status: 'active',
        endsOn: this.toPrettyDate(this.addDays(new Date(), 30)),
      },
      {
        id: this.nextId(),
        patient: 'Hassan El Amrani',
        medication: 'Ramipril',
        dosage: '5 mg',
        duration: '60 days',
        status: 'expiring',
        endsOn: this.toPrettyDate(this.addDays(new Date(), 5)),
      },
    ];
    this.prescriptions = [...batch, ...this.prescriptions];
    this.log(`Imported ${batch.length} prescriptions.`);
    this.actionMessage = 'Import completed.';
  }

  openTemplates(): void {
    this.showEditor = true;
    this.isEditMode = false;
    this.editingId = null;
    this.editor = {
      patient: '',
      medication: 'Paracetamol',
      dosage: '1 g',
      duration: '5 days',
      endsOn: this.formatDateInput(this.addDays(new Date(), 5)),
    };
    this.actionMessage = 'Template loaded: standard pain treatment.';
  }

  exportPdf(): void {
    const rows = this.filteredPrescriptions;
    const content = rows
      .map((r) => `${r.id} | ${r.patient} | ${r.medication} | ${r.dosage} | ${r.duration} | ${this.statusLabel(r.status)} | ${r.endsOn}`)
      .join('\n');
    const blob = new Blob([`Prescriptions Report\n\n${content}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prescriptions-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    this.log('Exported prescription list.');
    this.actionMessage = 'Export generated.';
  }

  openHistory(): void {
    this.showHistory = !this.showHistory;
    this.actionMessage = this.showHistory ? 'History panel opened.' : 'History panel closed.';
  }

  renew(row: PrescriptionRow): void {
    row.endsOn = this.toPrettyDate(this.addDays(new Date(), 30));
    row.duration = '30 days';
    row.status = 'active';
    this.log(`Renewed prescription ${row.id} for ${row.patient}.`);
    this.actionMessage = `${row.patient} renewed for 30 days.`;
  }

  viewRow(row: PrescriptionRow): void {
    this.selectedRow = row;
    this.actionMessage = `Viewing ${row.id}.`;
  }

  editRow(row: PrescriptionRow): void {
    this.showEditor = true;
    this.isEditMode = true;
    this.editingId = row.id;
    this.editor = {
      patient: row.patient,
      medication: row.medication,
      dosage: row.dosage,
      duration: row.duration,
      endsOn: this.toInputDate(row.endsOn),
    };
    this.actionMessage = `Editing ${row.id}.`;
  }

  duplicateRow(row: PrescriptionRow): void {
    const copy: PrescriptionRow = {
      ...row,
      id: this.nextId(),
      patient: `${row.patient} (copy)`,
    };
    this.prescriptions = [copy, ...this.prescriptions];
    this.log(`Duplicated ${row.id} to ${copy.id}.`);
    this.actionMessage = `Prescription duplicated (${copy.id}).`;
  }

  stopTreatment(row: PrescriptionRow): void {
    row.status = 'expired';
    row.endsOn = this.toPrettyDate(new Date());
    this.log(`Stopped treatment for ${row.id}.`);
    this.actionMessage = `Treatment stopped for ${row.patient}.`;
  }

  printRow(row: PrescriptionRow): void {
    const win = window.open('', '_blank', 'width=700,height=500');
    if (!win) return;
    win.document.write(`<html><head><title>${row.id}</title></head><body>`);
    win.document.write(`<h2>Prescription ${row.id}</h2>`);
    win.document.write(`<p><strong>Patient:</strong> ${row.patient}</p>`);
    win.document.write(`<p><strong>Medication:</strong> ${row.medication}</p>`);
    win.document.write(`<p><strong>Dosage:</strong> ${row.dosage}</p>`);
    win.document.write(`<p><strong>Duration:</strong> ${row.duration}</p>`);
    win.document.write(`<p><strong>Status:</strong> ${this.statusLabel(row.status)}</p>`);
    win.document.write(`<p><strong>Ends:</strong> ${row.endsOn}</p>`);
    win.document.write(`</body></html>`);
    win.document.close();
    win.focus();
    win.print();
    this.log(`Printed ${row.id}.`);
    this.actionMessage = `Printing ${row.id}...`;
  }

  saveEditor(): void {
    if (!this.editor.patient.trim() || !this.editor.medication.trim() || !this.editor.dosage.trim() || !this.editor.endsOn) {
      this.actionMessage = 'Please complete all required fields.';
      return;
    }
    const endsDate = new Date(this.editor.endsOn);
    const payload: PrescriptionRow = {
      id: this.editingId ?? this.nextId(),
      patient: this.editor.patient.trim(),
      medication: this.editor.medication.trim(),
      dosage: this.editor.dosage.trim(),
      duration: this.editor.duration.trim() || '30 days',
      status: this.computeStatus(endsDate),
      endsOn: this.toPrettyDate(endsDate),
    };
    if (this.isEditMode && this.editingId) {
      this.prescriptions = this.prescriptions.map((r) => (r.id === this.editingId ? payload : r));
      this.log(`Updated ${payload.id}.`);
      this.actionMessage = `Prescription ${payload.id} updated.`;
    } else {
      this.prescriptions = [payload, ...this.prescriptions];
      this.log(`Created ${payload.id}.`);
      this.actionMessage = `Prescription ${payload.id} created.`;
    }
    this.closeEditor();
  }

  closeEditor(): void {
    this.showEditor = false;
    this.isEditMode = false;
    this.editingId = null;
  }

  private computeStatus(endsDate: Date): PrescriptionStatus {
    const diff = Math.ceil((endsDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'expired';
    if (diff <= 7) return 'expiring';
    return 'active';
  }

  private nextId(): string {
    return `rx-${Math.floor(Math.random() * 100000)}`;
  }

  private log(message: string): void {
    this.history.unshift(`${new Date().toLocaleString()} - ${message}`);
    if (this.history.length > 12) this.history.length = 12;
  }

  private addDays(base: Date, days: number): Date {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  }

  private toPrettyDate(d: Date): string {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private toInputDate(value: string): string {
    const parsed = new Date(value);
    return this.formatDateInput(parsed);
  }

  private formatDateInput(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
