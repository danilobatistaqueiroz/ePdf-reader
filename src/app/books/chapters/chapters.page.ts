import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Books } from 'src/app/books';
import { Chapters } from 'src/app/chapters';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
})
export class ChaptersPage implements OnInit {

  books:Books = new Books();
  
  cover:string|undefined;

  chapters:Chapters = new Chapters();
  
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let content = localStorage.getItem('books')??'';
    this.books.loadAll(content);
    let bookid = this.activatedRoute.snapshot.params['id'];
    this.cover = this.books.getById(bookid)?.cover;
    this.chapters.loadAll(localStorage.getItem('chapters'));
  }

}
