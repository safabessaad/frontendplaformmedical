import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-doctors',
  standalone: false,
  templateUrl: './delete-doctors.component.html',
  styleUrl: './delete-doctors.component.scss'
})
export class DeleteDoctorsComponent {
  pendingDoctors = [
    { id: 'D-004', name: 'Dr. Emma Wilson', specialty: 'Cardiology' },
    { id: 'D-008', name: 'Dr. James Brown', specialty: 'Dermatology' },
  ];

  constructor(private router: Router) {}

  remove(id: string): void {
    this.pendingDoctors = this.pendingDoctors.filter((doc) => doc.id !== id);
  }

  done(): void {
    this.router.navigate(['/doctor', 'dashboard']);
  }
}
