import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbToastModule, NgbProgressbarModule
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

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AddDoctorsComponent } from './add-doctors/add-doctors.component';
import { UpdateDoctorsComponent } from './update-doctors/update-doctors.component';
import { CreateDoctorsComponent } from './create-doctors/create-doctors.component';
import { DeleteDoctorsComponent } from './delete-doctors/delete-doctors.component';

import { ReactiveFormsModule } from '@angular/forms';
import { createTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from 'src/app/core/services/language.service';
import { CommonComponentsDashModule } from '../../commonComponentsDash/common-components-dash.module';




/**
 * Routes relatives au préfixe `/doctor/doctors/` (lazy depuis `componentsDashDoctor.module`).
 *
 * | Chemin URL complet              | Composant        | Usage                          |
 * |--------------------------------|------------------|--------------------------------|
 * | `/doctor/doctors/add`          | AddDoctors       | Formulaire ajout médecin       |
 * | `/doctor/doctors/edit/:id`     | UpdateDoctors    | Édition par identifiant       |
 * | `/doctor/doctors/create`       | CreateDoctors    | Fiche / création (dashboard)   |
 */
const routes: Routes = [
  {
    path: '',
    data: { title: 'doctors' },
    children: [
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full',
      },
      {
        path: 'add',
        component: CreateDoctorsComponent,
        data: { title: 'Add doctor' }
      },
      {
        path: 'edit/:id',
        component: CreateDoctorsComponent,
        data: { title: 'Edit doctor' }
      },
      {
        path: 'create',
        component: CreateDoctorsComponent,
        data: { title: 'Create doctor' }
      }
    ]
  }
];

@NgModule({
  declarations: [
    AddDoctorsComponent, 
    UpdateDoctorsComponent, 
    CreateDoctorsComponent, 
    DeleteDoctorsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    NgbProgressbarModule,
    FlatpickrModule.forRoot(),
    RouterModule,
    RouterModule.forChild(routes),
    CountUpModule,
    NgApexchartsModule,
    LeafletModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    SlickCarouselModule,
    LightboxModule,
    TranslateModule,
    ReactiveFormsModule,
    CommonComponentsDashModule
  ],
  exports: [RouterModule],
  providers: [LanguageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
/** Module feature « médecins » : écrans add / edit / create sous `/doctor/doctors/`. */
export class DoctorsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}