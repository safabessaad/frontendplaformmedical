import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/** Données de démo — à remplacer par le store / API utilisateur connecté. */
@Component({
  selector: 'app-doctor-profil',
  templateUrl: './doctor-profil.component.html',
  styleUrl: './doctor-profil.component.scss',
  standalone: false,
})
export class DoctorProfilComponent implements OnInit {
  protected profileForm!: FormGroup;
  protected saved = false;
  protected readonly avatarInitials = 'DM';
  /** Identifiant fiche médecin (démo) — à remplacer par l’id utilisateur / API. */
  protected readonly doctorRecordId = 'DOC-001';

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      civility: ['Dr.', Validators.required],
      firstName: ['Marie', Validators.required],
      lastName: ['Dupont', Validators.required],
      specialty: ['Médecine générale', Validators.required],
      rpps: ['10001234567', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['marie.dupont@cabinet.fr', [Validators.required, Validators.email]],
      phone: ['+33 6 12 34 56 78', Validators.required],
      cabinetName: ['Cabinet Médical Centre-Ville', Validators.required],
      cabinetAddress: ['12 rue de la Santé, 75014 Paris'],
      bio: ['Médecin généraliste, consultations sur rendez-vous.'],
    });
  }

  protected save(): void {
    this.saved = false;
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.saved = true;
  }
}
