import { useLocalStorage } from "@uidotdev/usehooks";

const KEY = "__SETTINGS";

interface SettingsStore {
  model:
    | {
        type: "url";
        url: string;
      }
    | {
        type: "bytes";
        base64: string | null;
        filename: string | null;
      };
}

export const modelTypes = ["url", "bytes"];

export const useSettings = () => {
  return useLocalStorage<SettingsStore>(KEY, {
    model: { type: "url", url: "/glass_stone.glb" },
  });
};
