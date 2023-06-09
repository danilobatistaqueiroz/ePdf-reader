import { Component, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Book } from '../entities/book';
import { Chapter } from '../entities/chapter';
import { Bookmark } from '../entities/bookmark';
import { FileConfigStorage } from '../storages/config/file-config-storage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  portrait: boolean = false;
  private dark:boolean=false;

  constructor(private platform:Platform, public toastCtrl: ToastController) { }

  toggleDark() {
    this.dark=!this.dark;
    if(this.dark)
      this.openToast('dark theme');
    else
      this.openToast('light theme');
    document.body.classList.toggle('dark', this.dark);
    localStorage.setItem('dark',String(this.dark));
  }

  async ngOnInit() {
    this.portrait = (localStorage.getItem('portrait')==='true');
    window.screen.orientation.lock(this.portrait?'portrait':'landscape');
    this.dark = ((localStorage.getItem('dark')??'true').toLowerCase()==='true');
    document.body.classList.toggle('dark', this.dark);
  }

  async export(){
    let config = ["["];
    let books:string|null = localStorage.getItem('books');
    if(books) {
      let allbooks:Book[] = JSON.parse(books);
      for (let book of allbooks) {
        let chapters:string|null = localStorage.getItem(`chapters_${book.id}`)
        if(chapters) {
          let allchapters:Chapter[] = JSON.parse(chapters)
          for(let chapter of allchapters) {
            let currentPage:string|null = localStorage.getItem(`currentPage_${book.id}_${chapter.id}`)
            if(currentPage) {
              currentPage = currentPage.replace(/"/ig,"'")
              config.push(`{"configuration":"currentPage_${book.id}_${chapter.id}","value":"${currentPage}"},`);
            }
            let bookmarkers:string|null = localStorage.getItem(`bookmarkers_${book.id}_${chapter.id}`)
            if(bookmarkers) {
              bookmarkers = bookmarkers.replace(/"/ig,"'")
              config.push(`{"configuration":"bookmarkers_${book.id}_${chapter.id}","value":"${bookmarkers}"},`);
            }
            let time:string|null = localStorage.getItem(`time_${book.id}_${chapter.id}`)
            if(time) {
              time = time.replace(/"/ig,"'")
              config.push(`{"configuration":"time_${book.id}_${chapter.id}","value":"${time}"},`);
            }
            for(let pagenum=0; pagenum<1500; pagenum++){
              let penmarkers:string|null = localStorage.getItem(`penmarkers_${book.id}_${chapter.id}_${pagenum}`)
              if(penmarkers) {
                penmarkers = penmarkers.replace(/"/ig,"'")
                config.push(`{"configuration":"penmarkers_${book.id}_${chapter.id}_${pagenum}","value":"${penmarkers}"},`);
              }
              let penmarkersTop:string|null = localStorage.getItem(`penmarkers_zoom_top_${book.id}_${chapter.id}_${pagenum}`)
              if(penmarkersTop) {
                penmarkersTop = penmarkersTop.replace(/"/ig,"'")
                config.push(`{"configuration":"penmarkers_zoom_top_${book.id}_${chapter.id}_${pagenum}","value":"${penmarkersTop}"},`);
              }
              let penmarkersBottom:string|null = localStorage.getItem(`penmarkers_zoom_bottom_${book.id}_${chapter.id}_${pagenum}`)
              if(penmarkersBottom) {
                penmarkersBottom = penmarkersBottom.replace(/"/ig,"'")
                config.push(`{"configuration":"penmarkers_zoom_bottom_${book.id}_${chapter.id}_${pagenum}","value":"${penmarkersBottom}"},`);
              }
            }
          }
          chapters = chapters?.replace(/"/ig,"'")
          config.push(`{"configuration":"chapters_${book.id}","value":"${chapters}"},`);
        }
      }
    }
    config.push("]")
    let strconfig = config.join('\n')
    let i = strconfig.lastIndexOf(',')
    strconfig = strconfig.substring(0,i)+strconfig.substring(i+1)
    if(this.platform.is("android")){
      FileConfigStorage.writeFile(strconfig, 'configurations.json');
    } else {
      this.downloadBlob(strconfig, 'configurations.json', 'application/json');
    }
  }

  downloadBlob(content:string, filename:string, contentType:string) {
    var blob = new Blob([content], { type: contentType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    a.click();
  }

  rotate() {
    this.portrait=!this.portrait;
    if(this.portrait)
      this.openToast('Fixar tela em modo retrato');
    else
      this.openToast('Fixar tela em modo paisagem');
    localStorage.setItem('portrait',String(this.portrait));
    window.screen.orientation.lock(this.portrait?'portrait':'landscape');
  }

  async openToast(msg:string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}

