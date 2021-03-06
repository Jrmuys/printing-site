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

  debug: boolean = true;

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
        if (this.debug) {
          console.log('(main-component) test USEUSEUE');
        }
        if (user.roles.find((role) => role === 'freeUser')) {
          if (this.debug) {
            console.log('(main-component) Free user');
          }
          this.freeUser = true;
        } else {
          this.freeUser = false;
          if (this.debug) {
            console.log('(main-component) Not a free user');
          }
        }
        if (this.debug) {
          console.log(
            `Old user:${JSON.stringify(this.user)}, New user: ${JSON.stringify(
              user
            )}`
          );
        }
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
    if (this.debug) {
      console.log('(main-component) INIT');
    }
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
    this.unitSub = this.mainService.unitSubject$.subscribe(
      (data) => {
        this.unitChangeCB(data);
      }
      // (error) => {
      //   console.error('error in unit change', error);
      // }
    );

    this.onUnitSelect();
    this.authService.updateUser();
  }

  private unitChangeCB(data: string) {
    if (this.debug) {
      console.log(
        '(main-component) Changing Units \n================================'
      );
    }
    if (this.model.id != null) {
      if (this.debug) {
        console.log('(main-component) --- ucCB: model exists');
      }
      // if (this.debug) { console.log(this.user.roles);
      if (this.debug) {
        console.log('(main-component) --- ucCB: doing fit check...');
      }
      if (this.fitCheck()) {
        if (this.debug) {
          console.log('(main-component) This fits...');
        }
        this.formDisplay = true;
        this.printVolumeFit = true;
      } else {
        if (this.debug) {
          console.log("(main-component) --- ucCB: This doesn't...");
        }

        this.formDisplay = true;
        this.printVolumeFit = false;
      }
      if (this.debug) {
        console.log('(main-component) --- ucCB: checking volume/sa for units');
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
          console.error('--- ucCB: Invalid Unit!');
      }
      if (this.debug) {
        console.log('(main-component) --- ucCB: Free user? ', this.freeUser);
      }
      if (!this.freeUser) {
        if (this.debug) {
          console.log('(main-component) --- ucCB: Switching units:' + data);
        }
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
      if (this.totalCost < 5.0) {
        this.totalCost = 5.0;
      }
    } else {
      if (this.debug) {
        console.log(
          '(main-component) --- ucCB: model does not exist, skipping callback'
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.unitSub.unsubscribe();
    this.userSub.unsubscribe();
    if (this.model.modelPath) this.engServ.cleanup();
  }

  onUnitSelect() {
    if (this.debug) {
      console.log(
        '(main-component) --- onUnitSelect(): Units have changed to ' +
          this.model.units +
          '!'
      );
    }
    this.mainService.unitChange(this.model.units);
  }

  updateTotal() {
    this.totalCost =
      Math.round(this.modelCost * this.model.quantity * 100) / 100;
  }

  onFilePicked(event: Event) {
    this.setGraphics(localStorage.getItem('graphics') != 'low');
    this.loading = true;

    if (this.debug) {
      console.log('(main-component) --- onFilePicked(): File picked');
    }
    const file = (event.target as HTMLInputElement).files[0];
    const name = file.name.split('.')[0];

    var progress = 0;
    if (this.debug) {
      console.log('(main-component) --- onFilePicked(): file:', file);
    }
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
          if (this.debug) {
            console.log('(main-component) --- onFilePicked(): error');
          }
          console.error(err);
        }
      );
  }

  dropHandler(ev) {
    if (this.debug) {
      console.log('(main-component) File(s) dropped');
    }

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)

      if (ev.dataTransfer.items[0].kind === 'file') {
        var file = ev.dataTransfer.items[0].getAsFile();
        if (this.debug) {
          console.log('(main-component) test');
        }
        if (this.debug) {
          console.log(
            '(main-component) ... file[' + 0 + '].name = ' + file.name
          );
        }
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
              if (this.debug) {
                console.log('(main-component) error');
              }
              console.error(err);
            }
          );
      }
    }

    this.onFilePicked(ev);
  }

  dragOverHandler(ev) {
    if (this.debug) {
      console.log('(main-component) File(s) in drop zone');
    }

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  fitCheck(): boolean {
    if (this.debug) {
      console.log('(main-component) --- fitCheck():', this.model.id);
    }
    if (this.model.id) {
      const dimensions = this.engServ.getBoundingBoxDimensions();
      if (this.debug) {
        console.log(
          `(main-component) --- fitCheck(): Checking fit...\nDimensions: ${JSON.stringify(
            dimensions
          )}\nUnits: ${JSON.stringify(
            this.model.units
          )}\nPrint Volume: ${JSON.stringify(this.markforgedPrintVolume)}`
        );
      }
      let fit: boolean;
      if (this.debug) {
        console.log(this.model.units);
      }
      switch (this.model.units) {
        case 'mm':
          if (this.debug) {
            console.log("(main-component) --- fitCheck(): It's mm!");
          }
          if (
            dimensions.x > this.markforgedPrintVolume.mm[0] ||
            dimensions.y > this.markforgedPrintVolume.mm[1] ||
            dimensions.z > this.markforgedPrintVolume.mm[2]
          ) {
            if (this.debug) {
              console.log("(main-component) --- fitCheck(): Doesn't fit :(");
            }

            fit = false;
          } else {
            if (this.debug) {
              console.log('(main-component) --- fitCheck(): Does fit :)');
            }
            fit = true;
          }
          break;
        case 'cm':
          if (this.debug) {
            console.log('(main-component) --- fitCheck(): Units are cm');
          }
          if (
            dimensions.x > this.markforgedPrintVolume.cm[0] ||
            dimensions.y > this.markforgedPrintVolume.cm[1] ||
            dimensions.z > this.markforgedPrintVolume.cm[2]
          ) {
            fit = false;
            if (this.debug) {
              console.log("(main-component) --- fitCheck(): doesn't fit");
            }
          } else {
            fit = true;
            if (this.debug) {
              console.log('(main-component) --- fitCheck(): fits');
            }
          }
          break;
        case 'in':
          if (this.debug) {
            console.log('(main-component) --- fitCheck(): units are in');
          }
          if (
            dimensions.x > this.markforgedPrintVolume.in[0] ||
            dimensions.y > this.markforgedPrintVolume.in[1] ||
            dimensions.z > this.markforgedPrintVolume.in[2]
          ) {
            fit = false;
            if (this.debug) {
              console.log("(main-component) --- fitCheck(): doesn't fit");
            }
          } else {
            fit = true;
            if (this.debug) {
              console.log('(main-component) --- fitCheck(): fits');
            }
          }
          break;
      }
      if (this.debug) {
        console.log(
          '(main-component) --- fitCheck(): END OF FIT\n==============================\n Result: ',
          fit
        );
      }
      return fit;
    } else {
      if (this.debug) {
        console.log('(main-component) --- fitCheck(): no model found');
      }
      return true;
    }
  }

  updateModel() {
    if (this.debug) {
      console.log('(main-component) updating model');
    }
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
    if (this.debug) {
      console.log(model.id);
    }
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
      if (this.debug) {
        console.log('(main-component) No model saved');
      }
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
        if (this.debug) {
          console.log('(main-component) STL is valid', valid);
        }
        if (this.debug) {
          console.log(
            '(main-component) Getting model with info: ' + JSON.stringify(res)
          );
        }
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
        if (this.debug) {
          console.log(valid);
        }
        console.error('STL is invalid');
      }
    });
  }

  onGraphicsPicked(value: string) {
    this.graphicsChanged = true;
    if (this.debug) {
      console.log('(main-component) setting Graphics to ', value);
    }
    localStorage.setItem('graphics', value);
  }

  setGraphics(fancy: boolean) {
    if (this.debug) {
      console.log('(main-component) setting graphics... ');
    }
    if (this.debug) {
      console.log('(main-component) to', fancy);
    }

    this.engServ.setGraphics(fancy);
  }

  addToCart() {
    this.updateModel();
    if (this.debug) {
      console.log(this.authService.getUser());
    }
    if (!this.authService.getUser()) {
      const dialogRef = this.signInDialog.open(SignInDialogComponent);
      dialogRef.afterClosed().subscribe((result) => {
        result ? this.router.navigate(['/login']) : console.log(closed);
      });
    } else {
      // let boundingVolume = this.engServ.getBoundingBoxVolume();
      if (this.debug) {
        console.log('(main-component) bounding volume: ', this.boundingVolume);
      }
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
      if (this.debug) {
        console.log(this.model, image, this.totalCost, this.boundingVolume);
      }
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
