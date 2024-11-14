import * as THREE from "three";

import App from "../App";
import Physics from "./Physics";
import Environment from "./Environment";
import { appStateStore } from "../Utils/Store";

export default class World {
  app: App;
  scene: THREE.Scene;
  cubeMesh: THREE.Mesh | undefined;
  physics: Physics;
  environment: Environment | undefined;

  constructor() {
    this.app = new App();
    this.scene = this.app.scene!;

    // create world classes
    this.physics = new Physics();
    appStateStore.subscribe((state) => {
      if (state.physicsReady) {
        this.environment = new Environment();
      }
    });

    this.loop();
  }

  loop(deltaTime: number, elapsedTime: number) {
    this.physics.loop();
  }
}
