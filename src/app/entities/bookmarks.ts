import { Bookmark } from './bookmark';

export class Bookmarks {
  bookmarks:Bookmark[]=[];
  length:number=0;

  loadAll(content:string|null){
    if(content) {
      this.bookmarks=JSON.parse(content);
      length=this.bookmarks.length
    }
  }
  add(pagenum:number,description:string) {
    this.bookmarks.push(new Bookmark(pagenum,description));
  }
  del(pagenum:number) {
    this.bookmarks = this.bookmarks.filter(b => b.pagenum != pagenum);
  }
  getAll():Bookmark[] {
    return this.bookmarks;
  }
  getAllJson():string {
    return JSON.stringify(this.bookmarks);
  }
  getByDescription(description:string):Bookmark|undefined {
    return this.bookmarks.find(b => b.description == description);
  }
  getById(pagenum:number):Bookmark|undefined {
    return this.bookmarks.find(b => b.pagenum == pagenum);
  }

}