import z from "zod";
import {
  voxelMeshDatabaseStoreSchema as voxelMeshDatabaseStoreSchemaV0_0_1,
  voxelMeshRotationSchema,
} from "./v0.0.1";

export type VoxelMeshDatabaseStore = z.infer<
  typeof voxelMeshDatabaseStoreSchemaV0_0_1
>;

export type VoxelMesh = VoxelMeshDatabaseStore["meshes"][0];

export type VoxelMeshRotation = VoxelMesh["rotation"];

export type VoxelMeshHiderType = VoxelMesh["hider"]["types"][0];

export type VoxelMeshPart = VoxelMesh["parts"][0];

export type VoxelMeshRule = VoxelMeshPart["rules"][0];

export type VoxelMeshRelation = VoxelMeshRule["relations"][0];

export const voxelMeshRelationTypes: VoxelMeshRelation["type"][] = [
  "voxelName",
  "groupName",
  "hider",
  "!voxelName",
  "!groupName",
  "!hider",
  "!voxelName&hider",
  "!groupName&hider",
  "none",
];

export const voxelMeshHiderTypes: VoxelMeshHiderType[] = [
  "left",
  "right",
  "near",
  "far",
  "bottom",
  "top",
];

export const migrate = (data: unknown) => {
  const baseSchema = z.object({
    version: z.string(),
  });

  const value = baseSchema.parse(data);
  let fails = false;
  while (!fails) {
    switch (value.version) {
      case "0.0.1":
        return voxelMeshDatabaseStoreSchemaV0_0_1.parse(data);
      default:
        fails = true;
        break;
    }
  }
  throw new Error(`Unsupported version [${value.version}]`);
};

export const voxelMeshRotations: z.infer<typeof voxelMeshRotationSchema>[] = [
  "left",
  "right",
  "near",
  "far",
  "all",
];

export const createDefault = (): VoxelMeshDatabaseStore => {
  return {
    version: "0.0.1",
    meshes: [],
  };
};

export const createRelation = (
  type: VoxelMeshRelation["type"],
): VoxelMeshRelation => {
  switch (type) {
    case "voxelName":
      return {
        type: "voxelName",
        name: "",
        x: 0,
        y: 0,
        z: 0,
      };
    case "groupName":
      return {
        type: "groupName",
        name: "",
        x: 0,
        y: 0,
        z: 0,
      };
    case "hider":
      return {
        type: "hider",
        x: 0,
        y: 0,
        z: 0,
      };
    case "!voxelName":
      return {
        type: "!voxelName",
        name: "",
        x: 0,
        y: 0,
        z: 0,
      };
    case "!groupName":
      return {
        type: "!groupName",
        name: "",
        x: 0,
        y: 0,
        z: 0,
      };
    case "!hider":
      return {
        type: "!hider",
        x: 0,
        y: 0,
        z: 0,
      };
    case "!groupName&hider":
      return {
        type: "!groupName&hider",
        name: "",
        x: 0,
        y: 0,
        z: 0,
      };
    case "none":
      return {
        type: "none",
        x: 0,
        y: 0,
        z: 0,
      };
  }
  return {
    type: "none",
    x: 0,
    y: 0,
    z: 0,
  };
};
