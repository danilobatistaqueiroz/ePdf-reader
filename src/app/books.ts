import { Book } from './book';

export class Books {
  books!:Book[];
  public loadAll(content:string){
    this.books=JSON.parse(content);
  }
  public add(name:string,cover:string|undefined) {
    this.books.push(new Book(this.books.length,name,cover));
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