export class BookChapter {
  
  constructor(public bookId:number, public chapterId:number) {}

  toString():string {
    return this.withSeparator('_');
  }
  withSeparator(separator:string):string {
    return `${this.bookId}${separator}${this.chapterId}`
  }

}