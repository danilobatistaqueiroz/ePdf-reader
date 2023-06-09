import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Books } from 'src/app/entities/books';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit {
  
  public books:Books = new Books();

  constructor(private router: Router) { }

  ngOnInit() {
    let content = localStorage.getItem('books')??'';
    this.books.loadAll(content);
  }

  gotoChaptersBook(bookId:number) {
    console.log('gotoBook :'+bookId);
    this.router.navigate([`reader/chapters/${bookId}`]);
  }

}
