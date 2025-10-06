export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'boolean' | 'number' | 'actions';
  width?: string;
  format?: (value: any) => string;
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: string;
  action: (item: any) => void;
  visible?: (item: any) => boolean;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}