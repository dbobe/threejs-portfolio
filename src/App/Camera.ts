import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import App from "./App";
import { sizesStore } from "./Utils/Store";

export default class Camera {
  instance: THREE.PerspectiveCamera | undefined;
  app: App;
  canvas: HTMLCanvasElement;
  controls: OrbitControls | undefined;
  sizes: { width: number; height: number; pixelRatio: number };
  sizesStore: any;
  constructor() {
    this.app = new App();
    this.canvas = this.app.canvas!;
    this.sizesStore = sizesStore;
    this.sizes = this.sizesStore.getState();
    console.log(this.sizes);
    this.setInstance();
    this.setControls();
    this.setResizeListener();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      200
    );
    this.instance.position.z = 5;
  }

  setControls() {
    this.controls = new OrbitControls(this.instance!, this.canvas);
    this.controls.enableDamping = true;
  }

  setResizeListener() {
    this.sizesStore.subscribe((sizes: any) => {
      this.instance!.aspect = sizes.width / sizes.height;
      this.instance!.updateProjectionMatrix();
    });
  }

  loop() {
    this.controls?.update();
  }
}
