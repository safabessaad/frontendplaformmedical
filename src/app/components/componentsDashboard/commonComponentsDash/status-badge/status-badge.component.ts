import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
  standalone: false,
})
export class StatusBadgeComponent {
  @Input() status = '';

  get statusClass(): string {
    const key = this.status.toLowerCase();
    if (
      key === 'confirmed' ||
      key === 'paid' ||
      key === 'completed' ||
      key === 'confirme' ||
      key === 'terminee'
    ) {
      return 'status-badge--success';
    }
    if (
      key === 'pending' ||
      key === 'scheduled' ||
      key === 'processing' ||
      key === 'en attente' ||
      key === 'reporte' ||
      key === 'planifiee'
    ) {
      return 'status-badge--warning';
    }
    if (key === 'cancelled' || key === 'overdue' || key === 'failed' || key === 'annule') {
      return 'status-badge--danger';
    }
    return 'status-badge--neutral';
  }
}
