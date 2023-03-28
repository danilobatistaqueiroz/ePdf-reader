import { Page } from './page';

export class Pages {
  chapters:Page[]=[];
  public loadAll(content:string|null){
    if(content)
      this.chapters=JSON.parse(content);
  }
  public add(base64:string):string|null {
    if(this.chapters.find(c => c.base64 == base64)){
      return 'Imagem já carregada';
    }
    this.chapters.push(new Page(this.chapters.length,base64));
    return null;
  }
  public del(base64:string) {
    this.chapters = this.chapters.filter(b => b.base64 != base64);
    let i = 0;
    this.chapters = this.chapters.map(c => {
      c.id=i++;
      return c;
    });
  }
  public getAll():Page[] {
    return this.chapters;
  }
  public getAllBase64():string[] {
    return this.chapters.map(c => c.base64);
  }
  public getAllJson():string {
    return JSON.stringify(this.chapters);
  }
  public getByTitle(base64:string):Page|undefined {
    return this.chapters.find(b => b.base64 == base64);
  }
  public getById(id:number):Page|undefined {
    return this.chapters.find(b => b.id == id);
  }
}