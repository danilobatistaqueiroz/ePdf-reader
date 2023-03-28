 import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { BasePage } from '../base/base.page';
import { Book } from '../book';
import { Books } from '../books';
import { Chapters } from '../chapters';
import { Pages } from '../pages';

@Component({
  selector: 'app-integrating',
  templateUrl: '../base/base.page.html',
  styleUrls: ['../base/base.page.scss'],
})
export class ChapterPage extends BasePage implements OnInit {

  chapters:Chapters = new Chapters();
  books:Books = new Books();
  book!:Book|undefined;
  pages:Pages = new Pages();

  override chapterid:string = '';
  
  override totalPhotos!: number[];

  override photos: string[]=[];

  override ngOnInit() {
    this.books.loadAll(localStorage.getItem('books')??'');
    let bookid = this.route.snapshot.params['bookid'];
    this.book = this.books.getById(bookid);
    this.chapters.loadAll(localStorage.getItem('chapters'));
    let chapterid = this.route.snapshot.params['chapterid'];
    this.chapterid = this.chapters.getById(chapterid)?.title??'';

    this.pages.loadAll(localStorage.getItem(`pages_${bookid}_${chapterid}`));
    this.photos = this.pages.getAllBase64();
    this.totalPhotos = [...Array(this.photos?.length).keys()];
    super.ngOnInit();
  }

}
