import * as THREE from "three";
import App from "./App";
import Camera from "./Camera";
import { sizesStore } from "./Utils/Store";
export default class Renderer {
  instance: THREE.WebGLRenderer | undefined;
  app: App;
  canvas: HTMLCanvasElement | undefined;
  scene: THREE.Scene | undefined;
  camera: Camera | undefined;
  sizes: { width: number; height: number; pixelRatio: number };
  sizesStore: any;

  constructor() {
    this.app = new App();
    this.canvas = this.app.canvas;
    this.scene = this.app.scene;
    this.camera = this.app.camera!;
    this.sizesStore = sizesStore;
    this.sizes = this.sizesStore.getState();

    this.setInstance();
    this.setResizeListener();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  setResizeListener() {
    this.sizesStore.subscribe((sizes: any) => {
      this.instance!.setSize(sizes.width, sizes.height);
      this.instance!.setPixelRatio(sizes.pixelRatio);
    });
  }

  loop() {
    this.instance?.render(this.scene!, this.camera!.instance!);
  }
}
