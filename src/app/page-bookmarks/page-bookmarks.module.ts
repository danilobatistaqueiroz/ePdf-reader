import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageBookmarksPageRoutingModule } from './page-bookmarks-routing.module';

import { PageBookmarksPage } from './page-bookmarks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageBookmarksPageRoutingModule
  ],
  declarations: [PageBookmarksPage]
})
export class PageBookmarksPageModule {}
