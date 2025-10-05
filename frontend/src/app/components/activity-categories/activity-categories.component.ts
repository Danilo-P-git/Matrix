import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Categorie Attività</h2>
    <p>Placeholder gestione categorie attività. Aggiungi CRUD categorie e mapping alle attività.</p>
  `,
  styles: [`h2 { margin-top: 0; font-size: 20px; letter-spacing: .5px; }`]
})
export class ActivityCategoriesComponent {}
