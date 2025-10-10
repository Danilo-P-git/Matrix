import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { YearService } from '../../services/year';
import { Year, YearListResponse, YearStatistics } from '../../models/year.model';
import { TableColumn, TableAction } from '../../../common/models/table.model';
import { YearFormDialog } from '../../dialogs/year-form-dialog/year-form-dialog';
import { YearConfirmDialog } from '../../dialogs/year-confirm-dialog/year-confirm-dialog';

@Component({
  selector: 'app-year-list',
  standalone: false,
  templateUrl: './year-list.html',
  styleUrl: './year-list.scss'
})
export class YearList implements OnInit {
  years: Year[] = [];
  loading = false;
  error: string | null = null;

  // Table configuration
  columns: TableColumn[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'start_date', label: 'Data Inizio', type: 'date', sortable: true },
    { key: 'end_date', label: 'Data Fine', type: 'date', sortable: true },
    { key: 'description', label: 'Descrizione' }
  ];

  actions: TableAction[] = [
    {
      label: 'Modifica',
      icon: 'edit',
      color: 'primary',
      action: (year: Year) => this.editYear(year)
    },
    {
      label: 'Elimina',
      icon: 'delete',
      color: 'warn',
      action: (year: Year) => this.deleteYear(year)
    }
  ];

  // Server-side pagination
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  // Filters
  searchTerm = '';
  sortBy = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  activeFilter?: boolean;

  // Statistics
  statistics?: YearStatistics;

  // Filters object for template binding
  filters = {
    search: '',
    is_current: null as boolean | null
  };

  // Table configuration for template
  tableColumns: TableColumn[] = this.columns;
  tableActions: TableAction[] = this.actions;

  constructor(
    public yearService: YearService, // Make public for template access
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadYears();
    // this.loadStatistics();
  }

  loadYears() {
    this.years = [];
    this.loading = true;
    this.error = null;

    const params = {
      page: this.pageIndex + 1, // Angular Material uses 0-based indexing
      per_page: this.pageSize,
      search: this.searchTerm || undefined,
      sort_by: this.sortBy,
      sort_direction: this.sortDirection
    };

    this.yearService.getYears(params).subscribe({
      next: (response: YearListResponse) => {
        this.years = response.data;
        this.pageIndex = response.current_page - 1; // Adjust for 0-based index
        this.pageSize = response.per_page;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Errore nel caricamento degli anni';
        this.loading = false;
        this.showSnackBar('Errore nel caricamento degli anni', 'error');
        console.error('Error loading years:', error);
      }
    });
  }

  // loadStatistics() {
  //   this.yearService.getStatistics().subscribe({
  //     next: (stats) => {
  //       this.statistics = stats;
  //     },
  //     error: (error) => {
  //       console.error('Error loading statistics:', error);
  //     }
  //   });
  // }

  onSort(event: { column: string; direction: 'asc' | 'desc' }) {
    this.sortBy = event.column;
    this.sortDirection = event.direction;
    this.pageIndex = 0;
    this.loadYears();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadYears();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.pageIndex = 0;
    this.loadYears();
  }

  onFilterChange() {
    // Update individual filter properties from filters object
    this.searchTerm = this.filters.search;
    this.pageIndex = 0; // Reset to first page when filtering
    this.loadYears();
  }

  resetFilters() {
    this.filters = {
      search: '',
      is_current: null
    };
    this.searchTerm = '';
    this.pageIndex = 0;
    this.loadYears();
  }

  createYear() {
    const dialogRef = this.dialog.open(YearFormDialog, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadYears();
        // this.loadStatistics();
        this.showSnackBar('Anno creato con successo!', 'success');
      }
    });
  }

  editYear(year: Year) {
    const dialogRef = this.dialog.open(YearFormDialog, {
      width: '600px',
      data: { mode: 'edit', year }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadYears();
        // this.loadStatistics();
        this.showSnackBar('Anno aggiornato con successo!', 'success');
      }
    });
  }

  // setCurrentYear(year: Year) {
  //   const dialogRef = this.dialog.open(YearConfirmDialog, {
  //     width: '400px',
  //     data: {
  //       title: 'Imposta Anno Corrente',
  //       message: `Vuoi impostare "${year.name}" come anno corrente?`,
  //       confirmText: 'Imposta',
  //       cancelText: 'Annulla',
  //       type: 'warning',
  //       icon: 'star'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.yearService.setCurrentYear(year.id).subscribe({
  //         next: () => {
  //           this.loadYears();
  //           // this.loadStatistics();
  //           this.showSnackBar('Anno corrente impostato con successo!', 'success');
  //         },
  //         error: (error) => {
  //           this.showSnackBar('Errore nell\'impostazione dell\'anno corrente', 'error');
  //           console.error('Error setting current year:', error);
  //         }
  //       });
  //     }
  //   });
  // }

  deleteYear(year: Year) {
    const dialogRef = this.dialog.open(YearConfirmDialog, {
      width: '400px',
      data: {
        title: 'Elimina Anno',
        message: `Sei sicuro di voler eliminare l'anno "${year.name}"? Questa azione non può essere annullata.`,
        confirmText: 'Elimina',
        cancelText: 'Annulla',
        type: 'danger',
        icon: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.yearService.deleteYear(year.id).subscribe({
          next: () => {
            this.loadYears();
            // this.loadStatistics();
            this.showSnackBar('Anno eliminato con successo!', 'success');
          },
          error: (error) => {
            this.showSnackBar('Errore nell\'eliminazione dell\'anno', 'error');
            console.error('Error deleting year:', error);
          }
        });
      }
    });
  }

  refreshData() {
    this.loadYears();
    // this.loadStatistics();
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    const panelClass = type === 'success' ? 'snackbar-success' : 'snackbar-error';
    this.snackBar.open(message, 'Chiudi', {
      duration: 5000,
      panelClass: [panelClass],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
