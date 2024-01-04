import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { VoxelMesh } from "../../../modules/voxel/types";

interface VoxelMeshListProps {
  selectedVoxelMeshName?: string;
  voxelMeshes: VoxelMesh[];
  onSelect?: (value: VoxelMesh) => void;
}

export const VoxelMeshList: React.FC<VoxelMeshListProps> = ({
  selectedVoxelMeshName,
  voxelMeshes,
  onSelect,
}) => {
  return (
    <List
      sx={{
        overflow: "auto",
        maxHeight: 300,
      }}
    >
      {voxelMeshes.map((voxelMesh) => (
        <ListItem key={voxelMesh.name} disablePadding>
          <ListItemButton
            selected={selectedVoxelMeshName === voxelMesh.name}
            onClick={() => {
              onSelect?.(voxelMesh);
            }}
          >
            <ListItemText primary={voxelMesh.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
