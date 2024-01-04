import { css } from "@emotion/react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import React from "react";
import {
  VoxelMeshHiderType,
  voxelMeshHiderTypes,
} from "../../../modules/voxel/types";

interface VoxelMeshHiderListProps {
  selectedHiderTypes: VoxelMeshHiderType[];
  onChange: (values: VoxelMeshHiderType[]) => void;
}

export const VoxelMeshHiderList: React.FC<VoxelMeshHiderListProps> = ({
  selectedHiderTypes,
  onChange,
}) => {
  return (
    <FormGroup
      css={css`
        padding: 16px;
      `}
    >
      {voxelMeshHiderTypes.map((type) => (
        <FormControlLabel
          key={type}
          control={
            <Checkbox
              checked={selectedHiderTypes.includes(type)}
              onChange={(event) => {
                if (event.target.checked) {
                  onChange([...selectedHiderTypes, type]);
                } else {
                  onChange(selectedHiderTypes.filter((x) => x !== type));
                }
              }}
            />
          }
          label={type}
        />
      ))}
    </FormGroup>
  );
};
