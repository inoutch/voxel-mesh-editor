import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { VoxelMeshPart } from "../../../modules/voxel/types";

interface VoxelMeshPartListProps {
  selectedVoxelMeshPartName?: string;
  voxelMeshParts: VoxelMeshPart[];
  onSelect?: (value: VoxelMeshPart) => void;
}

export const VoxelMeshPartList: React.FC<VoxelMeshPartListProps> = ({
  selectedVoxelMeshPartName,
  voxelMeshParts,
  onSelect,
}) => {
  return (
    <List
      sx={{
        overflow: "auto",
        maxHeight: 300,
      }}
    >
      {voxelMeshParts.map((voxelMeshPart) => (
        <ListItem key={voxelMeshPart.name} disablePadding>
          <ListItemButton
            selected={selectedVoxelMeshPartName === voxelMeshPart.name}
            onClick={() => {
              onSelect?.(voxelMeshPart);
            }}
          >
            <ListItemText primary={voxelMeshPart.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
