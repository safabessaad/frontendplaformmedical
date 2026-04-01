import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type RecordRisk = 'Faible' | 'Moyen' | 'Eleve';
type RecordAccess = 'Restreint' | 'Standard' | 'Complet';
interface MedicalRecordDocument {
  id: string;
  name: string;
  type: 'Analyse' | 'Ordonnance' | 'Imagerie' | 'Compte rendu';
  addedAt: string;
}

interface MedicalRecordEntry {
  id: string;
  patient: string;
  birthDate: string;
  bloodGroup: string;
  allergies: string;
  chronicDiseases: string;
  risk: RecordRisk;
  access: RecordAccess;
  lastUpdate: string;
  notes: string;
  history: string[];
  documents: MedicalRecordDocument[];
}

@Component({
  selector: 'app-doctor-dossier-medical',
  templateUrl: './doctor-dossier-medical.component.html',
  styleUrl: './doctor-dossier-medical.component.scss',
  standalone: false,
})
export class DoctorDossierMedicalComponent {
  protected searchTerm = '';
  protected riskFilter: RecordRisk | 'Tous' = 'Tous';
  protected accessFilter: RecordAccess | 'Tous' = 'Tous';
  protected editingId: string | null = null;
  protected exportMessage = '';
  protected newDocumentType: MedicalRecordDocument['type'] = 'Analyse';

  protected readonly recordForm = this.fb.group({
    patient: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    bloodGroup: ['', [Validators.required]],
    allergies: [''],
    chronicDiseases: [''],
    risk: ['Moyen' as RecordRisk, [Validators.required]],
    access: ['Standard' as RecordAccess, [Validators.required]],
    notes: [''],
    historyLine: [''],
    consentChecked: [false, [Validators.requiredTrue]]
  });

  protected records: MedicalRecordEntry[] = [
    {
      id: 'DME-001',
      patient: 'Youssef El Idrissi',
      birthDate: '1988-07-13',
      bloodGroup: 'A+',
      allergies: 'Aucune',
      chronicDiseases: 'Diabete type 2',
      risk: 'Moyen',
      access: 'Complet',
      lastUpdate: '2026-03-16',
      notes: 'Suivi trimestriel recommande.',
      history: ['2026-03-16 - Consultation diabetologie, ajustement traitement.', '2026-02-03 - Analyse HbA1c et bilan lipidique.'],
      documents: [
        { id: 'DOC-1', name: 'bilan-hba1c.pdf', type: 'Analyse', addedAt: '2026-03-16' },
        { id: 'DOC-2', name: 'ordonnance-mars.pdf', type: 'Ordonnance', addedAt: '2026-03-16' }
      ]
    },
    {
      id: 'DME-002',
      patient: 'Fatima Rachidi',
      birthDate: '1975-11-02',
      bloodGroup: 'O-',
      allergies: 'Penicilline',
      chronicDiseases: 'Hypertension',
      risk: 'Eleve',
      access: 'Restreint',
      lastUpdate: '2026-03-16',
      notes: 'Surveillance tensionnelle hebdomadaire.',
      history: ['2026-03-16 - Urgence HTA, controle et suivi 7 jours.', '2026-01-20 - ECG + adaptation therapeutique.'],
      documents: [
        { id: 'DOC-3', name: 'ecg-janvier.jpg', type: 'Imagerie', addedAt: '2026-01-20' },
        { id: 'DOC-4', name: 'compte-rendu-hta.pdf', type: 'Compte rendu', addedAt: '2026-03-16' }
      ]
    }
  ];
  protected selectedRecord: MedicalRecordEntry | null = this.records[0] ?? null;

  constructor(private readonly fb: FormBuilder) {}

  protected get filteredRecords(): MedicalRecordEntry[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.records.filter((record) => {
      const searchMatch = !term || record.patient.toLowerCase().includes(term) || record.chronicDiseases.toLowerCase().includes(term);
      const riskMatch = this.riskFilter === 'Tous' || record.risk === this.riskFilter;
      const accessMatch = this.accessFilter === 'Tous' || record.access === this.accessFilter;
      return searchMatch && riskMatch && accessMatch;
    });
  }

  protected get highRiskCount(): number { return this.records.filter((record) => record.risk === 'Eleve').length; }
  protected get restrictedCount(): number { return this.records.filter((record) => record.access === 'Restreint').length; }
  protected get totalDocuments(): number { return this.records.reduce((sum, record) => sum + record.documents.length, 0); }

  protected get formBlockReason(): string {
    if (this.recordForm.valid) return '';
    const c = this.recordForm.get('consentChecked');
    if (c?.hasError('required')) {
      return 'Cochez la case de consentement pour activer Enregistrer.';
    }
    return 'Remplissez patient, date de naissance et groupe sanguin.';
  }

