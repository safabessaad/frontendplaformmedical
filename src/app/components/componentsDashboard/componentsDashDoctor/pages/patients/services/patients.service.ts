import { Injectable } from '@angular/core';
import { PatientModel } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private readonly patients: PatientModel[] = [
    {
      id: 'pat-001',
      firstName: 'Youssef',
      lastName: 'El Idrissi',
      age: 44,
      gender: 'M',
      phone: '+212600000001',
      bloodGroup: 'A+',
      chronicDisease: 'Diabete type 2',
      lastVisitDate: '2026-03-08',
      nextAppointmentDate: '2026-03-20',
      riskLevel: 'medium'
    },
    {
      id: 'pat-002',
      firstName: 'Fatima',
      lastName: 'Rachidi',
      age: 61,
      gender: 'F',
      phone: '+212600000002',
      bloodGroup: 'O+',
      chronicDisease: 'HTA',
      lastVisitDate: '2026-03-14',
      nextAppointmentDate: '2026-03-18',
      riskLevel: 'high'
    },
    {
      id: 'pat-003',
      firstName: 'Imane',
      lastName: 'Bennani',
      age: 29,
      gender: 'F',
      phone: '+212600000003',
      bloodGroup: 'B+',
      chronicDisease: 'Aucune',
      lastVisitDate: '2026-03-03',
      nextAppointmentDate: '2026-04-02',
      riskLevel: 'low'
    }
  ];

  list(): PatientModel[] {
    return [...this.patients];
  }

  add(patient: Omit<PatientModel, 'id'>): PatientModel {
    const newPatient: PatientModel = {
      id: `pat-${Date.now()}`,
      ...patient
    };
    this.patients.unshift(newPatient);
    return newPatient;
  }
}
