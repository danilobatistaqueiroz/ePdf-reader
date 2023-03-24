import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { BasePage } from '../base/base.page';
import { Chapters } from '../chapters';

@Component({
  selector: 'app-integrating',
  templateUrl: '../base/base.page.html',
  styleUrls: ['../base/base.page.scss'],
})
export class ChapterPage extends BasePage implements OnInit {

  chapters:Chapters = new Chapters();

  override chapter:string = '';
  
  override totalPhotos!: number[];

  override photos: string[] = [];

  override ngOnInit() {
    this.chapters.loadAll(localStorage.getItem('chapters'));
    let chapterid = this.route.snapshot.params['id'];
    this.chapter = this.chapters.getById(chapterid)?.title??'';

    this.totalPhotos = [...Array(this.photos.length).keys()];
    super.ngOnInit();
  }

}
