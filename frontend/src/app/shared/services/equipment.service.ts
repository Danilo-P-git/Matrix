import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Equipment,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
  EquipmentListResponse,
  EquipmentListResponsePaginated,
  EquipmentResponse,
  AssignEquipmentRequest,
  EquipmentStatistics
} from '../models/equipment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = `${environment.apiUrl}/equipment`;

  constructor(private http: HttpClient) { }

  /**
   * Get all equipment with optional filters and pagination
   */
  getEquipment(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: 'available' | 'assigned' | 'under_maintenance';
    year_id?: number;
    event_id?: number;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
  }): Observable<EquipmentListResponsePaginated> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<EquipmentListResponsePaginated>(this.apiUrl, { params: httpParams });
  }

  /**
   * Get a specific equipment by ID
   */
  getEquipmentById(id: number): Observable<EquipmentResponse> {
    return this.http.get<EquipmentResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new equipment
   */
  createEquipment(equipment: CreateEquipmentRequest): Observable<EquipmentResponse> {
    return this.http.post<EquipmentResponse>(this.apiUrl, equipment);
  }

  /**
   * Update an existing equipment
   */
  updateEquipment(id: number, equipment: UpdateEquipmentRequest): Observable<EquipmentResponse> {
    return this.http.put<EquipmentResponse>(`${this.apiUrl}/${id}`, equipment);
  }

  /**
   * Delete an equipment
   */
  deleteEquipment(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get equipment by status
   */
  getEquipmentByStatus(status: 'available' | 'assigned' | 'under_maintenance'): Observable<EquipmentListResponse> {
    return this.http.get<EquipmentListResponse>(`${this.apiUrl}/status/${status}`);
  }

  /**
   * Assign equipment to a subscription
   */
  assignEquipment(equipmentId: number, assignData: AssignEquipmentRequest): Observable<EquipmentResponse> {
    return this.http.post<EquipmentResponse>(`${this.apiUrl}/${equipmentId}/assign`, assignData);
  }

  /**
   * Get available equipment for assignment
   */
  getAvailableEquipment(): Observable<EquipmentListResponse> {
    return this.getEquipmentByStatus('available');
  }

  /**
   * Get assigned equipment
   */
  getAssignedEquipment(): Observable<EquipmentListResponse> {
    return this.getEquipmentByStatus('assigned');
  }

  /**
   * Get equipment in maintenance
   */
  getMaintenanceEquipment(): Observable<EquipmentListResponse> {
    return this.getEquipmentByStatus('under_maintenance');
  }

  /**
   * Get equipment statistics
   */
  getEquipmentStatistics(): Observable<EquipmentStatistics> {
    return this.http.get<EquipmentStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * Search equipment by name or related entities
   */
  searchEquipment(searchTerm: string, params?: {
    page?: number;
    per_page?: number;
    status?: 'available' | 'assigned' | 'under_maintenance';
    year_id?: number;
    event_id?: number;
  }): Observable<EquipmentListResponsePaginated> {
    const searchParams = { ...params, search: searchTerm };
    return this.getEquipment(searchParams);
  }

  /**
   * Get equipment by year
   */
  getEquipmentByYear(yearId: number, params?: {
    page?: number;
    per_page?: number;
    status?: 'available' | 'assigned' | 'under_maintenance';
  }): Observable<EquipmentListResponsePaginated> {
    const searchParams = { ...params, year_id: yearId };
    return this.getEquipment(searchParams);
  }

  /**
   * Get equipment by event
   */
  getEquipmentByEvent(eventId: number, params?: {
    page?: number;
    per_page?: number;
    status?: 'available' | 'assigned' | 'under_maintenance';
  }): Observable<EquipmentListResponsePaginated> {
    const searchParams = { ...params, event_id: eventId };
    return this.getEquipment(searchParams);
  }

  /**
   * Unassign equipment (set status to available and remove subscription)
   */
  unassignEquipment(equipmentId: number): Observable<EquipmentResponse> {
    return this.updateEquipment(equipmentId, {
      status: 'available',
      subscription_id: undefined,
      assign_date: undefined,
      return_date: new Date().toISOString()
    });
  }

  /**
   * Set equipment status to maintenance
   */
  setMaintenanceStatus(equipmentId: number): Observable<EquipmentResponse> {
    return this.updateEquipment(equipmentId, { status: 'under_maintenance' });
  }

  /**
   * Return equipment (set return date and make available)
   */
  returnEquipment(equipmentId: number): Observable<EquipmentResponse> {
    return this.updateEquipment(equipmentId, {
      status: 'available',
      subscription_id: undefined,
      return_date: new Date().toISOString()
    });
  }

  /**
   * Get equipment by condition
   */
  getEquipmentByCondition(condition: 'nuova' | 'usata' | 'danneggiata' | 'rotta'): Observable<EquipmentListResponsePaginated> {
    return this.getEquipment({ per_page: 1000 }).pipe(
      map((response: EquipmentListResponsePaginated) => ({
        ...response,
        data: response.data.filter((eq: Equipment) => eq.condition === condition)
      }))
    );
  }

  /**
   * Get equipment by type
   */
  getEquipmentByType(type: string): Observable<EquipmentListResponsePaginated> {
    return this.getEquipment({ per_page: 1000 }).pipe(
      map((response: EquipmentListResponsePaginated) => ({
        ...response,
        data: response.data.filter((eq: Equipment) => eq.type === type)
      }))
    );
  }

  /**
   * Get equipment available for sale
   */
  getEquipmentForSale(): Observable<EquipmentListResponsePaginated> {
    return this.getEquipment({ per_page: 1000 }).pipe(
      map((response: EquipmentListResponsePaginated) => ({
        ...response,
        data: response.data.filter((eq: Equipment) => eq.is_available_for_sale === true)
      }))
    );
  }
}
