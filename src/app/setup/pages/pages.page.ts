import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent, IonContent, IonRadioGroup, ToastController } from '@ionic/angular';
import { Chapter } from 'src/app/entities/chapter';
import { Chapters } from 'src/app/entities/chapters';
import { Pages } from 'src/app/entities/pages';

import { Camera, CameraResultType, GalleryImageOptions } from '@capacitor/camera';

import { LoadingController } from "@ionic/angular";
import { ItemReorderEventDetail } from '@ionic/angular';

import { Print } from 'src/app/entities/print';
import { PageModel } from 'src/app/entities/pagemodel';
import { Position } from 'src/app/reader/base/position';
import { BookChapter } from 'src/app/reader/base/book-chapter';
import { PouchChapterStorage } from 'src/app/storages/chapter/pouch-chapter-storage';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {

  @ViewChild('ioncontent') ioncontent!: IonContent;
  @ViewChild('resolutions') resolutions!: IonRadioGroup;
  
  position!:Position;
  bookChapter!:BookChapter;
  
  chapters:Chapters = new Chapters();
  chapter!:Chapter|undefined;
  pages:Pages = new Pages();

  imgs:Thumb[]=[];

  waiting:boolean=true;

  storage!:PouchChapterStorage;

  cntImg:number = 0;

  loading:boolean = false;
  loadCounter:number = 0;

  resolution:number = 1600;

  imgType:ImgType = ImgType.BASE64;

  constructor(private loader:LoadingController, private alertController: AlertController, private activatedRoute: ActivatedRoute, private toastController: ToastController) { }

  async ngOnInit() {

    /************* black **************/
    document.body.classList.toggle('dark', true);
    /************* black **************/

    this.position=new Position(0,0,1);
    this.bookChapter=new BookChapter(0,0);

    this.position.bookId = parseInt(this.activatedRoute.snapshot.params['bookId']);
    this.position.chapterId = parseInt(this.activatedRoute.snapshot.params['chapterId']);
    this.bookChapter=this.position.toBookChapter();

    this.chapters.loadAll(localStorage.getItem(`chapters_${this.position.bookId}`));
    this.chapter = this.chapters.getById(this.position.chapterId);
    if (this.chapter===undefined) throw new Error('Capítulo não encontrado!');

    this.storage = await PouchChapterStorage.initializeChapter(this.position.toBookChapter());

    let docs:Print[] = await this.storage.pullPrints(0);
    let content:string = JSON.stringify(docs.map(r => new PageModel(r.pageId,r.thumb64)));

    this.pages.loadAll(content);
    this.cntImg = this.pages.prints.length;

    setTimeout(()=> this.ioncontent.scrollToBottom(), 1000);

    if(this.pages.prints.length>3){
      setTimeout(()=>{
        this.waiting=false;
      },1500)
    } if(this.pages.prints.length>10){
      setTimeout(()=>{
        this.waiting=false;
      },6000)
    } else {
      setTimeout(()=>{
        this.waiting=false;
      },500)
    }
  }

  offset:number=10;
  async handleScroll(e:Event){
    let ec = e as CustomEvent;
    let d = ec.detail as any;
    if( (d.currentY==0 || d.scrollTop==0) && d.deltaY<0 ){
      if(this.offset<=0){
        this.offset=0;
        return;
      }
      if(this.offset<=0){
        this.offset=0;
      }
      if(this.pages.top==0)
        return;
      let docs:Print[] = await this.storage.pullPrints(this.pages.top-10);
      let content:string = JSON.stringify(docs.map(r => new PageModel(r.pageId,r.thumb64)));
      this.offset = this.pages.aloc(this.offset, content);
      this.cntImg = this.pages.prints.length;
    }
  }

  async onIonInfinite(ev:Event) {
    let docs:Print[] = await this.storage.pullPrints(this.offset);
    if(docs.length>0) {
      let content:string = JSON.stringify(docs.map(r => new PageModel(r.pageId,r.thumb64)));
      this.pages.concat(content);
      this.cntImg = this.pages.prints.length;
      if(docs.length>0)
        this.offset+=10;
    }
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async resizeBlob(file:HTMLImageElement, size:number):Promise<Blob|null> {
    return new Promise(async (resolve, reject) => {
      let canvas:HTMLCanvasElement = await this.resize(file,size);
      const base64Canvas = canvas.toBlob((blob)=>{
        resolve(blob);
      },"image/png");
    });
  }

  async resizeBase64(file:HTMLImageElement, size:number):Promise<string> {
    let canvas:HTMLCanvasElement = await this.resize(file,size);
    const base64Canvas = canvas.toDataURL("image/jpeg").split(';base64,')[1];
    return base64Canvas;
  }

  private async resize(file:HTMLImageElement, size:number):Promise<HTMLCanvasElement> {
    let sizeW = size

    const canvas:HTMLCanvasElement = document.createElement('canvas')
    const ctx:CanvasRenderingContext2D|null = canvas.getContext('2d')
    const bitmap = await createImageBitmap(file)

    if(size==0) {
      ctx?.drawImage(bitmap,0,0);
      return canvas;
    }

    let proportion = file.naturalWidth / sizeW
    canvas.width = sizeW
    let sizeH = (file.naturalHeight / proportion)
    canvas.height = sizeH
    const { width, height } = bitmap
    const ratio = Math.max(sizeW / width, sizeH / height)
    const x = (sizeW - (width * ratio)) / 2
    const y = (sizeH - (height * ratio)) / 2
    ctx?.drawImage(bitmap, 0, 0, width, height, x, y, width * ratio, height * ratio)

    return canvas;
  }
  
  async convertImage(ele:HTMLIonLoadingElement|undefined, len:number, idx:number, imgUrl:string, callback:any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin='anonymous';
      let self=this
      image.onload = async () => {
        const canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;
        ctx?.drawImage(image, 0, 0);
        const dataUrl = canvas.toDataURL();
        let thumbUrl:any=null;
        let imageUrl:any=null;
        if(this.imgType==ImgType.BLOB){
          thumbUrl = await this.resizeBlob(image,420);
          imageUrl = await this.resizeBlob(image,this.resolution);
        } else {
          thumbUrl = await this.resizeBase64(image,420);
          imageUrl = await this.resizeBase64(image,this.resolution);
        }
        callback && callback(thumbUrl,imageUrl,self,ele,len,idx)
        resolve(true);
      }
      image.src = imgUrl;
    });
  }


  async getPhoto(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.resolution = this.resolutions.value;
    console.log(this.resolution);
    await this.convertImage(undefined, 1, 1, image.webPath??'', this.print);
  }

  pickImages(){
    this.loader.create({
      message:"carregando..."
    }).then((ele) => {
      var options:GalleryImageOptions = {
        correctOrientation:true
      }
      let images;
      Camera.pickImages(options).then(async (val)=>{
        ele.present();
        this.loading=true;
        images = val.photos;
        this.imgs = [];
        for(var i=0;i<images.length;i++){
          await this.convertImage(ele, images.length, i, images[i].webPath, this.print);
          await this.sleep(1000);
          this.loadCounter+=1;
        }
      })
    })
  }

  async sleep(ms:number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getBlobPrint(image:Blob,thumb:Blob,self:this):Promise<Print|null>{
    let existentPage:Print|null;
    existentPage = await self.storage.getByBlob(self.bookChapter, image);
    if(existentPage) {
      self.presentToast("bottom","Imagem já carregada!");
       return null;
    }
    let print = new Print(self.bookChapter.bookId, self.bookChapter.chapterId);
    print.blob=image;
    print.thumbBlob=thumb;
    return print;
  }

  async getBase64Print(thumb:string,image:string,self:this):Promise<Print|null>{
    let existentPage:Print|null;
    thumb = thumb.replace('data:image/png;base64,','');
    image = image.replace('data:image/png;base64,','');
    existentPage = await self.storage.getByBase64(self.bookChapter, image);
    if(existentPage) {
      self.presentToast("bottom","Imagem já carregada!");
      return null;
    }
    let print = new Print(self.bookChapter.bookId, self.bookChapter.chapterId);
    print.base64=image;
    print.thumb64=thumb;
    return print;
  }

  async print(thumb:string|Blob,image:string|Blob,self:this,ele:HTMLIonLoadingElement|undefined,len:number, idx:number){
    let print:Print|null=null;
    if(typeof image == "object" && typeof thumb == "object") {
      print = await self.getBlobPrint(image,thumb,self);
    } else if(typeof thumb == "string" && typeof image == "string") {
      print = await self.getBase64Print(image,thumb,self);
    }
    if(print==null)
      return;
    await self.storage.insert(print);
    if(len==idx+1){
      if(len>=3){
        setTimeout(()=>{ele?.dismiss()},1500);
      } else if(len>=10){
        setTimeout(()=>{ele?.dismiss()},10000);
      } else if(len>=20){
        setTimeout(()=>{ele?.dismiss()},15000);
      } else {
        setTimeout(()=>{ele?.dismiss()},500);
      }
    }
    if(len<=idx+1){
      self.loading=false;
      self.offset=10;
      self.storage=await PouchChapterStorage.initializeChapter(self.bookChapter);
      self.pages = new Pages();
      self.ngOnInit();
    }
  }

  async cleanAllImages(){
    const alert = await this.alertController.create({
      header: 'Remover todas as páginas',
      message: 'Deseja remover todas as páginas?',
      buttons: [
        {
          text: 'OK',

          role: 'confirm'
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        },
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if(role=='confirm') {
      this.pages.prints=[];
      localStorage.removeItem(`${this.bookChapter}_pageId`)
      await this.storage.removeAll();
      this.storage = await PouchChapterStorage.initializeChapter(this.bookChapter);
    }
  }

  async handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    let pageFrom = this.pages.getByIndex(ev.detail.from);
    let pageTo = this.pages.getByIndex(ev.detail.to);
    if(ev.detail.from<ev.detail.to) {
      await this.storage.updateId(pageFrom.pageId, -1);
      for(let i=(pageFrom.pageId+1); i<=pageTo.pageId; i++) {
        await this.storage.updateId(i, (i-1));
      }
      await this.storage.updateId(-1, pageTo.pageId);
    } else if(ev.detail.from>ev.detail.to) {
      await this.storage.updateId(pageFrom.pageId, -1);
      for(let i=(pageFrom.pageId-1); i>=pageTo.pageId; i--) {
        await this.storage.updateId(i, (i+1));
      }
      await this.storage.updateId(-1, pageTo.pageId);
    }
    ev.detail.complete();
  }

  async del(pageId:number,base64:string){
    this.pages.del(base64);
    let print = Print.startBookChapter(this.bookChapter);
    print.base64=base64;
    print.thumb64='';
    print.pageId=pageId;
    this.storage.remove(print);
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

enum ImgType {
  BLOB, BASE64
}