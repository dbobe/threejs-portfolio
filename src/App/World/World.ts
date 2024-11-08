import * as THREE from "three";
import App from "../App";

export default class World {
  app: App;
  scene: THREE.Scene;
  cubeMesh: THREE.Mesh | undefined;

  constructor() {
    this.app = new App();
    this.scene = this.app.scene!;

    this.setCube();
  }

  setCube() {
    this.cubeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.scene.add(this.cubeMesh);
  }
  loop() {
    if (this.cubeMesh) {
      this.cubeMesh.rotation.y += 0.01;
    }
  }
}
