import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Year,
  CreateYearRequest,
  UpdateYearRequest,
  YearListResponse,
  YearStatistics
} from '../models/year.model';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class YearService {
  private apiUrl = `${environment.apiUrl}/years`;

  constructor(private http: HttpClient) { }

  /**
   * Get all years with optional filters and pagination
   */
  getYears(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    is_active?: boolean;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
  }): Observable<YearListResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<YearListResponse>(this.apiUrl, { params: httpParams });
  }

  /**
   * Get a specific year by ID
   */
  getYear(id: number): Observable<Year> {
    return this.http.get<Year>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new year
   */
  createYear(year: CreateYearRequest): Observable<{ message: string; data: Year }> {
    return this.http.post<{ message: string; data: Year }>(this.apiUrl, year);
  }

  /**
   * Update an existing year
   */
  updateYear(id: number, year: UpdateYearRequest): Observable<{ message: string; data: Year }> {
    return this.http.put<{ message: string; data: Year }>(`${this.apiUrl}/${id}`, year);
  }

  /**
   * Delete a year (soft delete)
   */
  deleteYear(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Restore a soft deleted year
   */
  restoreYear(id: number): Observable<{ message: string; data: Year }> {
    return this.http.post<{ message: string; data: Year }>(`${this.apiUrl}/${id}/restore`, {});
  }

  /**
   * Get the current active year
   */
  getCurrentYear(): Observable<Year> {
    return this.http.get<Year>(`${this.apiUrl}/current`);
  }

  /**
   * Set a year as current
   */
  setCurrentYear(id: number): Observable<{ message: string; data: Year }> {
    return this.http.patch<{ message: string; data: Year }>(`${this.apiUrl}/${id}/set-current`, {});
  }

  /**
   * Get years statistics
   */
  getStatistics(): Observable<YearStatistics> {
    return this.http.get<YearStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * Get only active years
   */
  getActiveYears(): Observable<Year[]> {
    return this.http.get<Year[]>(`${this.apiUrl}/active`);
  }
}
