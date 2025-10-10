import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  icon?: string;
}

@Component({
  selector: 'app-year-confirm-dialog',
  standalone: false,
  templateUrl: './year-confirm-dialog.html',
  styleUrl: './year-confirm-dialog.scss'
})
export class YearConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<YearConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    // Set defaults
    this.data.confirmText = this.data.confirmText || 'Conferma';
    this.data.cancelText = this.data.cancelText || 'Annulla';
    this.data.type = this.data.type || 'warning';
    this.data.icon = this.data.icon || this.getDefaultIcon();
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  private getDefaultIcon(): string {
    switch (this.data.type) {
      case 'danger':
        return 'warning';
      case 'info':
        return 'info';
      case 'warning':
      default:
        return 'help';
    }
  }

  get iconColor(): string {
    switch (this.data.type) {
      case 'danger':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      case 'warning':
      default:
        return 'text-yellow-500';
    }
  }

  get confirmButtonColor(): string {
    return this.data.type === 'danger' ? 'warn' : 'primary';
  }
}
