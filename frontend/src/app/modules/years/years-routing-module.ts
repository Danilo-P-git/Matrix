import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YearList } from './components/year-list/year-list';
import { YearForm } from './components/year-form/year-form';
import { YearDetail } from './components/year-detail/year-detail';

const routes: Routes = [
  {
    path: '',
    component: YearList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YearsRoutingModule { }
