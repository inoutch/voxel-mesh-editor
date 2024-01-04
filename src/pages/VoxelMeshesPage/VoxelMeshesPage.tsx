import { css } from "@emotion/react";
import { Previewer } from "./Previewer/Previewer";
import { useQueries } from "./useQueries";
import { VoxelEditorHeader } from "./VoxelEditorHeader/VoxelEditorHeader";
import { VoxelMeshesTabs } from "./VoxelMeshesTabs/VoxelMeshesTabs";
import { VoxelMeshListTab } from "./VoxelMeshListTab/VoxelMeshListTab";
import { VoxelMeshPartListTab } from "./VoxelMeshPartListTab/VoxelMeshPartListTab";
import { VoxelMeshRelationListTab } from "./VoxelMeshRelationListTab/VoxelMeshRelationListTab";
import { VoxelMeshRuleListTab } from "./VoxelMeshRuleListTab/VoxelMeshRuleListTab";

export const VoxelMeshesPage = () => {
  const { type } = useQueries();

  return (
    <div>
      <VoxelEditorHeader />
      <div
        css={css`
          display: flex;
          height: calc(100vh - 64px);
        `}
      >
        <div
          css={css`
            flex: 1;
          `}
        >
          <Previewer />
        </div>
        <div
          css={css`
            width: 360px;
            background-color: rgba(0, 0, 0, 0.03);
            overflow-y: scroll;
          `}
        >
          <VoxelMeshesTabs />
          {type === "voxelMesh" && <VoxelMeshListTab />}
          {type === "voxelMeshPart" && <VoxelMeshPartListTab />}
          {type === "voxelMeshRule" && <VoxelMeshRuleListTab />}
          {type === "voxelMeshRelation" && <VoxelMeshRelationListTab />}
        </div>
      </div>
    </div>
  );
};
