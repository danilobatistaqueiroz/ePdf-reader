import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'bookmarks',
    loadChildren: () => import('./bookmarks/bookmarks.module').then( m => m.BookmarksPageModule)
  },
  {
    path: 'base',
    loadChildren: () => import('./base/base.module').then( m => m.BasePageModule)
  },
  {
    path: 'takenotes',
    loadChildren: () => import('./takenotes/takenotes.module').then( m => m.TakenotesPageModule)
  },
  {
    path: 'page-bookmarks',
    loadChildren: () => import('./page-bookmarks/page-bookmarks.module').then( m => m.PageBookmarksPageModule)
  },
  {
    path: 'setup/books',
    loadChildren: () => import('./setup/books/books.module').then( m => m.BooksPageModule)
  },
  {
    path: 'setup/chapters/:bookid',
    loadChildren: () => import('./setup/chapters/chapters.module').then( m => m.ChaptersPageModule)
  },
  {
    path: 'setup/cover',
    loadChildren: () => import('./setup/cover/cover.module').then( m => m.CoverPageModule)
  },
  {
    path: 'chapter/:id',
    loadChildren: () => import('./chapter/chapter.module').then( m => m.ChapterPageModule)
  },
  {
    path: 'books/menu',
    loadChildren: () => import('./books/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'books/:id/chapters',
    loadChildren: () => import('./books/chapters/chapters.module').then( m => m.ChaptersPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
