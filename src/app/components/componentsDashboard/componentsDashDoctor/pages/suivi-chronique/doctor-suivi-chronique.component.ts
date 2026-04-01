import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import type { ShellMetric } from '../../../commonComponentsDash/dashboard-shell/dashboard-shell.component';

export type ChronicRisk = 'Faible' | 'Moyen' | 'Eleve';

export interface ChronicCaseRow {
  id: string;
  patient: string;
  condition: string;
  risk: ChronicRisk;
  lastVisit: string;
  adherencePct: number;
  nextReview: string;
}

export interface CarePlanEntry {
  id: string;
  caseId: string;
  patient: string;
  objectives: string;
  durationMonths: number;
  notes: string;
  createdAt: string;
}

/** Plans regroupes par dossier patient (affichage bibliotheque). */
export interface CarePlanGroup {
  caseId: string;
  patient: string;
  condition: string;
  plans: CarePlanEntry[];
}

@Component({
  selector: 'app-doctor-suivi-chronique',
  templateUrl: './doctor-suivi-chronique.component.html',
  styleUrl: './doctor-suivi-chronique.component.scss',
  standalone: false,
})
export class DoctorSuiviChroniqueComponent {
  private readonly fb = inject(FormBuilder);

  searchTerm = '';
  riskFilter: ChronicRisk | 'Tous' = 'Tous';
  feedback = '';
  showCarePlanForm = false;
  showAddPatientForm = false;
  carePlans: CarePlanEntry[] = [];
  /** Plan dont le detail est affiche dans la liste (null = tout replie). */
  expandedPlanId: string | null = null;
  /** Groupe patient replie / deplie dans la bibliotheque des plans. */
  expandedCaseGroupId: string | null = null;
  /** Filtre patient dans la bibliotheque ('' = tous). */
  planLibraryCaseId = '';
  /** Recherche dans id / objectifs / notes / date (bibliotheque uniquement). */
  planLibrarySearch = '';

  readonly addPatientForm = this.fb.group({
    patient: ['', [Validators.required, Validators.minLength(2)]],
    condition: ['', Validators.required],
    risk: ['Moyen' as ChronicRisk, Validators.required],
  });

  readonly carePlanForm = this.fb.group({
    caseId: ['', Validators.required],
    objectives: ['', [Validators.required, Validators.minLength(10)]],
    durationMonths: [3, [Validators.required, Validators.min(1), Validators.max(24)]],
    notes: [''],
  });

  cases: ChronicCaseRow[] = [
    {
      id: 'cc-1',
      patient: 'John Smith',
      condition: 'Hypertension',
      risk: 'Moyen',
      lastVisit: '2026-03-28',
      adherencePct: 82,
      nextReview: '2026-04-15',
    },
    {
      id: 'cc-2',
      patient: 'Sarah Kim',
      condition: 'Diabete type 2',
      risk: 'Eleve',
      lastVisit: '2026-03-30',
      adherencePct: 64,
      nextReview: '2026-04-02',
    },
    {
      id: 'cc-3',
      patient: 'Amine Bennani',
      condition: 'BPCO',
      risk: 'Faible',
      lastVisit: '2026-02-10',
      adherencePct: 91,
      nextReview: '2026-05-10',
    },
  ];

  get metrics(): ShellMetric[] {
    const high = this.cases.filter((c) => c.risk === 'Eleve').length;
    const alerts = this.cases.filter((c) => c.adherencePct < 70).length;
    const avgAdh = Math.round(this.cases.reduce((s, c) => s + c.adherencePct, 0) / Math.max(1, this.cases.length));
    const pending = this.cases.filter((c) => c.nextReview <= new Date().toISOString().slice(0, 10)).length;
    return [
      { label: 'Patients a risque eleve', value: String(high), icon: 'ri-heart-pulse-line', variant: 'danger' },
      { label: 'Alertes adherence', value: String(alerts), icon: 'ri-alarm-warning-line', variant: 'warning' },
      { label: 'Adherence moyenne', value: `${avgAdh}%`, icon: 'ri-percent-line', variant: 'success' },
      { label: 'Revues a planifier', value: String(pending), icon: 'ri-calendar-todo-line', variant: 'primary' },
    ];
  }

