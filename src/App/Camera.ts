import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { sizesStore } from "./Utils/Store";

import App from "./App";

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

    this.setInstance();
    this.setControls();
    this.setResizeListener();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      600
    );
    this.instance.position.z = 100;
    this.instance.position.y = 20;
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
