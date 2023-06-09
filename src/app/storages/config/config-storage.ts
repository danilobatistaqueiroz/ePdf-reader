class Book { 
  constructor(public id:number, public title:string){}
}
class Chapter {
  constructor(public id:number, public title:string, public bookId:number){}
}
class Time {
  constructor(public hours:number, public minutes:number, public seconds:number){}
}
class Bookmark {
  constructor(public pagenum:number, public description:string) {}
}
class Mark {
  constructor(public x1:number=0, public x2:number=0, public y1:number=0, public y2:number=0){}
}
class Penmark {
  constructor(public pagenum:number, public marks:Mark[], public zoomTopMarks:Mark[], public zoomBottomMarks:Mark[]){}
}

class Activities {
  bookId:number;
  chapterId:number;
  currentPage:number;
  notes:string;
  time:Time;
  bookmarkers:Bookmark[];
  penmarkers:Penmark[];
}
export class EBookReader {
  portrait:string="portrait";
  dark:boolean=true;
  screenOff:boolean=false;
  books: Book[];
  chapters: Chapter[];
  sequencePageid:number;
  activeTimer:number;
  activities: Activities;
}