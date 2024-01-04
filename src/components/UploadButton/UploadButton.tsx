import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import React from "react";

interface UploadButtonProps {
  name: string;
  onSelectFiles: (files: FileList | null) => void;
}

export const UploadButton: React.FC<
  React.PropsWithChildren<UploadButtonProps>
> = ({ name, children, onSelectFiles }) => {
  return (
    <label htmlFor={`__upload-button-${name}`}>
      <input
        accept=".glb"
        id={`__upload-button-${name}`}
        name={name}
        type="file"
        css={css`
          display: none;
        `}
        onChange={(event) => onSelectFiles(event.target.files)}
      />
      <Button variant="contained" component="span">
        {children}
      </Button>
    </label>
  );
};
