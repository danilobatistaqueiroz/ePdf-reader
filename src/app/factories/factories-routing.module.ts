import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FactoriesPage } from './factories.page';

const routes: Routes = [
  {
    path: '',
    component: FactoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactoriesPageRoutingModule {}
