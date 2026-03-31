import { Component, Input } from '@angular/core';
import { PatientRiskLevel } from '../models/patient.model';

@Component({
  selector: 'app-patient-risk-badge',
  templateUrl: './patient-risk-badge.component.html',
  styleUrl: './patient-risk-badge.component.scss',
  standalone: false,
})
export class PatientRiskBadgeComponent {
  @Input({ required: true }) risk: PatientRiskLevel = 'low';

  protected get text(): string {
    if (this.risk === 'high') return 'Risque eleve';
    if (this.risk === 'medium') return 'Risque moyen';
    return 'Risque faible';
  }
}