  protected selectRecord(record: MedicalRecordEntry): void {
    this.selectedRecord = record;
    this.editingId = record.id;
    this.recordForm.patchValue({
      patient: record.patient,
      birthDate: record.birthDate,
      bloodGroup: record.bloodGroup,
      allergies: record.allergies,
      chronicDiseases: record.chronicDiseases,
      risk: record.risk,
      access: record.access,
      notes: record.notes,
      historyLine: '',
      consentChecked: true
    });
  }

  protected openCreateForm(): void {
    this.selectedRecord = null;
    this.resetForm();
  }

  protected saveRecord(): void {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      this.exportMessage = 'Veuillez remplir les champs obligatoires et cocher le consentement.';
      return;
    }
    const value = this.recordForm.getRawValue();
    const historyLine = (value.historyLine ?? '').trim();
    const extraHistory = historyLine ? [`${this.today()} - ${historyLine}`] : [];

    if (this.editingId) {
      this.records = this.records.map((record) =>
        record.id === this.editingId
          ? {
              ...record,
              patient: value.patient ?? '',
              birthDate: value.birthDate ?? '',
              bloodGroup: value.bloodGroup ?? '',
              allergies: value.allergies ?? '',
              chronicDiseases: value.chronicDiseases ?? '',
              risk: (value.risk ?? 'Moyen') as RecordRisk,
              access: (value.access ?? 'Standard') as RecordAccess,
              notes: value.notes ?? '',
              lastUpdate: this.today(),
              history: extraHistory.length ? [...extraHistory, ...record.history] : record.history
            }
          : record
      );
      this.selectedRecord = this.records.find((record) => record.id === this.editingId) ?? null;
      this.exportMessage = 'Dossier medical enregistre avec succes.';
      this.recordForm.patchValue({ historyLine: '' });
      return;
    }

