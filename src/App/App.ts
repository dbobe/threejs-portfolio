import * as THREE from "three";
import Camera from "./Camera";

let instance: App | null = null;

export default class App {
  canvas!: HTMLCanvasElement;
  scene!: THREE.Scene;
  camera!: Camera;
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.canvas = document.querySelector("canvas.threejs") as HTMLCanvasElement;
    this.scene = new THREE.Scene();
    this.camera = new Camera();
  }
}
