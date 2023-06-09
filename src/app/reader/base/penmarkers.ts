import { Penmarker } from "../../entities/penmarker";
import { Position } from './position';

export function loadPenmarkers(zoom:boolean,isBottom:boolean,position:Position):Penmarker[] {
  let penmarkers = []
  if(zoom) {
    if(isBottom) {
      penmarkers = JSON.parse(localStorage.getItem(`penmarkers_zoom_bottom_${position.bookId}_${position.chapterId}_${position.pageId}`)??'[]');
    } else {
      penmarkers = JSON.parse(localStorage.getItem(`penmarkers_zoom_top_${position.bookId}_${position.chapterId}_${position.pageId}`)??'[]');
    }
  } else {
    penmarkers = JSON.parse(localStorage.getItem(`penmarkers_${position.bookId}_${position.chapterId}_${position.pageId}`)??'[]');
  }
  const notebook:HTMLCanvasElement = document.getElementById('notebook') as HTMLCanvasElement;
  const context = notebook.getContext('2d');
  context!.clearRect(0, 0, notebook.width, notebook.height);
  setTimeout(drawLines,300,context,penmarkers,drawLine);
  return penmarkers;
}

export function drawLines(context:any,markers:Penmarker[],drawLine:any) {
  for(let mark of markers) {
    drawLine(context, mark.x1, mark.y1, mark.x2, mark.y2);
  }
}

export function drawLine(context:any, x1:number, y1:number, x2:number, y2:number) {
  context.beginPath();
  context.strokeStyle = 'rgba(255,255,0,0.3)';
  context.lineWidth = '8';
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}