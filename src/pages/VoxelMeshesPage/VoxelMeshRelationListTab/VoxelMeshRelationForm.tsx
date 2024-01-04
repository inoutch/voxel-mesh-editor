import {
  Button,
  css,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  VoxelMeshRelation,
  voxelMeshRelationTypes,
} from "../../../modules/voxel/types";

export interface VoxelMeshRelationFormValue {
  type: (typeof voxelMeshRelationTypes)[0];
  name: string;
  x: number;
  y: number;
  z: number;
}

interface VoxelMeshPartFormProps {
  defaultValues: VoxelMeshRelation;
  voxelNames: string[];
  groupNames: string[];
  onSubmit: (value: VoxelMeshRelationFormValue) => void;
}

export const VoxelMeshRelationForm: React.FC<VoxelMeshPartFormProps> = ({
  defaultValues,
  voxelNames,
  groupNames,
  onSubmit,
}) => {
  const { control, formState, handleSubmit, watch } =
    useForm<VoxelMeshRelationFormValue>({
      defaultValues: {
        type: defaultValues.type,
        name:
          (() => {
            switch (defaultValues.type) {
              case "none":
              case "hider":
              case "!hider":
                return "";
              default:
                return defaultValues.name;
            }
          })() || "",
        x: defaultValues.x,
        y: defaultValues.y,
        z: defaultValues.z,
      },
      mode: "onBlur",
    });
  const data = watch();

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
        name="type"
        render={({ field, formState }) => (
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              {...field}
              error={!!formState.errors.type?.message}
            >
              {voxelMeshRelationTypes.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      {(data.type === "voxelName" ||
        data.type === "!voxelName" ||
        data.type === "!voxelName&hider") && (
        <Controller
          control={control}
          name="name"
          rules={{
            validate: {
              minLength: (value) => (value.length >= 1 ? true : "Required"),
            },
          }}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Name</InputLabel>
              <Select
                label="Name"
                {...field}
                error={!!formState.errors.name?.message}
              >
                {voxelNames.map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      )}
      {(data.type === "groupName" ||
        data.type === "!groupName" ||
        data.type === "!groupName&hider") && (
        <Controller
          control={control}
          name="name"
          rules={{
            validate: {
              minLength: (value) => (value.length >= 1 ? true : "Required"),
            },
          }}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Name</InputLabel>
              <Select
                label="Name"
                {...field}
                error={!!formState.errors.name?.message}
              >
                {groupNames.map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      )}
      <Controller
        control={control}
        name="x"
        render={({ field }) => (
          <div
            css={css`
              display: flex;
              gap: 12px;
            `}
          >
            <Button
              variant="outlined"
              onClick={() => {
                field.onChange(field.value - 1);
                handleSubmit(onSubmit)();
              }}
            >
              -
            </Button>
            <TextField type="number" label="x" {...field} />
            <Button
              variant="outlined"
              onClick={() => {
                field.onChange(field.value + 1);
                handleSubmit(onSubmit)();
              }}
            >
              +
            </Button>
          </div>
        )}
      />
      <Controller
        control={control}
        name="y"
        render={({ field }) => (
          <div
            css={css`
              display: flex;
              gap: 12px;
            `}
          >
            <Button
              variant="outlined"
              onClick={() => {
                field.onChange(field.value - 1);
                handleSubmit(onSubmit)();
              }}
            >
              -
            </Button>
            <TextField type="number" label="y" {...field} />
            <Button
              variant="outlined"
              onClick={() => {
                field.onChange(field.value + 1);
                handleSubmit(onSubmit)();
              }}
            >
              +
            </Button>
          </div>
        )}
      />
      <Controller
        control={control}
        name="z"
        render={({ field }) => (
          <div
            css={css`
              display: flex;
              gap: 12px;
            `}
          >
            <Button
              variant="outlined"
              onClick={() => {
                field.onChange(field.value - 1);
                handleSubmit(onSubmit)();
              }}
            >
              -
            </Button>
            <TextField type="number" label="z" {...field} />
            <Button
              variant="outlined"
              onClick={() => {
                field.onChange(field.value + 1);
                handleSubmit(onSubmit)();
              }}
            >
              +
            </Button>
          </div>
        )}
      />
    </form>
  );
};
