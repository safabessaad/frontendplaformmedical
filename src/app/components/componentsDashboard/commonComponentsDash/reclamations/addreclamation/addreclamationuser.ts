import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import type { ShellMetric } from '../../dashboard-shell/dashboard-shell.component';
import { ReclamationsListService } from 'src/app/core/services/reclamations-list.service';

@Component({
  selector: 'app-addreclamation-user',
  standalone: false,
  templateUrl: './addreclamationuser.html',
  styleUrl: './addreclamationuser.scss',
})
export class AddReclamationUser {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly reclamationsList = inject(ReclamationsListService);

  feedback = '';

  readonly metrics: ShellMetric[] = [
    { label: 'Delai moyen de reponse', value: '48 h', icon: 'ri-time-line', variant: 'primary' },
    { label: 'Reclamations ce mois', value: '12', icon: 'ri-file-warning-line', variant: 'warning' },
    { label: 'Taux de resolution', value: '94%', icon: 'ri-checkbox-circle-line', variant: 'success' },
    { label: 'En attente', value: '3', icon: 'ri-loader-4-line', variant: 'muted' },
  ];

  readonly complaintForm = this.fb.group({
    patient: ['', [Validators.required, Validators.minLength(2)]],
    contactEmail: ['', [Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    priority: ['Normale', Validators.required],
    category: ['Qualite des soins', Validators.required],
    description: ['', [Validators.required, Validators.minLength(15)]],
    consent: [false, Validators.requiredTrue],
  });

  submit(): void {
    if (this.complaintForm.invalid) {
      this.complaintForm.markAllAsTouched();
      this.feedback = 'Veuillez completer le formulaire et accepter le traitement.';
      return;
    }
    const v = this.complaintForm.getRawValue();
    const row = this.reclamationsList.addFromForm({
      patient: (v.patient ?? '').trim(),
      subject: (v.subject ?? '').trim(),
      category: (v.category ?? '').trim(),
      priority: (v.priority ?? '').trim(),
      description: (v.description ?? '').trim(),
      contactEmail: (v.contactEmail ?? '').trim(),
    });
    this.feedback = 'Reclamation enregistree avec succes. Redirection vers le suivi...';
    window.setTimeout(() => {
      const routeId = row.id.replace(/^R-/, '');
      void this.router.navigate(['../view', routeId], { relativeTo: this.route });
    }, 900);
  }


  reset(): void {
    this.complaintForm.reset({
      patient: '',
      contactEmail: '',
      subject: '',
      priority: 'Normale',
      category: 'Qualite des soins',
      description: '',
      consent: false,
    });
    this.feedback = '';
  }
}
