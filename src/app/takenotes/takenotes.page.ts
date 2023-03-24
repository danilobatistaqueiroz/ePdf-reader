import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-takenotes',
  templateUrl: './takenotes.page.html',
  styleUrls: ['./takenotes.page.scss'],
})
export class TakenotesPage implements OnInit {

  notes:string='';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.notes, 'confirm');
  }

}
