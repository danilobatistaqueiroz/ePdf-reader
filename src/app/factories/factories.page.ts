import { Component, OnInit } from '@angular/core';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-factories',
  templateUrl: '../base/base.page.html',
  styleUrls: ['../base/base.page.scss'],
})
export class FactoriesPage extends BasePage implements OnInit {

  override chapter: string = 'factories';
  
  override totalPhotos!: number[];

  override photos: string[] = [
    "20230131_194136.jpg",
    "20230131_194147.jpg",
    "20230131_194213.jpg",
    "20230131_194221.jpg",
    "20230131_194244.jpg",
    "20230131_194258.jpg",
    "20230131_194327.jpg",
    "20230131_194341.jpg",
    "20230131_194353.jpg",
    "20230131_194406.jpg",
    "20230131_194420.jpg",
    "20230131_194430.jpg",
    "20230131_194444.jpg",
    "20230131_194516.jpg",
    "20230131_194521.jpg",
    "20230131_194532.jpg",
    "20230131_194537.jpg",
    "20230131_194551.jpg",
    "20230131_194559.jpg",
    "20230131_194622.jpg",
    "20230131_194633.jpg",
    "20230131_194705.jpg",
    "20230131_194714.jpg",
    "20230131_194721.jpg"
  ]

  override ngOnInit() {
    this.totalPhotos = [...Array(this.photos.length).keys()];
    super.ngOnInit();
  }

}
