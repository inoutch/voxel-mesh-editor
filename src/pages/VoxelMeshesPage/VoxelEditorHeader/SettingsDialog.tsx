import { css } from "@emotion/react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { encode } from "base64-arraybuffer";
import React from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { UploadButton } from "../../../components/UploadButton/UploadButton";
import { readAsArrayBufferPromise } from "../../../modules/readAsArrayBufferPromise";
import { modelTypes, useSettings } from "../../../modules/useSettings";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
}) => {
  const [settings, setSettings] = useSettings();

  const handleModelTypeChange = (event: SelectChangeEvent) => {
    switch (event.target.value) {
      case "url":
        setSettings({
          ...settings,
          model: { type: "url", url: "/glass_stone.glb" },
        });
        break;
      case "bytes":
        setSettings({
          ...settings,
          model: { type: "bytes", base64: null, filename: null },
        });
        break;
    }
  };

  const handleFilesSelect = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }

    const buffer = await readAsArrayBufferPromise(file);
    await new GLTFLoader().parseAsync(buffer, "/"); // validate

    const base64 = encode(buffer);
    setSettings({
      ...settings,
      model: { type: "bytes", base64, filename: file.name },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"sm"}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <div
          css={css`
            display: flex;
            gap: 12px;
            align-items: center;
          `}
        >
          <Select
            label="Model"
            value={settings.model.type}
            onChange={handleModelTypeChange}
            sx={{ width: "120px" }}
          >
            {modelTypes.map((x) => (
              <MenuItem key={x} value={x}>
                {x}
              </MenuItem>
            ))}
          </Select>
          {settings.model.type === "url" && (
            <TextField
              value={settings.model.url}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  model: { type: "url", url: event.target.value },
                })
              }
            />
          )}
          {settings.model.type === "bytes" && (
            <>
              <UploadButton name="glb" onFilesSelect={handleFilesSelect}>
                Upload
              </UploadButton>
              <p>{settings.model.filename}</p>
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
