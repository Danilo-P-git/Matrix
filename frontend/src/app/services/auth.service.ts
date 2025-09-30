import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of, Subject } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user_cache';

  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private authErrorSubject = new Subject<string>();
  private unauthorizedFlag = false; // segna che una chiamata ha restituito 401
  private redirecting401 = false; // evita redirect multipli

  public user$ = this.userSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public authError$ = this.authErrorSubject.asObservable();

  private userLoad$?: Observable<User | null>; // in-flight user load

  get currentUser(): User | null { return this.userSubject.value; }
  get currentToken(): string | null { return this.tokenSubject.value; }
  wasUnauthorized(): boolean {
    if (this.unauthorizedFlag) {
      this.unauthorizedFlag = false;
      return true;
    }
    return false;
  }

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any) {
    // Solo recupero locale (token + eventuale user cache) SENZA chiamate HTTP per evitare ciclo DI con interceptor
    this.bootstrapFromStorage();
  }

  // Chiamata da APP_INITIALIZER (o manualmente) per fare il refresh remoto dopo che DI è stabile
  init(): void {
    if (this.currentToken) {
      this.loadUser(true).subscribe({
        error: () => { /* ignoriamo il fallimento iniziale */ }
      });
    }
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<User> {
    this.loadingSubject.next(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.applyAuthResponse(res, true)),
      map(res => res.user),
      catchError(err => this.processError(err, { context: 'login', clearOn401: false })),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<User> {
    this.loadingSubject.next(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => this.applyAuthResponse(res, true)),
      map(res => res.user),
      catchError(err => this.processError(err, { context: 'register', clearOn401: false })),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Logout user
   */
  logout(navigate: boolean = true): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this.clearAuthData();
      if (navigate) this.router.navigate(['/login']);
      return of(null);
    }
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      catchError(err => {
        // Non bloccare il logout locale se il server fallisce
        return of(null);
      }),
      finalize(() => {
        this.clearAuthData();
        if (navigate) this.router.navigate(['/login']);
      })
    );
  }



  /**
   * Get current user info
   */
  getCurrentUser(): Observable<User | null> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/user`).pipe(
      tap(res => this.setUser(res.user, true)),
      map(res => res.user),
      catchError(err => this.processError(err, { context: 'getCurrentUser', ignore401: false, clearOn401: true }))
    );
  }

  /** Carica l'utente (cache in-flight) */
  loadUser(force = false): Observable<User | null> {
    if (this.userSubject.value && !force) return of(this.userSubject.value);
    if (!this.getToken()) return of(null);
    if (this.userLoad$ && !force) return this.userLoad$;
    this.userLoad$ = this.getCurrentUser().pipe(
      finalize(() => { this.userLoad$ = undefined; })
    );
    return this.userLoad$;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean { return !!this.getToken(); }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try { return localStorage.getItem(this.tokenKey); } catch { return null; }
  }

  /**
   * Check if user has specific role
   */
  hasRole(roleName: string): boolean {
    const user = this.userSubject.value;
    return user?.roles?.some(role => role.name === roleName) ?? false;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permissionName: string): boolean {
    const user = this.userSubject.value;
    return user?.all_permissions?.some(permission => permission.name === permissionName) ?? false;
  }

  /**
   * Set authentication data
   */
  private applyAuthResponse(response: AuthResponse, cacheUser: boolean) {
    this.setToken(response.token);
    this.setUser(response.user, cacheUser);
  }

  private setToken(token: string | null) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      if (token) localStorage.setItem(this.tokenKey, token); else localStorage.removeItem(this.tokenKey);
    } catch { /* ignore */ }
    this.tokenSubject.next(token);
  }

  private setUser(user: User | null, persistCache: boolean) {
    this.userSubject.next(user);
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      if (persistCache && user) localStorage.setItem(this.userKey, JSON.stringify(user));
      else if (!user) localStorage.removeItem(this.userKey);
    } catch { /* ignore */ }
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    this.setToken(null);
    this.setUser(null, false);
  }

  /**
   * Load user from storage on app initialization
   */
  private bootstrapFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = this.getToken();
    if (token) {
      this.tokenSubject.next(token);
      try {
        const cached = localStorage.getItem(this.userKey);
        if (cached) {
          const parsed: User = JSON.parse(cached);
          this.userSubject.next(parsed);
        }
      } catch { /* ignore */ }
    }
  }

  /**
   * Ensure the current user is loaded if a token exists. Returns an Observable that
   * emits true if the user is (or becomes) available, false otherwise.
   * Prevents multiple parallel /user requests by caching in-flight observable.
   */
  ensureUserLoaded(): Observable<boolean> {
    return this.loadUser().pipe(map(u => !!u));
  }

  /**
   * Handle HTTP errors
   */
  private processError(error: HttpErrorResponse, opts: { context?: string; clearOn401?: boolean; ignore401?: boolean } = {}) {
    const { clearOn401 = true, ignore401 = false, context } = opts;
    let message = 'Errore sconosciuto';
    // Se NON è un HttpErrorResponse reale (potrebbe essere un errore sincrono in un tap/map)
    if (!(error instanceof HttpErrorResponse)) {
      const generic = (error as any);
      message = generic?.message || 'Errore client interno (non HTTP)';
      console.warn('[AuthService] Non-HTTP error intercettato nel flusso', { context, error: generic });
      this.authErrorSubject.next(message);
      return throwError(() => new Error(message));
    }

    // A questo punto è un HttpErrorResponse
    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
    } else {
      switch (error.status) {
        case 0:
          message = 'Connessione al server fallita';
          break;
        case 200:
          // Non dovrebbe essere qui: log diagnostico
          console.warn('[AuthService] processError chiamato con status 200', { context, error });
          message = 'Errore inatteso con status 200';
          break;
        case 400:
          message = (error as any).error?.message || 'Richiesta non valida';
          break;
        case 401:
          if (!ignore401) {
            message = 'Non autenticato';
            this.unauthorizedFlag = true;
            if (clearOn401) this.clearAuthData();
            // Redirect immediato a login se non ci stiamo già andando e non siamo già su login
            if (!this.redirecting401) {
              const current = this.router.url;
              if (!current.startsWith('/login')) {
                this.redirecting401 = true;
                // Aggiunge returnUrl solo se aveva un token precedente (sessione scaduta)
                const returnUrl = this.currentToken ? current : undefined;
                Promise.resolve().then(() => {
                  this.router.navigate(['/login'], { queryParams: { error: 'unauthorized', returnUrl } })
                    .finally(() => { this.redirecting401 = false; });
                });
              }
            }
          } else {
            message = '401 ignorato per contesto ' + (context || '-');
          }
          break;
        case 403:
          message = 'Accesso negato';
          break;
        case 404:
          message = 'Risorsa non trovata';
          break;
        case 422:
          message = (error as any).error?.message || 'Dati non validi';
          break;
        case 500:
          message = 'Errore interno server';
          break;
        default:
          message = (error as any).error?.message || `Errore ${error.status}`;
      }
    }
    console.debug('[AuthService] processError', { context, status: error.status, message, clearOn401, ignore401, url: (error as any).url });
    this.authErrorSubject.next(message);
    return throwError(() => new Error(message));
  }
}
