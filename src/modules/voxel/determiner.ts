import {
  VoxelMeshDatabaseStore,
  VoxelMeshHiderType,
  VoxelMeshRelation,
} from "./types";

const DIRECTION_6_PATHS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 0, 1],
  [0, 0, -1],
  [0, 1, 0],
  [0, -1, 0],
];

interface VoxelMeshRule {
  relations: VoxelMeshRelation[];
  relationBorder: number;
  graphicMeshNames: string[];
  collisionMeshNames: string[];
  name: string;
}

interface VoxelMeshPart {
  rules: VoxelMeshRule[];
  name: string;
}

interface VoxelMesh {
  name: string;
  groupName?: string;
  parts: VoxelMeshPart[];
  hider: {
    types: VoxelMeshHiderType[];
  };
}

interface VoxelMeshRuleNode {
  children: { [key in string]?: VoxelMeshRuleNode };
  rules: number[];
  gridPoint: {
    x: number;
    y: number;
    z: number;
  };
}

interface Count {
  index: number;
  value: number;
}

export class VoxelMeshDeterminer {
  private meshes: Map<string, VoxelMesh>;
  private voxelRuleDeterminers: Map<string, VoxelMeshRuleNode[]>;

  constructor(store: VoxelMeshDatabaseStore) {
    this.meshes = new Map(
      store.meshes
        .map(
          (mesh): VoxelMesh => ({
            name: mesh.name,
            groupName: mesh.groupName ?? undefined,
            parts: mesh.parts.map((part) => {
              return {
                name: part.name,
                rules: part.rules.map((rule) => {
                  const relations = [...rule.relations];
                  relations.sort((a) => {
                    return getHiderType(a) ? -1 : 1;
                  });

                  let relationBorder = 0;
                  for (const relation of relations) {
                    if (!getHiderType(relation)) {
                      break;
                    }
                    relationBorder += 1;
                  }
                  return {
                    relations,
                    relationBorder,
                    graphicMeshNames: rule.graphicMeshNames,
                    collisionMeshNames: rule.collisionMeshNames,
                    name: rule.name,
                  };
                }),
              };
            }),
            hider: mesh.hider,
          }),
        )
        .map((x) => [x.name, x]),
    );
    this.voxelRuleDeterminers = new Map<string, VoxelMeshRuleNode[]>();

    for (const [name, mesh] of this.meshes.entries()) {
      const nodes = mesh.parts.map((part) => {
        let countList = DIRECTION_6_PATHS.map((x, index) => ({
          index,
          value: 0,
        }));
        for (
          let dirIndex = 0;
          dirIndex < DIRECTION_6_PATHS.length;
          dirIndex++
        ) {
          const direction = DIRECTION_6_PATHS[dirIndex];
          for (const rule of part.rules) {
            const relation = rule.relations.find(
              (relation) =>
                relation.x == direction[0] &&
                relation.y == direction[1] &&
                relation.z == direction[2],
            );
            if (relation) {
              const counter = countList[dirIndex];
              if (counter) {
                counter.value += 1;
              }
            }
          }
        }
        countList = countList.filter((x) => x.value > 0);
        countList.sort((a, b) => b.value - a.value);

        const node: VoxelMeshRuleNode = {
          children: {},
          rules: [],
          gridPoint: {
            x: 0,
            y: 0,
            z: 0,
          },
        };
        const ruleIndices = part.rules.map((_, index) => index);
        createNode(part, countList, 0, node, ruleIndices);
        return node;
      });
      this.voxelRuleDeterminers.set(name, nodes);
    }
  }

  search(
    name: string,
    gridPoint: { x: number; y: number; z: number },
    getMesh: (gridPoint: {
      x: number;
      y: number;
      z: number;
    }) => VoxelMesh | undefined,
  ) {
    const determiner = this.voxelRuleDeterminers.get(name);
    const mesh = this.meshes.get(name);
    if (!determiner || !mesh) {
      return undefined;
    }

    const results: VoxelMeshRule[] = [];
    for (let i = 0; i < determiner.length; i++) {
      const part = mesh.parts[i];
      const node = determiner[i];
      const ruleIndex = searchVoxelRuleIndex(node, part, gridPoint, getMesh);
      if (ruleIndex !== undefined) {
        results.push(part.rules[ruleIndex]);
      }
    }

    return {
      graphicMeshNames: results.map((rule) => rule.graphicMeshNames).flat(),
      collisionMeshNames: results.map((rule) => rule.collisionMeshNames).flat(),
    };
  }
}

