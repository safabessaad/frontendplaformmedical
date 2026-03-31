import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
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
    location: ['Cabinet', [Validators.required]],
    description: [''],
    category: ['Consultation' as CalendarEventCategory, [Validators.required]]
  });

  protected readonly calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' },
    selectable: true,
    editable: false,
    events: [],
    select: (arg) => this.onDateSelect(arg),
    eventClick: (arg) => this.onEventClick(arg)
  };

  constructor(private readonly fb: FormBuilder, private readonly calendarEventsService: CalendarEventsService) {
    this.refreshCalendar();
  }

  protected saveEvent(): void {
    if (this.eventForm.invalid) return;
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
    this.refreshCalendar();
    this.resetForm();
  }

  protected resetForm(): void {
    this.editingEventId = null;
    this.eventForm.reset({ title: '', patientName: '', date: '', startTime: '09:00', endTime: '09:30', location: 'Cabinet', description: '', category: 'Consultation' });
  }

  private onDateSelect(arg: DateSelectArg): void { this.eventForm.patchValue({ date: arg.startStr.slice(0, 10) }); }
  private onEventClick(arg: EventClickArg): void { this.editingEventId = arg.event.id; }

  private refreshCalendar(): void {
    this.calendarEvents = this.calendarEventsService.toCalendarInputs(this.calendarEventsService.list());
    this.calendarOptions.events = [...this.calendarEvents] as EventSourceInput;
  }
}
