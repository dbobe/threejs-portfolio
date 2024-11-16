import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Loop from "./Utils/Loop";
import World from "./World/World";
import Resize from "./Utils/Resize";
import AssetLoader from "./Utils/AssetLoader";
import Preloader from "./UI/Preloader";
import InputController from "./UI/InputController";

let instance: App | null = null;

export default class App {
  canvas: HTMLCanvasElement | undefined;
  scene: THREE.Scene | undefined;
  camera: Camera | undefined;
  renderer: Renderer | undefined;
  loop: Loop | undefined;
  world: World | undefined;
  resize: Resize | undefined;
  assetLoader: AssetLoader | undefined;
  preloader: Preloader | undefined;
  inputController: InputController | undefined;

  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    // threejs elements
    this.canvas = document.querySelector("canvas.threejs") as HTMLCanvasElement;
    this.scene = new THREE.Scene();

    // Asset Loader
    this.assetLoader = new AssetLoader();

    // UI elements
    this.preloader = new Preloader();
    this.inputController = new InputController();

    // world element
    this.world = new World();

    // Camera and Renderer
    this.camera = new Camera();
    this.renderer = new Renderer();

    // extra utils
    this.loop = new Loop();
    this.resize = new Resize();
  }
}
