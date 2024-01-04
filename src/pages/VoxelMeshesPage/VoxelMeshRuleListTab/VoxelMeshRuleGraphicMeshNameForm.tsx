import { css } from "@emotion/react";
import TextField from "@mui/material/TextField";
import React from "react";
import { Controller, useForm } from "react-hook-form";

interface VoxelMeshRuleGraphicMeshNameFormProps {
  defaultValues: { name: string };
  names: string[];
  onSubmit: (value: { name: string }) => void;
}

export const VoxelMeshRuleGraphicMeshNameForm: React.FC<
  VoxelMeshRuleGraphicMeshNameFormProps
> = ({ defaultValues, names, onSubmit }) => {
  const { control, handleSubmit } = useForm<{
    name: string;
  }>({
    defaultValues,
    mode: "onBlur",
  });

  return (
    <form
      onBlur={handleSubmit(onSubmit)}
      css={css`
        padding: 0 16px;
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
            required: (value) => {
              if (names.includes(value)) {
                return "Same name has already exists";
              }
            },
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
