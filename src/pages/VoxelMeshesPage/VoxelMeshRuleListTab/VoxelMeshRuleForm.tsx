import { css } from "@emotion/react";
import TextField from "@mui/material/TextField";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { VoxelMeshRule } from "../../../modules/voxel/types";

interface VoxelMeshRuleFormProps {
  defaultValues: VoxelMeshRule;
  voxelMeshRuleNames: string[];
  onSubmit: (value: VoxelMeshRule) => void;
}

export const VoxelMeshRuleForm: React.FC<VoxelMeshRuleFormProps> = ({
  defaultValues,
  voxelMeshRuleNames,
  onSubmit,
}) => {
  const { control, handleSubmit } = useForm<VoxelMeshRule>({
    defaultValues,
    mode: "onBlur",
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
              if (voxelMeshRuleNames.includes(value)) {
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
          />
        )}
      />
    </form>
  );
};
