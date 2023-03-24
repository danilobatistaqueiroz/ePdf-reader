import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {

  constructor(private router: Router) { }

  allBookmarkers:BookMark[]=[];
  allChapters:string[]=['application','architecture','domains','events','integrating','introduction','presentation','repositories','services'];

  ngOnInit() {
    for (let c of this.allChapters) {
      let b = new BookMark(c,[]);

      let markers:string[]|undefined = localStorage.getItem(`bookmarkers_${c}`)?.split(',');
      markers?.forEach(m => b.pages.push(parseInt(m)));
      
      b.pages = b.pages.sort(function(a, b){return a - b});
      this.allBookmarkers.push(b);
    }
  }

  goto(chapter:string,bookmark:number){
    this.router.navigate([chapter,{page:bookmark}]);
  }

}

class BookMark {
  constructor(public chapter:string, public pages:number[]) {}
}