import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { CalendarEventCategory, CalendarEventModel } from './calendar-event.model';

@Injectable({ providedIn: 'root' })
export class CalendarEventsService {
  private readonly events: CalendarEventModel[] = [
    { id: 'evt-001', title: 'Consultation generale', date: '2026-03-17', startTime: '09:00', endTime: '09:30', location: 'Cabinet 1', description: 'Controle trimestriel', patientName: 'Youssef El Idrissi', category: 'Consultation' },
    { id: 'evt-002', title: 'Suivi diabete', date: '2026-03-17', startTime: '10:00', endTime: '10:40', location: 'Cabinet 2', description: 'Ajustement traitement', patientName: 'Fatima R.', category: 'Suivi' }
  ];

  list(): CalendarEventModel[] { return [...this.events]; }
  add(input: Omit<CalendarEventModel, 'id'>): CalendarEventModel { const event = { id: `evt-${Date.now()}`, ...input }; this.events.push(event); return event; }
  update(eventId: string, payload: Omit<CalendarEventModel, 'id'>): void {
    const index = this.events.findIndex((item) => item.id === eventId);
    if (index >= 0) this.events[index] = { id: eventId, ...payload };
  }

  toCalendarInputs(items: CalendarEventModel[]): EventInput[] {
    return items.map((item) => ({
      id: item.id,
      title: `${item.patientName} - ${item.title}`,
      start: `${item.date}T${item.startTime}:00`,
      end: `${item.date}T${item.endTime}:00`,
      extendedProps: { location: item.location, description: item.description, patientName: item.patientName, category: item.category }
    }));
  }

  getCategoryStyle(category: CalendarEventCategory): { background: string; border: string; text: string } {
    switch (category) {
      case 'Urgence': return { background: '#fee2e2', border: '#f87171', text: '#991b1b' };
      case 'Suivi': return { background: '#ecfeff', border: '#22d3ee', text: '#155e75' };
      case 'Teleconsultation': return { background: '#ede9fe', border: '#a78bfa', text: '#4c1d95' };
      default: return { background: '#dbeafe', border: '#60a5fa', text: '#1d4ed8' };
    }
  }
}
