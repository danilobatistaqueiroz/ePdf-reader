import { Component, OnInit } from '@angular/core';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-integrating',
  templateUrl: '../base/base.page.html',
  styleUrls: ['../base/base.page.scss'],
})
export class IntegratingPage extends BasePage implements OnInit {

  override chapter: string = 'integrating';
  
  override totalPhotos!: number[];

  override photos: string[] = [
    "i20230130_131712.jpg",
    "i20230130_162404.jpg",
    "i20230130_162804.jpg",
    "i20230130_162817.jpg",
    "i20230130_162838.jpg",
    "i20230130_162900.jpg",
    "i20230130_162922.jpg",
    "i20230130_163237.jpg",
    "i20230130_163258.jpg",
    "i20230130_163344.jpg",
    "i20230130_163415.jpg",
    "i20230130_163557.jpg",
    "i20230130_163612.jpg",
    "i20230130_163621.jpg",
    "i20230130_163650.jpg",
    "i20230130_163707.jpg",
    "i20230130_163724.jpg",
    "i20230130_163738.jpg",
    "i20230130_163759.jpg",
    "i20230130_163818.jpg",
    "i20230130_163832.jpg",
    "i20230130_163846.jpg",
    "i20230130_163857.jpg",
    "i20230130_163913.jpg",
    "i20230130_163922.jpg",
    "i20230130_163939.jpg",
    "i20230130_163955.jpg",
    "i20230130_164006.jpg",
    "i20230130_164018.jpg",
    "i20230130_202754.jpg",
    "i20230130_164035.jpg",
    "i20230130_164050.jpg",
    "i20230130_164109.jpg",
    "i20230130_164121.jpg",
    "i20230130_164150.jpg",
    "i20230130_164201.jpg",
    "i20230130_164215.jpg",
    "i20230130_164230.jpg",
    "i20230130_164248.jpg",
    "i20230130_164259.jpg",
    "i20230130_164308.jpg",
    "i20230130_164316.jpg",
    "i20230130_164328.jpg",
    "i20230130_164340.jpg",
    "i20230130_164351.jpg",
    "i20230130_164404.jpg",
    "i20230130_164419.jpg",
    "i20230130_164427.jpg",
    "i20230130_164439.jpg",
    "i20230130_164451.jpg",
    "i20230130_164502.jpg",
    "i20230130_164513.jpg",
    "i20230130_164548.jpg",
    "i20230130_202948.jpg",
    "i20230130_164602.jpg",
    "i20230130_164622.jpg",
    "i20230130_164636.jpg",
    "i20230130_164648.jpg",
    "i20230130_164702.jpg",
    "i20230130_164712.jpg",
    "i20230130_164721.jpg",
    "i20230130_164734.jpg"
  ]

  override ngOnInit() {
    this.totalPhotos = [...Array(this.photos.length).keys()];
    super.ngOnInit();
  }

}
