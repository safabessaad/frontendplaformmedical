import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type SessionStatus = 'Planned' | 'Live' | 'Finished' | 'Cancelled';
interface TeleconsultationSession {
  id: string;
  patient: string;
  date: string;
  startTime: string;
  duration: number;
  status: SessionStatus;
}

@Component({
  selector: 'app-doctor-teleconsultation-sessions',
  templateUrl: './doctor-teleconsultation-sessions.component.html',
  styleUrl: './doctor-teleconsultation-sessions.component.scss',
  standalone: false,
})
export class DoctorTeleconsultationSessionsComponent {
  protected showForm = false;
  protected readonly sessionForm = this.fb.group({
    patient: ['', [Validators.required]],
    date: ['', [Validators.required]],
    startTime: ['09:00', [Validators.required]],
    duration: [30, [Validators.required]],
  });

  protected sessions: TeleconsultationSession[] = [
    {
      id: 'TEL-101',
      patient: 'Fatima Rachidi',
      date: '2026-03-16',
      startTime: '11:00',
      duration: 30,
      status: 'Live',
    },
    {
      id: 'TEL-102',
      patient: 'Imane Bennani',
      date: '2026-03-17',
      startTime: '10:30',
      duration: 25,
      status: 'Planned',
    },
    {
      id: 'TEL-103',
      patient: 'Youssef Alami',
      date: '2026-03-31',
      startTime: '14:00',
      duration: 20,
      status: 'Planned',
    },
  ];

  constructor(private readonly fb: FormBuilder) {}

