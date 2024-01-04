import Divider from "@mui/material/Divider";
import { OperationButtons } from "../../../components/OperationButtons/OperationButtons";
import { SectionLabel } from "../../../components/Section/SectionLabel";
import { getNextName } from "../../../modules/getNextName";
import { VoxelMeshRule } from "../../../modules/voxel/types";
import {
  useVoxelMeshRule,
  useVoxelMeshRuleCollisionMeshNames,
  useVoxelMeshRuleGraphicMeshNames,
  useVoxelMeshRules,
} from "../../../modules/voxel/useVoxelMeshDatabaseStore";
import { useQueries } from "../useQueries";
import { VoxelMeshRuleCollisionMeshNameForm } from "./VoxelMeshRuleCollisionMeshNameForm";
import { VoxelMeshRuleCollisionMeshNameList } from "./VoxelMeshRuleCollisionMeshNameList";
import { VoxelMeshRuleForm } from "./VoxelMeshRuleForm";
import { VoxelMeshRuleGraphicMeshNameForm } from "./VoxelMeshRuleGraphicMeshNameForm";
import { VoxelMeshRuleGraphicMeshNameList } from "./VoxelMeshRuleGraphicMeshNameList";
import { VoxelMeshRuleList } from "./VoxelMeshRuleList";

