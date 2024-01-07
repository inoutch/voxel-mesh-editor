import z from "zod";

const voxelMeshRelationVoxelNameSchema = z.object({
  type: z.literal("voxelName"),
  x: z.number(),
  y: z.number(),
  z: z.number(),
  name: z.string(),
});

const voxelMeshRelationVoxelGroupNameSchema = z.object({
  type: z.literal("groupName"),
  x: z.number(),
  y: z.number(),
  z: z.number(),
  name: z.string(),
});

const voxelMeshRelationNoneSchema = z.object({
  type: z.literal("none"),
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const voxelMeshRelationHiderSchema = z.object({
  type: z.literal("hider"),
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const voxelMeshRelationNotVoxelNameSchema = z.object({
  type: z.literal("!voxelName"),
  x: z.number(),
  y: z.number(),
  z: z.number(),
  name: z.string(),
});

const voxelMeshRelationNotVoxelGroupNameSchema = z.object({
  type: z.literal("!groupName"),
  x: z.number(),
  y: z.number(),
  z: z.number(),
  name: z.string(),
});

const voxelMeshRelationNotHiderSchema = z.object({
  type: z.literal("!hider"),
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const voxelMeshRelationNotVoxelIdAndHiderSchema = z.object({
  type: z.literal("!voxelName&hider"),
  x: z.number(),
  y: z.number(),
  z: z.number(),
  name: z.string(),
});

const voxelMeshRelationNotVoxelGroupNameAndHiderSchema = z.object({
  type: z.literal("!groupName&hider"),
  x: z.number(),
  y: z.number(),
  z: z.number(),
  name: z.string(),
});

export const voxelMeshRelationSchema = z.discriminatedUnion("type", [
  voxelMeshRelationVoxelNameSchema,
  voxelMeshRelationVoxelGroupNameSchema,
  voxelMeshRelationNoneSchema,
  voxelMeshRelationHiderSchema,
  voxelMeshRelationNotVoxelNameSchema,
  voxelMeshRelationNotVoxelGroupNameSchema,
  voxelMeshRelationNotHiderSchema,
  voxelMeshRelationNotVoxelIdAndHiderSchema,
  voxelMeshRelationNotVoxelGroupNameAndHiderSchema,
]);

export const voxelMeshHiderTypeSchema = z.union([
  z.literal("left"),
  z.literal("right"),
  z.literal("near"),
  z.literal("far"),
  z.literal("bottom"),
  z.literal("top"),
]);

export const voxelMeshHiderSchema = z.object({
  types: z.array(voxelMeshHiderTypeSchema),
});

export const voxelMeshRuleStoreSchema = z.object({
  relations: z.array(voxelMeshRelationSchema),
  graphicMeshNames: z.array(z.string()),
  collisionMeshNames: z.array(z.string()),
  name: z.string(),
});

export const voxelMeshPartStoreSchema = z.object({
  rules: z.array(voxelMeshRuleStoreSchema),
  name: z.string(),
});

export const voxelMeshStoreSchema = z.object({
  name: z.string(),
  groupName: z.string().nullable(),
  parts: z.array(voxelMeshPartStoreSchema),
  hider: voxelMeshHiderSchema,
});

export const voxelMeshDatabaseStoreSchema = z.object({
  version: z.literal("0.0.2"),
  meshes: z.array(voxelMeshStoreSchema),
});
