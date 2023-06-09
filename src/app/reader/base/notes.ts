import { ModalController } from "@ionic/angular";
import { TakenotesPage } from "../../takenotes/takenotes.page";
import { Position } from './position';

export async function takenotes(position:Position,notes:string,modalCtrl:ModalController):Promise<string> {
  const modal = await modalCtrl.create({
    component: TakenotesPage,
    componentProps: { 
      notes: notes,
    }
  });
  modal.present();
  const { data, role } = await modal.onWillDismiss();
  if (role === 'confirm') {
    notes = data??'';
    localStorage.setItem(`notes_${position.bookId}_${position.chapterId}`,notes);
    return notes;
  }
  return '';
}