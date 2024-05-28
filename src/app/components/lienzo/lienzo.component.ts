import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-lienzo',
  standalone: true,
  imports: [],
  templateUrl: './lienzo.component.html',
  styleUrl: './lienzo.component.css'
})
export class LienzoComponent {
  @ViewChild('canvas') canvas: any;
  ctx!: any;
  public imgSrc = "https://i.pinimg.com/originals/0b/be/b1/0bbeb14b30d833389a3f53e067547763.png"
  canvasWidth: number = 700
  canvasHeight: number = 600
  isDrawing: boolean = false;
  trazos: { color: string; grosor: number; trazo: Path2D }[] = [];
  context: CanvasRenderingContext2D | null = null;
  penColor = '#000000';
  penThickness: number = 0;
  selectedTool = 'pen';
  selectedColor: string = '#000000';
  backgroundImage: HTMLImageElement = new Image();

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.ctx = this.canvas.nativeElement.getContext('2d');
    const backgroundImage = new Image();
    backgroundImage.src = this.imgSrc;
    backgroundImage.onload = () => {
      this.ctx.drawImage(
        backgroundImage,
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
    };
  }
  clearCanvas() {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      const backgroundImage = new Image();
      backgroundImage.src = this.imgSrc;
      backgroundImage.onload = () => {
        this.ctx.drawImage(
          backgroundImage,
          0,
          0,
          this.canvas.nativeElement.width,
          this.canvas.nativeElement.height
        );
      };
      this.trazos = [];
    }
  }

  cambiarGrosor(nuevoGrosor: number): void {
    this.penThickness = nuevoGrosor;
    this.ctx.lineWidth = this.penThickness;
  }

  seleccionarGrosor(grosor: number): void {
    this.cambiarGrosor(grosor);
  }

  seleccionarColor(color: string): void {
    this.cambiarColor(color);
  }

  cambiarColor(nuevoColor: string): void {
    this.selectedColor = nuevoColor;
    this.ctx.strokeStyle = this.penColor;
  }

  startDrawing(event: MouseEvent, color: string, grosor: number):void{
    this.isDrawing = true;
    const nuevoTrazo = new Path2D();
    nuevoTrazo.moveTo(event.offsetX, event.offsetY);
    this.trazos.push({ trazo: nuevoTrazo, color: color, grosor: grosor });
  }

  draw(event:MouseEvent):void{
    if (this.isDrawing) {
      const trazoActual = this.trazos[this.trazos.length - 1];
      trazoActual.trazo.lineTo(event.offsetX, event.offsetY);
      this.ctx.strokeStyle = trazoActual.color; 
      this.ctx.lineWidth = trazoActual.grosor;
      this.ctx.stroke(trazoActual.trazo);
    }
  }

  endDrawing():void{
    this.isDrawing = false
  }

  
  regresarUltimoTrazo(): void {
    if (this.trazos.length > 0) {
      this.trazos.pop();

      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      const backgroundImage = new Image();
      backgroundImage.src = this.imgSrc;
      backgroundImage.onload = () => {
        this.ctx.drawImage(
          backgroundImage,
          0,
          0,
          this.canvas.nativeElement.width,
          this.canvas.nativeElement.height
        );

        this.trazos.forEach((trazoData) => {
          this.ctx.strokeStyle = trazoData.color;
          this.ctx.lineWidth = trazoData.grosor;
          this.ctx.stroke(trazoData.trazo);
        });
      };
    }
  }
}
