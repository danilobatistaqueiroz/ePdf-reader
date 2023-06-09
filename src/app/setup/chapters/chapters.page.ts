import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastOptions, } from '@ionic/angular';
import { Book } from 'src/app/entities/book';
import { Books } from 'src/app/entities/books';
import { Chapter } from 'src/app/entities/chapter';
import { Chapters } from 'src/app/entities/chapters';
import PouchDB from 'pouchdb';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
})
export class ChaptersPage implements OnInit {

  chapters:Chapters = new Chapters();
  books:Books = new Books();
  book:Book|undefined;
  chapterControl:string='';
  errorMessage:string = '';

  constructor(private alertController: AlertController, private activatedRoute: ActivatedRoute, public toast: ToastController) { }

  ngOnInit() {
    let bookId = this.activatedRoute.snapshot.params['bookId'];
    let content = localStorage.getItem('books')??'';
    this.books.loadAll(content);
    this.book = this.books.getById(bookId);
    this.chapters.loadAll(localStorage.getItem(`chapters_${bookId}`));

    /************* black **************/
    document.body.classList.toggle('dark', true);
    /************* black **************/
  }

  add(){
    if(this.chapterControl.length < 3){
      this.openToast('O título do capítulo precisa ter ao menos 3 caracteres!');
      return;
    }
    this.chapters.add(this.chapterControl);
    localStorage.setItem(`chapters_${this.book?.id}`,this.chapters.getAllJson());
    this.chapterControl='';
  }

  async openToast(msg:string) {
    const toast = await this.toast.create({
      message: msg,
      color: 'warning',
      duration: 2000
    });
    toast.present();
  }

  async del(chapterTitle:string){
    const alert = await this.alertController.create({
      header: 'Remover o Capítulo',
      message: 'Confirma a remoção do capítulo '+chapterTitle+'?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm'
        },
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role == 'confirm') {
      let chapter=this.chapters.allChapters.filter(c => c.title==chapterTitle);
      this.chapters.allChapters=this.chapters.allChapters.filter(c => c.title!=chapterTitle);
      localStorage.setItem(`chapters_${this.book?.id}`,this.chapters.getAllJson());
      localStorage.removeItem(`${this.book?.id}_${chapter[0].id}_pageId`);
      localStorage.removeItem(`time_${this.book?.id}_${chapter[0].id}`);
      localStorage.removeItem(`notes_${this.book?.id}_${chapter[0].id}`);
      localStorage.removeItem(`currentPage_${this.book?.id}_${chapter[0].id}`);
      localStorage.removeItem(`bookmarkers_${this.book?.id}_${chapter[0].id}`);
      for(let page=0; page<=2000; page++) {
        localStorage.removeItem(`penmarkers_${this.book?.id}_${chapter[0].id}_${page}`);
        localStorage.removeItem(`penmarkers_zoom_bottom_${this.book?.id}_${chapter[0].id}_${page}`);
        localStorage.removeItem(`penmarkers_zoom_top_${this.book?.id}_${chapter[0].id}_${page}`);
      }
      const db = new PouchDB(`${this.book?.id}_${chapter[0].id}}`);
      db.destroy();
    }
  }

  onEnter(){
    this.add();
  }

  resetError(){
    this.errorMessage = '';
  }

}