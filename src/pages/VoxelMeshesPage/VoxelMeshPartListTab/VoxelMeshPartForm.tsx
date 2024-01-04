import { css, TextField } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { VoxelMeshPart } from "../../../modules/voxel/types";

interface VoxelMeshPartFormProps {
  defaultValues: VoxelMeshPart;
  voxelMeshPartNames: string[];
  onSubmit: (value: VoxelMeshPart) => void;
}

export const VoxelMeshPartForm: React.FC<VoxelMeshPartFormProps> = ({
  defaultValues,
  voxelMeshPartNames,
  onSubmit,
}) => {
  const { control, handleSubmit } = useForm<VoxelMeshPart>({
    defaultValues,
    mode: "onBlur",
  });

  return (
    <form
      onBlur={handleSubmit(onSubmit)}
      onSubmit={(event) => event.preventDefault()}
      css={css`
        padding: 16px;
        > *:not(first-child) {
          margin-top: 12px;
        }
      `}
    >
      <Controller
        control={control}
        name="name"
        rules={{
          validate: {
            duplicate: (value) => {
              if (
                defaultValues.name !== value &&
                voxelMeshPartNames.includes(value)
              ) {
                return "The name has already used";
              }
              return true;
            },
            minLength: (value) => (value.length >= 1 ? true : "Required"),
          },
        }}
        render={({ field, formState }) => (
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            {...field}
            helperText={formState.errors.name?.message}
            error={!!formState.errors.name?.message}
          />
        )}
      />
    </form>
  );
};
