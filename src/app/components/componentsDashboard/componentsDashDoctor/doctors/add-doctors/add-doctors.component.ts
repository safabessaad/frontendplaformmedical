import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-doctors',
  templateUrl: './add-doctors.component.html',
  styleUrl: './add-doctors.component.scss',
  standalone: false
})
export class AddDoctorsComponent {
  doctor = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
  };

  constructor(private router: Router) {}

  save(): void {
    if (!this.doctor.firstName || !this.doctor.lastName || !this.doctor.email) {
      return;
    }
    this.router.navigate(['/doctor', 'dashboard']);
  }
}
