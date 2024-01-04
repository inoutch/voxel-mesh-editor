import { css } from "@emotion/react";
import { Divider, Tab } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import { useQueries } from "../useQueries";

export const VoxelMeshesTabs = () => {
  const {
    type,
    selectedVoxelMeshName,
    selectedVoxelMeshPartName,
    selectedVoxelMeshRuleName,
    setQueries,
  } = useQueries();

  return (
    <div
      css={css`
        background: #fff;
        position: sticky;
        z-index: 1;
        top: 0;
      `}
    >
      <Tabs
        value={type || ""}
        onChange={(event, value) => setQueries({ type: value })}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab value="voxelMesh" label="Mesh" />
        <Tab
          value="voxelMeshPart"
          label="Part"
          disabled={!selectedVoxelMeshName}
        />
        <Tab
          value="voxelMeshRule"
          label="Rule"
          disabled={!selectedVoxelMeshPartName}
        />
        <Tab
          value="voxelMeshRelation"
          label="Relation"
          disabled={!selectedVoxelMeshRuleName}
        />
      </Tabs>
      <Divider />
    </div>
  );
};
