import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { YearService } from '../../services/year';
import { Year } from '../../models/year.model';

export interface YearDialogData {
  year?: Year;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-year-form-dialog',
  standalone: false,
  templateUrl: './year-form-dialog.html',
  styleUrl: './year-form-dialog.scss'
})
export class YearFormDialog implements OnInit {
  yearForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private yearService: YearService,
    public dialogRef: MatDialogRef<YearFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: YearDialogData
  ) {
    this.yearForm = this.createForm();
  }

  ngOnInit() {
    if (this.data.mode === 'edit' && this.data.year) {
      this.populateForm(this.data.year);
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

    this.loading = true;
    const formData = this.yearForm.value;

    const request = this.data.mode === 'edit' && this.data.year
      ? this.yearService.updateYear(this.data.year.id, formData)
      : this.yearService.createYear(formData);

    request.subscribe({
      next: (response) => {
        this.loading = false;
        this.dialogRef.close({ success: true, data: response.data });
      },
      error: (error) => {
        this.loading = false;
        this.dialogRef.close({ success: false, error });
      }
    });
  }

  onCancel() {
    this.dialogRef.close({ success: false });
  }

  private markFormGroupTouched() {
    Object.keys(this.yearForm.controls).forEach(key => {
      const control = this.yearForm.get(key);
      control?.markAsTouched();
    });
  }

  get dialogTitle(): string {
    return this.data.mode === 'edit' ? 'Modifica Anno' : 'Nuovo Anno';
  }

  get submitButtonText(): string {
    if (this.loading) {
      return this.data.mode === 'edit' ? 'Aggiornamento...' : 'Creazione...';
    }
    return this.data.mode === 'edit' ? 'Aggiorna' : 'Crea';
  }
}
