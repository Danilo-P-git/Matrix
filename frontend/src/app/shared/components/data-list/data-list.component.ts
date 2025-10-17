import { Component, Input } from '@angular/core';

export interface DataListItem {
  id?: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  avatar?: {
    text?: string;
    color?: string;
    imageUrl?: string;
  };
  badge?: {
    text: string;
    type: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';
    icon?: string;
  };
  rightContent?: {
    primary: string;
    secondary?: string;
    colorClass?: string;
  };
  progress?: {
    value: number;
    color: string;
  };
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  timestamp?: {
    date: string;
    time?: string;
  };
  customClasses?: string[];
  // Campi specifici per Activity Layout (per compatibilità con sales.html)
  date?: string;
  time?: string;
  primaryClass?: string;
  secondaryClass?: string;
  additionalInfo?: string;
  secondaryText?: string;
}

export interface DataListConfig {
  layout: 'products' | 'activity' | 'customers' | 'channels';
  showDivider?: boolean;
  itemPadding?: string;
  avatarSize?: 'sm' | 'md' | 'lg';
  // Opzioni per la card wrapper
  showCard?: boolean;
  cardTitle?: string;
  showViewAll?: boolean;
  viewAllText?: string;
  viewAllLink?: string;
  cardBodyPadding?: string;
}

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
  standalone: false
})
export class DataListComponent {
  @Input() items: DataListItem[] = [];
  @Input() config: DataListConfig = { layout: 'products' };
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'Nessun elemento disponibile';

  getDefaultPadding(): string {
    switch(this.config.layout) {
      case 'products':
      case 'customers':
      case 'channels':
        return 'p-0';
      case 'activity':
        return 'px-3';
      default:
        return 'p-3';
    }
  }
}
