import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { parseToNumOrUndefined } from "../../modules/parseToNumOrUndefined";

interface Queries {
  type: "voxelMesh" | "voxelMeshPart" | "voxelMeshRule" | "voxelMeshRelation";
  voxelMeshName: string | null;
  voxelMeshPartName: string | null;
  voxelMeshRuleName: string | null;
  voxelMeshRuleGraphicMeshName: string | null;
  voxelMeshRuleCollisionMeshName: string | null;
  voxelMeshRelationIndex: number | null;
}

export const useQueries = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedVoxelMeshName = searchParams.get("voxelMeshName") || undefined;
  const selectedVoxelMeshPartName =
    searchParams.get("voxelMeshPartName") || undefined;
  const selectedVoxelMeshRuleName =
    searchParams.get("voxelMeshRuleName") || undefined;
  const selectedVoxelMeshRuleGraphicMeshName =
    searchParams.get("voxelMeshRuleGraphicMeshName") || undefined;
  const selectedVoxelMeshRuleCollisionMeshName =
    searchParams.get("voxelMeshRuleCollisionMeshName") || undefined;
  const selectedVoxelMeshRelationIndex = parseToNumOrUndefined(
    searchParams.get("voxelMeshRelationIndex") || undefined,
  );
  const type = searchParams.get("type") || "voxelMesh";

  const setQueries = useCallback(
    (queries: Partial<Queries>) => {
      const ret: { [key in string]: string } = {};
      if (queries.type !== null) {
        const param = queries.type ?? type;
        if (param) {
          ret["type"] = param;
        }
      }
      if (queries.voxelMeshName !== null) {
        const param = queries.voxelMeshName ?? selectedVoxelMeshName;
        if (param) {
          ret["voxelMeshName"] = param;
        }
      }
      if (queries.voxelMeshPartName !== null) {
        const param =
          queries.voxelMeshPartName ?? selectedVoxelMeshPartName ?? undefined;
        if (param) {
          ret["voxelMeshPartName"] = param;
        }
      }
      if (queries.voxelMeshRuleName !== null) {
        const param =
          queries.voxelMeshRuleName ?? selectedVoxelMeshRuleName ?? undefined;
        if (param) {
          ret["voxelMeshRuleName"] = param;
        }
      }
      if (queries.voxelMeshRuleGraphicMeshName !== null) {
        const param =
          queries.voxelMeshRuleGraphicMeshName ??
          selectedVoxelMeshRuleGraphicMeshName ??
          undefined;
        if (param) {
          ret["voxelMeshRuleGraphicMeshName"] = param;
        }
      }
      if (queries.voxelMeshRuleCollisionMeshName !== null) {
        const param =
          queries.voxelMeshRuleCollisionMeshName ??
          selectedVoxelMeshRuleCollisionMeshName ??
          undefined;
        if (param) {
          ret["voxelMeshRuleCollisionMeshName"] = param;
        }
      }
      if (queries.voxelMeshRelationIndex !== null) {
        const param =
          queries.voxelMeshRelationIndex ?? selectedVoxelMeshRelationIndex;
        if (param !== undefined) {
          ret["voxelMeshRelationIndex"] = param.toString();
        }
      }
      setSearchParams(ret);
    },
    [
      type,
      selectedVoxelMeshName,
      selectedVoxelMeshPartName,
      selectedVoxelMeshRuleName,
      selectedVoxelMeshRuleGraphicMeshName,
      selectedVoxelMeshRuleCollisionMeshName,
      selectedVoxelMeshRelationIndex,
      setSearchParams,
    ],
  );

  return {
    type,
    selectedVoxelMeshName,
    selectedVoxelMeshPartName,
    selectedVoxelMeshRuleName,
    selectedVoxelMeshRuleGraphicMeshName,
    selectedVoxelMeshRuleCollisionMeshName,
    selectedVoxelMeshRelationIndex,
    setQueries,
  };
};
