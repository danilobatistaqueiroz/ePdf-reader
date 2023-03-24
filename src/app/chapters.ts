import { Chapter } from './chapter';

export class Chapters {
  chapters:Chapter[]=[];
  public loadAll(content:string|null){
    if(content)
      this.chapters=JSON.parse(content);
  }
  public add(title:string) {
    this.chapters.push(new Chapter(this.chapters.length,title));
  }
  public del(title:string) {
    this.chapters = this.chapters.filter(b => b.title != title);
  }
  public getAll():Chapter[] {
    return this.chapters;
  }
  public getAllJson():string {
    return JSON.stringify(this.chapters);
  }
  public getByTitle(title:string):Chapter|undefined {
    return this.chapters.find(b => b.title == title);
  }
  public getById(id:number):Chapter|undefined {
    return this.chapters.find(b => b.id == id);
  }
}