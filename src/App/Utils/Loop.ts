import App from "../App";
import Camera from "../Camera";
import Renderer from "../Renderer";
export default class Loop {
  app: App;
  camera: Camera;
  renderer: Renderer;
  constructor() {
    this.app = new App();
    this.camera = this.app.camera!;
    this.renderer = this.app.renderer!;
    this.loop();
  }
  loop() {
    this.camera.loop();
    this.renderer.loop();
    window.requestAnimationFrame(() => {
      this.loop();
    });
  }
}
