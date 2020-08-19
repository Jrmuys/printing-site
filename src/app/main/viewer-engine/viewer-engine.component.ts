import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ViewerEngineService } from '@core/main/viewer-engine.service';

@Component({
  selector: 'app-viewer-engine',
  templateUrl: './viewer-engine.component.html',
  styleUrls: ['./viewer-engine.component.scss'],
})
export class ViewerEngineComponent implements OnInit {
  constructor(private engServ: ViewerEngineService) {}

  ngOnInit(): void {}
}
