import { Filesystem, Directory, Encoding, GetUriOptions, StatResult, FileInfo, ReaddirResult, ReadFileResult } from '@capacitor/filesystem';
import { Print } from '../../entities/print';
import { PageModel } from 'src/app/entities/pagemodel';
import { BookChapter } from 'src/app/reader/base/book-chapter';
import { Position } from 'src/app/reader/base/position';

export class FileChapterStorage {

  bookId!:number;
  chapterId!:number;
  static rootFolder:string='ibookreader';
  folderName!:string;

  private constructor(){}

  async storageTotal(): Promise<number> {
    let result: ReaddirResult = await Filesystem.readdir({path:`${this.folderName}`,directory:Directory.Documents});
    return result.files.length;
  }

  async updateId(pageId: number, newPageId: number) {
    let result:ReadFileResult|null = await this.readChapterFile(`${this.folderName}/${pageId}.json`);
    if(result){
      let content:Print = JSON.parse(result.data) as Print;
      content.pageId=newPageId;
      this.writeChapterFile(result.data,`${this.folderName}/${newPageId}.json`);
      this.deleteChapterFile(`${this.folderName}/${pageId}.json`);
    }
  }

  async query(): Promise<Print[]> {
    console.log('query')
    let result:ReaddirResult = await Filesystem.readdir({path:`${this.folderName}`,directory:Directory.Documents});
    let prints:Print[]=[];
    for(let file of result.files) {
      let content:ReadFileResult|null = await this.readChapterFile(`${FileChapterStorage.rootFolder}/${this.bookId}/${this.chapterId}/${file.name}`);
      if(content)
        prints.push(JSON.parse(content.data));
    }
    return prints;
  }

  async getByBase64(bookChapter:BookChapter, base64: string): Promise<Print | null> {
    console.log('getByBase64 - bookId:'+bookChapter.bookId+' - chapterId:'+bookChapter.chapterId);
    let results;
    try {
      let prints:Print[] = await this.query();
      for(let print of prints) {
        if(print.bookId==bookChapter.bookId && print.chapterId==bookChapter.chapterId && print.base64==base64) {
          results = print;
        }
      }
    } catch (err) {
      console.error(err);
    }
    if(results)
      return results;
    else 
      return null;
  }

  async getByBlob(bookChapter:BookChapter, blob: Blob): Promise<Print | null> {
    console.log('getByBlob - bookId:'+bookChapter.bookId+' - chapterId:'+bookChapter.chapterId);
    let results;
    try {
      let prints:Print[] = await this.query();
      for(let print of prints) {
        if(print.bookId==bookChapter.bookId && print.chapterId==bookChapter.chapterId && print.blob==blob) {
          results = print;
        }
      }
    } catch (err) {
      console.error(err);
    }
    if(results)
      return results;
    else 
      return null;
  }

  async getOne(position:Position, base64: string): Promise<Print | null> {
    let results:Print|null=null;
    try {
      let result:ReadFileResult|null = await this.readChapterFile(`${this.folderName}/${position.pageId}.json`);
      if(result)
        results = JSON.parse(result.data) as Print;
    } catch (err) {
      console.error(err);
    }
    if(results)
      return results;
    else 
      return null;
  }

  async pull(offset: number): Promise<string> {
    console.log(`pull offset: ${offset}`)
    let prints:Print[]=[]
    for(let pageId of this.range(offset,offset+5)) {
      let result:ReadFileResult|null = await this.readChapterFile(`${this.folderName}/${pageId}.json`);
      if(result){
        let results:Print = JSON.parse(result.data) as Print;
        prints.push(results);
      }
    }
    return JSON.stringify(prints.map(r => new PageModel(r.pageId,r.thumb64)));
  }

  async pullBack(bookChapter:BookChapter,pageId:number): Promise<string> {
    let prints:Print[]=[]
    let result:ReadFileResult|null = await this.readChapterFile(`${this.folderName}/${pageId-2}.json`);
    if(result){
      let results:Print = JSON.parse(result.data) as Print;
      prints.push(results);
    }
    return JSON.stringify(prints.map(r => new PageModel(r.pageId,r.thumb64)));
  }

  async pullNext(bookChapter:BookChapter,pageId:number): Promise<string> {
    let prints:Print[]=[]
    let result:ReadFileResult|null = await this.readChapterFile(`${this.folderName}/${pageId+2}.json`);
    if(result){
      let results:Print = JSON.parse(result.data) as Print;
      prints.push(results);
    }
    return JSON.stringify(prints.map(r => new PageModel(r.pageId,r.thumb64)));
  }

  async pullPrints(slice: number): Promise<Print[]> {
    console.log('pullPrints slice:'+slice)
    let prints:Print[]=[]
    for(let pageId of this.range(slice,slice+10)) {
      let result:ReadFileResult|null = await this.readChapterFile(`${this.folderName}/${pageId}.json`);
      if(result){
        let results:Print = JSON.parse(result.data) as Print;
        prints.push(results);
      }
    }
    return prints;
  }

