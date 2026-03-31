import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell/dashboard-shell.component';
import { StatusBadgeComponent } from './status-badge/status-badge.component';
import { CalendarLegendComponent } from './calendar/calendar-legend.component';

@NgModule({
  declarations: [DashboardShellComponent, StatusBadgeComponent, CalendarLegendComponent],
  imports: [CommonModule, RouterModule],
  exports: [DashboardShellComponent, StatusBadgeComponent, CalendarLegendComponent],
})
export class CommonComponentsDashModule {}