    const newId = this.nextRecordId();
    const newEntry: MedicalRecordEntry = {
      id: newId,
      patient: (value.patient ?? '').trim(),
      birthDate: value.birthDate ?? '',
      bloodGroup: (value.bloodGroup ?? '').trim(),
      allergies: (value.allergies ?? '').trim(),
      chronicDiseases: (value.chronicDiseases ?? '').trim(),
      risk: (value.risk ?? 'Moyen') as RecordRisk,
      access: (value.access ?? 'Standard') as RecordAccess,
      lastUpdate: this.today(),
      notes: (value.notes ?? '').trim(),
      history: extraHistory,
      documents: []
    };
    this.records = [newEntry, ...this.records];
    this.selectedRecord = newEntry;
    this.editingId = newId;
    this.exportMessage = `Dossier ${newId} cree et affiche dans la liste.`;
    this.recordForm.patchValue({
      historyLine: '',
      consentChecked: true
    });
  }

  protected onDocumentPicked(event: Event): void {
    if (!this.selectedRecord) return;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const doc: MedicalRecordDocument = { id: `DOC-${Date.now()}`, name: file.name, type: this.newDocumentType, addedAt: this.today() };
    this.records = this.records.map((record) => record.id === this.selectedRecord?.id ? { ...record, lastUpdate: this.today(), documents: [doc, ...record.documents] } : record);
    this.selectedRecord = this.records.find((record) => record.id === this.selectedRecord?.id) ?? null;
    this.exportMessage = 'Document medical ajoute au dossier.';
    input.value = '';
  }

  /** PDF : impression directe via iframe cachée (sans fenêtre about:blank). */
  protected exportPdf(): void {
    const record = this.selectedRecord;
    if (!record) {
      this.exportMessage = 'Sélectionnez un dossier patient.';
      return;
    }
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc) {
      document.body.removeChild(iframe);
      this.exportMessage = "Impossible d'initialiser l'export PDF.";
      return;
    }

    doc.open();
    doc.write(this.buildPrintableHtml(record));
    doc.close();

    const doPrint = () => {
      const win = iframe.contentWindow;
      if (!win) {
        document.body.removeChild(iframe);
        return;
      }
      win.focus();
      win.print();
      window.setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 1000);
    };

    iframe.onload = doPrint;
    window.setTimeout(doPrint, 250);
    this.exportMessage = `PDF : utilisez « Enregistrer au format PDF » dans la fenêtre d'impression pour ${record.patient}.`;
  }

  /** Excel : fichier CSV (séparateur ;) ouvert par Excel (UTF-8 avec BOM). */
  protected exportExcel(): void {
    const record = this.selectedRecord;
    if (!record) {
      this.exportMessage = 'Sélectionnez un dossier patient.';
      return;
    }
    const rows: string[][] = [
      ['Section', 'Champ', 'Valeur'],
      ['Identification', 'ID dossier', record.id],
      ['Identification', 'Patient', record.patient],
      ['Identification', 'Date de naissance', record.birthDate],
      ['Identification', 'Groupe sanguin', record.bloodGroup],
      ['Clinique', 'Allergies', record.allergies || ''],
      ['Clinique', 'Maladies chroniques', record.chronicDiseases || ''],
      ['Clinique', 'Niveau de risque', record.risk],
      ['Clinique', "Niveau d'accès", record.access],
      ['Suivi', 'Dernière mise à jour', record.lastUpdate],
      ['Suivi', 'Notes', record.notes || ''],
    ];
    record.history.forEach((line, i) => {
      rows.push(['Historique médical', `Entrée ${i + 1}`, line]);
    });
    record.documents.forEach((doc, i) => {
      rows.push(['Documents', `Fichier ${i + 1}`, `${doc.name} | ${doc.type} | ${doc.addedAt}`]);
    });
    const csv = rows.map((r) => r.map((c) => this.csvEscape(c)).join(';')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.safeFileName(`dossier-medical-${record.id}-${record.patient}`) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    this.exportMessage = `Export Excel (CSV) téléchargé pour ${record.patient}.`;
  }

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private csvEscape(cell: string): string {
    const needsQuote = /[;"\r\n]/.test(cell);
    const escaped = cell.replace(/"/g, '""');
    return needsQuote ? `"${escaped}"` : escaped;
  }

  private safeFileName(name: string): string {
    return name.replace(/[^\w\-\u00C0-\u024f]+/g, '_').slice(0, 120);
  }

  private buildPrintableHtml(record: MedicalRecordEntry): string {
    const historyHtml = record.history.map((h) => `<li>${this.escapeHtml(h)}</li>`).join('');
    const docsHtml =
      record.documents.length > 0
        ? record.documents
            .map(
              (d) =>
                `<tr><td>${this.escapeHtml(d.name)}</td><td>${this.escapeHtml(d.type)}</td><td>${this.escapeHtml(
                  d.addedAt
                )}</td></tr>`
            )
            .join('')
        : '<tr><td colspan="3">Aucun document</td></tr>';

    return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8"/>
    <title>Dossier medical - ${this.escapeHtml(record.patient)}</title>
    <style>
      body{font-family:Segoe UI,system-ui,sans-serif;padding:24px;color:#0f172a;line-height:1.45}
      h1{font-size:1.75rem;margin:0 0 14px;color:#334155}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:6px 22px;font-size:.9rem;margin-bottom:14px}
      .meta p{margin:0}
      .notes{border:1px solid #e2e8f0;border-radius:6px;padding:8px 10px;background:#f8fafc;margin:12px 0}
      h2{font-size:1.05rem;margin:16px 0 8px}
      ul{margin:0;padding-left:18px}
      table{width:100%;border-collapse:collapse;margin-top:8px;font-size:.88rem}
      th,td{border:1px solid #e2e8f0;padding:8px;text-align:left}
      th{background:#f8fafc}
      @media print { body{padding:12px} }
    </style>
  </head>
  <body>
    <h1>Dossier medical patient</h1>
    <div class="meta">
      <p><strong>Patient:</strong> ${this.escapeHtml(record.patient)}</p>
      <p><strong>Date naissance:</strong> ${this.escapeHtml(record.birthDate)}</p>
      <p><strong>Groupe sanguin:</strong> ${this.escapeHtml(record.bloodGroup)}</p>
      <p><strong>Risque:</strong> ${this.escapeHtml(record.risk)}</p>
      <p><strong>Acces:</strong> ${this.escapeHtml(record.access)}</p>
      <p><strong>Derniere mise a jour:</strong> ${this.escapeHtml(record.lastUpdate)}</p>
      <p><strong>Allergies:</strong> ${this.escapeHtml(record.allergies || 'Aucune')}</p>
      <p><strong>Maladies chroniques:</strong> ${this.escapeHtml(record.chronicDiseases || 'Aucune')}</p>
    </div>
    <div class="notes"><strong>Notes</strong><br/>${this.escapeHtml(record.notes || 'Aucune note')}</div>
    <h2>Historique medical</h2>
    <ul>${historyHtml || '<li>Aucun historique</li>'}</ul>
    <h2>Documents</h2>
    <table>
      <thead><tr><th>Nom</th><th>Type</th><th>Date ajout</th></tr></thead>
      <tbody>${docsHtml}</tbody>
    </table>
  </body>
</html>`;
  }

  protected resetForm(): void {
    this.editingId = null;
    this.selectedRecord = null;
    this.recordForm.reset({
      patient: '',
      birthDate: '',
      bloodGroup: '',
      allergies: '',
      chronicDiseases: '',
      risk: 'Moyen',
      access: 'Standard',
      notes: '',
      historyLine: '',
      consentChecked: false
    });
    this.exportMessage = '';
  }

  protected riskClass(risk: RecordRisk): 'low' | 'medium' | 'high' {
    if (risk === 'Faible') return 'low';
    if (risk === 'Moyen') return 'medium';
    return 'high';
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private nextRecordId(): string {
    const nums = this.records
      .map((r) => {
        const m = /^DME-(\d+)$/.exec(r.id);
        return m ? Number(m[1]) : 0;
      })
      .filter((n) => n > 0);
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `DME-${String(next).padStart(3, '0')}`;
  }
}
