import { css } from "@emotion/react";
import TextField from "@mui/material/TextField";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";

interface VoxelMeshRuleCollisionMeshNameFormProps {
  defaultValues: { name: string };
  names: string[];
  onSubmit: (value: { name: string }) => void;
}

export const VoxelMeshRuleCollisionMeshNameForm: React.FC<
  VoxelMeshRuleCollisionMeshNameFormProps
> = ({ defaultValues, names, onSubmit }) => {
  const { control, formState, handleSubmit, watch, reset } = useForm<{
    name: string;
  }>({
    defaultValues: { name: "" },
    mode: "onChange",
  });

  const isValid = formState.isValid && !formState.isValidating;
  const data = watch();
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  useDeepCompareEffect(() => {
    if (isValid) {
      onSubmitRef.current(data);
    }
  }, [data, isValid]);

  useDeepCompareEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
