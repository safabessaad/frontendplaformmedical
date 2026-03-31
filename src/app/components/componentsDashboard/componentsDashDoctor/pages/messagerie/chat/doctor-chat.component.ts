import { Component } from '@angular/core';

@Component({
  selector: 'app-doctor-chat',
  templateUrl: './doctor-chat.component.html',
  styleUrl: './doctor-chat.component.scss',
  standalone: false,
})
export class DoctorChatComponent {
  protected contacts = [
    { name: 'Lisa Parker', status: 'En ligne', unread: 2, active: true },
    { name: 'Frank Thomas', status: 'Hors ligne', unread: 0 }
  ];
  protected draft = '';
  protected messages = [
    { author: 'patient', text: 'Bonjour Docteur, j ai une douleur depuis ce matin.', time: '09:10' },
    { author: 'medecin', text: 'Bonjour, depuis combien de temps exactement ?', time: '09:12' }
  ];

  protected send(): void {
    const text = this.draft.trim();
    if (!text) return;
    this.messages.push({ author: 'medecin', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    this.draft = '';
  }
}
