import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-doctors',
  standalone: false,
  templateUrl: './update-doctors.component.html',
  styleUrl: './update-doctors.component.scss'
})
export class UpdateDoctorsComponent {
  doctor = {
    firstName: 'Sami',
    lastName: 'Khiari',
    email: 'sami.khiari@clinic.com',
    phone: '+216 55 221 144',
    specialty: 'General medicine',
  };

  constructor(private router: Router) {}

  update(): void {
    this.router.navigate(['/doctor', 'dashboard']);
  }
}