const createNode = (
  part: VoxelMeshPart,
  countList: Count[],
  depth: number,
  currentNode: VoxelMeshRuleNode,
  remainRuleIndices: number[],
) => {
  const count = countList[depth];
  if (!count) {
    currentNode.rules = remainRuleIndices;
    return;
  }

  const direction = DIRECTION_6_PATHS[count.index];
  currentNode.gridPoint = { x: direction[0], y: direction[1], z: direction[2] };

  const nextRuleMap = new Map<string, number[]>();
  for (const remainRuleIndex of remainRuleIndices) {
    const rule = part.rules[remainRuleIndex];
    const relation = rule.relations.find(
      (relation) =>
        relation.x == direction[0] &&
        relation.y == direction[1] &&
        relation.z == direction[2],
    );
    const key = getVoxelNodeKeysFromRelation(relation);

    if (!nextRuleMap.has(key)) {
      nextRuleMap.set(key, []);
    }
    nextRuleMap.get(key)?.push(remainRuleIndex);
  }

  for (const [key, value] of nextRuleMap.entries()) {
    const newNode: VoxelMeshRuleNode = {
      children: {},
      rules: [],
      gridPoint: { x: 0, y: 0, z: 0 },
    };
    currentNode.children[key] = newNode;
    createNode(part, countList, depth + 1, newNode, value);
  }
};

const getVoxelNodeKeysFromRelation = (
  relation: VoxelMeshRelation | undefined,
) => {
  if (!relation) {
    return "A";
  }
  return JSON.stringify(relation);
};

const searchVoxelRuleIndex = (
  node: VoxelMeshRuleNode,
  target: VoxelMeshPart,
  targetGridPoint: { x: number; y: number; z: number },
  getMesh: (gridPoint: {
    x: number;
    y: number;
    z: number;
  }) => VoxelMesh | undefined,
): number | undefined => {
  if (node.rules.length !== 0) {
    const ruleIndex = node.rules.find((ruleIndex) => {
      const targetRule = target.rules[ruleIndex];
      return validateRemaining(targetRule, targetGridPoint, getMesh);
    });
    if (ruleIndex !== undefined) {
      return ruleIndex;
    }
  }

  const direction = node.gridPoint;
  const otherGridPoint = {
    x: direction.x + targetGridPoint.x,
    y: direction.y + targetGridPoint.y,
    z: direction.z + targetGridPoint.z,
  };
  const otherVoxelMesh = getMesh(otherGridPoint);
  const otherVoxelMeshName = otherVoxelMesh?.name;
  const otherVoxelMeshGroupName = otherVoxelMesh?.groupName;
  const hasOtherVoxelHider = otherVoxelMesh
    ? hasHiderTypeFromDirection(otherVoxelMesh.hider.types, direction)
    : false;

  for (const [key, nextNode] of Object.entries(node.children)) {
    if (
      !nextNode ||
      !validate(
        key,
        otherVoxelMeshName,
        otherVoxelMeshGroupName,
        hasOtherVoxelHider,
      )
    ) {
      continue;
    }
    const ruleIndex = searchVoxelRuleIndex(
      nextNode,
      target,
      targetGridPoint,
      getMesh,
    );
    if (ruleIndex !== undefined) {
      return ruleIndex;
    }
  }
  return;
};

const getHiderType = (direction: { x: number; y: number; z: number }) => {
  const map: {
    [x in number]?: { [y in number]?: { [z in number]?: VoxelMeshHiderType } };
  } = {
    [-1]: {
      [0]: {
        [0]: "right",
      },
    },
    [0]: {
      [-1]: {
        [0]: "top",
      },
      [0]: {
        [1]: "far",
        [-1]: "near",
      },
      [1]: {
        [0]: "bottom",
      },
    },
    [1]: {
      [0]: {
        [0]: "left",
      },
    },
  };
  return map[direction.x]?.[direction.y]?.[direction.z];
};

