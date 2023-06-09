import { BookChapter } from "../reader/base/book-chapter";
import { Position } from "../reader/base/position";

export class Print {

  pageId!:number;
  blob:Blob|null=null;
  thumbBlob:Blob|null=null;
  base64: string|null=null;
  thumb64: string|null=null;
  _id!:string;
  _rev!:string;

  constructor (public bookId: number, public chapterId: number){

  }

  static startBookChapter(bookChapter:BookChapter) {
    return new Print(bookChapter.bookId,bookChapter.chapterId);
  }

  getPosition(){
    return new Position(this.bookId,this.chapterId,this.pageId);
  }

  getBookChapter(){
    return new BookChapter(this.bookId,this.chapterId);
  }

}