import PouchDB from 'pouchdb';
import plugin from 'pouchdb-find';
import { Print } from '../../entities/print';
import { PageModel } from '../../entities/pagemodel';
import { BookChapter } from 'src/app/reader/base/book-chapter';
import { Position } from 'src/app/reader/base/position';

export class PouchChapterStorage {

  db!:PouchDB.Database<{}>;
  remoteCouch = false;

  tblPrints:any;
  dbName!:string;

  bookId!:number;
  chapterId!:number;

  private constructor() {}

  async insert(print:Print) {
    console.log('insert')
    
    let pageId:number = parseInt(localStorage.getItem(`${print.bookId}_${print.chapterId}_pageId`)??'0')
    pageId+=1;
    print.pageId=pageId;
    try {
      await this.post(print);
      localStorage.setItem(`${print.bookId}_${print.chapterId}_pageId`, pageId.toString())
    } catch (err) {
      console.error(err);
    }
  }

  async storageTotal(): Promise<number> {
    console.log('storageTotal pouchDB ',this.db.name);
    let info:PouchDB.Core.DatabaseInfo = await this.db.info();
    return info.doc_count;
  }
  
  private async post(print: Print) {
    await this.db.post(print);
  }

  async updateId(pageId: number, newPageId: number) {
    let result:PouchDB.Find.FindResponse<{}>;
    try {
      result = await this.db.find({
        selector: {pageId: pageId}
      });
      if(result) {
        if(result.docs.length>0) {
          let doc:Print = result.docs[0] as Print;
          doc.pageId=newPageId;
          await this.db.put(doc);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async query(): Promise<Print[]> {
    let result;
    try {
      result = await this.db.find({
        selector: {bookId: this.bookId, chapterId: this.chapterId}
      });
    } catch (err) {
      console.error(err);
    }
    return result?.docs as Print[];
  }

  async getByBase64(bookChapter:BookChapter, base64: string): Promise<Print | null> {
    let results;
    try {
      results = await this.db.find({
        selector: {bookId: bookChapter.bookId, chapterId: bookChapter.chapterId, base64: base64}
      });
    } catch (err) {
      console.error(err);
    }
    if(results)
      return results.docs[0] as Print;
    else 
      return null;
  }

  async getByBlob(bookChapter:BookChapter, blob: Blob): Promise<Print | null> {
    let results;
    try {
      results = await this.db.find({
        selector: {bookId: bookChapter.bookId, chapterId: bookChapter.chapterId, blob: blob}
      });
    } catch (err) {
      console.error(err);
    }
    if(results)
      return results.docs[0] as Print;
    else 
      return null;
  }

  async getOne(position:Position, base64: string|null): Promise<Print | null> {
    let results;
    try {
      results = await this.db.find({
        selector: {bookId: position.bookId, chapterId: position.chapterId, pageId: position.pageId, base64: base64}
      });
    } catch (err) {
      console.error(err);
    }
    if(results)
      return results[0] as Print;
    else 
      return null;
  }

  async getByPageId(pageId:number): Promise<Print | null> {
    console.log('getByPageId',pageId);
    
    let results;
    try {
      results = await this.db.find({
        selector: {pageId: pageId}
      });
    } catch (err) {
      console.error(err);
    }
    console.log('results',results?.docs[0]);
    
    if(results)
      return results.docs[0] as Print;
    else 
      return null;
  }

  async pullRange(pageIdStart:number, pageIdEnd:number): Promise<string> {
    console.log('pullRange',pageIdStart, pageIdEnd)

    let results = await this.db.allDocs({include_docs: true});
    let docs = results.rows.map(d => d.doc) as Print[];
    docs = docs.sort((a,b)=>a.pageId-b.pageId);
    
    if(pageIdStart<1) pageIdStart=1;
    if(pageIdEnd>docs.length) pageIdEnd=docs.length;
    console.log('pageIdStart',pageIdStart,'pageIdEnd',pageIdEnd)
    for(let i=0;i<docs.length;i++){
      if(docs[i].pageId<pageIdStart) {
        docs[i].base64='';
        docs[i].thumb64='';
      }
      if(docs[i].pageId>pageIdEnd) {
        docs[i].base64='';
        docs[i].thumb64='';
      }
    }
    console.log('docs',docs)
    console.log('docs.length',docs.length);
    return JSON.stringify(docs.map(r => new PageModel(r.pageId,r.thumb64)));
  }

  async pull(pageId:number): Promise<string> {
    console.log('pull','pagedId',pageId);
    let print:Print|null = await this.getByPageId(pageId);
    if(print) {
      return JSON.stringify(new PageModel(print.pageId,print.thumb64));
    } else
      return '';
  }

  async pullPrints(slice:number): Promise<Print[]> {
    let results;
    results = await this.db.allDocs({include_docs: true});
    let docs = results.rows.map(d => d.doc) as Print[];
    docs = docs.sort((a,b)=>a.pageId-b.pageId);
    docs = docs.slice(slice,(slice+10));
    return docs;
  }

  async remove(print: Print) {
    let result = await this.getOne(print.getPosition(),print.base64);
    if(result) {
      let r = await this.db.remove(result._id,result._rev);
    }
  }

  async removeAll() {
    try {
      await this.db.destroy();
    } catch (err) {
      console.error(err);
    }
  }

  static initializeBook(bookId:number) : PouchChapterStorage {
    let db = new PouchDB(bookId.toString());
    PouchDB.plugin(plugin);
    let pouchStorage = new PouchChapterStorage();
    pouchStorage.dbName=bookId.toString();
    pouchStorage.bookId=bookId;
    pouchStorage.db=db;
    return pouchStorage;
  }

  static async initializeChapter(bookChapter:BookChapter) : Promise<PouchChapterStorage> {
    console.log(`initializing pouchDB ${bookChapter}`);

    let db = new PouchDB(`${bookChapter}`);
    PouchDB.plugin(plugin);
    let pouchStorage = new PouchChapterStorage();
    pouchStorage.bookId=bookChapter.bookId;
    pouchStorage.chapterId=bookChapter.chapterId;
    pouchStorage.dbName=`${bookChapter}`;
    pouchStorage.db=db;
    return pouchStorage;
  }

}