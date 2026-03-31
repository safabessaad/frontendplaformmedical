export type PatientRiskLevel = 'low' | 'medium' | 'high';

export interface PatientModel {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'F' | 'M';
  phone: string;
  bloodGroup: string;
  chronicDisease: string;
  lastVisitDate: string;
  nextAppointmentDate: string;
  riskLevel: PatientRiskLevel;
}
