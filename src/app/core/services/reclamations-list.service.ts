import { Injectable } from '@angular/core';

export type ComplaintStatus = 'Ouverte' | 'En cours' | 'Resolue' | 'Fermee';

export interface ComplaintRow {
  id: string;
  patient: string;
  subject: string;
  openedAt: string;
  status: ComplaintStatus;
  owner: string;
  /** Texte detaille (formulaire ou demo). */
  description?: string;
  contactEmail?: string;
  category?: string;
  priority?: string;
}

export interface NewComplaintInput {
  patient: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  contactEmail?: string;
}

/**
 * Liste partagee entre « Nouvelle reclamation » et « Suivi des reclamations ».
 * En production, remplacer par des appels API.
 */
@Injectable({ providedIn: 'root' })
export class ReclamationsListService {
  private nextNumericId = 1043;

  readonly items: ComplaintRow[] = [
    {
      id: 'R-1042',
      patient: 'Youssef El Idrissi',
      subject: 'Delai pour obtenir un rendez-vous',
      openedAt: '2026-03-14',
      status: 'En cours',
      owner: 'Secretariat',
      category: 'Delais',
      priority: 'Haute',
      description:
        'Le patient signale un delai de plus de 3 semaines pour une consultation de suivi. Demande de rappel telephonique.',
      contactEmail: 'youssef.exemple@email.com',
    },
    {
      id: 'R-1041',
      patient: 'Fatima Rachidi',
      subject: 'Facturation consult. du 02/2026',
      openedAt: '2026-03-10',
      status: 'Ouverte',
      owner: 'Comptabilite',
      category: 'Facturation',
      priority: 'Normale',
      description: 'Montant en double sur la facture du mois de fevrier. Pieces jointes transmises au secretariat.',
      contactEmail: '',
    },
    {
      id: 'R-1038',
      patient: 'Omar Benjelloun',
      subject: 'Demande de copie dordonnance',
      openedAt: '2026-02-28',
      status: 'Resolue',
      owner: 'Medecin referent',
      category: 'Documents',
      priority: 'Basse',
      description: 'Copie PDF envoyee par courriel le 01/03/2026.',
      contactEmail: 'omar.b@email.com',
    },
    {
      id: 'R-1035',
      patient: 'Sanae Alaoui',
      subject: 'Accueil telephone',
      openedAt: '2026-02-20',
      status: 'Fermee',
      owner: 'Secretariat',
      category: 'Relation patient',
      priority: 'Normale',
      description: 'Retour patient : satisfaction apres rappel du standard.',
      contactEmail: '',
    },
  ];

  /** Passe une reclamation « Ouverte » en « En cours » apres prise en charge. */
  markAsProcessing(id: string): void {
    const row = this.items.find((r) => r.id === id);
    if (row && row.status === 'Ouverte') {
      row.status = 'En cours';
    }
  }

  addFromForm(input: NewComplaintInput): ComplaintRow {
    const id = `R-${this.nextNumericId++}`;
    const row: ComplaintRow = {
      id,
      patient: input.patient.trim(),
      subject: input.subject.trim(),
      openedAt: new Date().toISOString().slice(0, 10),
      status: 'Ouverte',
      owner: `Categorie: ${input.category} · ${input.priority}`,
      category: input.category.trim(),
      priority: input.priority.trim(),
      description: input.description.trim(),
      contactEmail: (input.contactEmail ?? '').trim() || undefined,
    };
    this.items.unshift(row);
    return row;
  }
}
