import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntegratingPageRoutingModule } from './integrating-routing.module';

import { IntegratingPage } from './integrating.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntegratingPageRoutingModule
  ],
  declarations: [IntegratingPage]
})
export class IntegratingPageModule {}
