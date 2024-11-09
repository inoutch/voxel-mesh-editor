import z from "zod";
import { voxelMeshDatabaseStoreSchema as voxelMeshDatabaseStoreSchemaV0_0_1 } from "./v0.0.1";
import { voxelMeshDatabaseStoreSchema as voxelMeshDatabaseStoreSchemaV0_0_2 } from "./v0.0.2";
import { voxelMeshDatabaseStoreSchema as voxelMeshDatabaseStoreSchemaLatest } from "./v0.0.3";

export type VoxelMeshDatabaseStore = z.infer<
  typeof voxelMeshDatabaseStoreSchemaLatest
>;

export type VoxelMesh = VoxelMeshDatabaseStore["meshes"][0];

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

export const migrate = (data: unknown): VoxelMeshDatabaseStore => {
  const baseSchema = z.discriminatedUnion("version", [
    voxelMeshDatabaseStoreSchemaLatest,
    voxelMeshDatabaseStoreSchemaV0_0_1,
    voxelMeshDatabaseStoreSchemaV0_0_2,
  ]);

  let value = baseSchema.parse(data);
  let fails = false;
  while (!fails) {
    switch (value.version) {
      case "0.0.1":
        value = {
          version: "0.0.2",
          meshes: value.meshes.map((mesh) => ({
            name: mesh.name,
            groupName: mesh.groupName,
            hider: mesh.hider,
            parts: mesh.parts,
          })),
        };
        break;
      case "0.0.2":
        value = {
          version: "0.0.3",
          meshes: value.meshes.map((mesh) => ({
            name: mesh.name,
            groupName: mesh.groupName,
            hider: mesh.hider,
            parts: mesh.parts,
            rotatable: false,
          })),
        };
        break;
      case "0.0.3":
        return value;
      default:
        fails = true;
        break;
    }
  }
  throw new Error(`Unsupported version [${value.version}]`);
};

export const createDefault = (): VoxelMeshDatabaseStore => {
  return {
    version: "0.0.3",
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
