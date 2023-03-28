import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Chapter } from 'src/app/chapter';
import { Chapters } from 'src/app/chapters';
import { Pages } from 'src/app/pages';
import { Page } from 'src/app/page';

import { Camera, CameraResultType, CameraSource, Photo, GalleryImageOptions } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import { LoadingController } from "@ionic/angular";

import { ItemReorderEventDetail } from '@ionic/angular';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {

  bookid!:number;
  chapterid!:number;
  chapters:Chapters = new Chapters();
  chapter!:Chapter|undefined;
  pages:Pages = new Pages();
  page:Page|undefined;

  imgs:Thumb[]=[];
  
  constructor(private loader:LoadingController, private alertController: AlertController, private activatedRoute: ActivatedRoute, private toastController: ToastController) { }

  ngOnInit() {
    this.bookid = this.activatedRoute.snapshot.params['bookid'];
    this.chapterid = this.activatedRoute.snapshot.params['chapterid'];
    this.chapters.loadAll(localStorage.getItem(`chapters_${this.bookid}`));
    this.chapter = this.chapters.getById(this.chapterid);
    this.pages.loadAll(localStorage.getItem(`pages_${this.bookid}_${this.chapterid}`));
  }

  async addImage() {
    const image = await Camera.getPhoto({
      quality:90,
      source: CameraSource.Photos,
      width: 600,
      resultType: CameraResultType.Base64
    })
    if(image.base64String) {
      let msg = this.pages.add(image.base64String);
      if(msg){
        this.presentToast("bottom",msg);
        return;
      }
      localStorage.setItem(`pages_${this.bookid}_${this.chapterid}`,this.pages.getAllJson());
    }
  }
  
  convertImageToBase64(imgUrl:string, callback:any) {
    const image = new Image();
    image.crossOrigin='anonymous';
    let self=this
    image.onload = () => {
      const canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx?.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL();
      callback && callback(dataUrl,self)
    }
    image.src = imgUrl;
  }

  pickImages(){
    this.loader.create({
      message:"please wait..."
    }).then((ele) => {
      ele.present();
      var options:GalleryImageOptions = {
        correctOrientation:true
      }
      Camera.pickImages(options).then((val)=>{
        var images = val.photos;
        this.imgs = [];
        for(var i=0;i<images.length;i++){
          this.convertImageToBase64(images[i].webPath,this.print)
        }
        ele.dismiss();
      })
    })
  }

  print(str:string,self:this){
    self.imgs.push(new Thumb(`a${self.imgs.length}`,str));
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  async del(base64:string){
    this.pages.del(base64);
    localStorage.setItem(`pages_${this.bookid}_${this.chapterid}`,this.pages.getAllJson());
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', text:string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1500,
      color: "danger",
      position: position
    });
    await toast.present();
  }

}

class Thumb {
  constructor(public id:string,public src:string){}
}