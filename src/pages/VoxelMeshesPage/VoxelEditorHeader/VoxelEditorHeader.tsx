import { css } from "@emotion/react";
import MoreIcon from "@mui/icons-material/MoreVert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState } from "react";
import { downloadText } from "../../../modules/download";
import { VoxelMeshDatabaseStore } from "../../../modules/voxel/types";
import {
  useVoxelMeshDatabase,
  useVoxelMeshDatabaseBackups,
} from "../../../modules/voxel/useVoxelMeshDatabaseStore";
import { LoadDialog } from "./LoadDialog";
import { SettingsDialog } from "./SettingsDialog";

export const VoxelEditorHeader = () => {
  const [loadOpen, setLoadOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { store, setStore, save } = useVoxelMeshDatabase();
  const { pushBackup } = useVoxelMeshDatabaseBackups();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMore = Boolean(anchorEl);

  const handleLoadClose = () => {
    setLoadOpen(false);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const handleLoad = (value: VoxelMeshDatabaseStore) => {
    setLoadOpen(false);
    setStore(value);
  };

  const handleSave = () => {
    pushBackup(store);
    save(store);
  };

  const handleExport = () => {
    downloadText(
      JSON.stringify(store, null, "\t"),
      `${dayjs().format("YYYY-MM-DD-HH-mm")}.json`,
    );
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={openMore}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          setLoadOpen(true);
        }}
      >
        Load
      </MenuItem>
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          setSettingsOpen(true);
        }}
      >
        Settings
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Voxel Mesh Editor
        </Typography>
        <Button
          color="inherit"
          variant="outlined"
          css={css`
            margin-left: 12px;
          `}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          color="inherit"
          variant="outlined"
          css={css`
            margin-left: 12px;
          `}
          onClick={handleExport}
        >
          Export
        </Button>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          css={css`
            margin-left: 12px;
          `}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
        >
          <MoreIcon />
        </IconButton>
      </Toolbar>
      {renderMenu}
      <LoadDialog
        open={loadOpen}
        onClose={handleLoadClose}
        onLoad={handleLoad}
      />
      <SettingsDialog open={settingsOpen} onClose={handleSettingsClose} />
    </AppBar>
  );
};
