import { useEffect, useState } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const useGLTFLoader = (data: ArrayBuffer | string | undefined) => {
  const [gltf, setGltf] = useState<GLTF>();

  useEffect(() => {
    const loader = new GLTFLoader();
    if (typeof data === "string") {
      return loader.load(data, (gltf) => {
        setGltf(gltf);
      });
    }
    if (data instanceof ArrayBuffer) {
      return loader.parse(data, "/", (gltf) => {
        setGltf(gltf);
      });
    }
  }, [data]);

  return gltf;
};
