import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { RelationBox } from "../../../components/Box/RelationBox";
import { VOXEL_SCALE, VOXEL_SIZE } from "../../../constants/voxel";
import { VoxelMeshDeterminer } from "../../../modules/voxel/determiner";
import {
  useVoxelMeshDatabase,
  useVoxelMeshRelation,
  useVoxelMeshRule,
} from "../../../modules/voxel/useVoxelMeshDatabaseStore";
import { useQueries } from "../useQueries";
import { Camera } from "./Camera";
import { Model } from "./Model";

export const Previewer = () => {
  const {
    selectedVoxelMeshName,
    selectedVoxelMeshPartName,
    selectedVoxelMeshRuleName,
    selectedVoxelMeshRelationIndex,
  } = useQueries();
  const { store } = useVoxelMeshDatabase();
  const determiner = useMemo(() => {
    return new VoxelMeshDeterminer(store);
  }, [store]);
  const bundle = useMemo(() => {
    if (!selectedVoxelMeshName) {
      return;
    }
    return determiner.search(
      selectedVoxelMeshName,
      { x: 0, y: 0, z: 0 },
      () => undefined,
    );
  }, [determiner, selectedVoxelMeshName]);

  const [selectedVoxelMeshRule] = useVoxelMeshRule({
    voxelMeshName: selectedVoxelMeshName,
    voxelMeshPartName: selectedVoxelMeshPartName,
    voxelMeshRuleName: selectedVoxelMeshRuleName,
  });

  const [selectedVoxelMeshRelation] = useVoxelMeshRelation({
    voxelMeshName: selectedVoxelMeshName,
    voxelMeshPartName: selectedVoxelMeshPartName,
    voxelMeshRuleName: selectedVoxelMeshRuleName,
    voxelMeshRelationIndex: selectedVoxelMeshRelationIndex,
  });

  return (
    <Canvas>
      <Camera />
      <gridHelper
        args={[3, 3]}
        scale={VOXEL_SIZE * VOXEL_SCALE}
        position={[0, 0, 0]}
      />
      <ambientLight />
      <color
        attach="background"
        args={[selectedVoxelMeshRule ? "#EEF296" : "#FF8F8F"]}
      />
      <pointLight position={[0, 5, 5]} intensity={100.0} />
      {selectedVoxelMeshRule ? (
        <>
          <Model names={selectedVoxelMeshRule.graphicMeshNames} />
          {selectedVoxelMeshRelation ? (
            <RelationBox relation={selectedVoxelMeshRelation} />
          ) : (
            selectedVoxelMeshRule.relations.map((relation, key) => (
              <RelationBox key={key} relation={relation} />
            ))
          )}
        </>
      ) : (
        <Model names={bundle?.graphicMeshNames || []} />
      )}
      <axesHelper args={[5]} position={[0, 0, 0]} />
    </Canvas>
  );
};
