import { createStore } from "zustand/vanilla";

const assetsToLoad = [
  {
    path: "/textures/2k_earth_daymap.jpg",
    id: "earth",
    type: "texture",
  },
  {
    path: "/textures/2k_mars.jpg",
    id: "mars",
    type: "texture",
  },
  {
    path: "/textures/2k_mercury.jpg",
    id: "mercury",
    type: "texture",
  },
  {
    path: "/textures/2k_sun.jpg",
    id: "sun",
    type: "texture",
  },
];

const assetStore = createStore((set) => ({
  assetsToLoad,
  loadedAssets: {},
  addLoadedAsset: (asset: any, id: string) =>
    set((state: any) => ({
      loadedAssets: {
        ...state.loadedAssets,
        [id]: asset,
      },
    })),
}));

export default assetStore;
