import { Subscription } from 'rxjs';
import { CartService } from './../../core/cart/cart.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Model } from '@core/model.model';
import { ViewerEngineComponent } from './../viewer-engine/viewer-engine.component';
import { Router } from '@angular/router';
import { UploadService } from '@core/upload/upload.service';
import { ViewerEngineService } from '@core/main/viewer-engine.service';
import { MainService } from '../../core/main/main.service';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { SignInDialogComponent } from '../sign-in-dialog/sign-in-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss', '../../../../node_modules/w3.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  constructor(
    private mainService: MainService,
    private engServ: ViewerEngineService,
    private uploadService: UploadService,
    private authService: AuthService,
    private cartService: CartService,
    private signInDialog: MatDialog,
    private router: Router,
    private viewerCompontent: ViewerEngineComponent
  ) {}

  loading = true;
  private unitSub;
  private userSub: Subscription;
  user;

  ngOnDestroy(): void {
    this.unitSub.unsubscribe();
    this.userSub.unsubscribe();
    if (this.model.modelPath) this.engServ.cleanup();
  }

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  formDisplay = false;

  model: Model;
  modelCost;
  modelVolume;
  modelUnit;
  fileUpload: ElementRef;
  totalCost: number;

  units = ['mm', 'cm', 'in'];
  // formDisplay = true;

  onFormSubmit() {}

  onUnitSelect() {
    console.log('Units have changed to ' + this.model.units + '!');
    this.mainService.unitChange(this.model.units);
  }

  updateTotal() {
    this.totalCost =
      Math.round(this.modelCost * this.model.quantity * 100) / 100;
  }

  onFilePicked(event: Event) {
    console.log('File picked');
    const file = (event.target as HTMLInputElement).files[0];
    const name = file.name.split('.')[0];
    var progress = 0;
    console.log('file:', file);
    this.uploadService
      .upload(
        name,
        file,
        this.model.units,
        this.model.comment,
        this.model.quantity,
        this.authService.getUser()
      )
      .subscribe((result) => {
        console.log(typeof result);
        this.engServ.createScene(this.rendererCanvas, result.filePath, () => {
          this.modelVolume =
            Math.round(this.engServ.getVolumeService() * 100) / 100;
          this.onUnitSelect();
          this.model.title = result.title;
          this.formDisplay = true;
          this.model.id = result._id;
          this.model.modelPath = result.filePath;
          this.model.user = result.user;
          console.log('Model: ' + JSON.stringify(this.model));
          this.storeModel(this.model);
        });
        this.engServ.animate();
      });
  }

  updateModel() {
    console.log('updating model');
    this.uploadService.updateModel(
      this.model.id,
      this.model.title,
      this.model.modelPath,
      this.model.units,
      this.model.comment,
      this.model.quantity,
      this.model.user
    );
  }

  storeModel(model: Model) {
    localStorage.setItem('modelSaved', 'true');
    localStorage.setItem('id', model.id);
    console.log(model.id);
  }
  getStoredModel() {
    this.loading = true;
    if (localStorage.getItem('id')) {
      this.uploadService
        .getModel(localStorage.getItem('id'))
        .subscribe((res) => {
          console.log('Getting model with info: ' + JSON.stringify(res));
          this.model = {
            id: res._id,
            title: res.title,
            modelPath: res.filePath,
            units: res.units,
            comment: res.comment,
            quantity: +res.quantity,
            user: res.user,
          };
          this.engServ.createScene(
            this.rendererCanvas,
            this.model.modelPath,
            () => {
              this.modelVolume =
                Math.round(this.engServ.getVolumeService() * 100) / 100;
              this.onUnitSelect();
              this.engServ.animate();
              this.loading = false;
              this.formDisplay = true;
            }
          );
        });
    } else {
      console.log('No model saved');
      this.loading = false;
    }
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
    console.log('INIT');
    this.loading = true;
    this.model = {
      id: null,
      title: null,
      modelPath: null,
      units: 'mm',
      quantity: 1,
      user: null,
      comment: '',
    };
    this.getStoredModel();
    var conversionFactor = 1;
    this.unitSub = this.mainService.getUnitSubject().subscribe((data) => {
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
      this.totalCost =
        Math.round(this.modelCost * this.model.quantity * 100) / 100;
    });
    this.onUnitSelect();
    this.userSub = this.authService.getUserListener().subscribe((user) => {
      console.log(`Old user:${this.user}, New user: ${user}`);
      if (this.user && !user) {
        this.model = {
          id: null,
          title: null,
          modelPath: null,
          units: 'mm',
          quantity: 1,
          user: null,
          comment: '',
        };
        this.engServ.cleanup();
        this.modelCost = 0;
        this.totalCost = 0;
        localStorage.removeItem('id');
      }
      this.user = user;
    });
  }

  addToCart() {
    console.log(this.authService.getUser());
    if (!this.authService.getUser()) {
      const dialogRef = this.signInDialog.open(SignInDialogComponent);
      dialogRef.afterClosed().subscribe((result) => {
        result ? this.router.navigate(['/login']) : console.log(closed);
      });
    } else {
      let image = this.engServ.snapshot();
      this.cartService.addCartItem(
        this.model.id,
        this.modelCost,
        this.model.title,
        image,
        this.model.quantity,
        this.model.modelPath
      );
      this.cartService.getCart();
      this.model = {
        id: null,
        title: null,
        modelPath: null,
        units: 'mm',
        quantity: 1,
        user: null,
        comment: '',
      };
      this.engServ.cleanup();
      this.modelCost = 0;
      this.totalCost = 0;
      this.modelVolume = 0;
      this.formDisplay = false;
      localStorage.removeItem('id');
    }
  }
}
