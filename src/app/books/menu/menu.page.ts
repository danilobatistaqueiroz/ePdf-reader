import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Books } from 'src/app/books';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  
  public books:Books = new Books();

  constructor(private router: Router) { }

  ngOnInit() {
    let content = localStorage.getItem('books')??'';
    this.books.loadAll(content);
  }

  gotoBook(id:number) {
    this.router.navigate([`books/${id}/chapters`]);
  }

}
