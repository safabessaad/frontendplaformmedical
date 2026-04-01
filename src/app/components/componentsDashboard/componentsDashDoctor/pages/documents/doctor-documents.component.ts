import { Component } from '@angular/core';
import type { ShellMetric } from '../../../commonComponentsDash/dashboard-shell/dashboard-shell.component';

export interface MedicalDocumentRow {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
  sizeKb: number;
  shared: boolean;
}

@Component({
  selector: 'app-doctor-documents',
  templateUrl: './doctor-documents.component.html',
  styleUrl: './doctor-documents.component.scss',
  standalone: false,
})
export class DoctorDocumentsComponent {
  searchTerm = '';
  filterType: 'all' | string = 'all';
  feedback = '';

  documents: MedicalDocumentRow[] = [
    { id: 'doc-1', name: 'Blood-test-JohnSmith.pdf', type: 'Lab result', updatedAt: '2026-03-29', sizeKb: 420, shared: true },
    { id: 'doc-2', name: 'MRI-MariaGarcia.pdf', type: 'Imaging', updatedAt: '2026-03-21', sizeKb: 2100, shared: false },
    { id: 'doc-3', name: 'Ordonnance-AVR-2026.pdf', type: 'Prescription', updatedAt: '2026-04-01', sizeKb: 180, shared: true },
  ];

  get metrics(): ShellMetric[] {
    const thisMonth = this.documents.length;
    const pending = this.documents.filter((d) => !d.shared).length;
    const shared = this.documents.filter((d) => d.shared).length;
    const storageMb = (this.documents.reduce((s, d) => s + d.sizeKb, 0) / 1024).toFixed(1);
    return [
      { label: 'Files indexed', value: String(thisMonth), icon: 'ri-folder-2-line', variant: 'primary' },
      { label: 'Pending review', value: String(pending), icon: 'ri-time-line', variant: 'warning' },
      { label: 'Shared with patient', value: String(shared), icon: 'ri-share-line', variant: 'success' },
      { label: 'Storage (approx.)', value: `${storageMb} MB`, icon: 'ri-hard-drive-2-line', variant: 'muted' },
    ];
  }

  get documentTypes(): string[] {
    const types = [...new Set(this.documents.map((d) => d.type))];
    return types.sort();
  }

  get filteredDocuments(): MedicalDocumentRow[] {
    let rows = this.documents;
    const q = this.searchTerm.trim().toLowerCase();
    if (q) {
      rows = rows.filter((d) => d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q) || d.id.toLowerCase().includes(q));
    }
    if (this.filterType !== 'all') {
      rows = rows.filter((d) => d.type === this.filterType);
    }
    return rows;
  }

  onUploadPick(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const type = ext === 'pdf' ? 'Document' : ext.match(/png|jpg|jpeg/) ? 'Imaging' : 'Lab result';
    const row: MedicalDocumentRow = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type,
      updatedAt: new Date().toISOString().slice(0, 10),
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
      shared: false,
    };
    this.documents = [row, ...this.documents];
    this.feedback = `Fichier ajoute : ${file.name}`;
    input.value = '';
  }

  openDoc(row: MedicalDocumentRow): void {
    this.feedback = `Ouverture simulee : ${row.name}`;
  }

  downloadDoc(row: MedicalDocumentRow): void {
    const blob = new Blob([`Medical file placeholder\n${row.name}\n`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = row.name.replace(/[^\w.\-]+/g, '_');
    a.click();
    URL.revokeObjectURL(url);
    this.feedback = `Telechargement : ${row.name}`;
  }

  toggleShare(row: MedicalDocumentRow): void {
    row.shared = !row.shared;
    this.feedback = row.shared ? `Partage active pour ${row.name}` : `Partage desactive pour ${row.name}`;
  }
}
