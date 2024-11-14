import * as THREE from "three";
import type { World, RigidBody } from "@dimforge/rapier3d";
import App from "../App";
import { appStateStore } from "../Utils/Store";

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
  groundRigidBody: RigidBody | undefined;
  cubeMesh2:
    | THREE.Mesh<
        THREE.BoxGeometry,
        THREE.MeshStandardMaterial,
        THREE.Object3DEventMap
      >
    | undefined;
  rigidBody2: RigidBody | undefined;
  rapier: any;
  meshMap: Map<any, any>;

  constructor() {
    this.app = new App();
    this.scene = this.app.scene;

    this.meshMap = new Map();

    import("@dimforge/rapier3d").then((RAPIER) => {
      this.rapier = RAPIER;
      const gravity = new RAPIER.Vector3(0, -9.81, 0);
      this.world = new RAPIER.World(gravity);

      this.rapierLoaded = true;
      appStateStore.setState({ physicsReady: true });
    });
  }

  add(mesh: THREE.Mesh, type: string) {
    let rigidBodyType;
    if (type === "dynamic") {
      rigidBodyType = this.rapier.RigidBodyDesc.dynamic();
    } else if (type === "fixed") {
      rigidBodyType = this.rapier.RigidBodyDesc.fixed();
    }
    this.rigidBody = this.world?.createRigidBody(rigidBodyType);
    const worldPosition = mesh.getWorldPosition(new THREE.Vector3());
    const worldRotation = mesh.getWorldQuaternion(new THREE.Quaternion());
    this.rigidBody?.setTranslation(worldPosition, true);
    this.rigidBody?.setRotation(worldRotation, true);

    // autoCompute collider dimensions
    const dimensions = this.computeCuboidDimensions(mesh);

    const colliderType = this.rapier.ColliderDesc.cuboid(
      dimensions.x / 2,
      dimensions.y / 2,
      dimensions.z / 2
    );
    this.world?.createCollider(colliderType, this.rigidBody);

    this.meshMap.set(mesh, this.rigidBody);
  }

  computeCuboidDimensions(mesh: THREE.Mesh) {
    mesh.geometry.computeBoundingBox();
    const size = mesh.geometry.boundingBox!.getSize(new THREE.Vector3());
    const worldScale = mesh.getWorldScale(new THREE.Vector3());
    size.multiply(worldScale);
    return size;
  }

  loop() {
    if (!this.rapierLoaded) return;
    this.world?.step();

    this.meshMap.forEach((rigidBody, mesh) => {
      // const position = rigidBody?.translation();
      const position = new THREE.Vector3().copy(rigidBody?.translation());
      const rotation = new THREE.Quaternion().copy(rigidBody?.rotation());

      position.applyMatrix4(
        new THREE.Matrix4().copy(mesh.parent!.matrixWorld).invert()
      );

      const inverseParentMatrix = new THREE.Matrix4()
        .extractRotation(mesh.parent!.matrixWorld)
        .invert();
      const inverseParentRotation =
        new THREE.Quaternion().setFromRotationMatrix(inverseParentMatrix);
      rotation.premultiply(inverseParentRotation);

      mesh.position.copy(position!);
      mesh.quaternion.copy(rotation!);
    });
  }
}
