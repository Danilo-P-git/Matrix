export interface Year {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateYearRequest {
  name: string;
  start_date: string;
  end_date: string;
  is_active?: boolean;
  description?: string;
}

export interface UpdateYearRequest {
  name?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  description?: string;
}

export interface YearListResponse {
  data: Year[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface YearStatistics {
  total: number;
  active: number;
  inactive: number;
  current: number;
}