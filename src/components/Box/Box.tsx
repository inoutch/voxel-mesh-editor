import React from "react";
import { VOXEL_SCALE, VOXEL_SIZE } from "../../constants/voxel";

interface BoxProps {
  gridPosition: { x: number; y: number; z: number };
  wireframe?: boolean;
  color?: string;
}

export const Box: React.FC<BoxProps> = ({ gridPosition, wireframe, color }) => {
  return (
    <mesh
      scale={VOXEL_SIZE * VOXEL_SCALE}
      position={[
        gridPosition.x * VOXEL_SIZE * VOXEL_SCALE,
        gridPosition.y * VOXEL_SIZE * VOXEL_SCALE +
          (VOXEL_SIZE * VOXEL_SCALE) / 2,
        gridPosition.z * VOXEL_SIZE * VOXEL_SCALE,
      ]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial wireframe={wireframe} color={color} />
    </mesh>
  );
};
