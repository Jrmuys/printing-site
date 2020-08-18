import { Model } from './../../models/model.model';
import { ViewerEngineComponent } from './../viewer-engine/viewer-engine.component';
import { Router } from '@angular/router';
import { UploadService } from './../../services/upload.service';
import { ViewerEngineService } from '../../services/viewer-engine.service';
import { MainService } from '../../services/main.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { matMenuAnimations } from '@angular/material/menu';
import { JsonPipe } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';

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
    private engServ: ViewerEngineService,
    private uploadService: UploadService,
    private router: Router,
    private viewerCompontent: ViewerEngineComponent
  ) {}

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  formDisplay = false;

  model: Model;
  modelCost;
  modelVolume;
  modelUnit;
  fileUpload: ElementRef;

  units = ['mm', 'cm', 'in'];
  // formDisplay = true;

  onFormSubmit() {}

  onUnitSelect() {
    console.log('Units have changed to ' + this.model.units + '!');
    this.mainService.unitChange(this.model.units);
  }

  onFilePicked(event: Event) {
    console.log('File picked');
    const file = (event.target as HTMLInputElement).files[0];
    const name = file.name.split('.')[0];
    var progress = 0;
    console.log('file:', file);
    this.uploadService
      .upload(name, file, this.model.units)
      .subscribe((result) => {
        console.log(typeof result);
        this.engServ.createScene(this.rendererCanvas, result.filePath, () => {
          this.modelVolume =
            Math.round(this.engServ.getVolumeService() * 100) / 100;
          this.onUnitSelect();
          this.model.title = result.title;
          this.formDisplay = true;
        });
        this.engServ.animate();
      });
  }

  // .pipe(
  //   map((event) => {
  //     switch (event.type) {
  //       case HttpEventType.UploadProgress:
  //         progress = Math.round((event.loaded * 100) / event.total);
  //         console.log('file upload progress: ' + progress);
  //         break;
  //       case HttpEventType.Response:
  //         console.log('File has been uploaded');
  //         return event;
  //     }
  //   })
  // );

  ngOnInit(): void {
    this.model = {
      id: null,
      title: null,
      modelPath: null,
      units: 'mm',
      comment: null,
      quantity: 1,
    };
    var conversionFactor = 1;
    this.mainService.getUnitSubject().subscribe((data) => {
      console.log('Switching units:' + data);
      this.modelUnit = data;
      // this.modelVolume =
      //   Math.round(this.engServ.getVolumeService() * 100) / 100;

      switch (this.model.units) {
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
    this.onUnitSelect();
  }
}