export const VoxelMeshRuleListTab = () => {
  const {
    selectedVoxelMeshName,
    selectedVoxelMeshPartName,
    selectedVoxelMeshRuleName,
    selectedVoxelMeshRuleGraphicMeshName,
    selectedVoxelMeshRuleCollisionMeshName,
    setQueries,
  } = useQueries();
  const {
    array: voxelMeshRules,
    add: addVoxelMeshRule,
    remove: removeVoxelMeshRule,
    exchange: exchangeVoxelMeshRule,
  } = useVoxelMeshRules({
    voxelMeshName: selectedVoxelMeshName,
    voxelMeshPartName: selectedVoxelMeshPartName,
  });
  const [selectedVoxelMeshRule, setSelectedVoxelMeshRule] = useVoxelMeshRule({
    voxelMeshName: selectedVoxelMeshName,
    voxelMeshPartName: selectedVoxelMeshPartName,
    voxelMeshRuleName: selectedVoxelMeshRuleName,
  });
  const selectedVoxelMeshRuleIndex = selectedVoxelMeshRuleName
    ? (() => {
        const index = voxelMeshRules.findIndex(
          (x) => x.name === selectedVoxelMeshRuleName,
        );
        return index < 0 ? undefined : index;
      })()
    : undefined;
  const isSelectedVoxelMeshRuleGraphicMeshName =
    selectedVoxelMeshRuleGraphicMeshName
      ? selectedVoxelMeshRule?.graphicMeshNames.includes(
          selectedVoxelMeshRuleGraphicMeshName,
        )
      : false;
  const isSelectedVoxelMeshRuleCollisionMeshName =
    selectedVoxelMeshRuleCollisionMeshName
      ? selectedVoxelMeshRule?.collisionMeshNames.includes(
          selectedVoxelMeshRuleCollisionMeshName,
        )
      : false;
  const {
    add: addGraphicMeshName,
    remove: removeGraphicMeshName,
    update: updateGraphicMeshName,
  } = useVoxelMeshRuleGraphicMeshNames({
    voxelMeshName: selectedVoxelMeshName,
    voxelMeshPartName: selectedVoxelMeshPartName,
    voxelMeshRuleName: selectedVoxelMeshRuleName,
  });
  const {
    add: addCollisionMeshName,
    remove: removeCollisionMeshName,
    update: updateCollisionMeshName,
  } = useVoxelMeshRuleCollisionMeshNames({
    voxelMeshName: selectedVoxelMeshName,
    voxelMeshPartName: selectedVoxelMeshPartName,
    voxelMeshRuleName: selectedVoxelMeshRuleName,
  });

  const handleSubmit = (value: VoxelMeshRule) => {
    if (
      !selectedVoxelMeshName ||
      !selectedVoxelMeshPartName ||
      !selectedVoxelMeshRuleName
    ) {
      return;
    }

    setSelectedVoxelMeshRule(selectedVoxelMeshRuleName, value);
    if (selectedVoxelMeshRuleName !== value.name) {
      setQueries({
        voxelMeshRuleName: value.name,
      });
    }
  };

  const handleRuleCreate = () => {
    addVoxelMeshRule({
      name: getNextName(
        voxelMeshRules,
        "NewVoxelMeshRule",
        (rule) => rule.name,
      ),
      relations: [],
      graphicMeshNames: [],
      collisionMeshNames: [],
    });
  };

  const handleRuleDelete = () => {
    if (
      !selectedVoxelMeshName ||
      !selectedVoxelMeshPartName ||
      !selectedVoxelMeshRuleName
    ) {
      return;
    }
    removeVoxelMeshRule(selectedVoxelMeshRuleName);
    setQueries({
      voxelMeshRuleName: null,
      voxelMeshRuleGraphicMeshName: null,
      voxelMeshRuleCollisionMeshName: null,
      voxelMeshRelationIndex: null,
    });
  };

  const handleRuleDuplicate = () => {
    if (!selectedVoxelMeshRule) {
      return;
    }

    const nextName = getNextName(
      voxelMeshRules,
      selectedVoxelMeshRule.name,
      (rule) => rule.name,
    );
    addVoxelMeshRule({ ...selectedVoxelMeshRule, name: nextName });
  };

  const handleRuleSelect = (value: VoxelMeshRule) => {
    setQueries({
      voxelMeshRuleName:
        selectedVoxelMeshRuleName === value.name ? null : value.name,
      voxelMeshRelationIndex: null,
      voxelMeshRuleGraphicMeshName: null,
      voxelMeshRuleCollisionMeshName: null,
    });
  };

  const handleGraphicMeshNameCreate = () => {
    if (!selectedVoxelMeshRule) {
      return;
    }
    addGraphicMeshName(
      getNextName(selectedVoxelMeshRule.graphicMeshNames, "Graphic", (x) => x),
    );
  };

  const handleGraphicMeshNameDelete = () => {
    if (!selectedVoxelMeshRuleGraphicMeshName) {
      return;
    }
    removeGraphicMeshName(selectedVoxelMeshRuleGraphicMeshName);
  };

  const handleGraphicMeshNameDuplicate = () => {
    if (!selectedVoxelMeshRule || !selectedVoxelMeshRuleGraphicMeshName) {
      return;
    }
    addGraphicMeshName(
      getNextName(
        selectedVoxelMeshRule.graphicMeshNames,
        selectedVoxelMeshRuleGraphicMeshName,
        (x) => x,
      ),
    );
  };

  const handleGraphicMeshNameSubmit = (value: { name: string }) => {
    if (!selectedVoxelMeshRuleGraphicMeshName) {
      return;
    }
    updateGraphicMeshName(selectedVoxelMeshRuleGraphicMeshName, value.name);
    if (selectedVoxelMeshRuleGraphicMeshName !== value.name) {
      setQueries({
        voxelMeshRuleGraphicMeshName: value.name,
      });
    }
  };

  const handleGraphicMeshNameSelect = (value: string) => {
    setQueries({
      voxelMeshRuleGraphicMeshName:
        selectedVoxelMeshRuleGraphicMeshName === value ? null : value,
    });
  };

  const handleCollisionMeshNameCreate = () => {
    if (!selectedVoxelMeshRule) {
      return;
    }
    addCollisionMeshName(
      getNextName(
        selectedVoxelMeshRule.collisionMeshNames,
        "Collision",
        (x) => x,
      ),
    );
  };

  const handleCollisionMeshNameDelete = () => {
    if (!selectedVoxelMeshRuleCollisionMeshName) {
      return;
    }
    removeCollisionMeshName(selectedVoxelMeshRuleCollisionMeshName);
  };

  const handleCollisionMeshNameDuplicate = () => {
    if (!selectedVoxelMeshRule || !selectedVoxelMeshRuleCollisionMeshName) {
      return;
    }
    addCollisionMeshName(
      getNextName(
        selectedVoxelMeshRule.collisionMeshNames,
        selectedVoxelMeshRuleCollisionMeshName,
        (x) => x,
      ),
    );
  };

  const handleCollisionMeshNameSelect = (value: string) => {
    setQueries({
      voxelMeshRuleCollisionMeshName:
        selectedVoxelMeshRuleGraphicMeshName === value ? null : value,
    });
  };

  const handleCollisionMeshNameSubmit = (value: { name: string }) => {
    if (!selectedVoxelMeshRuleCollisionMeshName) {
      return;
    }
    updateCollisionMeshName(selectedVoxelMeshRuleCollisionMeshName, value.name);
    if (selectedVoxelMeshRuleCollisionMeshName !== value.name) {
      setQueries({
        voxelMeshRuleCollisionMeshName: value.name,
      });
    }
  };

  const handleRuleMoveUp = () => {
    if (selectedVoxelMeshRuleIndex === undefined) {
      return;
    }
    exchangeVoxelMeshRule(
      selectedVoxelMeshRuleIndex,
      selectedVoxelMeshRuleIndex - 1,
    );
  };

  const handleRuleMoveDown = () => {
    if (selectedVoxelMeshRuleIndex === undefined) {
      return;
    }
    exchangeVoxelMeshRule(
      selectedVoxelMeshRuleIndex,
      selectedVoxelMeshRuleIndex + 1,
    );
  };

  const handleRuleRotateRight = () => {
    if (!selectedVoxelMeshRule) {
      return;
    }

    const rad = Math.PI / 2;
    const relations = selectedVoxelMeshRule.relations.map((relation) => ({
      ...relation,
      x: Math.round(relation.x * Math.cos(rad) - relation.z * Math.sin(rad)),
      z: Math.round(relation.x * Math.sin(rad) + relation.z * Math.cos(rad)),
    }));
    setSelectedVoxelMeshRule(selectedVoxelMeshRule.name, {
      ...selectedVoxelMeshRule,
      relations,
    });
  };

  const handleRuleRotateLeft = () => {
    if (!selectedVoxelMeshRule) {
      return;
    }

    const rad = -Math.PI / 2;
    const relations = selectedVoxelMeshRule.relations.map((relation) => ({
      ...relation,
      x: Math.round(relation.x * Math.cos(rad) - relation.z * Math.sin(rad)),
      z: Math.round(relation.x * Math.sin(rad) + relation.z * Math.cos(rad)),
    }));
    setSelectedVoxelMeshRule(selectedVoxelMeshRule.name, {
      ...selectedVoxelMeshRule,
      relations,
    });
  };

  return (
    <div>
      <VoxelMeshRuleList
        selectedVoxelMeshRuleName={selectedVoxelMeshRuleName}
        voxelMeshRules={voxelMeshRules}
        onSelect={handleRuleSelect}
      />
      <OperationButtons
        disabledDuplicate={!selectedVoxelMeshRule}
        disabledDelete={!selectedVoxelMeshRule}
        disabledMoveUp={
          selectedVoxelMeshRuleIndex === undefined ||
          selectedVoxelMeshRuleIndex < 1
        }
        disabledMoveDown={
          selectedVoxelMeshRuleIndex === undefined ||
          selectedVoxelMeshRuleIndex >= voxelMeshRules.length - 1
        }
        onCreate={handleRuleCreate}
        onDelete={handleRuleDelete}
        onDuplicate={handleRuleDuplicate}
        onMoveUp={handleRuleMoveUp}
        onMoveDown={handleRuleMoveDown}
        onRotateRight={handleRuleRotateRight}
        onRotateLeft={handleRuleRotateLeft}
      />
      {selectedVoxelMeshRule && (
        <>
          <Divider />
          <VoxelMeshRuleForm
            key={selectedVoxelMeshRuleName}
            defaultValues={selectedVoxelMeshRule}
            voxelMeshRuleNames={voxelMeshRules
              .map((rule) => rule.name)
              .filter((x) => x !== selectedVoxelMeshRuleName)}
            onSubmit={handleSubmit}
          />
          <Divider />
          <SectionLabel text="Graphics" />
          <VoxelMeshRuleGraphicMeshNameList
            selectedGraphicMeshName={selectedVoxelMeshRuleGraphicMeshName}
            graphicMeshNames={selectedVoxelMeshRule.graphicMeshNames}
            onSelect={handleGraphicMeshNameSelect}
          />
          {selectedVoxelMeshRuleGraphicMeshName &&
            selectedVoxelMeshRule.graphicMeshNames.includes(
              selectedVoxelMeshRuleGraphicMeshName,
            ) && (
              <VoxelMeshRuleGraphicMeshNameForm
                defaultValues={{
                  name: selectedVoxelMeshRuleGraphicMeshName,
                }}
                names={selectedVoxelMeshRule.graphicMeshNames}
                onSubmit={handleGraphicMeshNameSubmit}
              />
            )}

          <OperationButtons
            disabledDuplicate={!isSelectedVoxelMeshRuleGraphicMeshName}
            disabledDelete={!isSelectedVoxelMeshRuleGraphicMeshName}
            onCreate={handleGraphicMeshNameCreate}
            onDelete={handleGraphicMeshNameDelete}
            onDuplicate={handleGraphicMeshNameDuplicate}
          />
          <Divider />
          <SectionLabel text="Collisions" />
          <VoxelMeshRuleCollisionMeshNameList
            selectedGraphicMeshName={selectedVoxelMeshRuleCollisionMeshName}
            graphicMeshNames={selectedVoxelMeshRule.collisionMeshNames}
            onSelect={handleCollisionMeshNameSelect}
          />
          {selectedVoxelMeshRuleCollisionMeshName &&
            selectedVoxelMeshRule.collisionMeshNames.includes(
              selectedVoxelMeshRuleCollisionMeshName,
            ) && (
              <VoxelMeshRuleCollisionMeshNameForm
                defaultValues={{
                  name: selectedVoxelMeshRuleCollisionMeshName,
                }}
                names={selectedVoxelMeshRule.collisionMeshNames}
                onSubmit={handleCollisionMeshNameSubmit}
              />
            )}
          <OperationButtons
            disabledDuplicate={!isSelectedVoxelMeshRuleCollisionMeshName}
            disabledDelete={!isSelectedVoxelMeshRuleCollisionMeshName}
            onCreate={handleCollisionMeshNameCreate}
            onDelete={handleCollisionMeshNameDelete}
            onDuplicate={handleCollisionMeshNameDuplicate}
          />
        </>
      )}
    </div>
  );
};
