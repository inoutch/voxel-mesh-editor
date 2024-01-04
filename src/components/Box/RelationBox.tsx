import React from "react";
import { VoxelMeshRelation } from "../../modules/voxel/types";
import { Box } from "./Box";

interface RelationBoxProps {
  relation: VoxelMeshRelation;
}

export const RelationBox: React.FC<RelationBoxProps> = ({ relation }) => {
  const getColor = () => {
    switch (relation.type) {
      case "voxelName":
        return "red";
      case "groupName":
        return "green";
      case "hider":
        return "grey";
      case "!voxelName":
        return "red";
      case "!groupName":
        return "green";
      case "!voxelName&hider":
        return "red";
      case "!groupName&hider":
        return "green";
      case "!hider":
        return "grey";
      case "none":
        return "white";
    }
  };
  const getWireframe = () => {
    switch (relation.type) {
      case "voxelName":
      case "groupName":
      case "hider":
        return false;
      default:
        return true;
    }
  };
  return (
    <Box
      gridPosition={{ x: relation.x, y: relation.y, z: relation.z }}
      color={getColor()}
      wireframe={getWireframe()}
    />
  );
};
