import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { YearService } from '../../../shared/services/year.service';
import { Year, YearListResponse, YearListResponsePaginated   } from '../../../shared/models/year.model';
import { FeatureCard } from '../../../shared/models/utility';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { MaterialModuleModule } from "../../../materialModule/material-module/material-module.module";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, MaterialModuleModule]
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private yearService: YearService, private cdr: ChangeDetectorRef, private router: Router) { }

  navigateToYears() {
    this.router.navigate(['/dashboards/years']);
  }
  yearData: Year[] = [];
  structuredData: FeatureCard[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.getYearData();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getYearData() {
    console.log('Inizio caricamento dati...');
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges(); // Forza il rilevamento delle modifiche

    this.yearService.getCurrentYear()
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Errore nel caricamento dei dati:', error);
          this.errorMessage = 'Errore nel caricamento dei dati. Riprova più tardi.';
          this.isLoading = false;
          this.cdr.detectChanges();
          return of({ data: [], success: false, message: 'Errore nel caricamento' } as YearListResponse);
        })
      )
      .subscribe((response: YearListResponse) => {
        console.log('Risposta ricevuta:', response);
        this.yearData = response.data || [];
        this.getStructuredData();
        this.isLoading = false;
        this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
      });
  }

  getStructuredData(){
    this.structuredData = this.yearData.map(year => ({
      id: year.id,
      title: year.name,
      text: year.description,
      note: year.note,
      start_date: year.start_date,
      end_date: year.end_date,
      url: '/dashboards/activities/' + year.id,
    }));
    console.log('Structured data:', this.structuredData);
  }

}
