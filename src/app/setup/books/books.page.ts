import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Book } from '../../book';
import { Books } from '../../books';

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

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    let content = localStorage.getItem('books')??'';
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
      this.books.del(book);
      localStorage.setItem('books',this.books.getAllJson());
    }
  }

  onEnter(){
    this.add();
  }

  resetError(){
    this.errorMessage = '';
  }

}
