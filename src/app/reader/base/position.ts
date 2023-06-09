import { BookChapter } from "./book-chapter";

export class Position {
  
  constructor(public bookId:number, public chapterId:number, public pageId:number) {}

  toString():string {
    return this.withSeparator('_');
  }
  withSeparator(separator:string):string {
    return `${this.bookId}${separator}${this.chapterId}${separator}${this.pageId}`
  }
  toBookChapter():BookChapter{
    return new BookChapter(this.bookId,this.chapterId);
  }
}