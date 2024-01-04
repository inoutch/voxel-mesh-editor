import { Divider } from "@mui/material";
import { OperationButtons } from "../../../components/OperationButtons/OperationButtons";
import { Section } from "../../../components/Section/Section";
import { getNextName } from "../../../modules/getNextName";
import { VoxelMesh, VoxelMeshHiderType } from "../../../modules/voxel/types";
import {
  useVoxelMesh,
  useVoxelMeshes,
} from "../../../modules/voxel/useVoxelMeshDatabaseStore";
import { useQueries } from "../useQueries";
import { VoxelMeshForm } from "./VoxelMeshForm";
import { VoxelMeshHiderList } from "./VoxelMeshHiderList";
import { VoxelMeshList } from "./VoxelMeshList";

export const VoxelMeshListTab = () => {
  const { selectedVoxelMeshName, setQueries } = useQueries();
  const {
    array: voxelMeshes,
    add: addVoxelMesh,
    remove: removeVoxelMesh,
  } = useVoxelMeshes();
  const [selectedVoxelMesh, setSelectedVoxelMesh] = useVoxelMesh(
    selectedVoxelMeshName,
  );

  const handleSubmit = (value: VoxelMesh) => {
    if (!selectedVoxelMeshName) {
      return;
    }

    setSelectedVoxelMesh(selectedVoxelMeshName, value);
    if (selectedVoxelMeshName !== value.name) {
      setQueries({ voxelMeshName: value.name });
    }
  };

  const handleCreate = () => {
    addVoxelMesh({
      name: getNextName(
        voxelMeshes,
        "NewVoxelMesh",
        (voxelMesh) => voxelMesh.name,
      ),
      groupName: null,
      rotation: "all",
      parts: [],
      hider: { types: [] },
    });
  };

  const handleDelete = () => {
    if (!selectedVoxelMeshName) {
      return;
    }
    removeVoxelMesh(selectedVoxelMeshName);
    setQueries({
      voxelMeshName: null,
      voxelMeshPartName: null,
      voxelMeshRuleName: null,
      voxelMeshRuleGraphicMeshName: null,
      voxelMeshRuleCollisionMeshName: null,
      voxelMeshRelationIndex: null,
    });
  };

  const handleDuplicate = () => {
    if (!selectedVoxelMesh) {
      return;
    }

    const nextName = getNextName(
      voxelMeshes,
      selectedVoxelMesh.name,
      (voxelMesh) => voxelMesh.name,
    );
    addVoxelMesh({ ...selectedVoxelMesh, name: nextName });
  };

  const handleVoxelMeshSelect = (value: VoxelMesh) => {
    setQueries({
      voxelMeshName: selectedVoxelMeshName === value.name ? null : value.name,
      voxelMeshPartName: null,
      voxelMeshRuleName: null,
      voxelMeshRuleGraphicMeshName: null,
      voxelMeshRuleCollisionMeshName: null,
      voxelMeshRelationIndex: null,
    });
  };

  const handleVoxelMeshHiderTypesChange = (types: VoxelMeshHiderType[]) => {
    if (!selectedVoxelMesh) {
      return;
    }
    setSelectedVoxelMesh(selectedVoxelMesh.name, {
      ...selectedVoxelMesh,
      hider: { types },
    });
  };

  return (
    <div>
      <VoxelMeshList
        selectedVoxelMeshName={selectedVoxelMeshName}
        voxelMeshes={voxelMeshes}
        onSelect={handleVoxelMeshSelect}
      />
      <OperationButtons
        disabledDuplicate={!selectedVoxelMesh}
        disabledDelete={!selectedVoxelMesh}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
      {selectedVoxelMesh && (
        <>
          <Divider />
          <VoxelMeshForm
            key={selectedVoxelMeshName}
            defaultValues={selectedVoxelMesh}
            voxelMeshNames={voxelMeshes
              .map((mesh) => mesh.name)
              .filter((x) => x !== selectedVoxelMeshName)}
            onSubmit={handleSubmit}
          />
          <Section title="Hider">
            <VoxelMeshHiderList
              selectedHiderTypes={selectedVoxelMesh.hider.types}
              onChange={handleVoxelMeshHiderTypesChange}
            />
          </Section>
        </>
      )}
    </div>
  );
};
