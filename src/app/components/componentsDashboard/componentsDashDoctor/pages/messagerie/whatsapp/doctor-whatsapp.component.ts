import { Component } from '@angular/core';

@Component({
  selector: 'app-doctor-whatsapp',
  templateUrl: './doctor-whatsapp.component.html',
  styleUrl: './doctor-whatsapp.component.scss',
  standalone: false,
})
export class DoctorWhatsappComponent {
  protected searchTerm = '';
  protected draft = '';
  protected threads = [
    { patient: 'Fatima Rachidi', phone: '+212 6 12 34 56 78', lastMessage: 'Bonjour docteur...', unread: 2, active: true },
    { patient: 'Youssef El Idrissi', phone: '+212 6 23 45 67 89', lastMessage: 'Merci pour la prescription.', unread: 0 }
  ];
  protected messages = [
    { author: 'patient', text: 'Puis-je envoyer mon analyse ici ?', time: '10:02' },
    { author: 'cabinet', text: 'Oui, envoyez le document PDF.', time: '10:04' }
  ];

  protected get filteredThreads() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.threads;
    return this.threads.filter((thread) => `${thread.patient} ${thread.phone} ${thread.lastMessage}`.toLowerCase().includes(term));
  }

  protected send(): void {
    const text = this.draft.trim();
    if (!text) return;
    this.messages.push({ author: 'cabinet', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    this.draft = '';
  }
}
