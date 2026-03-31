import { Component } from '@angular/core';

type SettingsTab = 'account' | 'notification' | 'integration' | 'security' | 'billing';
interface IntegrationItem {
  key: string;
  name: string;
  description: string;
  connected: boolean;
  initials: string;
}

@Component({
  selector: 'app-doctor-parametres',
  templateUrl: './doctor-parametres.component.html',
  styleUrl: './doctor-parametres.component.scss',
  standalone: false,
})
export class DoctorParametresComponent {
  protected settings = {
    language: 'fr',
    darkMode: false,
    emailNotifications: true,
    whatsappReminders: false,
  };

  /** Onglet par défaut : compte (réglages cabinet visibles comme sur la maquette). */
  protected activeTab: SettingsTab = 'account';
  protected readonly tabs: Array<{ key: SettingsTab; label: string }> = [
    { key: 'account', label: 'Account Settings' },
    { key: 'notification', label: 'Notification' },
    { key: 'integration', label: 'Integration' },
    { key: 'security', label: 'Security' },
    { key: 'billing', label: 'Plan & Billing' },
  ];

  protected readonly summaryStats = [
    { label: 'Users with access', value: '12' },
    { label: 'Security level', value: 'Standard' },
    { label: 'Backups this week', value: '7' },
    { label: 'Audit events', value: '23' },
  ];

  protected integrations: IntegrationItem[] = [
    { key: 'google-calendar', name: 'Google Calendar', description: 'Sync your appointments with Google Calendar.', connected: true, initials: 'GC' },
    { key: 'zoom', name: 'Zoom', description: 'Integrate Zoom to facilitate video consultations.', connected: false, initials: 'ZM' },
    { key: 'stripe', name: 'Stripe', description: 'Manage your payments and billing with Stripe.', connected: true, initials: 'ST' },
    { key: 'outlook', name: 'Microsoft Outlook', description: 'Sync your appointments with Microsoft Outlook.', connected: true, initials: 'MO' },
    { key: 'drive', name: 'Google Drive', description: 'Store and manage patient documents securely.', connected: true, initials: 'GD' },
    { key: 'dropbox', name: 'Dropbox', description: 'Manage patient files and records in cloud.', connected: false, initials: 'DB' },
  ];

  protected saveSettings(): void {
    // Données mock — brancher API plus tard
  }

  protected openAuditLog(): void {
    // Navigation ou modal plus tard
  }
}
