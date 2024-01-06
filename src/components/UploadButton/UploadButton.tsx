import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import React from "react";

interface UploadButtonProps {
  name: string;
  variant?: "text" | "outlined" | "contained";
  onFilesSelect: (files: FileList | null) => void;
}

export const UploadButton: React.FC<
  React.PropsWithChildren<UploadButtonProps>
> = ({ name, variant, children, onFilesSelect: onSelectFiles }) => {
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
      <Button variant={variant} component="span">
        {children}
      </Button>
    </label>
  );
};
