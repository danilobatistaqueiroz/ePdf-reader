import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Books } from 'src/app/books';
import { Chapter } from 'src/app/chapter';
import { Chapters } from 'src/app/chapters';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
})
export class ChaptersPage implements OnInit {

  books:Books = new Books();
  bookid!:number;
  cover:string|undefined;

  chapters:Chapters = new Chapters();
  
  orientation!:string;
  rows:[Chapter[]]=[[]];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { 
    let self = this;
    self.getOrientation(self);
    window.addEventListener("orientationchange", function() {
      self.getOrientation(self);
    }, false);
  }

  ngOnInit() {
    let content = localStorage.getItem('books')??'';
    this.books.loadAll(content);
    this.bookid = this.activatedRoute.snapshot.params['id'];
    this.cover = this.books.getById(this.bookid)?.cover;
    this.chapters.loadAll(localStorage.getItem(`chapters_${this.bookid}`));
    this.grider();
  }

  getOrientation(self:this){
    if ( window.orientation == 0 || window.orientation == 180) {
      self.orientation='portrait';
    } else {
      self.orientation='landscape';
    }
  }

  grider() {
    let cols:Chapter[]=[];
    this.rows.pop();
    let chs = this.chapters.getAll();
    for(let c=0; c<32; c+=4){
      if(c>=chs.length)
        break
      for(let i=c; i<c+4; i++){
        if(i>=chs.length)
          break
        cols.push(chs[i]);
      }
      this.rows.push(cols);
      cols=[];
    }
  }

  gotoReader(chapterid:number) {
    this.router.navigate([`/chapter/${this.bookid}/${chapterid}`]);
  }

}
