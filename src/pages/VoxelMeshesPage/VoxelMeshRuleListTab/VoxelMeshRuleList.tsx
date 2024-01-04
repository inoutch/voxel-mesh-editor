import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { VoxelMeshRule } from "../../../modules/voxel/types";

interface VoxelMeshRuleListProps {
  selectedVoxelMeshRuleName?: string;
  voxelMeshRules: VoxelMeshRule[];
  onSelect: (value: VoxelMeshRule) => void;
}

export const VoxelMeshRuleList: React.FC<VoxelMeshRuleListProps> = ({
  selectedVoxelMeshRuleName,
  voxelMeshRules,
  onSelect,
}) => {
  return (
    <List
      sx={{
        overflow: "auto",
        maxHeight: 300,
      }}
    >
      {voxelMeshRules.map((voxelMeshRule) => (
        <ListItem key={voxelMeshRule.name} disablePadding>
          <ListItemButton
            selected={selectedVoxelMeshRuleName === voxelMeshRule.name}
            onClick={() => {
              onSelect?.(voxelMeshRule);
            }}
          >
            <ListItemText primary={voxelMeshRule.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
