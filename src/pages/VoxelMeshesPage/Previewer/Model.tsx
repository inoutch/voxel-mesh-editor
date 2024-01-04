import { decode } from "base64-arraybuffer";
import { useEffect, useMemo } from "react";
import { VOXEL_SCALE } from "../../../constants/voxel";
import { useGLTFLoader } from "../../../modules/useGLTFLoader";
import { useSettings } from "../../../modules/useSettings";

interface ModelProps {
  names: string[];
}

export const Model: React.FC<ModelProps> = ({ names }) => {
  const [settings] = useSettings();
  const settingsBundle = useMemo(() => {
    switch (settings.model.type) {
      case "url":
        return {
          url: settings.model.url,
          base64: undefined,
        };
      case "bytes":
        return {
          url: undefined,
          base64: settings.model.base64,
        };
    }
  }, [settings]);
  const gltfArrayBuffer = useMemo(() => {
    if (settingsBundle.base64) {
      return decode(settingsBundle.base64);
    }
  }, [settingsBundle.base64]);
  const gltf = useGLTFLoader(settingsBundle.url || gltfArrayBuffer);

  const nameSet = useMemo(() => {
    return new Set<string>(names);
  }, [names]);

  useEffect(() => {
    if (!gltf) {
      return;
    }
    for (const child of gltf.scene.children) {
      child.visible = nameSet.has(child.name);
    }
  }, [nameSet, gltf]);

  if (!gltf) {
    return null;
  }
  return (
    <primitive
      object={gltf.scene}
      scale={[VOXEL_SCALE, VOXEL_SCALE, VOXEL_SCALE]}
    />
  );
};
