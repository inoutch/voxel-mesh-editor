import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";

interface VoxelMeshRuleCollisionNameMeshListProps {
  selectedGraphicMeshName: string | undefined;
  graphicMeshNames: string[];
  onSelect: (value: string) => void;
}

export const VoxelMeshRuleCollisionMeshNameList: React.FC<
  VoxelMeshRuleCollisionNameMeshListProps
> = ({ selectedGraphicMeshName, graphicMeshNames, onSelect }) => {
  return (
    <List
      sx={{
        overflow: "auto",
        maxHeight: 300,
      }}
    >
      {graphicMeshNames.map((name) => (
        <ListItem key={name} disablePadding>
          <ListItemButton
            selected={name === selectedGraphicMeshName}
            onClick={() => {
              onSelect?.(name);
            }}
          >
            <ListItemText primary={name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
