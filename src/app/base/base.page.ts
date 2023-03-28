import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { Insomnia } from '@ionic-native/insomnia/ngx';
import { AlertController, IonContent, IonSlides, ModalController } from '@ionic/angular';

import { CapacitorVolumeButtons, VolumeButtonPressed } from 'capacitor-volume-buttons';

import { Marker } from '../marker';
import { TakenotesPage } from '../takenotes/takenotes.page';
import { PageBookmarksPage } from '../page-bookmarks/page-bookmarks.page';

import { Bookmarks } from '../book-marks';

@Component({
  selector: 'app-base',
  templateUrl: './base.page.html',
  styleUrls: ['./base.page.scss'],
})
export class BasePage implements OnInit, AfterViewInit {
  
    @ViewChild('ioncontent') ioncontent!: IonContent;
    @ViewChild('slides') slider!: IonSlides;
  
    page: number = 0;
    totalPhotos: number[]=[]
    photos: string[]=[]
    chapterid: string|null='';
    bookid: string|null='';
    screenOff: boolean = false;
    zoom:boolean=true;
    
    private penmarkers: Marker[] = [];
    private notes: string='';
    private allHideTimeout:NodeJS.Timeout[] = []
    private bookmarkers:Bookmarks = new Bookmarks();

    timeout:number=0;
    seconds:number=0;
    minutes:number=0;
    hours:number=0;

    constructor(
      public route: ActivatedRoute, 
      public insomnia: Insomnia,
      public modalCtrl: ModalController,
      public alertController: AlertController,
      public changeDetectorRef: ChangeDetectorRef) { 

      }
  
    ngOnInit() {
      this.chapterid = this.route.snapshot.paramMap.get('chapterid')
      this.bookid = this.route.snapshot.paramMap.get('bookid')
      this.screenOff = (localStorage.getItem('screenOff')??'false').toLowerCase()==='true';
      this.volumeButtons();
      this.zoom=true;
      this.notebookOn();
      this.notes = localStorage.getItem(`notes_${this.bookid}_${this.chapterid}`)??'';
      this.changeDetectorRef.detectChanges();
      this.bookmarkers.loadAll(localStorage.getItem(`bookmarkers_${this.bookid}_${this.chapterid}`));
    }
  
    ngAfterViewInit(): void {
      this.startNotebook();
      if (this.route.snapshot.paramMap.get('page')) {
        this.page = parseInt(this.route.snapshot.paramMap.get('page')??'0');
      } else {
        let page = localStorage.getItem(`currentPage_${this.bookid}_${this.chapterid}`);
        if(page)
          this.page = parseInt(page);
        else
          this.page = 0;
      }
      this.slider.slideTo(this.page,200);
      this.loadPenmarkers();
      this.startTimer();
    }

    startTimer(){
      this.seconds=0;
      this.minutes=0;
      this.hours=0;
      this.timeout = window.setInterval(this.timer,1000,this);
      localStorage.setItem('active_timer',String(this.timeout));
      localStorage.setItem(`time_${this.bookid}_${this.chapterid}`,'{"hours":'+this.hours+',"minutes":'+this.minutes+',"seconds":'+this.seconds+'}');
    }

    timer(self:this){
      self.seconds+=1;
      self.changeDetectorRef?.detectChanges();
      if(self.seconds>60) {
        self.seconds=0;
        self.minutes=self.minutes+1;
        if(self.minutes>60) {
          self.minutes=0;
          self.hours=self.hours+1;
          if(self.hours>60) {
            self.hours=self.hours+1;
          }
        }
      }
    }

