import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type ConsultationPriority = 'Normale' | 'Urgente';
type ConsultationRisk = 'Faible' | 'Moyen' | 'Eleve';

interface ConsultationItem {
  id: string;
  patient: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  prescription: string;
  followUpDate: string;
  priority: ConsultationPriority;
  risk: ConsultationRisk;
  report: string;
  attachments: string[];
}

@Component({
  selector: 'app-doctor-consultations',
  templateUrl: './doctor-consultations.component.html',
  styleUrl: './doctor-consultations.component.scss',
  standalone: false,
})
export class DoctorConsultationsComponent {
  protected readonly searchControl = this.fb.control('', { nonNullable: true });
  protected readonly riskFilterControl = this.fb.control<'Tous' | ConsultationRisk>('Tous', { nonNullable: true });

  protected readonly consultationForm = this.fb.group({
    patient: ['', [Validators.required]],
    date: ['', [Validators.required]],
    followUpDate: [''],
    priority: ['Normale' as ConsultationPriority, [Validators.required]],
    risk: ['Moyen' as ConsultationRisk, [Validators.required]],
    symptoms: ['', [Validators.required, Validators.minLength(8)]],
    diagnosis: ['', [Validators.required, Validators.minLength(5)]],
    report: ['', [Validators.required, Validators.minLength(10)]],
    prescription: [''],
    consent: [false, [Validators.requiredTrue]]
  });

  protected consultations: ConsultationItem[] = [
    {
      id: 'CONS-101',
      patient: 'Youssef El Idrissi',
      date: '2026-03-16',
      symptoms: 'Fatigue, soif intense, polyurie',
      diagnosis: 'Diabete type 2 non equilibre',
      report: 'Ajustement du traitement antidiabetique et education therapeutique.',
      prescription: 'Metformine 850mg x2/jour, bilan HbA1c dans 1 mois.',
      followUpDate: '2026-04-16',
      priority: 'Normale',
      risk: 'Moyen',
      attachments: ['analyse-hba1c.pdf']
    },
    {
      id: 'CONS-102',
      patient: 'Fatima Rachidi',
      date: '2026-03-16',
      symptoms: 'Cephalee, tension elevee, vertiges',
      diagnosis: 'Hypertension arterielle non controlee',
      report: 'Controle tensionnel et adaptation traitement antihypertenseur.',
      prescription: 'Amlodipine 5mg/jour, surveillance TA 7 jours.',
      followUpDate: '2026-03-23',
      priority: 'Urgente',
      risk: 'Eleve',
      attachments: ['ecg-image.jpg', 'tension-notes.pdf']
    }
  ];

  protected selectedConsultation: ConsultationItem | null = this.consultations[0] ?? null;
  protected editingId: string | null = null;
  protected aiSuggestion = '';
  protected selectedAttachments: string[] = [];

  constructor(private readonly fb: FormBuilder) {}

  protected get filteredConsultations(): ConsultationItem[] {
    const term = this.searchControl.value.trim().toLowerCase();
    const risk = this.riskFilterControl.value;
    return this.consultations.filter((item) => {
      const searchMatch = !term || item.patient.toLowerCase().includes(term) || item.diagnosis.toLowerCase().includes(term);
      const riskMatch = risk === 'Tous' || item.risk === risk;
      return searchMatch && riskMatch;
    });
  }

  protected get totalConsultations(): number { return this.consultations.length; }
  protected get urgentConsultations(): number { return this.consultations.filter((item) => item.priority === 'Urgente').length; }
  protected get highRiskPatients(): number { return this.consultations.filter((item) => item.risk === 'Eleve').length; }
  protected get todayConsultations(): number { return this.consultations.filter((item) => item.date === '2026-03-16').length; }

  protected openNewConsultation(): void {
    this.selectedConsultation = null;
    this.editingId = null;
    this.aiSuggestion = '';
    this.selectedAttachments = [];
    this.consultationForm.reset({
      patient: '',
      date: '',
      followUpDate: '',
      priority: 'Normale',
      risk: 'Moyen',
      symptoms: '',
      diagnosis: '',
      report: '',
      prescription: '',
      consent: false
    });
  }

  protected selectConsultation(item: ConsultationItem): void {
    this.selectedConsultation = item;
    this.editingId = item.id;
    this.aiSuggestion = '';
    this.selectedAttachments = [...item.attachments];
    this.consultationForm.patchValue({
      patient: item.patient,
      date: item.date,
      followUpDate: item.followUpDate,
      priority: item.priority,
      risk: item.risk,
      symptoms: item.symptoms,
      diagnosis: item.diagnosis,
      report: item.report,
      prescription: item.prescription,
      consent: true
    });
  }

  protected saveConsultation(): void {
    if (this.consultationForm.invalid) return;
    const value = this.consultationForm.getRawValue();
    if (this.editingId) {
      this.consultations = this.consultations.map((item) =>
        item.id === this.editingId
          ? {
              ...item,
              patient: value.patient ?? '',
              date: value.date ?? '',
              followUpDate: value.followUpDate ?? '',
              priority: (value.priority ?? 'Normale') as ConsultationPriority,
              risk: (value.risk ?? 'Moyen') as ConsultationRisk,
              symptoms: value.symptoms ?? '',
              diagnosis: value.diagnosis ?? '',
              report: value.report ?? '',
              prescription: value.prescription ?? '',
              attachments: [...this.selectedAttachments]
            }
          : item
      );
    } else {
      this.consultations = [
        {
          id: `CONS-${Date.now()}`,
          patient: value.patient ?? '',
          date: value.date ?? '',
          followUpDate: value.followUpDate ?? '',
          priority: (value.priority ?? 'Normale') as ConsultationPriority,
          risk: (value.risk ?? 'Moyen') as ConsultationRisk,
          symptoms: value.symptoms ?? '',
          diagnosis: value.diagnosis ?? '',
          report: value.report ?? '',
          prescription: value.prescription ?? '',
          attachments: [...this.selectedAttachments]
        },
        ...this.consultations
      ];
    }
    this.resetForm();
  }

  protected resetForm(): void {
    this.editingId = null;
    this.aiSuggestion = '';
    this.selectedAttachments = [];
    this.consultationForm.reset({
      patient: '',
      date: '',
      followUpDate: '',
      priority: 'Normale',
      risk: 'Moyen',
      symptoms: '',
      diagnosis: '',
      report: '',
      prescription: '',
      consent: false
    });
  }

  protected analyzeSymptoms(): void {
    const symptoms = (this.consultationForm.value.symptoms ?? '').toLowerCase();
    if (!symptoms.trim()) {
      this.aiSuggestion = 'Ajoutez des symptomes pour generer une suggestion.';
      return;
    }
    if (symptoms.includes('douleur thoracique') || symptoms.includes('cephalee')) {
      this.aiSuggestion = 'Suggestion IA: Evaluer en priorite le risque cardio-vasculaire.';
    } else if (symptoms.includes('fievre') || symptoms.includes('toux')) {
      this.aiSuggestion = 'Suggestion IA: Verifier une infection respiratoire.';
    } else {
      this.aiSuggestion = 'Suggestion IA: Completer anamnese detaillee puis examen clinique cible.';
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;
    this.selectedAttachments = Array.from(files).map((file) => file.name);
  }

  protected riskClass(risk: ConsultationRisk): 'low' | 'medium' | 'high' {
    if (risk === 'Faible') return 'low';
    if (risk === 'Moyen') return 'medium';
    return 'high';
  }
}
