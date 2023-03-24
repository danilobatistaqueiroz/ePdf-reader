import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntegratingPage } from './integrating.page';

const routes: Routes = [
  {
    path: '',
    component: IntegratingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegratingPageRoutingModule {}
