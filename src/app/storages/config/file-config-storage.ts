import { Filesystem, Directory, Encoding, GetUriOptions, StatResult, FileInfo, ReaddirResult, ReadFileResult } from '@capacitor/filesystem';

export class FileConfigStorage {

  static rootFolder: string = 'ebookreader';

  constructor() { }

  static async readFile(filePath: string) {
    return await Filesystem.readFile({
      path: `${FileConfigStorage.rootFolder}/${filePath}`,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    })
  }

  static async writeFile(content: string, filePath: string) {
    await Filesystem.writeFile({
      path: `${FileConfigStorage.rootFolder}/${filePath}`,
      data: content,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  }

  static async deleteFile(filePath: string) {
    await Filesystem.deleteFile({
      path: `${FileConfigStorage.rootFolder}/${filePath}`,
      directory: Directory.Documents
    })
  }

}