    async gotoBookmark(){
      const modal = await this.modalCtrl.create({
        component: PageBookmarksPage,
        componentProps: { 
          bookmarks: this.bookmarkers,
        }
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {
        this.page = data;
        this.slider.slideTo(data,200);
      }
    }

    async takenotes() {
      const modal = await this.modalCtrl.create({
        component: TakenotesPage,
        componentProps: { 
          notes: this.notes,
        }
      });
      modal.present();
  
      const { data, role } = await modal.onWillDismiss();
  
      if (role === 'confirm') {
        this.notes = data??'';
        localStorage.setItem(`notes_${this.bookid}_${this.chapterid}`,this.notes);
      }
    }

    changeZoom() {
      this.zoom=!this.zoom;
    }
  
    home() {
      this.page = 0;
      this.slider.slideTo(0,200);
    }
  
    eye() {
      this.screenOff = !this.screenOff;
      this.screenOff?this.insomnia.allowSleepAgain():this.insomnia.keepAwake();
      localStorage.setItem('screenOff',String(this.screenOff));
    }
  
    rubber() {
      const notebook:HTMLCanvasElement = document.getElementById('notebook') as HTMLCanvasElement;
      const context = notebook.getContext('2d');
      context!.clearRect(0, 0, notebook.width, notebook.height);
      localStorage.setItem(`penmarkers_${this.bookid}_${this.chapterid}_${this.page}`,'[]');
      this.penmarkers = [];
    }
    
    submit = (data:any) => {
      if(data.page==undefined)
        this.page = data;
      else 
        this.page = data.page;
      this.slider.slideTo(this.page,200);
      localStorage.setItem(`currentPage_${this.bookid}_${this.chapterid}`,String(this.page))
    }

    async choosePage() {
      const alert = await this.alertController.create({
        header: 'Goto page',
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'OK',
            handler: this.submit,
          },
        ],
        inputs: [
          {
            name: 'page',
            placeholder: 'Page',
          },
        ],
      });
      await alert.present();
      let text = document?.querySelector('.alert-input');
      (text as HTMLInputElement).focus();
      text?.addEventListener('keyup', (e) => {
        if ((e as KeyboardEvent).key=="Enter") {
          this.submit((text as HTMLInputElement).value);
          alert.dismiss(this.submit((text as HTMLInputElement).value));
        }
      });
    }

    isBottom:boolean=false;

    back() {
      if(this.zoom) {
        if (this.isBottom==true) {
          this.isBottom=false;
          this.ioncontent.scrollToTop();
          this.loadPenmarkers();
        } else {
          if(this.page==0) return;
          this.isBottom=true;
          this.pageBack();
          this.ioncontent.scrollToBottom();
        }
      } else {
        this.pageBack();
      }
    }
  
    forward() {
      if(this.zoom) {
        if (this.isBottom==false) {
          this.isBottom=true;
          this.ioncontent.scrollToBottom();
          this.loadPenmarkers();
        } else {
          if(this.page==this.totalPhotos.length-1) return;
          this.isBottom=false;
          this.pageForward();
          this.ioncontent.scrollToTop();
        }
      } else {
        this.pageForward();
      }
    }

    pageForward() {
      if(this.page==this.totalPhotos.length-1) return;
      this.slider.slideNext();
      this.page++;
      this.loadPenmarkers();
      this.allHideTimeout.forEach(t => clearTimeout(t));
      this.allHideTimeout.push(setTimeout(this.hideBtPage,3000));
      this.showBtPage();
      localStorage.setItem(`currentPage_${this.bookid}_${this.chapterid}`,String(this.page));
      this.changeDetectorRef.detectChanges();
    }

    pageBack() {
      if(this.page==0) return;
      this.slider.slidePrev();
      this.page--;
      this.loadPenmarkers();
      this.allHideTimeout.forEach(t => clearTimeout(t));
      this.allHideTimeout.push(setTimeout(this.hideBtPage,3000));
      this.showBtPage();
      localStorage.setItem(`currentPage_${this.bookid}_${this.chapterid}`,String(this.page));
      this.changeDetectorRef.detectChanges();
    }

    isPageBookmarked() {
      if (this.bookmarkers?.getById(this.page)) {
        return true;
      }
      return false;
    }

    async bookmarkPage() {
      let description = await this.bookmarkDescription();
      if(this.bookmarkers.getById(this.page))
        this.bookmarkers.del(this.page);
      else
        this.bookmarkers.add(this.page, description??'');
      localStorage.setItem(`bookmarkers_${this.bookid}_${this.chapterid}`,this.bookmarkers.getAllJson());
    }

