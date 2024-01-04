import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { VOXEL_SCALE, VOXEL_SIZE } from "../../../constants/voxel";

export const Camera = () => {
  const cameraControlRef = useRef<CameraControls>(null);

  useEffect(() => {
    cameraControlRef.current?.setTarget(
      (VOXEL_SIZE * VOXEL_SCALE) / 2,
      0.0,
      (VOXEL_SIZE * VOXEL_SCALE) / 2,
    );
    cameraControlRef.current?.setPosition(
      (VOXEL_SIZE * VOXEL_SCALE) / 2,
      10,
      10,
    );
  }, []);

  return <CameraControls ref={cameraControlRef} />;
};