  async pullRange(pageId:number): Promise<string> {
    let ini = pageId-3;
    let end = pageId+3;
    if(ini<1) ini=1;
    let count = await this.storageTotal();
    if(end>count) end=count;
    console.log('pullRange:'+ini+' '+end);
    let prints:Print[]=[]
    for(let pageId of this.range(ini,end)) {
      let result:ReadFileResult|null = await this.readChapterFile(`${this.folderName}/${pageId}.json`);
      if(result){
        let results:Print = JSON.parse(result.data) as Print;
        prints.push(results);
      }
    }
    return JSON.stringify(prints.map(r => new PageModel(r.pageId,r.thumb64)));
  }

  async remove(print: Print) {
    this.deleteChapterFile(`${this.folderName}/${print.pageId}.json`)
  }

  async removeAll() {
    try {
      await Filesystem.rmdir({path:this.folderName,directory:Directory.Documents,recursive:true})
    } catch (err) {
      console.error(err);
    }
  }

  private static async initialize() {
    console.log('initialize')
    let exists:boolean = await this.checkFileExists({path: FileChapterStorage.rootFolder, directory: Directory.Documents});
    if (exists==false) {
      console.log(`mkdir ${FileChapterStorage.rootFolder}`)
      await Filesystem.mkdir({path: `${FileChapterStorage.rootFolder}`, directory: Directory.Documents})
    }
  }

  private static async initializeBook(bookId:number) {
    console.log('initializeBook')
    let exists:boolean = await FileChapterStorage.checkFileExists({ path: `${FileChapterStorage.rootFolder}/book_${bookId}`, directory: Directory.Documents});
    if(exists==false){
      console.log(`mkdir book ${FileChapterStorage.rootFolder}/book_${bookId}`)
      await Filesystem.mkdir({path: `${FileChapterStorage.rootFolder}/book_${bookId}`, directory:Directory.Documents});
    }
  }

  static async initializeChapter(bookChapter:BookChapter) : Promise<FileChapterStorage> {
    console.log('initializeChapter')
    await this.initialize();
    await this.initializeBook(bookChapter.bookId);
    let fullFolderName=`${FileChapterStorage.rootFolder}/book_${bookChapter.bookId}/chapter_${bookChapter.chapterId}`;
    let exists:boolean = await FileChapterStorage.checkFileExists({ path: fullFolderName, directory: Directory.Documents});
    if(exists==false){
      console.log(`mkdir chapter ${fullFolderName}`)
      await Filesystem.mkdir({path: fullFolderName,directory:Directory.Documents});
    }
    let fileStorage = new FileChapterStorage();
    fileStorage.bookId=bookChapter.bookId;
    fileStorage.chapterId=bookChapter.chapterId;
    fileStorage.folderName=fullFolderName;
    return fileStorage;
  }

  async insert(print: Print) {
    console.log('storage insert')
    try {
      let filePath = `${this.folderName}/${print.pageId}.json`;
      await this.writeChapterFile(JSON.stringify(print), filePath);
    } catch (err) {
      console.error(err);
    }
  }

  async readChapterFile(filePath:string): Promise<ReadFileResult|null> {
    console.log('readChapterFile: '+filePath)
    if (await FileChapterStorage.checkFileExists({ path: filePath, directory: Directory.Documents}) ){
      return await Filesystem.readFile({
        path: `${filePath}`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })
    }
    return null;
  }

  async writeChapterFile(content:string,filePath:string) {
    console.log('write chapter file')
    await Filesystem.writeFile({
      path: `${filePath}`,
      data: content,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  }

  async deleteChapterFile(filePath:string) {
    await Filesystem.deleteFile({
      path: `${filePath}`,
      directory: Directory.Documents
    })
  }

  private static async checkFileExists(getUriOptions: GetUriOptions): Promise<boolean> {
    console.log('checkFileExists')
    console.log(getUriOptions.path);
    try {
      await Filesystem.stat(getUriOptions);
      return true;
    } catch (checkDirException:any) {
      console.error(getUriOptions.path, 'File does not exist')
      if (checkDirException.message === 'File does not exist') {
        return false;
      } else {
        throw checkDirException;
      }
    }
  }

  rangeInt = (from:number,to:number) => Array.from( { length: to-from+1 }, (e, i) => i + from );
  rangeChar = (from:string,to:string) => Array.from( { length: to.charCodeAt(0)-from.charCodeAt(0)+1 }, (e,i) => String.fromCharCode(i+from.charCodeAt(0)) );
  range = (from:any,to:any) =>
      (typeof(from) === 'string' && typeof(to) === 'string') 
      ? this.rangeChar(from,to)
      : (!to) ? this.rangeInt(0,from-1) : this.rangeInt(from,to);
}