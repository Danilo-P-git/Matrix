import { User } from './user.model';
import { Year } from './year.model';
export interface Equipment {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  code?: string;
  type?: string;
  status: 'available' | 'assigned' | 'under_maintenance';
  condition: 'nuova' | 'usata' | 'danneggiata' | 'rotta';
  size?: string;
  note?: string;
  is_available_for_sale?: boolean;
  year_id: number;
  subscription_id?: number;
  event_id?: number;
  assign_date?: string;
  return_date?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  // Relazioni caricate
  year?: Year;
  subscription?: {
    id: number;
    user: User;
  };
  event?: {
    id: number;
    name: string;
  };
}

export interface CreateEquipmentRequest {
  name: string;
  description?: string;
  quantity?: number;
  code?: string;
  type?: string;
  status?: 'available' | 'assigned' | 'under_maintenance';
  condition?: 'nuova' | 'usata' | 'danneggiata' | 'rotta';
  size?: string;
  note?: string;
  is_available_for_sale?: boolean;
  year_id: number;
  subscription_id?: number;
  event_id?: number;
  assign_date?: string;
  return_date?: string;
}

export interface UpdateEquipmentRequest {
  name?: string;
  description?: string;
  quantity?: number;
  code?: string;
  type?: string;
  status?: 'available' | 'assigned' | 'under_maintenance';
  condition?: 'nuova' | 'usata' | 'danneggiata' | 'rotta';
  size?: string;
  note?: string;
  is_available_for_sale?: boolean;
  year_id?: number;
  subscription_id?: number;
  event_id?: number;
  assign_date?: string;
  return_date?: string;
}

export interface EquipmentListResponse {
  success: boolean;
  data: Equipment[];
  message: string;
}

export interface EquipmentListResponsePaginated {
  current_page: number;
  data: Equipment[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface EquipmentResponse {
  success: boolean;
  data: Equipment;
  message: string;
}

export interface AssignEquipmentRequest {
  subscription_id: number;
  assign_date?: string;
}

export interface EquipmentStatistics {
  total: number;
  available: number;
  assigned: number;
  under_maintenance: number;
  by_condition: {
    nuova: number;
    usata: number;
    danneggiata: number;
    rotta: number;
  };
  by_type: Record<string, number>;
}
