import { Insomnia } from '@ionic-native/insomnia/ngx';
import { CapacitorVolumeButtons, VolumeButtonPressed } from 'capacitor-volume-buttons';

import { AlertController, IonContent, IonSlides, LoadingController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Penmarker } from '../../entities/penmarker';
import { Bookmarks } from '../../entities/bookmarks';
import { Pages } from '../../entities/pages';
import { Page } from '../../entities/page';
import { Book } from '../../entities/book';
import { Books } from '../../entities/books';
import { Chapters } from '../../entities/chapters';

import { PouchChapterStorage } from '../../storages/chapter/pouch-chapter-storage';

import { NotebookEvents } from '../base/notebook-events';
import { loadPenmarkers, drawLine } from '../base/penmarkers';
import { choosePage, hideBtPage, notebookOn, rubber, showBtPage,  } from '../base/functions';
import { bookmarkPage, checkBookChapter, gotoBookmark, isPageBookmarked } from '../base/bookmarkers';
import { Position } from '../base/position';
import { BookChapter } from '../base/book-chapter';
import { takenotes } from '../base/notes';

@Component({
  selector: 'pages-page',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {

  @ViewChild('ioncontent') ioncontent!: IonContent;
  @ViewChild('slides') slider!: IonSlides;

  pages:Pages = new Pages();
  storage!:PouchChapterStorage;
  
  totalPhotos: number[]=[]
  photos: string[]=[]
  screenOff: boolean = false;
  zoom:boolean=true;

  position:Position=new Position(0,0,1);
  bookChapter:BookChapter=new BookChapter(0,0);
  
  private notes: string='';
  private allHideTimeout:NodeJS.Timeout[] = []
  private bookmarkers:Bookmarks = new Bookmarks();
  penmarkers:Penmarker[]=[];

  loadCounter:number = 0;
  loadingPages:boolean=false;

  timeout:number=0;
  seconds:number=0;
  minutes:number=0;
  hours:number=0;

  isToastOpen = false;

  notebookEvents!:NotebookEvents;

  chapters:Chapters = new Chapters();
  books:Books = new Books();
  book!:Book|undefined;

  chapterTitle:string = '';

  constructor(
    private loader:LoadingController,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public insomnia: Insomnia,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    public changeDetectorRef: ChangeDetectorRef) { 

  }

  async ngOnInit() {
    this.screenOff = (localStorage.getItem('screenOff')??'false').toLowerCase()==='true';
    this.volumeButtons()
    this.zoom=true;

    notebookOn();
    this.notes = localStorage.getItem(`notes_${this.bookChapter}`)??'';
    this.changeDetectorRef.detectChanges();
    this.bookmarkers.loadAll(localStorage.getItem(`bookmarkers_${this.bookChapter}`));
    
    this.position.chapterId = parseInt(this.activeRoute.snapshot.paramMap.get('chapterId')??'0');
    this.position.bookId = parseInt(this.activeRoute.snapshot.paramMap.get('bookId')??'0');
    this.bookChapter=this.position.toBookChapter();
    this.books.loadAll(localStorage.getItem('books')??'');

    this.book = this.books.getById(this.position.bookId);
    this.chapters.loadAll(localStorage.getItem(`chapters_${this.position.bookId}`));
    this.chapterTitle = this.chapters.getById(this.position.chapterId)?.title??'';

    /**************************************************** */
    this.zoom=false;
    /**************************************************** */

    /************* black **************/
    document.body.classList.toggle('dark', true);
    /************* black **************/

    if (this.activeRoute.snapshot.paramMap.get('page')) {
      this.position.pageId = parseInt(this.activeRoute.snapshot.paramMap.get('page')??'1');
    } else {
      let page = localStorage.getItem(`currentPage_${this.bookChapter}`);
      if(page)
        this.position.pageId = parseInt(page);
      else
        this.position.pageId = 1;
    }

    this.storage = await PouchChapterStorage.initializeChapter(this.bookChapter);

    let content:string = await this.storage.pullRange(this.position.pageId-2,this.position.pageId+2);
    this.pages.loadAll(content)
    await this.slice(this.position.pageId);
    this.photos = this.pages.getAllBase64();

    let storageTotal:number = await this.storage.storageTotal();
    this.totalPhotos = [...Array(storageTotal).keys()];
    this.slider.slideTo(this.position.pageId,200);

    this.checkBookChapter();
  }

  ngAfterViewInit(): void {
    this.notebookEvents=new NotebookEvents();
    this.notebookEvents.position = this.position;
    this.notebookEvents.back=this.back;
    this.notebookEvents.forward=this.forward;
    this.notebookEvents.zoom=this.zoom;
    this.notebookEvents.isBottom=this.isBottom;
    this.notebookEvents.drawLine=drawLine;
    this.notebookEvents.penmarkers=this.penmarkers;
    this.notebookEvents.startNotebook();
    this.penmarkers = loadPenmarkers(this.zoom,this.isBottom,this.position);
    this.startTimer();
  }

  startTimer(){
    this.seconds=0;
    this.minutes=0;
    this.hours=0;
    this.timeout = window.setInterval(this.timer,1000,this);
    localStorage.setItem('active_timer',String(this.timeout));
    localStorage.setItem(`time_${this.bookChapter}`,'{"hours":'+this.hours+',"minutes":'+this.minutes+',"seconds":'+this.seconds+'}');
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
    localStorage.setItem(`time_${self.bookChapter}`,'{"hours":'+self.hours+',"minutes":'+self.minutes+',"seconds":'+self.seconds+'}');
  }

  volumeButtons() {
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

  async gotoBookmark(){
    gotoBookmark(this.loadingPages,this.bookmarkers,this.modalCtrl, async (data:any)=>{
      this.position.pageId = parseInt(data);
      let ele = await this.loader.create({message:"carregando..."});
      ele.present();
      this.slider.slideTo(this.position.pageId,200);
      let content:string = await this.storage.pullRange(this.position.pageId-2,this.position.pageId+2);
      this.pages.loadAll(content)
      this.changeCurrentPage();
      ele.dismiss();
    });
  }

  choosePage = async () => choosePage(this.loadingPages,this.alertController,this.submit);

  takeNotes = async () => takenotes(this.position,this.notes,this.modalCtrl)

  checkBookChapter = () => checkBookChapter(this.bookChapter,this.totalPhotos,this.alertController,this.router);

  bookmarkPage = () => bookmarkPage(this.position,this.bookmarkers,this.alertController)

  rubber = () => rubber(this.position,this.zoom,this.isBottom)

  takenotes = () => takenotes(this.position,this.notes,this.modalCtrl)

  isPageBookmarked = ():boolean => isPageBookmarked(this.bookmarkers,this.position.pageId)

  
  submit = async (data:any) => {
    if(data.page==undefined)
      this.position.pageId = parseInt(data);
    else 
      this.position.pageId = parseInt(data.page);
    let ele = await this.loader.create({message:"carregando..."});
    ele.present();
    this.slider.slideTo(this.position.pageId,200);
    let content:string = await this.storage.pullRange(this.position.pageId-2,this.position.pageId+2);
    this.pages.loadAll(content)
    this.changeCurrentPage();
    ele.dismiss();
  }

  isBottom:boolean=false;

  back() {
    if(this.loadingPages)
      return;
    if(this.zoom) {
      if (this.isBottom==true) {
        this.isBottom=false;
        this.ioncontent.scrollToTop();
        this.penmarkers = loadPenmarkers(this.zoom,this.isBottom,this.position);
      } else {
        if(this.position.pageId==1) return;
        this.isBottom=true;
        this.pageBack();
        this.ioncontent.scrollToBottom();
      }
    } else {
      this.pageBack();
    }
  }

  forward() {
    if(this.loadingPages)
      return;
    if(this.zoom) {
      if (this.isBottom==false) {
        this.isBottom=true;
        this.ioncontent.scrollToBottom();
        this.penmarkers = loadPenmarkers(this.zoom,this.isBottom,this.position);
      } else {
        if(this.position.pageId==this.totalPhotos.length) return;
        this.isBottom=false;
        this.pageForward();
        this.ioncontent.scrollToTop();
      }
    } else {
      this.pageForward();
    }
  }

  async pageForward() {
    if(this.position.pageId==this.totalPhotos.length) {
      return;
    }
    this.position.pageId++;
    let pageIdForward = this.position.pageId+2;
    this.changePage(pageIdForward);
  }

  async pageBack() {
    if(this.position.pageId==1){
      return;
    }
    this.position.pageId--;
    let pageIdBack = this.position.pageId-2;
    this.changePage(pageIdBack);
  }

  async changePage(newPageId:number){
    this.slider.slideTo(this.position.pageId,200);
    this.penmarkers = loadPenmarkers(this.zoom,this.isBottom,this.position);
    this.allHideTimeout.forEach(t => clearTimeout(t));
    this.allHideTimeout.push(setTimeout(hideBtPage,3000));
    showBtPage();
    await this.newPage(newPageId);
    this.changeCurrentPage();
  }

  async changeCurrentPage() {
    localStorage.setItem(`currentPage_${this.bookChapter}`,String(this.position.pageId));
    await this.slice(this.position.pageId);
    this.photos = this.pages.getAllBase64();
    this.changeDetectorRef.detectChanges();
  }

  private async newPage(pageId: number) {
    let content: string = await this.storage.pull(pageId);
    let page: Page | undefined = this.pages.getByPageId(pageId);
    if (page)
      page.base64 = JSON.parse(content).base64;
  }

  private async slice(pageId: number) {
    let startId = pageId - 2;
    if (startId < 1)
      startId = 1;
    let endId = pageId + 2;
    if (endId > this.pages.prints.length)
      endId = this.pages.prints.length;
    for (let i = 0; i < this.pages.prints.length; i++) {
      if (this.pages.prints[i].pageId < startId) {
        this.pages.prints[i].base64 = '';
      }
      if (this.pages.prints[i].pageId > endId) {
        this.pages.prints[i].base64 = '';
      }
    }
  }

  changeZoom() {
    this.zoom=!this.zoom;
  }

  async home() {
    this.position.pageId = 1;
    let ele = await this.loader.create({message:"carregando..."});
    ele.present();
    this.slider.slideTo(this.position.pageId,200);
    let content:string = await this.storage.pullRange(this.position.pageId-2,this.position.pageId+2);
    this.pages.loadAll(content);
    this.changeCurrentPage();
    ele.dismiss();
  }

  eye() {
    this.screenOff = !this.screenOff;
    this.screenOff?this.insomnia.allowSleepAgain():this.insomnia.keepAwake();
    this.isToastOpen = true;
    localStorage.setItem('screenOff',String(this.screenOff));
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

}
