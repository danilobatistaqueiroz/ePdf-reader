import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TakenotesPage } from './takenotes.page';

const routes: Routes = [
  {
    path: '',
    component: TakenotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TakenotesPageRoutingModule {}
