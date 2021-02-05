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
  surfaceArea: number;
  surfaceAreaCm: number;
  freeUser: boolean = false;
  dragOver = false;
  validModel: boolean = true;
  printVolumeFit: boolean = true;
  markforgedPrintVolume = {
    mm: [320, 132, 154],
    cm: [32, 13.2, 15.4],
    in: [23, 13, 14],
  };

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
      } else {
        this.freeUser = false;
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
    this.unitSub = this.mainService.getUnitSubject().subscribe(
      (data) => {
        console.log('UNITS CHANGING!!!!!');
        // console.log(this.user.roles);
        console.log('Fit check result: ' + this.fitCheck());
        if (this.fitCheck()) {
          console.log('This fits...');
          this.formDisplay = true;
          this.printVolumeFit = true;
        } else {
          console.log("This doesn't...");

          this.formDisplay = false;
          this.printVolumeFit = false;
        }
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
        if (!this.freeUser) {
          console.log('Switching units:' + data);
          this.modelUnit = data;

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
          this.modelCost = 0.0;
        }
        this.totalCost =
          Math.round(this.modelCost * this.model.quantity * 100) / 100;
      },
      (error) => {
        console.error('error in unit change', error);
      }
    );

    this.onUnitSelect();
    this.authService.updateUser();
  }

  ngOnDestroy(): void {
    this.unitSub.unsubscribe();
    this.userSub.unsubscribe();
    if (this.model.modelPath) this.engServ.cleanup();
  }

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

  dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)

      if (ev.dataTransfer.items[0].kind === 'file') {
        var file = ev.dataTransfer.items[0].getAsFile();
        console.log('test');
        console.log('... file[' + 0 + '].name = ' + file.name);
        this.uploadService
          .upload(
            file.name,
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
    }

    this.onFilePicked(ev);
  }

  dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  fitCheck(): boolean {
    const dimensions = this.engServ.getBoundingBoxDimensions();
    console.log(
      `Checking fit...\nDimensions: ${JSON.stringify(
        dimensions
      )}\nUnits: ${JSON.stringify(
        this.model.units
      )}\nPrint Volume: ${JSON.stringify(this.markforgedPrintVolume)}`
    );
    let fit: boolean;
    console.log(this.model.units);
    switch (this.model.units) {
      case 'mm':
        console.log("It's mm!");
        if (
          dimensions.x > this.markforgedPrintVolume.mm[0] ||
          dimensions.y > this.markforgedPrintVolume.mm[1] ||
          dimensions.z > this.markforgedPrintVolume.mm[2]
        ) {
          console.log("Doesn't fit :(");

          fit = false;
        } else {
          console.log('Does fit :)');
          fit = true;
        }
        break;
      case 'cm':
        console.log('Units are cm');
        if (
          dimensions.x > this.markforgedPrintVolume.cm[0] ||
          dimensions.y > this.markforgedPrintVolume.cm[1] ||
          dimensions.z > this.markforgedPrintVolume.cm[2]
        ) {
          fit = false;
          console.log("doesn't fit");
        } else {
          fit = true;
          console.log('fits');
        }
        break;
      case 'in':
        console.log('units are in');
        if (
          dimensions.x > this.markforgedPrintVolume.in[0] ||
          dimensions.y > this.markforgedPrintVolume.in[1] ||
          dimensions.z > this.markforgedPrintVolume.in[2]
        ) {
          fit = false;
          console.log("doesn't fit");
        } else {
          fit = true;
          console.log('fits');
        }
        break;
    }
    console.log('END OF FIT\n===============\n Result: ' + fit);
    return fit;
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
            if (this.fitCheck()) {
              this.formDisplay = true;
              this.printVolumeFit = true;
            } else {
              this.formDisplay = false;
              this.printVolumeFit = false;
            }
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
      console.log(this.model, image, this.modelCost, this.boundingVolume);
      this.cartService.addCartItem(
        this.model,
        image,
        this.modelCost,
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
