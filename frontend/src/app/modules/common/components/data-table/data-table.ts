import { Component, Input, Output, EventEmitter, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { TableColumn, TableAction } from '../../models/table.model';

@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() loading = false;
  @Input() searchable = true;
  @Input() sortable = true;
  @Input() service?: any; // Service for server-side operations
  @Input() filters?: any; // Filters object

  @Output() sort = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();
  @Output() search = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  searchTerm = '';
  pageSizeOptions = [5, 10, 25, 50, 100];

  ngOnInit() {
    this.updateDisplayedColumns();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = null; // Server-side pagination
    }
    if (this.matSort) {
      this.dataSource.sort = null; // Server-side sorting
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
    if (changes['columns']) {
      this.updateDisplayedColumns();
    }
  }

  private updateDisplayedColumns() {
    this.displayedColumns = this.columns.map(col => col.key);
    if (this.actions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  onSortChange(sort: Sort) {
    const direction = sort.direction as 'asc' | 'desc';
    this.sort.emit({ column: sort.active, direction });
  }

  onPageEvent(event: PageEvent) {
    this.pageChange.emit({ 
      pageIndex: event.pageIndex, 
      pageSize: event.pageSize 
    });
  }

  onSearchChange() {
    this.search.emit(this.searchTerm);
  }

  getCellValue(item: any, column: TableColumn): any {
    const value = this.getNestedValue(item, column.key);
    
    if (column.format) {
      return column.format(value);
    }

    return value;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  isActionVisible(action: TableAction, item: any): boolean {
    return action.visible ? action.visible(item) : true;
  }

  executeAction(action: TableAction, item: any) {
    action.action(item);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
