import { Penmarker } from "src/app/entities/penmarker";
import { AlertController } from "@ionic/angular";
import { CapacitorVolumeButtons, VolumeButtonPressed } from "capacitor-volume-buttons";
import { ChangeDetectorRef } from "@angular/core";
import { Position } from "./position";

export function hideBtPage(){
  (document.querySelector("#btPage") as HTMLButtonElement)!.style.opacity = '0.3';
}

export function showBtPage(){
  (document.querySelector("#btPage") as HTMLButtonElement)!.style.opacity = '0.8';
}

export function notebookOn() {
  const notebook:HTMLCanvasElement = document.getElementById('notebook') as HTMLCanvasElement;
  notebook.style.display='block';
}

export async function choosePage(loadingPages:boolean,alertController:AlertController,submit:any) {
  if(loadingPages)
    return;
  const alert = await alertController.create({
    header: 'Goto page',
    buttons: [
      {
        text: 'Cancel'
      },
      {
        text: 'OK',
        handler: submit,
      },
    ],
    inputs: [
      {
        name: 'page',
        placeholder: 'Page',
      },
    ],
  });
  await alert.present();
  let text = document?.querySelector('.alert-input');
  (text as HTMLInputElement).focus();
  text?.addEventListener('keyup', (e) => {
    if ((e as KeyboardEvent).key=="Enter") {
      submit((text as HTMLInputElement).value);
      alert.dismiss(submit((text as HTMLInputElement).value));
    }
  });
}

export function volumeButtons(changeDetectorRef:ChangeDetectorRef,back:any,forward:any) {
  const onVolumeButtonPressed = ({ direction }: VolumeButtonPressed) => {
    if (direction === 'up') {
      back();
    } else {
      forward();
    }
    changeDetectorRef.detectChanges();
  };
  CapacitorVolumeButtons.addListener('volumeButtonPressed', onVolumeButtonPressed);
}

export function rubber(position:Position,zoom:boolean,isBottom:boolean):Penmarker[] {
  const notebook:HTMLCanvasElement = document.getElementById('notebook') as HTMLCanvasElement;
  const context = notebook.getContext('2d');
  context!.clearRect(0, 0, notebook.width, notebook.height);
  if(zoom) {
    if(isBottom) {
      localStorage.setItem(`penmarkers_zoom_bottom_${position}`,'[]');
    } else {
      localStorage.setItem(`penmarkers_zoom_top_${position}`,'[]');
    }
  } else {
    localStorage.setItem(`penmarkers_${position}`,'[]');
  }
  return [];
}

