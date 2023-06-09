import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Book } from '../../entities/book';
import { Books } from '../../entities/books';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit {

  bookControl:string = '';
  cover:string|undefined = '';

  public books:Books = new Books();
  errorMessage:string = '';

  thumbnail:string='';

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    let content = localStorage.getItem('books')??'';
    if(content!='')
      this.books.loadAll(content);
  }

  edit(){
    
  }
  async getPicture() {
    const image = await Camera.getPhoto({
      quality:90,
      source: CameraSource.Photos,
      width: 600,
      resultType: CameraResultType.Base64
    })
    console.log(image)
    this.thumbnail=image.base64String??'';
    this.cover = image.base64String;
  }

  add(){
    if(this.bookControl.length < 3){
      this.errorMessage = 'O nome do livro precisa ter ao menos 3 caracteres!';
      return;
    }
    this.books.add(this.bookControl,this.cover);
    localStorage.setItem('books',this.books.getAllJson());
    this.bookControl='';
    this.thumbnail='';
  }

  async del(book:string){
    const alert = await this.alertController.create({
      header: 'Remover o Livro',
      message: 'Confirma a remoção do livro '+book+'?',
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
      let bookId = this.books.getByName(book)?.id;
      if(JSON.parse(localStorage.getItem(`chapters_${bookId}`)??'[]').length>0){
        const alert = await this.alertController.create({
          header: 'Remover Capítulos',
          message: 'O livro tem capítulos cadastrados, deseja remover tudo?',
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
          let chapters = JSON.parse(localStorage.getItem(`chapters_${bookId}`)??'[]');
          localStorage.removeItem(`chapters_${bookId}`);
          for(let chapter of chapters) {
            localStorage.removeItem(`currentPage_${bookId}_${chapter.id}`);
            localStorage.removeItem(`bookmarkers_${bookId}_${chapter.id}`);
            let pages = JSON.parse(localStorage.getItem(`pages_${bookId}_${chapter.id}`)??'[]');
            localStorage.removeItem(`pages_${bookId}_${chapter.id}`);
            localStorage.removeItem(`time_${bookId}_${chapter.id}`);
            for(let pagenum = 0; pagenum < pages.length; pagenum++){
              localStorage.removeItem(`penmarkers_${bookId}_${chapter.id}_${pagenum}`);
              localStorage.removeItem(`penmarkers_zoom_top_${bookId}_${chapter.id}_${pagenum}`);
              localStorage.removeItem(`penmarkers_zoom_bottom_${bookId}_${chapter.id}_${pagenum}`);
              localStorage.removeItem(`penmarkers_zoom_${bookId}_${chapter.id}_${pagenum}`);
            }
          }
          this.books.del(book);
          localStorage.setItem('books',this.books.getAllJson());
        }
      } else {
        this.books.del(book);
        localStorage.setItem('books',this.books.getAllJson());
      }
    }
  }

  onEnter(){
    this.add();
  }

  resetError(){
    this.errorMessage = '';
  }

}