  get filteredCases(): ChronicCaseRow[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.cases.filter((c) => {
      const match =
        !q ||
        c.patient.toLowerCase().includes(q) ||
        c.condition.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      const riskOk = this.riskFilter === 'Tous' || c.risk === this.riskFilter;
      return match && riskOk;
    });
  }

  /** Tous les plans d'un dossier, du plus recent au plus ancien. */
  getPlansForCase(caseId: string): CarePlanEntry[] {
    return this.carePlans
      .filter((p) => p.caseId === caseId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
  }

  /** Groupes par patient (alphabetique), uniquement les dossiers qui ont au moins un plan. */
  get carePlanGroups(): CarePlanGroup[] {
    const byCase = new Map<string, CarePlanEntry[]>();
    for (const p of this.carePlans) {
      const arr = byCase.get(p.caseId) ?? [];
      arr.push(p);
      byCase.set(p.caseId, arr);
    }
    const out: CarePlanGroup[] = [];
    for (const c of this.cases) {
      const raw = byCase.get(c.id);
      if (raw?.length) {
        const plans = [...raw].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
        out.push({
          caseId: c.id,
          patient: c.patient,
          condition: c.condition,
          plans,
        });
      }
    }
    out.sort((a, b) => a.patient.localeCompare(b.patient, 'fr', { sensitivity: 'base' }));
    return out;
  }

  /** Bibliotheque filtree (patient + texte). */
  get filteredCarePlanGroups(): CarePlanGroup[] {
    let groups = this.carePlanGroups;
    if (this.planLibraryCaseId) {
      groups = groups.filter((g) => g.caseId === this.planLibraryCaseId);
    }
    const q = this.planLibrarySearch.trim().toLowerCase();
    if (!q) {
      return groups;
    }
    return groups
      .map((g) => ({
        ...g,
        plans: g.plans.filter(
          (p) =>
            p.id.toLowerCase().includes(q) ||
            p.patient.toLowerCase().includes(q) ||
            p.objectives.toLowerCase().includes(q) ||
            (p.notes && p.notes.toLowerCase().includes(q)) ||
            p.createdAt.includes(q)
        ),
      }))
      .filter((g) => g.plans.length > 0);
  }

  clearPlanLibraryFilters(): void {
    this.planLibraryCaseId = '';
    this.planLibrarySearch = '';
  }

  riskClass(risk: ChronicRisk): string {
    if (risk === 'Faible') return 'risk-pill risk-pill--low';
    if (risk === 'Moyen') return 'risk-pill risk-pill--mid';
    return 'risk-pill risk-pill--high';
  }

  openAddPatientForm(): void {
    this.showAddPatientForm = true;
    this.addPatientForm.reset({ patient: '', condition: '', risk: 'Moyen' });
  }

  closeAddPatientForm(): void {
    this.showAddPatientForm = false;
  }

  submitAddPatient(): void {
    if (this.addPatientForm.invalid) {
      this.addPatientForm.markAllAsTouched();
      this.feedback = 'Renseignez le nom et la pathologie du patient.';
      return;
    }
    const v = this.addPatientForm.getRawValue();
    const today = new Date().toISOString().slice(0, 10);
    const next = new Date();
    next.setMonth(next.getMonth() + 3);
    const row: ChronicCaseRow = {
      id: `cc-${Date.now()}`,
      patient: (v.patient ?? '').trim(),
      condition: (v.condition ?? '').trim(),
      risk: v.risk as ChronicRisk,
      lastVisit: today,
      adherencePct: 80,
      nextReview: next.toISOString().slice(0, 10),
    };
    this.cases = [row, ...this.cases];
    this.showAddPatientForm = false;
    this.feedback = `${row.patient} ajoute au suivi chronique. Vous pouvez le selectionner dans le plan de soins.`;
  }

  openCarePlanForm(preselectCaseId?: string): void {
    this.showCarePlanForm = true;
    this.feedback = '';
    this.carePlanForm.reset({
      caseId: preselectCaseId ?? this.cases[0]?.id ?? '',
      objectives: '',
      durationMonths: 3,
      notes: '',
    });
  }

  closeCarePlanForm(): void {
    this.showCarePlanForm = false;
  }

  submitCarePlan(): void {
    if (this.carePlanForm.invalid) {
      this.carePlanForm.markAllAsTouched();
      this.feedback = 'Veuillez remplir le formulaire correctement.';
      return;
    }
    const v = this.carePlanForm.getRawValue();
    const row = this.cases.find((c) => c.id === v.caseId);
    if (!row) {
      this.feedback = 'Patient introuvable.';
      return;
    }
    const durationMonths = Number(v.durationMonths);
    const plan: CarePlanEntry = {
      id: `PS-${Date.now()}`,
      caseId: row.id,
      patient: row.patient,
      objectives: (v.objectives ?? '').trim(),
      durationMonths,
      notes: (v.notes ?? '').trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.carePlans = [plan, ...this.carePlans];
    this.expandedPlanId = plan.id;
    this.planLibraryCaseId = row.id;
    this.expandedCaseGroupId = row.id;

    const next = new Date();
    next.setMonth(next.getMonth() + durationMonths);
    row.nextReview = next.toISOString().slice(0, 10);

    this.showCarePlanForm = false;
    this.feedback = `Plan ${plan.id} enregistre pour ${row.patient}. Prochaine revue prevue : ${row.nextReview}.`;
  }

  toggleExpandedPlan(id: string): void {
    this.expandedPlanId = this.expandedPlanId === id ? null : id;
  }

  toggleCaseGroup(caseId: string): void {
    this.expandedCaseGroupId = this.expandedCaseGroupId === caseId ? null : caseId;
  }

  /** Corps du groupe visible (filtre un patient = toujours ouvert, sinon accordéon). */
  isGroupBodyVisible(caseId: string): boolean {
    if (this.planLibraryCaseId && this.planLibraryCaseId === caseId) {
      return true;
    }
    return this.expandedCaseGroupId === caseId;
  }

  /** Dernier plan enregistre pour ce dossier (le plus recent). */
  getLatestPlanForCase(caseId: string): CarePlanEntry | undefined {
    return this.getPlansForCase(caseId)[0];
  }

  hasCarePlanForCase(caseId: string): boolean {
    return this.carePlans.some((p) => p.caseId === caseId);
  }

  /**
   * Depuis le tableau : filtre la bibliotheque sur ce patient, affiche tous ses plans,
   * deplie le groupe et ouvre le detail du plan le plus recent.
   */
  openPlanFromTable(row: ChronicCaseRow): void {
    const plans = this.getPlansForCase(row.id);
    if (!plans.length) {
      return;
    }
    this.planLibraryCaseId = row.id;
    this.planLibrarySearch = '';
    this.expandedCaseGroupId = row.id;
    this.expandedPlanId = plans[0].id;
    setTimeout(() => {
      document.getElementById('suivi-care-plans-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  createAlert(row: ChronicCaseRow): void {
    this.feedback = `Alerte creee : suivi renforce pour ${row.patient}.`;
  }

  scheduleReview(row: ChronicCaseRow): void {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    row.nextReview = d.toISOString().slice(0, 10);
    this.feedback = `Prochaine revue fixee au ${row.nextReview} pour ${row.patient}.`;
  }

  exportMonthlyReport(): void {
    const lines = [
      'Rapport mensuel - Suivi chronique',
      `Date : ${new Date().toISOString().slice(0, 10)}`,
      '',
      'Patient;Pathologie;Risque;Adherence;Prochaine revue',
      ...this.cases.map(
        (c) => `${c.patient};${c.condition};${c.risk};${c.adherencePct}%;${c.nextReview}`
      ),
    ];
    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-suivi-chronique-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.feedback = 'Rapport CSV telecharge.';
  }
}
