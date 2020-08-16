import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ViewerEngineService } from '../../services/viewer-engine.service';

@Component({
  selector: 'app-viewer-engine',
  templateUrl: './viewer-engine.component.html',
  styleUrls: ['./viewer-engine.component.scss'],
})
export class ViewerEngineComponent implements OnInit {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private engServ: ViewerEngineService) {}

  ngOnInit(): void {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
  }
}
