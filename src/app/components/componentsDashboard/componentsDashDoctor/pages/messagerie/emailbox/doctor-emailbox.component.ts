import { Component } from '@angular/core';

@Component({
  selector: 'app-doctor-emailbox',
  templateUrl: './doctor-emailbox.component.html',
  styleUrl: './doctor-emailbox.component.scss',
  standalone: false,
})
export class DoctorEmailboxComponent {
  protected searchTerm = '';
  protected selectedCategory: 'primary' | 'social' | 'promotions' = 'primary';
  protected emails = [
    { from: 'Reception', subject: 'RDV annule', preview: 'Patient Fatima R. cancelled.', category: 'primary' },
    { from: 'Laboratoire', subject: 'Resultats analyses', preview: 'Biology report ready.', category: 'primary' },
    { from: 'Support', subject: 'Mail settings', preview: 'Security settings review.', category: 'social' }
  ];

  protected get filteredEmails() {
    const term = this.searchTerm.trim().toLowerCase();
    return this.emails.filter((mail) => mail.category === this.selectedCategory && (!term || `${mail.from} ${mail.subject} ${mail.preview}`.toLowerCase().includes(term)));
  }
}
