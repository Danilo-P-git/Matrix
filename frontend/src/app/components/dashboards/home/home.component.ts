import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { YearService } from '../../../shared/services/year.service';
import { Year, YearListResponse, YearListResponsePaginated   } from '../../../shared/models/year.model';
import { FeatureCard } from '../../../shared/models/utility';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { MaterialModuleModule } from "../../../materialModule/material-module/material-module.module";
import { Router } from '@angular/router';
import { DataListConfig, DataListItem } from '../../../shared/components/data-list/data-list.component';
import { productsData, activityData, customersData, channelsData } from '../../../shared/components/data-list/usage-examples';
import { EquipmentService } from '../../../shared/services/equipment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, MaterialModuleModule]
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private yearService: YearService, private equipmentService: EquipmentService, private cdr: ChangeDetectorRef, private router: Router) { }

  navigateToYears() {
    this.router.navigate(['/dashboards/years']);
  }
  equipmentList: DataListItem[] = [];
  dataListConfig: DataListConfig = { layout: 'products' };
  emptyMessage: string = 'Nessun equipaggiamento disponibile';

  yearData: Year[] = [];
  structuredData: FeatureCard[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.getYearData();
    this.getEquipmentList();
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

  getEquipmentList() {
    // Implementa la logica per ottenere l'elenco dell'equipaggiamento
    this.equipmentService.getEquipment().subscribe((response) => {
      console.log('Elenco equipaggiamento ricevuto:', response);
      this.dataListConfig = { layout: 'products', showCard: true, cardTitle: 'Elenco Equipaggiamento', showViewAll: true, viewAllText: 'Vedi tutti', viewAllLink: '/dashboards/equipment' } as DataListConfig;
      // Mappa i dati ricevuti nel formato DataListItem
      this.equipmentList = response.data.map(equipment => ({
        id: equipment.id,
        title: equipment.name,
        subtitle: "Condizione: " + equipment.condition,
        description: equipment.description,
        badge: {
          text: equipment.status,
          type: equipment.status === 'available' ? 'success' : (equipment.status === 'assigned' ? 'warning' : 'danger'),
          // Aggiungi altri campi se necessario
        },
        rightContent: {
          primary: 'Assegnata: ' + (equipment.subscription?.user?.name || 'N/A'),
          secondary: 'Codice: ' + (equipment.code || 'N/A')

        }
        // Aggiungi altri campi se necessario
      }));
      this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
    }, (error) => {
      console.error('Errore nel caricamento dell\'elenco equipaggiamento:', error);
    });
  }

}
