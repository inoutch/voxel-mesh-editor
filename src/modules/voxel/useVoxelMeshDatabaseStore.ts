import { useLocalStorage } from "@uidotdev/usehooks";
import { useCallback, useMemo } from "react";
import { atom, useRecoilState } from "recoil";
import { createUseArrayOperation } from "../createUseArrayOperation";
import {
  createDefault,
  migrate,
  VoxelMesh,
  VoxelMeshDatabaseStore,
  VoxelMeshPart,
  VoxelMeshRelation,
  VoxelMeshRule,
} from "./types";

const MAIN_KEY = "VoxelMeshStore";
const BACKUP_KEY = "VoxelMeshBackupStore";

export const useVoxelMeshDatabaseBackups = () => {
  const [store, setStore] = useLocalStorage<{
    backups: {
      store: VoxelMeshDatabaseStore;
      createdAt: number;
    }[];
  }>(BACKUP_KEY, { backups: [] });

  const pushBackup = useCallback(
    (value: VoxelMeshDatabaseStore) => {
      setStore({
        backups: [...store.backups, { store: value, createdAt: Date.now() }],
      });
    },
    [setStore, store],
  );

  return { store, pushBackup };
};

const init = (): VoxelMeshDatabaseStore => {
  try {
    const json = localStorage.getItem(MAIN_KEY);
    if (!json) {
      throw new Error("json is null");
    }
    return migrate(JSON.parse(json));
  } catch (e) {
    console.error(e);
    return createDefault();
  }
};

const voxelMeshDatabaseStoreState = atom<VoxelMeshDatabaseStore>({
  key: "voxelMeshDatabaseStoreState",
  default: init(),
});

export const useVoxelMeshDatabase = () => {
  const [store, setStore] = useRecoilState(voxelMeshDatabaseStoreState);
  const { pushBackup } = useVoxelMeshDatabaseBackups();
  const save = useCallback(
    (store: VoxelMeshDatabaseStore) => {
      setStore(store);
      pushBackup(store);
      localStorage.setItem(MAIN_KEY, JSON.stringify(store));
    },
    [setStore, pushBackup],
  );

  return { store, setStore, save };
};

export const useVoxelMeshes = createUseArrayOperation<VoxelMesh>(
  () => {
    const { store, setStore } = useVoxelMeshDatabase();
    return [store.meshes, (meshes) => setStore({ ...store, meshes })];
  },
  (value) => value.name,
);

export const useVoxelMesh = (voxelMeshName: string | undefined) => {
  const { array, update } = useVoxelMeshes();
  const mesh = useMemo(() => {
    return array.find((x) => x.name === voxelMeshName);
  }, [array, voxelMeshName]);
  return [mesh, update] as const;
};

export const useVoxelMeshParts = createUseArrayOperation<
  VoxelMeshPart,
  string,
  string | undefined
>(
  (voxelMeshName) => {
    const [mesh, setMesh] = useVoxelMesh(voxelMeshName);
    const update = useCallback(
      (parts: VoxelMeshPart[]) => {
        if (!mesh) {
          return;
        }
        setMesh(mesh.name, { ...mesh, parts });
      },
      [mesh, setMesh],
    );
    return [mesh?.parts || [], update];
  },
  (value) => value.name,
);

export const useVoxelMeshPart = (
  voxelMeshName: string | undefined,
  voxelMeshPartName: string | undefined,
) => {
  const { array, update } = useVoxelMeshParts(voxelMeshName);
  const part = useMemo(() => {
    return array.find((x) => x.name === voxelMeshPartName);
  }, [array, voxelMeshPartName]);
  return [part, update] as const;
};

export const useVoxelMeshRules = createUseArrayOperation<
  VoxelMeshRule,
  string,
  { voxelMeshName: string | undefined; voxelMeshPartName: string | undefined }
>(
  ({ voxelMeshName, voxelMeshPartName }) => {
    const [part, setPart] = useVoxelMeshPart(voxelMeshName, voxelMeshPartName);
    const update = useCallback(
      (rules: VoxelMeshRule[]) => {
        if (!part) {
          return;
        }
        setPart(part.name, { ...part, rules });
      },
      [part, setPart],
    );
    return [part?.rules || [], update];
  },
  (value) => value.name,
);

