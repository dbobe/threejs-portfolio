import * as THREE from "three";
import Physics from "./Physics";
import App from "../App";

export default class Environment {
  app: App;
  scene: THREE.Scene | undefined;
  directionalLight: THREE.DirectionalLight | undefined;
  cubeMesh: THREE.Mesh | undefined;
  cubeMesh2: THREE.Mesh | undefined;
  physics: Physics | undefined;

  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world?.physics;

    this.loadEnvironment();
    this.addMeshes();
  }

  loadEnvironment() {
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene?.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(1, 1, 1);
    this.scene?.add(this.directionalLight);
  }

  addMeshes() {
    const group = new THREE.Group();
    group.position.y = 10;
    this.scene?.add(group);
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 30, 16);
    const material = new THREE.MeshStandardMaterial({ color: "blue" });
    this.cubeMesh = new THREE.Mesh(geometry, material);
    this.cubeMesh.position.y = 10;
    this.cubeMesh.rotation.x = 0.5;
    this.cubeMesh.rotation.z = 0.5;
    this.cubeMesh.scale.set(1, 2, 3);
    group.add(this.cubeMesh);
    this.physics?.add(this.cubeMesh, "dynamic", "trimesh");

    this.cubeMesh2 = new THREE.Mesh(geometry, material);
    this.cubeMesh2.position.y = 10;
    this.cubeMesh2.position.x = 5;
    this.cubeMesh2.rotation.x = 0.5;
    this.cubeMesh2.rotation.z = 0.5;
    group.add(this.cubeMesh2);
    this.physics?.add(this.cubeMesh2, "dynamic", "trimesh");

    const groundGeometry = new THREE.BoxGeometry(20, 1, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: "turquoise",
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    this.scene?.add(groundMesh);
    this.physics?.add(groundMesh, "fixed", "cuboid");
  }
}
