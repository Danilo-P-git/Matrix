import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Gestione Attività</h2>
    <p>Placeholder sezione attività. Implementa qui la lista e CRUD delle attività.</p>
  `,
  styles: [`h2 { margin-top: 0; font-size: 20px; letter-spacing: .5px; }`]
})
export class ActivitiesComponent {}
