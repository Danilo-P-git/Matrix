import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { YearsRoutingModule } from './years-routing-module';
import { YearList } from './components/year-list/year-list';
import { YearForm } from './components/year-form/year-form';
import { YearDetail } from './components/year-detail/year-detail';

// Import Common Module components
import { CommonModule as AppCommonModule } from '../common/common-module';
import { YearFormDialog } from './dialogs/year-form-dialog/year-form-dialog';
import { YearConfirmDialog } from './dialogs/year-confirm-dialog/year-confirm-dialog';

// Additional Angular Material modules
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    YearList,
    YearForm,
    YearDetail,
    YearFormDialog,
    YearConfirmDialog
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    YearsRoutingModule,
    AppCommonModule,
    MatSlideToggleModule,
    MatCardModule,
    MatChipsModule,
    MatSelectModule
  ]
})
export class YearsModule { }
