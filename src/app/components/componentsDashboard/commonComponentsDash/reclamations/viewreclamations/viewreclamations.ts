import { Component, inject, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import type { ShellMetric } from '../../dashboard-shell/dashboard-shell.component';
import {
  ReclamationsListService,
  type ComplaintRow,
  type ComplaintStatus,
} from 'src/app/core/services/reclamations-list.service';

export type { ComplaintStatus, ComplaintRow };

@Component({
  selector: 'app-viewreclamations',
  templateUrl: './viewreclamations.html',
  styleUrl: './viewreclamations.scss',
  standalone: false,
})
export class ViewreclamationsExtern {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly reclamationsList = inject(ReclamationsListService);
  private readonly modal = inject(NgbModal);

  searchTerm = '';
  statusFilter: ComplaintStatus | 'Tous' = 'Tous';
  feedback = '';
  /** Ligne affichee dans la modale detail. */
  detailRow: ComplaintRow | null = null;

  get items(): ComplaintRow[] {
    return this.reclamationsList.items;
  }

  get metrics(): ShellMetric[] {
    const open = this.items.filter((i) => i.status === 'Ouverte' || i.status === 'En cours').length;
    const resolved = this.items.filter((i) => i.status === 'Resolue').length;
    return [
      { label: 'Actives', value: String(open), icon: 'ri-loader-4-line', variant: 'warning' },
      { label: 'Resolues (30j)', value: String(resolved), icon: 'ri-checkbox-circle-line', variant: 'success' },
      { label: 'Total dossiers', value: String(this.items.length), icon: 'ri-file-list-3-line', variant: 'primary' },
      { label: 'SLA respecte', value: '92%', icon: 'ri-timer-flash-line', variant: 'muted' },
    ];
  }

  get filteredItems(): ComplaintRow[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.items.filter((row) => {
      const match =
        !q ||
        row.id.toLowerCase().includes(q) ||
        row.patient.toLowerCase().includes(q) ||
        row.subject.toLowerCase().includes(q) ||
        (row.description && row.description.toLowerCase().includes(q)) ||
        (row.category && row.category.toLowerCase().includes(q));
      const st = this.statusFilter === 'Tous' || row.status === this.statusFilter;
      return match && st;
    });
  }

  statusClass(s: ComplaintStatus): string {
    const map: Record<ComplaintStatus, string> = {
      Ouverte: 'bg-primary-subtle text-primary',
      'En cours': 'bg-warning-subtle text-warning',
      Resolue: 'bg-success-subtle text-success',
      Fermee: 'bg-secondary-subtle text-secondary',
    };
    return map[s];
  }

  newComplaint(): void {
    void this.router.navigate(['../add'], { relativeTo: this.route });
  }

  /** Exporte les lignes visibles (meme filtres que le tableau) en CSV, telechargement navigateur. */
  exportCsv(): void {
    const rows = this.filteredItems;
    if (!rows.length) {
      this.feedback = 'Aucune reclamation a exporter avec les filtres actuels.';
      return;
    }
    const sep = ';';
    const header = [
      'ID',
      'Patient',
      'Sujet',
      'Date',
      'Statut',
      'Responsable',
      'Categorie',
      'Priorite',
      'Email',
      'Description',
    ];
    const esc = (v: string | undefined): string => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const line = (r: ComplaintRow): string =>
      [
        r.id,
        r.patient,
        r.subject,
        r.openedAt,
        r.status,
        r.owner,
        r.category ?? '',
        r.priority ?? '',
        r.contactEmail ?? '',
        (r.description ?? '').replace(/\r?\n/g, ' '),
      ]
        .map(esc)
        .join(sep);
    const body = [header.join(sep), ...rows.map(line)].join('\r\n');
    const blob = new Blob(['\uFEFF' + body], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reclamations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.feedback = `Fichier CSV telecharge (${rows.length} reclamation(s), filtres appliques).`;
  }

  openRow(row: ComplaintRow, content: TemplateRef<unknown>): void {
    this.detailRow = row;
    this.modal.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  /**
   * Traitement : message type au patient (mailto si e-mail connu).
   * Sans backend SMTP, le navigateur ouvre le client mail avec le texte pret a envoyer.
   */
  async traiterReclamation(row: ComplaintRow): Promise<void> {
    const bodyText =
      `Bonjour ${row.patient},\n\n` +
      `Nous avons bien recu votre reclamation (${row.id}) concernant : ${row.subject}.\n\n` +
      `Merci pour votre retour. Nous allons la traiter et corriger la situation dans les meilleurs delais.\n\n` +
      `Cordialement,\nLe cabinet`;

    const subject = `Re: Votre reclamation ${row.id}`;
    const email = row.contactEmail?.trim();

    this.reclamationsList.markAsProcessing(row.id);

    if (!email) {
      this.feedback =
        'Aucun e-mail de contact : le texte du message a ete copie dans le presse-papiers. Collez-le dans votre messagerie pour le patient.';
      try {
        await navigator.clipboard.writeText(bodyText);
      } catch {
        this.feedback =
          'Aucun e-mail de contact enregistre pour ce dossier. Ajoutez un e-mail a la creation de la reclamation.';
      }
      return;
    }

    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailto;
    this.feedback = `Client mail ouvert vers ${email} avec le message de prise en charge. Statut : En cours.`;
  }
}
