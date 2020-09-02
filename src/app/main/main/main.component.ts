import { Subscription } from 'rxjs';
import { CartService } from './../../core/cart/cart.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Model } from '../../core/model.model';
import { ViewerEngineComponent } from './../viewer-engine/viewer-engine.component';
import { Router } from '@angular/router';
import { UploadService } from '../../core/upload/upload.service';
import { ViewerEngineService } from '../../core/main/viewer-engine.service';
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
import { Vector3 } from 'three';
import { User } from 'src/app/core/user.model';
import { markTimeline } from 'console';

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
export class MainComponent implements OnInit, OnDestroy {
  constructor(
    private mainService: MainService,
    private engServ: ViewerEngineService,
    private uploadService: UploadService,
    private authService: AuthService,
    private cartService: CartService,
    private signInDialog: MatDialog,
    private router: Router
  ) {}

  loading = true;
  private unitSub;
  private userSub: Subscription;
  user: User = null;


  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  formDisplay = false;

  model: Model;
  modelCost;
  modelVolume;
  modelVolumeCm;
  modelUnit;
  fileUpload: ElementRef;
  totalCost: number;
  boundingVolume: number;
  boundingDimentions: Vector3;
  graphics: string;
  graphicsOptions = ['fancy', 'low'];
  units = ['mm', 'cm', 'in'];
  graphicsChanged = false;
<<<<<<< HEAD
  surfaceArea: number;
  surfaceAreaCm: number;
  freeUser: boolean = false;

  ngOnInit(): void {
    this.userSub = this.authService.getUserListener().subscribe((user) => {
      if (user) {
        console.log('test USEUSEUE');
        if (user.roles.find((role) => role === 'freeUser')) {
          console.log('Free user');
          this.freeUser = true;
        } else {
          this.freeUser = false;
          console.log('Not a free user');
        }
        console.log(
          `Old user:${JSON.stringify(this.user)}, New user: ${JSON.stringify(
            user
          )}`
        );
        if (this.user && !user) {
          this.resetModel();
        }
      }
      this.user = user;
    });

    this.graphics = localStorage.getItem('graphics');
    if (!this.graphics) {
      localStorage.setItem('graphics', 'fancy');
      this.graphics = 'fancy';
    }
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
    this.formDisplay = false;
    var conversionFactor = 1;
    this.unitSub = this.mainService.getUnitSubject().subscribe((data) => {
      console.log(this.user.roles);
      if (!this.freeUser) {
        console.log('Switching units:' + data);
        this.modelUnit = data;
        switch (this.model.units) {
          case 'mm':
            this.modelVolumeCm = this.modelVolume / 1000;
            this.surfaceAreaCm = this.surfaceArea / 100;
            break;
          case 'cm':
            this.modelVolumeCm = this.modelVolume;
            this.surfaceAreaCm = this.surfaceArea;
            break;
          case 'in':
            this.modelVolumeCm = this.modelVolume * 16.3871;
            this.surfaceAreaCm = this.surfaceArea * 6.4516;
            break;
          default:
            console.error('Invalid Unit!');
        }
        let plasticVolume =
          this.modelVolumeCm * 0.37 + this.surfaceAreaCm * 0.083014211;
        let ONYX_DENSITY = 1.18;
        let MARKUP = 4;
        let COST_PER_GRAM = 190 / 944;
        this.modelCost =
          Math.round(
            plasticVolume * ONYX_DENSITY * COST_PER_GRAM * MARKUP * 100
          ) / 100;
      } else {
        this.modelCost = 0;
      }
      this.totalCost =
        Math.round(this.modelCost * this.model.quantity * 100) / 100;
    });

    this.onUnitSelect();
    this.authService.updateUser();
  }

  ngOnDestroy(): void {
    this.unitSub.unsubscribe();
    this.userSub.unsubscribe();
    if (this.model.modelPath) this.engServ.cleanup();
  }
=======
  // formDisplay = true;

  onFormSubmit() {}
>>>>>>> parent of c57310b... Fixed first time use bug

  onUnitSelect() {
    console.log('Units have changed to ' + this.model.units + '!');
    this.mainService.unitChange(this.model.units);
  }

  updateTotal() {
    this.totalCost =
      Math.round(this.modelCost * this.model.quantity * 100) / 100;
  }

  onFilePicked(event: Event) {
    this.setGraphics(localStorage.getItem('graphics') != 'low');
    this.loading = true;

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
      .subscribe(
        (result) => {
          this.loadModel(result);
        },
        (err) => {
          console.log('error');
          console.error(err);
        }
      );
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
    this.setGraphics(localStorage.getItem('graphics') != 'low');

    this.loading = true;
    if (localStorage.getItem('id')) {
      this.uploadService
        .getModel(localStorage.getItem('id'))
        .subscribe((res) => {
                 this.loadModel(res);
        });
    } else {
      console.log('No model saved');
      this.loading = false;
    }
  }

  private loadModel(res: {
    _id: string;
    user: User;
    title: string;
    filePath: string;
    units: string;
    comment: string;
    quantity: string;
  }) {
    this.engServ.testLoadSTL(res.filePath).then((valid) => {
      if (valid) {
        console.log('STL is valid', valid);
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
            this.boundingVolume = this.engServ.getBoundingBoxVolume();
            this.boundingDimentions = this.engServ.getBoundingBoxDimensions();
            this.formDisplay = true;
            this.surfaceArea = this.engServ.getSurfaceArea();

            this.boundingDimentions.x =
              Math.round(this.boundingDimentions.x * 10) / 10;
            this.boundingDimentions.y =
              Math.round(this.boundingDimentions.y * 10) / 10;
            this.boundingDimentions.z =
              Math.round(this.boundingDimentions.z * 10) / 10;
            this.storeModel(this.model);
            this.onUnitSelect();
          }
        );
      } else {
        console.log(valid);
        console.error('STL is invalid');
      }
    });
  }

  onGraphicsPicked(value: string) {
    this.graphicsChanged = true;
    console.log('setting Graphics to ', value);
    localStorage.setItem('graphics', value);
  }

  setGraphics(fancy: boolean) {
    console.log('setting graphics... ');
    console.log('to', fancy);

    this.engServ.setGraphics(fancy);
  }

  addToCart() {
    this.updateModel();
    console.log(this.authService.getUser());
    if (!this.authService.getUser()) {
      const dialogRef = this.signInDialog.open(SignInDialogComponent);
      dialogRef.afterClosed().subscribe((result) => {
        result ? this.router.navigate(['/login']) : console.log(closed);
      });
    } else {
      // let boundingVolume = this.engServ.getBoundingBoxVolume();
      console.log('bounding volume: ', this.boundingVolume);
      let image = this.engServ.snapshot();
      switch (this.model.units) {
        case 'mm':
          this.boundingVolume *= 6.10237e-5;
          break;
        case 'cm':
          this.boundingVolume *= 0.0610237;
          break;
        case 'in':
          break;
        default:
          console.error('Invalid Unit!');
      }
      this.cartService.addCartItem(
        this.model,
        image,
        this.modelCost,
        this.modelUnit,
        this.boundingVolume
      );
      this.cartService.getCart();
      this.resetModel();
    }
  }

  private resetModel() {
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
    this.boundingDimentions.y = 0;
    this.boundingDimentions.x = 0;
    this.boundingDimentions.z = 0;

    this.formDisplay = false;
    localStorage.removeItem('id');
  }
}
