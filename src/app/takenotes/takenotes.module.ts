import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TakenotesPageRoutingModule } from './takenotes-routing.module';

import { TakenotesPage } from './takenotes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TakenotesPageRoutingModule
  ],
  declarations: [TakenotesPage]
})
export class TakenotesPageModule {}
