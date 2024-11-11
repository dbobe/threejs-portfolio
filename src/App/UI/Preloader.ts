import assetStore from "../Utils/AssetStore";

export default class Preloader {
  assetStore: any;
  numberOfLoadedAssets: number = 0;
  numberOfAssetsToLoad: number = 0;
  progress: number = 0;
  overlay: HTMLDivElement | null;
  loading: HTMLHeadingElement | null;
  startButton: HTMLButtonElement | null;

  constructor() {
    this.assetStore = assetStore;

    // access dom elements
    this.overlay = document.querySelector(".overlay");
    this.loading = document.querySelector(".loading");
    this.startButton = document.querySelector(".start");
    const progressElement = document.getElementById("progressPercentage");

    this.assetStore.subscribe((state: any) => {
      console.log(state.loadedAssets);

      this.numberOfLoadedAssets = Object.keys(state.loadedAssets || {}).length;
      this.numberOfAssetsToLoad = state.assetsToLoad?.length || 0;
      if (this.numberOfAssetsToLoad > 0) {
        this.progress = this.numberOfLoadedAssets / this.numberOfAssetsToLoad;
        if (progressElement) {
          progressElement.innerHTML = Math.trunc(
            this.progress * 100
          ).toString();
        }
        console.log(this.progress * 100 + "%");
      }
      if (this.progress === 1) {
        console.log("Done");
        this.loading?.classList.add("fade");
        window.setTimeout(() => {
          this.ready();
        }, 1200);
      }
    });
  }

  ready() {
    this.loading!.remove();
    this.startButton!.style.display = "inline";
    this.startButton!.classList.add("fadeIn");

    this.startButton!.addEventListener(
      "click",
      () => {
        console.log("clicked");
        this.overlay!.classList.add("fade");
        this.startButton!.classList.add("fadeOut");

        window.setTimeout(() => {
          this.overlay!.remove();
          this.startButton!.remove();
        }, 2000);
      },
      { once: true }
    );
  }
}
