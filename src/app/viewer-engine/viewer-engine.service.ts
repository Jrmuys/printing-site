import * as THREE from 'three';
import { Injectable, OnDestroy, NgZone, ElementRef } from '@angular/core';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Injectable({
  providedIn: 'root',
})
export class ViewerEngineService implements OnDestroy {
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

  private loading: Boolean;

  private model: THREE.Mesh;

  private frameId: number = null;

  public constructor(private ngZone: NgZone) {}

  private controls: OrbitControls;

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public getVolumeService() {
    return this.getVolume(this.geometry);
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.width = document
      .getElementById('engine')
      .getBoundingClientRect().width;

    this.height =
      document.getElementById('engine').getBoundingClientRect().width - 16;
    if (this.height > 768) {
      this.height = 768;
    }
    console.log('Width: ' + this.width + ' Height: ' + this.height);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(this.width, this.height);

    // create the scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.resize();
    this.camera.position.z = 5;
    this.scene.add(this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 10;
    this.scene.add(this.light);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

    // this.model = new THREE.Mesh(geometry, material);

    this.loader = new STLLoader();
    this.loading = true;
    this.loader.load('./assets/20mm_cube.stl', (geometry) => {
      var material = new THREE.MeshPhongMaterial({
        color: 0x99ff99,
        specular: 50,
        shininess: 50,
      });
      console.log('Test');
      geometry.scale(0.1, 0.1, 0.1);
      this.geometry = geometry;
      this.material = material;
      console.log('Volume: ' + Math.round(this.getVolume(this.geometry)));
      // this.scene.add(mesh);
      this.model = new THREE.Mesh(this.geometry, this.material);
      // this.model.position.set(0, 0, 0);
      var center = new THREE.Vector3();

      this.model.geometry.center();
      this.scene.add(this.model);
      this.camera.lookAt(this.model.position);
      this.model.rotation.x += 4;
      this.model.rotation.y += 41;
      this.resize();
      this.loading = false;
    });

    // const geometry = new THREE.BoxGeometry(1, 2, 1);
    // const material = new THREE.MeshPhongMaterial({
    //   color: 0x999999,
    //   specular: 50,
    //   shininess: 50,
    // });

    console.log('Model added');
  }

  signedVolumeOfTriangle(p1, p2, p3): number {
    return p1.dot(p2.cross(p3)) / 6.0;
  }

  public getVolume(geometry): number {
    let position = geometry.attributes.position;
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

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
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
}
