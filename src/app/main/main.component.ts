import { ViewerEngineService } from './../viewer-engine/viewer-engine.service';
import { MainService } from './main.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(
    private mainService: MainService,
    private engServ: ViewerEngineService
  ) {}

  modelCost;
  modelVolume;
  modelUnit;

  unit: string;
  units: string[] = ['mm', 'cm', 'in'];

  onUnitSelect() {
    console.log('Units have changed to ' + this.unit + '!');
    this.mainService.unitChange(this.unit);
  }

  onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
  }

  ngOnInit(): void {
    var conversionFactor = 1;
    this.mainService.getUnitSubject().subscribe((data) => {
      this.modelUnit = data;
      this.modelVolume =
        Math.round(this.engServ.getVolumeService() * 100) / 100;

      switch (this.unit) {
        case 'mm':
          conversionFactor = 1 / 2.54 / 100;
          break;
        case 'cm':
          conversionFactor = 1 / 2.54;
          break;
        case 'in':
          conversionFactor = 1;
          break;
        default:
          console.error('Invalid Unit!');
      }
      this.modelCost =
        Math.round(this.modelVolume * 5.323 * 100 * conversionFactor) / 100;
    });
  }
}
