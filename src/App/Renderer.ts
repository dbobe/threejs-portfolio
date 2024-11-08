import * as THREE from "three";
import App from "./App";
import Camera from "./Camera";
export default class Renderer {
  instance: THREE.WebGLRenderer | undefined;
  app: App;
  canvas: HTMLCanvasElement | undefined;
  scene: THREE.Scene | undefined;
  camera: Camera | undefined;
  constructor() {
    this.app = new App();
    this.canvas = this.app.canvas;
    this.scene = this.app.scene;
    this.camera = this.app.camera!;
    this.setInstance();
  }
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.setSize(window.innerWidth, window.innerHeight);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  loop() {
    this.instance?.render(this.scene!, this.camera!.instance!);
  }
}
