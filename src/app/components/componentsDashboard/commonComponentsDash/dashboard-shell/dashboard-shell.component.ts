import { Component, Input } from '@angular/core';

export interface ShellMetric {
  label: string;
  value: string;
  /** Classe d’icône Remix Icon (ex. ri-medicine-bottle-line) */
  icon?: string;
  /** Variante couleur pour l’icône / accent */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'muted';
}

@Component({
  selector: 'app-dashboard-shell',
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss',
  standalone: false,
})
export class DashboardShellComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() metrics: ShellMetric[] = [];
  @Input() secondaryMetrics: ShellMetric[] = [];
}
