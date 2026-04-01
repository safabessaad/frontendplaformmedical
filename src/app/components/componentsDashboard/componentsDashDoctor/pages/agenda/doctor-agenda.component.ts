import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarEventCategory } from '../../../commonComponentsDash/calendar/calendar-event.model';
import { CalendarEventsService } from '../../../commonComponentsDash/calendar/calendar-events.service';

@Component({
  selector: 'app-doctor-agenda',
  templateUrl: './doctor-agenda.component.html',
  styleUrl: './doctor-agenda.component.scss',
  standalone: false,
})
export class DoctorAgendaComponent {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  protected editingEventId: string | null = null;
  protected calendarEvents: EventInput[] = [];

  protected readonly eventForm = this.fb.group({
    title: ['', [Validators.required]],
    patientName: ['', [Validators.required]],
    date: ['', [Validators.required]],
    startTime: ['09:00', [Validators.required]],
    endTime: ['09:30', [Validators.required]],
    location: ['Cabinet 1', [Validators.required]],
    description: [''],
    category: ['Consultation' as CalendarEventCategory, [Validators.required]]
  });

  protected submitAttempt = false;

  protected readonly calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    locale: frLocale,
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' },
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      list: 'Liste'
    },
    selectable: true,
    editable: false,
    dayMaxEvents: true,
    height: 'auto',
    dateClick: (arg) => this.onDateClick(arg),
    select: (arg) => this.onDateSelect(arg),
    eventClick: (arg) => this.onEventClick(arg)
  };

  constructor(private readonly fb: FormBuilder, private readonly calendarEventsService: CalendarEventsService) {
    this.refreshCalendar();
  }

  protected saveEvent(): void {
    this.submitAttempt = true;
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }
    const value = this.eventForm.getRawValue();
    const payload = {
      title: value.title ?? '',
      patientName: value.patientName ?? '',
      date: value.date ?? '',
      startTime: value.startTime ?? '09:00',
      endTime: value.endTime ?? '09:30',
      location: value.location ?? '',
      description: value.description ?? '',
      category: (value.category ?? 'Consultation') as CalendarEventCategory
    };
    if (this.editingEventId) this.calendarEventsService.update(this.editingEventId, payload);
    else this.calendarEventsService.add(payload);
    this.submitAttempt = false;
    this.refreshCalendar();
    this.resetForm();
  }

  protected resetForm(): void {
    this.submitAttempt = false;
    this.editingEventId = null;
    this.eventForm.reset({ title: '', patientName: '', date: '', startTime: '09:00', endTime: '09:30', location: 'Cabinet 1', description: '', category: 'Consultation' });
  }

  private switchToNewAppointment(dateIso: string): void {
    this.editingEventId = null;
    this.submitAttempt = false;
    this.eventForm.patchValue({ date: dateIso });
  }

  private onDateClick(arg: DateClickArg): void {
    this.switchToNewAppointment(arg.dateStr);
  }

  private onDateSelect(arg: DateSelectArg): void {
    this.switchToNewAppointment(arg.startStr.slice(0, 10));
  }

  private onEventClick(arg: EventClickArg): void {
    arg.jsEvent.preventDefault();
    arg.jsEvent.stopPropagation();
    const eventId = arg.event.id;
    const event = this.calendarEventsService.getById(eventId);
    if (!event) return;

    this.submitAttempt = false;
    this.editingEventId = eventId;
    this.eventForm.patchValue({
      title: event.title,
      patientName: event.patientName,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      description: event.description,
      category: event.category
    });
  }

  protected deleteEvent(): void {
    if (!this.editingEventId) return;
    if (!confirm('Supprimer ce rendez-vous ? Cette action est definitive.')) return;
    this.calendarEventsService.remove(this.editingEventId);
    this.refreshCalendar();
    this.resetForm();
  }

  private refreshCalendar(): void {
    this.calendarEvents = [...this.calendarEventsService.toCalendarInputs(this.calendarEventsService.list())];
  }
}
