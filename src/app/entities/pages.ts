import { Page } from './page';

export class Pages {
  prints:Page[]=[];
  top:number=0;
  public loadAll(content:string|null){
    if(content)
      this.prints=JSON.parse(content);
  }

  public concat(content:string|null){
    if(content){
      let pages:Page[] = JSON.parse(content);
      for(let page of pages) {
        this.prints.push(page);
      }
      if(this.prints.length>30) {
        this.top+=10;
        console.log('prints slice top',this.top);
        this.prints = this.prints.slice(10)
      }
    }
    console.log('concat top',this.top)
  }

  public aloc(offset:number, content:string|null): number {
    if(content){
      let pages:Page[] = JSON.parse(content);

      console.log('aloc - top',this.top)
      if(this.top<10){
        return offset;
      }
      this.top-=10;
      console.log('aloc - novo top',this.top)
      let newPrints = [];
      for(let i=0; i<pages.length; i++) {
        console.log('push')
        newPrints.push(pages[i]);
      }
      newPrints = newPrints.concat(this.prints);
      this.prints = newPrints;
      if(this.prints.length>30){
        offset-=10;
        console.log('prints slice bottom');
        this.prints = this.prints.slice(0,30);
      }
      console.log('top',this.top)
    }
    return offset;
  }

  public add(pageId:number,base64:string):string|null {
    if(this.prints.find(c => c.base64 == base64)){
      return 'Imagem já carregada';
    }
    this.prints.push(new Page(pageId,base64));
    return null;
  }
  public del(base64:string) {
    this.prints = this.prints.filter(b => b.base64 != base64);
    let i = 0;
    this.prints = this.prints.map(c => {
      c.pageId=i++;
      return c;
    });
  }
  public getAll():Page[] {
    return this.prints.sort((a, b) => a.pageId - b.pageId);
  }
  public getAllBase64():string[] {
    return this.prints.map(c => c.base64);
  }
  public getAllJson():string {
    return JSON.stringify(this.prints);
  }
  public getByTitle(base64:string):Page|undefined {
    return this.prints.find(b => b.base64 == base64);
  }
  public getByPageId(pageId:number):Page|undefined {
    return this.prints.find(b => b.pageId == pageId);
  }
  public getByIndex(idx: number) {
    return this.prints[idx];
  }
}