import Divider from "@mui/material/Divider";
import { OperationButtons } from "../../../components/OperationButtons/OperationButtons";
import { getNextName } from "../../../modules/getNextName";
import { VoxelMeshPart } from "../../../modules/voxel/types";
import {
  useVoxelMeshPart,
  useVoxelMeshParts,
} from "../../../modules/voxel/useVoxelMeshDatabaseStore";
import { useQueries } from "../useQueries";
import { VoxelMeshPartForm } from "./VoxelMeshPartForm";
import { VoxelMeshPartList } from "./VoxelMeshPartList";

export const VoxelMeshPartListTab = () => {
  const { selectedVoxelMeshName, selectedVoxelMeshPartName, setQueries } =
    useQueries();
  const {
    array: voxelMeshParts,
    add: addVoxelMeshPart,
    remove: removeVoxelMeshPart,
  } = useVoxelMeshParts(selectedVoxelMeshName);
  const [selectedVoxelMeshPart, setSelectedVoxelMeshPart] = useVoxelMeshPart(
    selectedVoxelMeshName,
    selectedVoxelMeshPartName,
  );

  const handleSubmit = (value: VoxelMeshPart) => {
    if (!selectedVoxelMeshName || !selectedVoxelMeshPartName) {
      return;
    }

    setSelectedVoxelMeshPart(selectedVoxelMeshPartName, value);
    if (selectedVoxelMeshPartName !== value.name) {
      setQueries({
        voxelMeshPartName: value.name,
      });
    }
  };

  const handleCreate = () => {
    addVoxelMeshPart({
      name: getNextName(
        voxelMeshParts,
        "NewVoxelMeshPart",
        (part) => part.name,
      ),
      rules: [],
    });
  };

  const handleDelete = () => {
    if (!selectedVoxelMeshName || !selectedVoxelMeshPartName) {
      return;
    }
    removeVoxelMeshPart(selectedVoxelMeshPartName);
    setQueries({
      voxelMeshName: selectedVoxelMeshName,
      voxelMeshPartName: null,
      voxelMeshRuleName: null,
      voxelMeshRuleGraphicMeshName: null,
      voxelMeshRuleCollisionMeshName: null,
      voxelMeshRelationIndex: null,
    });
  };

  const handleDuplicate = () => {
    if (!selectedVoxelMeshPart) {
      return;
    }

    const nextName = getNextName(
      voxelMeshParts,
      selectedVoxelMeshPart.name,
      (part) => part.name,
    );
    addVoxelMeshPart({ ...selectedVoxelMeshPart, name: nextName });
  };

  const handleVoxelMeshPartSelect = (value: VoxelMeshPart) => {
    setQueries({
      voxelMeshPartName:
        selectedVoxelMeshPartName === value.name ? null : value.name,
      voxelMeshRuleName: null,
      voxelMeshRuleGraphicMeshName: null,
      voxelMeshRuleCollisionMeshName: null,
      voxelMeshRelationIndex: null,
    });
  };

  return (
    <div>
      <VoxelMeshPartList
        selectedVoxelMeshPartName={selectedVoxelMeshPartName}
        voxelMeshParts={voxelMeshParts}
        onSelect={handleVoxelMeshPartSelect}
      />
      <OperationButtons
        disabledDuplicate={!selectedVoxelMeshPart}
        disabledDelete={!selectedVoxelMeshPart}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
      {selectedVoxelMeshPart && (
        <>
          <Divider />
          <VoxelMeshPartForm
            key={selectedVoxelMeshPartName}
            defaultValues={selectedVoxelMeshPart}
            voxelMeshPartNames={voxelMeshParts
              .map((part) => part.name)
              .filter((x) => x !== selectedVoxelMeshName)}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
};
