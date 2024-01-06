import { ListItemButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import dayjs from "dayjs";
import React from "react";
import { UploadButton } from "../../../components/UploadButton/UploadButton";
import { readAsTextPromise } from "../../../modules/readAsTextPromise";
import { migrate, VoxelMeshDatabaseStore } from "../../../modules/voxel/types";
import { useVoxelMeshDatabaseBackups } from "../../../modules/voxel/useVoxelMeshDatabaseStore";

interface LoadDialogProps {
  open: boolean;
  onClose: () => void;
  onLoad: (value: VoxelMeshDatabaseStore) => void;
}

export const LoadDialog: React.FC<LoadDialogProps> = ({
  open,
  onClose,
  onLoad,
}) => {
  const { store } = useVoxelMeshDatabaseBackups();
  const handleFilesSelect = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }
    const text = await readAsTextPromise(file);
    const data = JSON.parse(text);
    const store = migrate(data);
    onLoad(store);
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"sm"}>
      <DialogTitle>Load from history</DialogTitle>
      <DialogContent>
        <List sx={{ width: "100%", maxHeight: 500 }}>
          {store.backups.map((x, i) => (
            <ListItem key={`${i}`}>
              <ListItemButton onClick={() => onLoad(x.store)}>
                <ListItemText
                  primary={dayjs(x.createdAt).format("YYYY/MM/DD HH:mm ss")}
                  secondary={x.store.version}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <UploadButton name="load" onFilesSelect={handleFilesSelect}>
          Upload
        </UploadButton>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
