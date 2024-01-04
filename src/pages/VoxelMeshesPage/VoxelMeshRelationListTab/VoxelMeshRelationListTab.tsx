import Divider from "@mui/material/Divider";
import { OperationButtons } from "../../../components/OperationButtons/OperationButtons";
import { VoxelMeshRelation } from "../../../modules/voxel/types";
import {
  useGroupNames,
  useVoxelMeshRelation,
  useVoxelMeshRelations,
  useVoxelNames,
} from "../../../modules/voxel/useVoxelMeshDatabaseStore";
import { useQueries } from "../useQueries";
import {
  VoxelMeshRelationForm,
  VoxelMeshRelationFormValue,
} from "./VoxelMeshRelationForm";
import { VoxelMeshRelationList } from "./VoxelMeshRelationList";

export const VoxelMeshRelationListTab = () => {
  const {
    selectedVoxelMeshName,
    selectedVoxelMeshPartName,
    selectedVoxelMeshRuleName,
    selectedVoxelMeshRelationIndex,
    setQueries,
  } = useQueries();
  const {
    array: voxelMeshRelations,
    add: addVoxelMeshRelation,
    remove: removeVoxelMeshRelation,
  } = useVoxelMeshRelations({
    voxelMeshName: selectedVoxelMeshName,
    voxelMeshPartName: selectedVoxelMeshPartName,
    voxelMeshRuleName: selectedVoxelMeshRuleName,
  });
  const [selectedVoxelMeshRelation, setSelectedVoxelMeshRelation] =
    useVoxelMeshRelation({
      voxelMeshName: selectedVoxelMeshName,
      voxelMeshPartName: selectedVoxelMeshPartName,
      voxelMeshRuleName: selectedVoxelMeshRuleName,
      voxelMeshRelationIndex: selectedVoxelMeshRelationIndex,
    });
  const voxelNames = useVoxelNames();
  const groupNames = useGroupNames();

  const handleSubmit = (value: VoxelMeshRelationFormValue) => {
    if (!selectedVoxelMeshRelation) {
      return;
    }
    let result: VoxelMeshRelation;
    switch (value.type) {
      case "none":
      case "hider":
      case "!hider":
        result = {
          type: value.type,
          x: value.x,
          y: value.y,
          z: value.z,
        };
        break;
      default:
        result = {
          type: value.type,
          name: value.name,
          x: value.x,
          y: value.y,
          z: value.z,
        };
    }
    setSelectedVoxelMeshRelation(selectedVoxelMeshRelation, result);
  };

  const handleCreate = () => {
    addVoxelMeshRelation({
      type: "none",
      x: 0,
      y: 0,
      z: 0,
    });
  };

  const handleDelete = () => {
    if (!selectedVoxelMeshRelation) {
      return;
    }

    removeVoxelMeshRelation(selectedVoxelMeshRelation);
  };

  const handleDuplicate = () => {
    if (!selectedVoxelMeshRelation) {
      return;
    }

    addVoxelMeshRelation({ ...selectedVoxelMeshRelation });
  };

  const handleVoxelMeshRelationSelect = (value: VoxelMeshRelation) => {
    const index = voxelMeshRelations.findIndex(
      (relation) => value === relation,
    );
    if (index < 0) {
      return;
    }
    setQueries({
      voxelMeshRelationIndex:
        selectedVoxelMeshRelationIndex === index ? null : index,
    });
  };

  return (
    <div>
      <VoxelMeshRelationList
        selectedIndex={selectedVoxelMeshRelationIndex}
        voxelMeshRelations={voxelMeshRelations}
        onSelect={handleVoxelMeshRelationSelect}
      />
      <OperationButtons
        disabledDuplicate={!selectedVoxelMeshRelation}
        disabledDelete={!selectedVoxelMeshRelation}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
      {selectedVoxelMeshRelation && (
        <>
          <Divider />
          <VoxelMeshRelationForm
            key={selectedVoxelMeshRelationIndex}
            defaultValues={selectedVoxelMeshRelation}
            onSubmit={handleSubmit}
            voxelNames={voxelNames}
            groupNames={groupNames}
          />
        </>
      )}
    </div>
  );
};
