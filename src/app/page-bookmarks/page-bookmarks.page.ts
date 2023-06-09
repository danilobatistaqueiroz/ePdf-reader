import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Bookmarks } from '../entities/bookmarks';

@Component({
  selector: 'app-page-bookmarks',
  templateUrl: './page-bookmarks.page.html',
  styleUrls: ['./page-bookmarks.page.scss'],
})
export class PageBookmarksPage implements OnInit {

  bookmarks!:Bookmarks;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(page:number) {
    return this.modalCtrl.dismiss(page, 'confirm');
  }

}
