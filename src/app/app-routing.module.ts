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
    path: 'bookmarks/:bookId',
    loadChildren: () => import('./bookmarks/bookmarks.module').then( m => m.BookmarksPageModule)
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
    path: 'reader/books',
    loadChildren: () => import('./reader/books/books.module').then( m => m.BooksPageModule)
  },
  {
    path: 'reader/chapters',
    loadChildren: () => import('./reader/chapters/chapters.module').then( m => m.ChaptersPageModule)
  },
  {
    path: 'reader/chapters/:bookId',
    loadChildren: () => import('./reader/chapters/chapters.module').then( m => m.ChaptersPageModule)
  },
  {
    path: 'reader/pages/:bookId/:chapterId',
    loadChildren: () => import('./reader/pages/pages.module').then( m => m.PagesPageModule)
  },

  {
    path: 'setup/books',
    loadChildren: () => import('./setup/books/books.module').then( m => m.BooksPageModule)
  },
  {
    path: 'setup/chapters/:bookId',
    loadChildren: () => import('./setup/chapters/chapters.module').then( m => m.ChaptersPageModule)
  },
  {
    path: 'setup/pages/:bookId/:chapterId',
    loadChildren: () => import('./setup/pages/pages.module').then( m => m.PagesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
