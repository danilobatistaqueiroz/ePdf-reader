import { Filesystem, Directory, Encoding, GetUriOptions, StatResult, FileInfo, ReaddirResult, ReadFileResult } from '@capacitor/filesystem';
import { Print } from '../../entities/print';
import { IBookStorage } from './book-storage';

export class FileBookStorage implements IBookStorage {

  bookId!:number;
  chapterId!:number;
  static rootFolder:string='ebookreader';
  folderName!:string;

  private constructor(){}

  async remove(print: Print) {
    this.deleteBookFile(`${this.folderName}/${print.pageId}.json`)
  }

  private static async initialize() {
    let exists:boolean = await this.checkFileExists({path: FileBookStorage.rootFolder, directory: Directory.Documents});
    if (exists==false) {
      await Filesystem.mkdir({path: `${FileBookStorage.rootFolder}`, directory: Directory.Documents})
    }
  }

  static async initializeBook(bookId:number) {
    await this.initialize();
    let fullFolderName=`${FileBookStorage.rootFolder}/${bookId}`;
    let exists:boolean = await FileBookStorage.checkFileExists({ path: `${FileBookStorage.rootFolder}/${bookId}`, directory: Directory.Documents});
    if(exists==false){
      await Filesystem.mkdir({path: `${FileBookStorage.rootFolder}/${bookId}`});
    }
    let fileStorage = new FileBookStorage();
    fileStorage.bookId=bookId;
    fileStorage.folderName=fullFolderName;
    return fileStorage;
  }

  async insert(print: Print) {
    try {
      let filePath = `${this.folderName}/${print.pageId}.json`;
      await this.writeBookFile(JSON.stringify(print), filePath);
    } catch (err) {
      console.error(err);
    }
  }

  async readBookFile(filePath:string){
    return await Filesystem.readFile({
      path: `${filePath}`,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    })
  }

  async writeBookFile(content:string,filePath:string) {
    await Filesystem.writeFile({
      path: `${filePath}`,
      data: content,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  }

  async deleteBookFile(filePath:string) {
    await Filesystem.deleteFile({
      path: `${filePath}`,
      directory: Directory.Documents
    })
  }

  private static async checkFileExists(getUriOptions: GetUriOptions): Promise<boolean> {
    try {
      await Filesystem.stat(getUriOptions);
      return true;
    } catch (checkDirException:any) {
      if (checkDirException.message === 'File does not exist') {
        return false;
      } else {
        throw checkDirException;
      }
    }
  }

}