    async bookmarkDescription():Promise<string|undefined> {
      const alert = await this.alertController.create({
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
  
    private hideBtPage(){
      (document.querySelector("#btPage") as HTMLButtonElement)!.style.opacity = '0.3';
    }
    private showBtPage(){
      (document.querySelector("#btPage") as HTMLButtonElement)!.style.opacity = '0.8';
    }

    private loadPenmarkers() {
      this.penmarkers = []
      if(this.zoom) {
        if(this.isBottom) {
          this.penmarkers = JSON.parse(localStorage.getItem(`penmarkers_zoom_bottom_${this.bookid}_${this.chapterid}_${this.page}`)??'[]');
        } else {
          this.penmarkers = JSON.parse(localStorage.getItem(`penmarkers_zoom_top_${this.bookid}_${this.chapterid}_${this.page}`)??'[]');
        }
      } else {
        this.penmarkers = JSON.parse(localStorage.getItem(`penmarkers_${this.bookid}_${this.chapterid}_${this.page}`)??'[]');
      }
      const notebook:HTMLCanvasElement = document.getElementById('notebook') as HTMLCanvasElement;
      const context = notebook.getContext('2d');
      context!.clearRect(0, 0, notebook.width, notebook.height);
      setTimeout(this.drawLines,300,context,this.penmarkers,this.drawLine);
    }
  
    private drawLines(context:any,markers:Marker[],drawLine:any) {
      for(let mark of markers) {
        drawLine(context, mark.x1, mark.y1, mark.x2, mark.y2);
      }
    }

    private notebookOn() {
      const notebook:HTMLCanvasElement = document.getElementById('notebook') as HTMLCanvasElement;
      notebook.style.display='block';
    }
  
    private startNotebook() {
      
      let isDrawing = false;
      let x=0,y=0,x1=0,x2=0,y1=0,y2=0;
      
      const notebook:HTMLCanvasElement = document.getElementById('notebook') as HTMLCanvasElement;
      const context = notebook.getContext('2d');
  
      var w = document.documentElement.clientWidth || document.body.clientWidth;
      var h = document.documentElement.clientHeight || document.body.clientHeight;
      notebook.width=w;
      notebook.height=h;
      
      this.penmarkers = JSON.parse(localStorage.getItem(`penmarkers_${this.bookid}_${this.chapterid}_${this.page}`)??'[]');
      for(let mark of this.penmarkers) {
        this.drawLine(context,mark.x1,mark.y1,mark.x2,mark.y2);
      }

      notebook.addEventListener('mousedown', (e) => {
        x = e.offsetX;
        x1 = x;
        y = e.offsetY;
        y1 = y
        isDrawing = true;
      });

      window.addEventListener('keydown', (e:KeyboardEvent) => {
        if (e.key == "ArrowRight") {
          this.forward();
        } else if (e.key == "ArrowLeft") {
          this.back();
        }
      });
      
      window.addEventListener('mouseup', (e) => {
        if (isDrawing) {
          x2 = e.offsetX;
          y2 = e.offsetY;
          this.drawLine(context, x, y, x2, y2);
          this.penmarkers.push({x1:x1, y1:y1, x2:x2, y2:y2});
          if(this.zoom) {
            if(this.isBottom) {
              localStorage.setItem(`penmarkers_zoom_bottom_${this.bookid}_${this.chapterid}_${this.page}`,JSON.stringify(this.penmarkers));
            } else {
              localStorage.setItem(`penmarkers_zoom_top_${this.bookid}_${this.chapterid}_${this.page}`,JSON.stringify(this.penmarkers));
            }
          } else {
            localStorage.setItem(`penmarkers_${this.bookid}_${this.chapterid}_${this.page}`,JSON.stringify(this.penmarkers));
          }
          x = 0;
          y = 0;
          isDrawing = false;
        }
      });
      
      notebook.addEventListener('touchstart', (e:TouchEvent) => {
        x = e.touches[0]?.clientX;
        x1 = x;
        y = e.touches[0]?.clientY;
        y1 = y;
        isDrawing = true;
      });

      notebook.addEventListener('touchend', (e:TouchEvent) => {
        if (isDrawing) {
          if (e.changedTouches[0]){
            x2 = e.changedTouches[0].clientX;
            y2 = e.changedTouches[0].clientY;
            this.drawLine(context, x, y, x2, y2);
            this.penmarkers.push({x1:x1, y1:y1, x2:x2, y2:y2});
            if(this.zoom) {
              if(this.isBottom) {
                localStorage.setItem(`penmarkers_zoom_bottom_${this.bookid}_${this.chapterid}_${this.page}`,JSON.stringify(this.penmarkers));
              } else {
                localStorage.setItem(`penmarkers_zoom_top_${this.bookid}_${this.chapterid}_${this.page}`,JSON.stringify(this.penmarkers));
              }
            } else {
              localStorage.setItem(`penmarkers_${this.bookid}_${this.chapterid}_${this.page}`,JSON.stringify(this.penmarkers));
            }
            x = 0;
            y = 0;
            isDrawing = false;
          }
        }
      });
  
    }
  
    private drawLine(context:any, x1:number, y1:number, x2:number, y2:number) {
      context.beginPath();
      context.strokeStyle = 'rgba(255,255,0,0.4)';
      context.lineWidth = '8';
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
    }
  
    private volumeButtons() {
      const onVolumeButtonPressed = ({ direction }: VolumeButtonPressed) => {
        if (direction === 'up') {
          this.back();
        } else {
          this.forward();
        }
        this.changeDetectorRef.detectChanges();
      };
      CapacitorVolumeButtons.addListener('volumeButtonPressed', onVolumeButtonPressed);
    }
  
  }