import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { YearService } from '../../services/year';
import { Year } from '../../models/year.model';

@Component({
  selector: 'app-year-form',
  standalone: false,
  templateUrl: './year-form.html',
  styleUrl: './year-form.scss'
})
export class YearForm implements OnInit {
  yearForm: FormGroup;
  isEditMode = false;
  yearId?: number;
  loading = false;
  submitting = false;
  error: string | null = null;
  year?: Year;

  constructor(
    private fb: FormBuilder,
    private yearService: YearService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.yearForm = this.createForm();
  }

  ngOnInit() {
    this.yearId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.yearId;

    if (this.isEditMode) {
      this.loadYear();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      is_active: [false],
      description: ['', [Validators.maxLength(1000)]]
    });
  }

  loadYear() {
    if (!this.yearId) return;

    this.loading = true;
    this.error = null;

    this.yearService.getYear(this.yearId).subscribe({
      next: (year) => {
        this.year = year;
        this.populateForm(year);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Errore nel caricamento dell\'anno';
        this.loading = false;
        console.error('Error loading year:', error);
      }
    });
  }

  private populateForm(year: Year) {
    this.yearForm.patchValue({
      name: year.name,
      start_date: year.start_date ? year.start_date.split('T')[0] : '',
      end_date: year.end_date ? year.end_date.split('T')[0] : '',
      is_active: year.is_active,
      description: year.description || ''
    });
  }

  onSubmit() {
    if (this.yearForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    this.error = null;

    const formData = this.yearForm.value;

    const request = this.isEditMode
      ? this.yearService.updateYear(this.yearId!, formData)
      : this.yearService.createYear(formData);

    request.subscribe({
      next: (response) => {
        this.submitting = false;
        this.router.navigate(['/years'], {
          queryParams: { message: response.message }
        });
      },
      error: (error) => {
        this.submitting = false;
        this.error = this.getErrorMessage(error);
        console.error('Error saving year:', error);
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.yearForm.controls).forEach(key => {
      const control = this.yearForm.get(key);
      control?.markAsTouched();
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (error.error?.errors) {
      const firstError = Object.values(error.error.errors)[0];
      return Array.isArray(firstError) ? firstError[0] as string : firstError as string;
    }

    return 'Si è verificato un errore durante il salvataggio';
  }

  onCancel() {
    this.router.navigate(['/years']);
  }

  // Getter methods for template validation
  get nameError(): string | null {
    const control = this.yearForm.get('name');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Il nome è obbligatorio';
      if (control.errors['maxlength']) return 'Il nome non può superare i 255 caratteri';
    }
    return null;
  }

  get startDateError(): string | null {
    const control = this.yearForm.get('start_date');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'La data di inizio è obbligatoria';
    }
    return null;
  }

  get endDateError(): string | null {
    const control = this.yearForm.get('end_date');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'La data di fine è obbligatoria';
    }
    return null;
  }

  get descriptionError(): string | null {
    const control = this.yearForm.get('description');
    if (control?.errors && control.touched) {
      if (control.errors['maxlength']) return 'La descrizione non può superare i 1000 caratteri';
    }
    return null;
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Modifica Anno' : 'Nuovo Anno';
  }

  get submitButtonText(): string {
    if (this.submitting) {
      return this.isEditMode ? 'Aggiornamento...' : 'Creazione...';
    }
    return this.isEditMode ? 'Aggiorna' : 'Crea';
  }
}
