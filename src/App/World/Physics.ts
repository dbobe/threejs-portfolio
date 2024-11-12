import * as THREE from "three";
import App from "../App";
import type { World, RigidBody } from "@dimforge/rapier3d";

export default class Physics {
  app: App;
  scene: THREE.Scene | undefined;
  world: World | undefined;
  rigidBody: RigidBody | undefined;
  rapierLoaded: boolean = false;
  cubeMesh:
    | THREE.Mesh<
        THREE.BoxGeometry,
        THREE.MeshStandardMaterial,
        THREE.Object3DEventMap
      >
    | undefined;

  constructor() {
    this.app = new App();
    this.scene = this.app.scene;

    import("@dimforge/rapier3d").then((RAPIER) => {
      const gravity = new RAPIER.Vector3(0, -9.81, 0);
      this.world = new RAPIER.World(gravity);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: "blue" });
      this.cubeMesh = new THREE.Mesh(geometry, material);
      this.scene?.add(this.cubeMesh);

      // rigid body
      const rigidBodyType = RAPIER.RigidBodyDesc.dynamic();
      this.rigidBody = this.world.createRigidBody(rigidBodyType);

      // collider
      const colliderType = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
      this.world.createCollider(colliderType, this.rigidBody);

      this.rapierLoaded = true;
    });
  }

  loop() {
    if (!this.rapierLoaded) return;
    this.world?.step();

    const position = this.rigidBody?.translation();
    const rotation = this.rigidBody?.rotation();
    this.cubeMesh?.position.copy(position!);
    this.cubeMesh?.quaternion.copy(rotation!);
  }
}
