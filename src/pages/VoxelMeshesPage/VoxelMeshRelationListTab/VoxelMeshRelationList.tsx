import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { VoxelMeshRelation } from "../../../modules/voxel/types";

const displayRelation = (relation: VoxelMeshRelation) => {
  switch (relation.type) {
    case "voxelName":
      return `V - ${relation.name} - (${relation.x}, ${relation.y}, ${relation.z})`;
    case "groupName":
      return `G - ${relation.name} - (${relation.x}, ${relation.y}, ${relation.z})`;
    case "hider":
      return `H - (${relation.x}, ${relation.y}, ${relation.z})`;
    case "!voxelName":
      return `!V - ${relation.name} - (${relation.x}, ${relation.y}, ${relation.z})`;
    case "!groupName":
      return `!G - ${relation.name} - (${relation.x}, ${relation.y}, ${relation.z})`;
    case "!hider":
      return `!H - (${relation.x}, ${relation.y}, ${relation.z})`;
    case "!voxelName&hider":
      return `!V&H - ${relation.name} - (${relation.x}, ${relation.y}, ${relation.z})`;
    case "!groupName&hider":
      return `!G&H - ${relation.name} - (${relation.x}, ${relation.y}, ${relation.z})`;
    case "none":
      return `N - (${relation.x}, ${relation.y}, ${relation.z})`;
  }
  return "Invalid";
};

interface VoxelMeshRuleListProps {
  selectedIndex: number | undefined;
  voxelMeshRelations: VoxelMeshRelation[];
  onSelect: (value: VoxelMeshRelation) => void;
}

export const VoxelMeshRelationList: React.FC<VoxelMeshRuleListProps> = ({
  selectedIndex,
  voxelMeshRelations,
  onSelect,
}) => {
  return (
    <List
      sx={{
        overflow: "auto",
        maxHeight: 300,
      }}
    >
      {voxelMeshRelations.map((relation, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton
            selected={index === selectedIndex}
            onClick={() => {
              onSelect?.(relation);
            }}
          >
            <ListItemText primary={displayRelation(relation)} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
