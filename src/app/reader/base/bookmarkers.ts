import { AlertController, ModalController } from '@ionic/angular';
import { PageBookmarksPage } from '../../page-bookmarks/page-bookmarks.page';
import { Router } from '@angular/router';
import { Bookmarks } from 'src/app/entities/bookmarks';
import { BookChapter } from './book-chapter';
import { Position } from './position';

export async function  checkBookChapter(bookChapter:BookChapter,totalPhotos:number[],alertController:AlertController,router:Router) {
  if(Number.isNaN(bookChapter.bookId) || bookChapter.bookId==0){
    const alert = await alertController.create({
      header: 'Livro não encontrado!',
      message: 'O livro não foi encontrado!',
      buttons: [
        {
          text: 'OK',
          role: 'confirm'
        },
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    router.navigate(['/menu']);
  }
  if(Number.isNaN(bookChapter.chapterId) || bookChapter.chapterId==0){
    const alert = await alertController.create({
      header: 'Capítulo não encontrado!',
      message: 'O capítulo não foi encontrado!',
      buttons: [
        {
          text: 'OK',
          role: 'confirm'
        },
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    router.navigate(['/menu']);
  }
  if(totalPhotos.length==0) {
    const alert = await alertController.create({
      header: 'Páginas não encontradas!',
      message: 'O capítulo não contém páginas cadastradas!',
      buttons: [
        {
          text: 'OK',
          role: 'confirm'
        },
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    router.navigate([`/reader/chapters/${bookChapter.bookId}`]);
  }
}


export async function gotoBookmark(loadingPages:boolean,bookmarkers:Bookmarks,modalCtrl:ModalController,callBack:any){
  if(loadingPages)
    return;
  const modal = await modalCtrl.create({
    component: PageBookmarksPage,
    componentProps: { 
      bookmarks: bookmarkers,
    }
  });
  modal.present();
  const { data, role } = await modal.onWillDismiss();
  if (data) {
    callBack(data);
  }
}


export function isPageBookmarked(bookmarkers:Bookmarks,page:number):boolean {
  if (bookmarkers?.getById(page)) {
    return true;
  }
  return false;
}

export async function bookmarkPage(position:Position,bookmarkers:Bookmarks,alertController:AlertController) {
  let description = await bookmarkDescription(alertController);
  if(bookmarkers.getById(position.pageId))
    bookmarkers.del(position.pageId);
  else
    bookmarkers.add(position.pageId, description??'');
  localStorage.setItem(`bookmarkers_${position.bookId}_${position.chapterId}`,bookmarkers.getAllJson());
}

async function bookmarkDescription(alertController:AlertController):Promise<string|undefined> {
  const alert = await alertController.create({
    header: 'Insira uma descrição',
    buttons: [
      {
        text:'OK',
        handler: (alertData) => {
          
        }
      }
    ],
    inputs: [
      {
        name: 'description',
        placeholder: 'Descrição',
      }
    ]
  });
  await alert.present();
  const { role, data } = await alert.onDidDismiss();
  return data.values.description;
}