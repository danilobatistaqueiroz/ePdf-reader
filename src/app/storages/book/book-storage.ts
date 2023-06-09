import { Print } from "../../entities/print";

export interface IBookStorage {
  remove(print: Print): {};
  insert(print: Print): {};
  readBookFile(filePath: string): {};
  writeBookFile(content: string, filePath: string): {};
  deleteBookFile(filePath: string): {};
}