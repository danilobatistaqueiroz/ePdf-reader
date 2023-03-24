import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FactoriesPageRoutingModule } from './factories-routing.module';

import { FactoriesPage } from './factories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FactoriesPageRoutingModule
  ],
  declarations: [FactoriesPage]
})
export class FactoriesPageModule {}
