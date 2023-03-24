import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-page-bookmarks',
  templateUrl: './page-bookmarks.page.html',
  styleUrls: ['./page-bookmarks.page.scss'],
})
export class PageBookmarksPage implements OnInit {

  pages:string[]=[];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(page:string) {
    return this.modalCtrl.dismiss(page, 'confirm');
  }

}
