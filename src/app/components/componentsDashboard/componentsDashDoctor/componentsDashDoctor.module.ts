import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbToastModule, NgbProgressbarModule, NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';

import { FlatpickrModule } from 'angularx-flatpickr';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { LightboxModule } from 'ngx-lightbox';
import { FullCalendarModule } from '@fullcalendar/angular';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';
import { RouterModule, Routes } from '@angular/router';

import { DoctorPatientsComponent } from './pages/patients/doctor-patients.component';
import { DoctorRendezVousComponent } from './pages/rendez-vous/doctor-rendez-vous.component';
import { DoctorAgendaComponent } from './pages/agenda/doctor-agenda.component';
import { DoctorDossierMedicalComponent } from './pages/dossier-medical/doctor-dossier-medical.component';
import { DoctorOrdonnancesComponent } from './pages/ordonnances/doctor-ordonnances.component';
import { DoctorDocumentsComponent } from './pages/documents/doctor-documents.component';
import { DoctorTeleconsultationComponent } from './pages/teleconsultation/doctor-teleconsultation.component';
import { DoctorMessagerieComponent } from './pages/messagerie/doctor-messagerie.component';
import { DoctorSuiviChroniqueComponent } from './pages/suivi-chronique/doctor-suivi-chronique.component';
import { DoctorFacturationComponent } from './pages/facturation/doctor-facturation.component';
import { DoctorIaAssistanceComponent } from './pages/ia-assistance/doctor-ia-assistance.component';
import { DoctorIaPlanningComponent } from './pages/ia-planning/doctor-ia-planning.component';
import { DoctorReportingComponent } from './pages/reporting/doctor-reporting.component';
import { DoctorParametresComponent } from './pages/parametres/doctor-parametres.component';
import { DoctorProfilComponent } from './pages/profil/doctor-profil.component';
import { DoctorDashboardComponent } from './pages/dashboard/doctor-dashboard.component';
import { CommonComponentsDashModule } from '../commonComponentsDash/common-components-dash.module';
import { DoctorConsultationsComponent } from './pages/consultations/doctor-consultations.component';
import { DoctorEmailboxComponent } from './pages/messagerie/emailbox/doctor-emailbox.component';
import { DoctorChatComponent } from './pages/messagerie/chat/doctor-chat.component';
import { DoctorWhatsappComponent } from './pages/messagerie/whatsapp/doctor-whatsapp.component';
import { DoctorTeleconsultationSessionsComponent } from './pages/teleconsultation/sessions/doctor-teleconsultation-sessions.component';
import { DoctorTeleconsultationFollowUpComponent } from './pages/teleconsultation/follow-up/doctor-teleconsultation-follow-up.component';
import { PatientRiskBadgeComponent } from './pages/patients/components/patient-risk-badge.component';

/**
 * Routage du dashboard médecin (préfixe parent : `/doctor` dans `app-routing.module.ts`).
 *
 * - **Lazy** : `doctors`, `reclamations`.
 * - **Une route = un composant** sous `pages/` pour pouvoir implémenter chaque écran séparément.
 */
const routes: Routes = [
  /** Accueil médecin : tableau de bord (pas de redirect pour éviter les cas limites du router). */
  { path: '', component: DoctorDashboardComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DoctorDashboardComponent },

  {
    path: 'doctors',
    loadChildren: () =>
      import('../componentsDashDoctor/doctors/doctors.module').then((m) => m.DoctorsModule),
  },
  {
    path: 'reclamations',
    loadChildren: () =>
      import('../commonComponentsDash/reclamations/reclamations.module').then((m) => m.ReclamationsModule),
  },

  { path: 'patients', component: DoctorPatientsComponent },
  { path: 'rendez-vous', component: DoctorRendezVousComponent },
  { path: 'agenda', component: DoctorAgendaComponent },
  { path: 'consultations', component: DoctorConsultationsComponent },
  { path: 'dossier-medical', component: DoctorDossierMedicalComponent },
  { path: 'ordonnances', component: DoctorOrdonnancesComponent },

  { path: 'documents', component: DoctorDocumentsComponent },
  {
    path: 'teleconsultation',
    component: DoctorTeleconsultationComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sessions' },
      { path: 'sessions', component: DoctorTeleconsultationSessionsComponent },
      { path: 'follow-up', component: DoctorTeleconsultationFollowUpComponent }
    ]
  },
  {
    path: 'messagerie',
    component: DoctorMessagerieComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'emailbox' },
      { path: 'emailbox', component: DoctorEmailboxComponent },
      { path: 'chat', component: DoctorChatComponent },
      { path: 'whatsapp', component: DoctorWhatsappComponent }
    ]
  },
  { path: 'suivi-chronique', component: DoctorSuiviChroniqueComponent },

  { path: 'facturation', component: DoctorFacturationComponent },
  { path: 'ia-assistance', component: DoctorIaAssistanceComponent },
  { path: 'ia-planning', component: DoctorIaPlanningComponent },
  { path: 'reporting', component: DoctorReportingComponent },
  { path: 'parametres', component: DoctorParametresComponent },
  { path: 'profil', component: DoctorProfilComponent },
];

const doctorPageDeclarations = [
  DoctorPatientsComponent,
  PatientRiskBadgeComponent,
  DoctorRendezVousComponent,
  DoctorAgendaComponent,
  DoctorConsultationsComponent,
  DoctorDossierMedicalComponent,
  DoctorOrdonnancesComponent,
  DoctorDocumentsComponent,
  DoctorTeleconsultationComponent,
  DoctorMessagerieComponent,
  DoctorEmailboxComponent,
  DoctorChatComponent,
  DoctorWhatsappComponent,
  DoctorSuiviChroniqueComponent,
  DoctorFacturationComponent,
  DoctorIaAssistanceComponent,
  DoctorIaPlanningComponent,
  DoctorReportingComponent,
  DoctorParametresComponent,
  DoctorProfilComponent,
  DoctorDashboardComponent,
  DoctorTeleconsultationSessionsComponent,
  DoctorTeleconsultationFollowUpComponent,
];

@NgModule({
  declarations: [...doctorPageDeclarations],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbToastModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    RouterModule.forChild(routes),
    FlatpickrModule.forRoot(),
    CountUpModule,
    NgApexchartsModule,
    LeafletModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    SlickCarouselModule,
    LightboxModule,
    FullCalendarModule,
    CommonComponentsDashModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsDashDoctorModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
