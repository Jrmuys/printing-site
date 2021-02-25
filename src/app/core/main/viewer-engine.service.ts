import { Subscription } from 'rxjs';
import { MainService } from './main.service';
import * as THREE from 'three';
import {
  Injectable,
  OnDestroy,
  NgZone,
  ElementRef,
  OnInit,
} from '@angular/core';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Triangle, WireframeGeometry } from 'three';

@Injectable({
  providedIn: 'root',
})
export class ViewerEngineService implements OnInit, OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private loader: STLLoader;
  private geometry: THREE.BufferGeometry;
  private material: THREE.MeshPhongMaterial;

  private width: number;
  private height: number;
  private boxLines: THREE.LineSegments;

  private loading: Boolean;

  private model: THREE.Mesh;

  private frameId: number = null;
  spotlight: THREE.SpotLight;

  private controls: OrbitControls;
  private boundingDimesions$;
  private unitSub: Subscription;

  public constructor(private ngZone: NgZone, private mainServ: MainService) {}

  ngOnInit() {}

  public getBoundingDimensionsListener() {
    return this.boundingDimesions$.asObservable();
  }

  fancy = true;
  public setGraphics(fancy: boolean) {
    this.fancy = fancy;
  }

  public testLoadSTL(path: string): Promise<any> {
    return new Promise((resolve) => {
      const loader = new STLLoader();
      loader.load(
        path,
        () => {
          console.log('(viewer-engine) stl valid');
          resolve(true);
        },
        () => {},
        () => resolve(false)
      );
    });
  }
  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public getVolumeService() {
    return this.getVolume();
  }

  public createScene(
    canvas: ElementRef<HTMLCanvasElement>,
    filePath: string,
    callback
  ): void {
    this.unitSub = this.mainServ.getUnitSubject().subscribe((unit) => {
      if (this.boxLines) {
        this.scene.remove(this.boxLines);
      }
      let markforgedPrintVolume = {
        mm: [320, 132, 154],
        cm: [32, 13.2, 15.4],
        in: [12.6, 5.2, 6.06],
      };
      let boxSize;
      switch (unit) {
        case 'mm':
          boxSize = markforgedPrintVolume.mm;
          break;
        case 'cm':
          boxSize = markforgedPrintVolume.cm;
          break;
        case 'in':
          boxSize = markforgedPrintVolume.in;
          break;
        default:
          console.error('Invalid Unit!');
          break;
      }
      let boxGeometry = new THREE.BoxBufferGeometry(
        boxSize[0],
        boxSize[1],
        boxSize[2],
        1,
        1,
        1
      );
      let boxEdges = new THREE.EdgesGeometry(boxGeometry);
      let boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      let boxWireframe = new THREE.WireframeGeometry(boxGeometry);
      this.boxLines = new THREE.LineSegments(
        boxEdges,
        new THREE.LineBasicMaterial({ color: 0xff0000 })
      );

      let boxObject = new THREE.Mesh(boxWireframe, boxMaterial);
      this.scene.add(this.boxLines);
    });
    // The first step is to get the reference of the canvas element from our HTML document
    console.log('(viewer-engine) createScene... \ncanvas:', canvas);
    this.canvas = canvas.nativeElement;

    this.width = document
      .getElementById('engine')
      .getBoundingClientRect().width;

    this.height =
      document.getElementById('engine').getBoundingClientRect().width - 16;
    if (this.height > 768) {
      this.height = 768;
    }
    console.log(
      '(viewer-engine) Width: ' + this.width + ' Height: ' + this.height
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background
      antialias: true, // smooth edges
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(this.width, this.height);
    if (this.fancy) {
      this.renderer.toneMapping = THREE.ReinhardToneMapping; // create the scene
      this.renderer.toneMappingExposure = 2.3;
      this.renderer.shadowMap.enabled = true;
    }
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.resize();
    this.camera.position.z = 50;
    this.camera.position.y = 50;
    this.camera.position.x = 50;
    this.scene.add(this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // soft white light
    if (this.fancy) {
      this.spotlight = new THREE.SpotLight(0xfffbf2, 4);

      this.spotlight.castShadow = true;
      this.spotlight.shadow.bias = -0.0001;
      this.spotlight.shadow.mapSize.width = 1024 * 4;
      this.spotlight.shadow.mapSize.height = 1024 * 4;
      this.scene.add(this.spotlight);
    }
    // spotlight.position.z = 1;
    // spotlight.position.x = 5;
    // spotlight.position.y = 3;

    this.scene.add(new THREE.HemisphereLight(0xe0f3ff, 0x080808, 4.0));

    // this.model = new THREE.Mesh(geometry, material);

    this.loader = new STLLoader();
    this.loading = true;
    this.loader.load(filePath, (geometry) => {
      var material = new THREE.MeshPhongMaterial({
        color: 0x333333,
        specular: 50,
        shininess: 0,
      });
      console.log('(viewer-engine) Test');
      geometry.scale(1, 1, 1);
      this.geometry = geometry;
      this.material = material;
      console.log('(viewer-engine) Volume: ' + Math.round(this.getVolume()));
      this.model = new THREE.Mesh(this.geometry, this.material);
      var center = new THREE.Vector3();
      if (this.fancy) {
        this.model.receiveShadow = true;
        this.model.castShadow = true;
      }
      this.model.geometry.center();
      this.scene.add(this.model);
      // this.model.rotation.x += 4;
      // this.model.rotation.y += 41;
      var boundingBox = new THREE.BoxHelper(this.model, 0xff0000);
      // this.scene.add(boundingBox);
      this.camera.lookAt(this.model.position);

      this.resize();
      this.loading = false;
      this.getBoundingBoxVolume();
      console.log(this.getSurfaceArea());
      callback();
    });

    console.log('(viewer-engine) Model added');
  }

  signedVolumeOfTriangle(p1, p2, p3): number {
    return p1.dot(p2.cross(p3)) / 6.0;
  }

  public getVolume(): number {
    let position = this.geometry.attributes.position as THREE.BufferAttribute;
    let faces = position.count / 3;
    let sum = 0;
    let p1 = new THREE.Vector3(),
      p2 = new THREE.Vector3(),
      p3 = new THREE.Vector3();
    for (let i = 0; i < faces; i++) {
      p1.fromBufferAttribute(position, i * 3 + 0);
      p2.fromBufferAttribute(position, i * 3 + 1);
      p3.fromBufferAttribute(position, i * 3 + 2);
      sum += this.signedVolumeOfTriangle(p1, p2, p3);
    }
    return sum;
  }

  public getBoundingDimensions() {
    const bbox = new THREE.Box3().setFromObject(this.model);
    const bboxSize = new THREE.Vector3();
    bbox.getSize(bboxSize);
    return { x: bboxSize.x, y: bboxSize.y, z: bboxSize.z };
  }

  public getBoundingBoxVolume() {
    const bbox = new THREE.Box3().setFromObject(this.model);
    const bboxSize = new THREE.Vector3();
    bbox.getSize(bboxSize);
    console.log(bboxSize);
    return bboxSize.x * bboxSize.y * bboxSize.z;
  }

  public getBoundingBoxDimensions() {
    const bbox = new THREE.Box3().setFromObject(this.model);
    const bboxSize = new THREE.Vector3();
    bbox.getSize(bboxSize);
    return bboxSize;
  }

  public getSurfaceArea() {
    let position = this.geometry.attributes.position as THREE.BufferAttribute;
    let faces = position.count / 3;
    let sum = 0;
    let p1 = new THREE.Vector3(),
      p2 = new THREE.Vector3(),
      p3 = new THREE.Vector3();
    for (let i = 0; i < faces; i++) {
      p1.fromBufferAttribute(position, i * 3 + 0);
      p2.fromBufferAttribute(position, i * 3 + 1);
      p3.fromBufferAttribute(position, i * 3 + 2);
      let triangle = new Triangle(p1, p2, p3);
      sum += triangle.getArea();
    }
    return sum;
  }

  public animate(): void {
    // This is run this outside angular zones
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        this.loading = true;
        window.addEventListener('DOMContentLoaded', () => {
          this.loading = false;
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    try {
      this.controls.update();
      if (this.spotlight) {
        this.spotlight.position.set(
          this.camera.position.x + 10,
          this.camera.position.y + 10,
          this.camera.position.z + 10
        );
      }
      this.frameId = requestAnimationFrame(() => {
        this.render();
      });

      // this.model.rotation.x += 0.01;
      // this.model.rotation.y += 0.01;

      this.renderer.render(this.scene, this.camera);
    } catch (error) {
      console.warn('STL not loaded: ' + error);
    }
  }

  public resize(): void {
    this.width =
      document.getElementById('engine').getBoundingClientRect().width - 35;
    this.height =
      document.getElementById('engine').getBoundingClientRect().width - 16;
    if (this.height > 650) {
      this.height = 650;
    }
    const width = window.innerWidth / 2;
    const height = window.innerHeight / 2;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  public cleanup() {
    this.scene.remove(this.model);
    // clean up
    this.geometry.dispose();
    this.material.dispose();
  }
  public snapshot(): File {
    return this.blobToFile(
      this.convertDataUrlToBlob(this.renderer.domElement.toDataURL()),
      'snapshot'
    );
  }

  convertDataUrlToBlob(dataUrl): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  };
}
