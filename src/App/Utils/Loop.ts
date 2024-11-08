import App from "../App";
import Camera from "../Camera";
import Renderer from "../Renderer";
import World from "../World/World";
export default class Loop {
  app: App;
  camera: Camera;
  renderer: Renderer;
  world: World;
  constructor() {
    this.app = new App();
    this.camera = this.app.camera!;
    this.renderer = this.app.renderer!;
    this.world = this.app.world!;
    console.log(this.world);

    this.loop();
  }
  loop() {
    this.world.loop();
    this.camera.loop();
    this.renderer.loop();
    window.requestAnimationFrame(() => {
      this.loop();
    });
  }
}
