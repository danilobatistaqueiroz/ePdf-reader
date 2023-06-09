import { Book } from './book';

export class Books {
  books:Book[]=[];
  public loadAll(content:string){
    this.books=JSON.parse(content);
  }
  public max():number {
    if(!this.books || this.books.length==0)
      return 0;
    return this.books.reduce(function (p, v) {
      return ( p > v ? p : v );
    }).id;
  }
  public add(name:string,cover:string|undefined) {
    this.books.push(new Book(this.max()+1,name,cover));
  }
  public del(name:string) {
    this.books = this.books.filter(b => b.name != name);
  }
  public getAll():Book[] {
    return this.books;
  }
  public getAllJson():string {
    return JSON.stringify(this.books);
  }
  public getByName(name:string):Book|undefined {
    return this.books.find(b => b.name == name);
  }
  public getById(id:number):Book|undefined {
    return this.books.find(b => b.id == id);
  }
}