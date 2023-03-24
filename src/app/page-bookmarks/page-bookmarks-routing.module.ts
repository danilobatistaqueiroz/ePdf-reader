import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageBookmarksPage } from './page-bookmarks.page';

const routes: Routes = [
  {
    path: '',
    component: PageBookmarksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageBookmarksPageRoutingModule {}
