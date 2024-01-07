import { css, TextField } from "@mui/material";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { VoxelMesh } from "../../../modules/voxel/types";

interface VoxelMeshFormProps {
  defaultValues: VoxelMesh;
  voxelMeshNames: string[];
  onSubmit: (value: VoxelMesh) => void;
}

export const VoxelMeshForm: React.FC<VoxelMeshFormProps> = ({
  defaultValues,
  voxelMeshNames,
  onSubmit,
}) => {
  const nonNullDefaultValues = useMemo(() => {
    return {
      ...defaultValues,
      groupName: defaultValues.groupName ? defaultValues.groupName : "",
    };
  }, [defaultValues]);
  const { control, handleSubmit } = useForm<VoxelMesh>({
    defaultValues: nonNullDefaultValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  return (
    <form
      onBlur={handleSubmit(onSubmit)}
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
                voxelMeshNames.includes(value)
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
            error={!!formState.errors.name?.message}
            helperText={formState.errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="groupName"
        render={({ field, formState }) => (
          <TextField
            {...field}
            variant="outlined"
            label="Group Name"
            fullWidth
            error={!!formState.errors.groupName?.message}
          />
        )}
      />
    </form>
  );
};
