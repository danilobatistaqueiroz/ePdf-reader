import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bookmark } from '../book-mark';
import { Bookmarks } from '../book-marks';
import { Chapter } from '../chapter';
import { Chapters } from '../chapters';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router: Router) { }

  allChapterMarks:ChapterMarks[]=[];
  allChapters:Chapter[]=[];
  chapters:Chapters=new Chapters();
  bookid!:number;
  
  ngOnInit() {
    this.bookid = this.activatedRoute.snapshot.params['bookid'];
    this.chapters.loadAll(localStorage.getItem(`chapters_${this.bookid}`)); // [{id:1,title:ch11},{id:2,title:ch22},{id:3,title:ch33},{id:4,title:ch44}]
    this.allChapters = this.chapters.getAll();

    for (let chapter of this.allChapters) {
      let b = new ChapterMarks(chapter,[]);
      let bookmarkers:Bookmarks = new Bookmarks();
      bookmarkers.loadAll(localStorage.getItem(`bookmarkers_${this.bookid}_${chapter.id}`)); // [{pagenum:3,description:apresentação}, {pagenum:5,description:abc}]
      let all = bookmarkers.getAll();
      if(all.length>0)
        b.bookmarks = all;
      else
        b.bookmarks = [new Bookmark(0,'')];
      this.allChapterMarks.push(b);
    }
  }

  goto(bookid:number,chapterid:number,page:number){
    this.router.navigate(['/chapter/'+bookid+'/'+chapterid,{page:page}]);
  }

}

class ChapterMarks {
  constructor(public chapter:Chapter, public bookmarks:Bookmark[]) {}
}