const hasHiderTypeFromDirection = (
  types: VoxelMeshHiderType[],
  direction: {
    x: number;
    y: number;
    z: number;
  },
) => {
  const hiderType = getHiderType(direction);
  if (!hiderType) {
    return false;
  }

  return types.includes(hiderType);
};

const validateRemaining = (
  rule: VoxelMeshRule,
  gridPoint: { x: number; y: number; z: number },
  getMesh: (gridPoint: {
    x: number;
    y: number;
    z: number;
  }) => VoxelMesh | undefined,
) => {
  if (rule.relationBorder == rule.relations.length) {
    return true;
  }

  return !rule.relations
    .slice(rule.relationBorder, rule.relations.length)
    .some((relation) => {
      const otherGridPoint = {
        x: gridPoint.x + relation.x,
        y: gridPoint.y + relation.y,
        z: gridPoint.z + relation.z,
      };
      const otherVoxelMesh = getMesh(otherGridPoint);
      return !isEquals(relation, gridPoint, otherVoxelMesh, otherGridPoint);
    });
};

const isEquals = (
  voxelMeshRelation: VoxelMeshRelation,
  gridRelationPoint: { x: number; y: number; z: number },
  voxelMesh: VoxelMesh | undefined,
  gridPoint: { x: number; y: number; z: number },
) => {
  switch (voxelMeshRelation.type) {
    case "voxelName":
      return voxelMesh ? voxelMesh.name === voxelMeshRelation.name : false;
    case "groupName":
      return voxelMesh ? voxelMesh.groupName === voxelMeshRelation.name : false;
    case "none":
      return !voxelMesh;
    case "hider":
      return voxelMesh
        ? hasHiderTypeFromDirection(voxelMesh.hider.types, {
            x: gridRelationPoint.x - gridPoint.x,
            y: gridRelationPoint.y - gridPoint.y,
            z: gridRelationPoint.z - gridPoint.z,
          })
        : false;
    case "!voxelName":
      return voxelMesh ? voxelMesh.name !== voxelMeshRelation.name : true;
    case "!groupName":
      return voxelMesh ? voxelMesh.groupName !== voxelMeshRelation.name : true;
    case "!hider":
      return voxelMesh
        ? !hasHiderTypeFromDirection(voxelMesh.hider.types, {
            x: gridRelationPoint.x - gridPoint.x,
            y: gridRelationPoint.y - gridPoint.y,
            z: gridRelationPoint.z - gridPoint.z,
          })
        : true;
    case "!voxelName&hider":
      return voxelMesh
        ? voxelMesh.name !== voxelMeshRelation.name &&
            !hasHiderTypeFromDirection(voxelMesh.hider.types, {
              x: gridRelationPoint.x - gridPoint.x,
              y: gridRelationPoint.y - gridPoint.y,
              z: gridRelationPoint.z - gridPoint.z,
            })
        : true;
    case "!groupName&hider":
      return voxelMesh
        ? voxelMesh.groupName !== voxelMeshRelation.name &&
            !hasHiderTypeFromDirection(voxelMesh.hider.types, {
              x: gridRelationPoint.x - gridPoint.x,
              y: gridRelationPoint.y - gridPoint.y,
              z: gridRelationPoint.z - gridPoint.z,
            })
        : true;
  }
};

const validate = (
  key: string,
  voxelName: string | undefined,
  groupName: string | undefined,
  hasOtherVoxelHider: boolean,
) => {
  if (key === "A") {
    return true;
  }

  const relation = JSON.parse(key) as VoxelMeshRelation;
  switch (relation.type) {
    case "voxelName":
      return voxelName === undefined ? voxelName === relation.name : false;
    case "groupName":
      return groupName === undefined ? groupName === relation.name : false;
    case "none":
      return voxelName !== undefined;
    case "hider":
      return hasOtherVoxelHider;
    case "!voxelName":
      return voxelName === undefined ? voxelName !== relation.name : true;
    case "!groupName":
      return groupName === undefined ? groupName !== relation.name : true;
    case "!hider":
      return !hasOtherVoxelHider;
    case "!voxelName&hider":
      return (
        (voxelName === undefined ? voxelName !== relation.name : true) &&
        !hasOtherVoxelHider
      );
    case "!groupName&hider":
      return (
        (groupName === undefined ? groupName !== relation.name : true) &&
        !hasOtherVoxelHider
      );
  }
};
