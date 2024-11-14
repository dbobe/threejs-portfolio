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
  cubeMesh: THREE.Mesh | undefined;
  groundRigidBody: RigidBody | undefined;
  cubeMesh2: THREE.Mesh | undefined;
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

  add(mesh: THREE.Mesh, type: string, collider: string) {
    // define rigid body type
    let rigidBodyType;
    if (type === "dynamic") {
      rigidBodyType = this.rapier.RigidBodyDesc.dynamic();
    } else if (type === "fixed") {
      rigidBodyType = this.rapier.RigidBodyDesc.fixed();
    }
    this.rigidBody = this.world?.createRigidBody(rigidBodyType);

    // define collider type
    let colliderType;
    switch (collider) {
      case "cuboid":
        const dimensions = this.computeCuboidDimensions(mesh);
        colliderType = this.rapier.ColliderDesc.cuboid(
          dimensions.x / 2,
          dimensions.y / 2,
          dimensions.z / 2
        );
        break;
      case "ball":
        const radius = this.computeBallDimensions(mesh);
        colliderType = this.rapier.ColliderDesc.ball(radius);
        break;
      case "trimesh":
        const { vertices, indices } = this.computeTrimeshDimensions(mesh);
        colliderType = this.rapier.ColliderDesc.trimesh(vertices, indices);
        break;
      case "capsule":
        break;
    }
    this.world?.createCollider(colliderType, this.rigidBody);

    // set rigid body position and rotation
    const worldPosition = mesh.getWorldPosition(new THREE.Vector3());
    const worldRotation = mesh.getWorldQuaternion(new THREE.Quaternion());
    this.rigidBody?.setTranslation(worldPosition, true);
    this.rigidBody?.setRotation(worldRotation, true);

    this.meshMap.set(mesh, this.rigidBody);
  }

  computeCuboidDimensions(mesh: THREE.Mesh) {
    mesh.geometry.computeBoundingBox();
    const size = mesh.geometry.boundingBox!.getSize(new THREE.Vector3());
    const worldScale = mesh.getWorldScale(new THREE.Vector3());
    size.multiply(worldScale);
    return size;
  }

  computeBallDimensions(mesh: THREE.Mesh) {
    mesh.geometry.computeBoundingSphere();
    const radius = mesh.geometry.boundingSphere!.radius;
    const worldScale = mesh.getWorldScale(new THREE.Vector3());
    const maxScale = Math.max(worldScale.x, worldScale.y, worldScale.z);
    return radius * maxScale;
  }

  computeTrimeshDimensions(mesh: THREE.Mesh) {
    const vertices = mesh.geometry.attributes.position.array;
    const indices = mesh.geometry.index?.array;
    const worldScale = mesh.getWorldScale(new THREE.Vector3());

    const scaledVertices = vertices.map((vertex, index) => {
      return vertex * worldScale.getComponent(index % 3);
    });
    return { vertices: scaledVertices, indices };
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
