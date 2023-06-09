import { Penmarker } from '../../entities/penmarker';
import { Position } from './position';

export class NotebookEvents {

  forward:any;
  back:any;
  drawLine:any;
  penmarkers!:Penmarker[];
  zoom!:boolean;
  isBottom!:boolean;
  position!:Position;

  startNotebook() {
      
    let isDrawing = false;
    let x=0,y=0,x1=0,x2=0,y1=0,y2=0;
    
    const notebook:HTMLCanvasElement = document.getElementById('notebook') as HTMLCanvasElement;
    const context = notebook.getContext('2d');

    var w = document.documentElement.clientWidth || document.body.clientWidth;
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    notebook.width=w;
    notebook.height=h;
    
    // this.penmarkers = JSON.parse(localStorage.getItem(`penmarkers_${this.bookid}_${this.chapterid}_${this.page}`)??'[]');
    // for(let mark of this.penmarkers) {
    //   this.drawLine(context,mark.x1,mark.y1,mark.x2,mark.y2);
    // }

    notebook.addEventListener('mousedown', (e) => {
      x = e.offsetX;
      x1 = x;
      y = e.offsetY;
      y1 = y
      isDrawing = true;
    });

    window.addEventListener('keydown', (e:KeyboardEvent) => {
      if (e.key == "ArrowRight") {
        this.forward();
      } else if (e.key == "ArrowLeft") {
        this.back();
      }
    });
    
    window.addEventListener('mouseup', (e) => {
      if (isDrawing) {
        x2 = e.offsetX;
        y2 = e.offsetY;
        this.drawLine(context, x, y, x2, y2);
        this.penmarkers.push({x1:x1, y1:y1, x2:x2, y2:y2});
        if(this.zoom) {
          if(this.isBottom) {
            localStorage.setItem(`penmarkers_zoom_bottom_${this.position}`,JSON.stringify(this.penmarkers));
          } else {
            localStorage.setItem(`penmarkers_zoom_top_${this.position}`,JSON.stringify(this.penmarkers));
          }
        } else {
          localStorage.setItem(`penmarkers_${this.position}`,JSON.stringify(this.penmarkers));
        }
        x = 0;
        y = 0;
        isDrawing = false;
      }
    });
    
    notebook.addEventListener('touchstart', (e:TouchEvent) => {
      x = e.touches[0]?.clientX;
      x1 = x;
      y = e.touches[0]?.clientY;
      y1 = y;
      isDrawing = true;
    });

    notebook.addEventListener('touchend', (e:TouchEvent) => {
      if (isDrawing) {
        if (e.changedTouches[0]){
          x2 = e.changedTouches[0].clientX;
          y2 = e.changedTouches[0].clientY;
          this.drawLine(context, x, y, x2, y2);
          this.penmarkers.push({x1:x1, y1:y1, x2:x2, y2:y2});
          if(this.zoom) {
            if(this.isBottom) {
              localStorage.setItem(`penmarkers_zoom_bottom_${this.position}`,JSON.stringify(this.penmarkers));
            } else {
              localStorage.setItem(`penmarkers_zoom_top_${this.position}`,JSON.stringify(this.penmarkers));
            }
          } else {
            localStorage.setItem(`penmarkers_${this.position}`,JSON.stringify(this.penmarkers));
          }
          x = 0;
          y = 0;
          isDrawing = false;
        }
      }
    });

  }

}