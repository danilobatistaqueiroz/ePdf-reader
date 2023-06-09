import { Chapter } from './chapter';

export class Chapters {
  allChapters:Chapter[]=[];
  public loadAll(content:string|null){
    if(content)
      this.allChapters=JSON.parse(content);
  }
  public max():number {
    if(!this.allChapters || this.allChapters.length==0)
      return 0;
    return this.allChapters.reduce(function (p, v) {
      return ( p > v ? p : v );
    }).id;
  }
  public add(title:string) {
    this.allChapters.push(new Chapter(this.max()+1,title));
  }
  public del(title:string) {
    this.allChapters = this.allChapters.filter(b => b.title != title);
  }
  public getAll():Chapter[] {
    return this.allChapters;
  }
  public getAllJson():string {
    return JSON.stringify(this.allChapters);
  }
  public getByTitle(title:string):Chapter|undefined {
    return this.allChapters.find(b => b.title == title);
  }
  public getById(id:number):Chapter|undefined {
    return this.allChapters.find(b => b.id == id);
  }
}