export const useVoxelMeshRule = ({
  voxelMeshName,
  voxelMeshPartName,
  voxelMeshRuleName,
}: {
  voxelMeshName: string | undefined;
  voxelMeshPartName: string | undefined;
  voxelMeshRuleName: string | undefined;
}) => {
  const { array, update } = useVoxelMeshRules({
    voxelMeshName,
    voxelMeshPartName,
  });
  const rule = useMemo(() => {
    return array.find((x) => x.name === voxelMeshRuleName);
  }, [array, voxelMeshRuleName]);
  return [rule, update] as const;
};

export const useVoxelMeshRuleGraphicMeshNames = createUseArrayOperation<
  string,
  string,
  {
    voxelMeshName: string | undefined;
    voxelMeshPartName: string | undefined;
    voxelMeshRuleName: string | undefined;
  }
>(
  (params) => {
    const [rule, setRule] = useVoxelMeshRule(params);
    const update = useCallback(
      (names: string[]) => {
        if (!rule) {
          return;
        }
        setRule(rule.name, { ...rule, graphicMeshNames: names });
      },
      [rule, setRule],
    );
    return [rule?.graphicMeshNames || [], update] as const;
  },
  (x) => x,
);

export const useVoxelMeshRuleCollisionMeshNames = createUseArrayOperation<
  string,
  string,
  {
    voxelMeshName: string | undefined;
    voxelMeshPartName: string | undefined;
    voxelMeshRuleName: string | undefined;
  }
>(
  (params) => {
    const [rule, setRule] = useVoxelMeshRule(params);
    const update = useCallback(
      (names: string[]) => {
        if (!rule) {
          return;
        }
        setRule(rule.name, { ...rule, collisionMeshNames: names });
      },
      [rule, setRule],
    );
    return [rule?.collisionMeshNames || [], update] as const;
  },
  (x) => x,
);

export const useVoxelMeshRelations = createUseArrayOperation<
  VoxelMeshRelation,
  VoxelMeshRelation,
  {
    voxelMeshName: string | undefined;
    voxelMeshPartName: string | undefined;
    voxelMeshRuleName: string | undefined;
  }
>(
  ({ voxelMeshName, voxelMeshPartName, voxelMeshRuleName }) => {
    const [rule, setRule] = useVoxelMeshRule({
      voxelMeshName,
      voxelMeshPartName,
      voxelMeshRuleName,
    });

    const update = useCallback(
      (relations: VoxelMeshRelation[]) => {
        if (!rule) {
          return;
        }
        setRule(rule.name, { ...rule, relations });
      },
      [rule, setRule],
    );

    return [rule?.relations || [], update] as const;
  },
  (x) => x,
);

export const useVoxelMeshRelation = ({
  voxelMeshName,
  voxelMeshPartName,
  voxelMeshRuleName,
  voxelMeshRelationIndex,
}: {
  voxelMeshName: string | undefined;
  voxelMeshPartName: string | undefined;
  voxelMeshRuleName: string | undefined;
  voxelMeshRelationIndex: number | undefined;
}) => {
  const { array, update } = useVoxelMeshRelations({
    voxelMeshName,
    voxelMeshPartName,
    voxelMeshRuleName,
  });
  const relation: VoxelMeshRelation | undefined = useMemo(() => {
    return array[voxelMeshRelationIndex ?? -1];
  }, [array, voxelMeshRelationIndex]);
  return [relation, update] as const;
};

export const useVoxelNames = () => {
  const { array } = useVoxelMeshes();
  return useMemo(() => {
    return array.map((x) => x.name);
  }, [array]);
};

export const useGroupNames = () => {
  const { array } = useVoxelMeshes();
  return useMemo(() => {
    return array
      .map((x) => x.groupName)
      .filter((x): x is NonNullable<typeof x> => !!x);
  }, [array]);
};