  /** Jour courant local (YYYY-MM-DD). */
  private localTodayYmd(): string {
    const n = new Date();
    const y = n.getFullYear();
    const m = (n.getMonth() + 1).toString().padStart(2, '0');
    const d = n.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /** Jour courant (YYYY-MM-DD) pour les KPI — date locale. */
  protected get kpiToday(): number {
    const today = this.localTodayYmd();
    return this.sessions.filter((s) => s.date === today).length;
  }

  /** Fin du creneau (date + heure + duree). */
  private sessionEndDate(session: TeleconsultationSession): Date {
    const [y, mo, d] = session.date.split('-').map((n) => parseInt(n, 10));
    const [hh, mm] = session.startTime.split(':').map((n) => parseInt(n, 10));
    const start = new Date(y, mo - 1, d, hh, mm, 0);
    return new Date(start.getTime() + session.duration * 60 * 1000);
  }

  /**
   * Meet / Rejoindre : uniquement le jour J (aujourd hui) et avant la fin du creneau.
   * Pas demain, pas apres la fin, pas si la date est passee.
   */
  protected canJoinMeet(session: TeleconsultationSession): boolean {
    const today = this.localTodayYmd();
    if (session.date !== today) return false;
    return Date.now() <= this.sessionEndDate(session).getTime();
  }

  protected joinDisabledReason(session: TeleconsultationSession): string {
    if (this.canJoinMeet(session)) return '';
    const today = this.localTodayYmd();
    if (session.date < today) {
      return 'Cette session est passee : vous ne pouvez plus rejoindre la visio.';
    }
    if (session.date > today) {
      return 'Rejoindre uniquement le jour de la session (pas avant).';
    }
    return 'Le creneau est termine : vous ne pouvez plus rejoindre la visio.';
  }

  protected get kpiLive(): number {
    return this.sessions.filter((s) => s.status === 'Live').length;
  }

  protected get kpiPlanned(): number {
    return this.sessions.filter((s) => s.status === 'Planned').length;
  }

  protected initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  protected sessionStatusLabel(status: SessionStatus): string {
    const map: Record<SessionStatus, string> = {
      Live: 'En direct',
      Planned: 'Planifiée',
      Finished: 'Terminée',
      Cancelled: 'Annulée',
    };
    return map[status];
  }

  protected sessionStatusClass(status: SessionStatus): string {
    const map: Record<SessionStatus, string> = {
      Live: 'tc-badge--live',
      Planned: 'tc-badge--planned',
      Finished: 'tc-badge--finished',
      Cancelled: 'tc-badge--cancelled',
    };
    return map[status];
  }

  /**
   * Rejoindre : ouvre Google Meet (nouvelle reunion). L URL Agenda publique ne peut pas ajouter Meet automatiquement.
   */
  protected openJoin(session: TeleconsultationSession): void {
    if (!this.canJoinMeet(session)) {
      return;
    }
    window.open('https://meet.google.com/new', '_blank', 'noopener,noreferrer');
  }

  /**
   * Google Agenda : toujours disponible pour modifier le creneau (ex. passer a aujourd hui avec le patient)
   * et ajouter une visio Meet dans l evenement.
   */
  protected openCalendarSlot(session: TeleconsultationSession): void {
    window.open(this.buildGoogleCalendarUrl(session), '_blank', 'noopener,noreferrer');
  }

  /** Texte d aide pour le bouton Agenda (toutes les lignes). */
  protected calendarButtonTooltip(): string {
    return 'Ouvrir Google Agenda : vous pouvez modifier la date et l heure (ex. aujourd hui selon les disponibilites), puis ajouter une visioconference Google Meet a l evenement.';
  }

  private nextRoundedHour(): Date {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return d;
  }

  /**
   * Date/heure de brouillon pour le lien Agenda : si la seance est passee ou le creneau termine,
   * on propose plutot aujourd hui a la prochaine heure (modifiable dans Agenda).
   */
  private computeCalendarDraftStart(session: TeleconsultationSession): Date {
    const today = this.localTodayYmd();
    const [hh, mm] = session.startTime.split(':').map((n) => parseInt(n, 10));
    const [sy, smo, sd] = session.date.split('-').map((n) => parseInt(n, 10));
    const plannedStart = new Date(sy, smo - 1, sd, hh, mm, 0);

    if (session.date < today) {
      const [ty, tmo, td] = today.split('-').map((n) => parseInt(n, 10));
      let s = new Date(ty, tmo - 1, td, hh, mm, 0);
      if (s.getTime() < Date.now()) {
        return this.nextRoundedHour();
      }
      return s;
    }

    if (session.date > today) {
      return plannedStart;
    }

    if (session.date === today) {
      if (Date.now() <= this.sessionEndDate(session).getTime()) {
        return plannedStart;
      }
      return this.nextRoundedHour();
    }

    return plannedStart;
  }

  private buildGoogleCalendarUrl(session: TeleconsultationSession): string {
    const start = this.computeCalendarDraftStart(session);
    const end = new Date(start.getTime() + session.duration * 60 * 1000);
    const compact = (dt: Date): string => {
      const p = (n: number) => n.toString().padStart(2, '0');
      return `${dt.getFullYear()}${p(dt.getMonth() + 1)}${p(dt.getDate())}T${p(dt.getHours())}${p(dt.getMinutes())}00`;
    };
    const text = encodeURIComponent(`Teleconsultation — ${session.patient} (${session.id})`);
    const details = encodeURIComponent(
      `Session ${session.id}.\n\nModifiez la date et l heure dans Agenda si besoin (ex. replanifier aujourd hui avec le patient).\nEnsuite : « Ajouter une visioconference Google Meet », ou utilisez le bouton Rejoindre le jour J pour ouvrir Meet.`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${compact(start)}/${compact(end)}&details=${details}`;
  }

  protected createSession(): void {
    if (this.sessionForm.invalid) return;
    const value = this.sessionForm.getRawValue();
    const id = `TEL-${Date.now().toString().slice(-4)}`;
    this.sessions = [
      {
        id,
        patient: value.patient ?? '',
        date: value.date ?? '',
        startTime: value.startTime ?? '09:00',
        duration: Number(value.duration ?? 30),
        status: 'Planned',
      },
      ...this.sessions,
    ];
    this.showForm = false;
    this.sessionForm.reset({ patient: '', date: '', startTime: '09:00', duration: 30 });
  }
}
