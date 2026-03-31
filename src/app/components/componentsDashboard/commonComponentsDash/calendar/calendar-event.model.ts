export type CalendarEventCategory = 'Consultation' | 'Suivi' | 'Urgence' | 'Teleconsultation';

export interface CalendarEventModel {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  patientName: string;
  category: CalendarEventCategory;
}
