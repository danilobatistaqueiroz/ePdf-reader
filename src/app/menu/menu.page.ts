import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  portrait: boolean = false;
  private dark:boolean=false;

  constructor() { }

  toggleDark() {
    this.dark=!this.dark;
    document.body.classList.toggle('dark', this.dark);
    localStorage.setItem('dark',String(this.dark));
  }

  ngOnInit() {
    this.portrait = (localStorage.getItem('portrait')==='true');
    window.screen.orientation.lock(this.portrait?'portrait':'landscape');
    this.dark = ((localStorage.getItem('dark')??'true').toLowerCase()==='true');
    document.body.classList.toggle('dark', this.dark);
  }

  rotate() {
    this.portrait=!this.portrait;
    localStorage.setItem('portrait',String(this.portrait));
    window.screen.orientation.lock(this.portrait?'portrait':'landscape');
  }

}
