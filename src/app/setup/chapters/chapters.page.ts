import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Book } from 'src/app/book';
import { Books } from 'src/app/books';
import { Chapter } from 'src/app/chapter';
import { Chapters } from 'src/app/chapters';

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

  constructor(private alertController: AlertController, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let bookid = this.activatedRoute.snapshot.params['bookid'];
    let content = localStorage.getItem('books')??'';
    this.books.loadAll(content);
    this.book = this.books.getById(bookid);
    this.chapters.loadAll(localStorage.getItem(`chapters_${bookid}`));
  }

  add(){
    if(this.chapterControl.length < 3){
      this.errorMessage = 'O título do capítulo precisa ter ao menos 3 caracteres!';
      return;
    }
    this.chapters.add(this.chapterControl);
    localStorage.setItem(`chapters_${this.book?.id}`,this.chapters.getAllJson());
    this.chapterControl='';
  }

  async del(chapter:string){
    const alert = await this.alertController.create({
      header: 'Remover o Capítulo',
      message: 'Confirma a remoção do capítulo '+chapter+'?',
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
      localStorage.setItem(`chapters_${this.book?.id}`,this.chapters.getAllJson());
    }
  }

  onEnter(){
    this.add();
  }

  resetError(){
    this.errorMessage = '';
  }

}
