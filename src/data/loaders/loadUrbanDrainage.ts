import type { UrbanDrainageEntry } from "../../types/urbanDrainage";

export async function loadUrbanDrainage(): Promise<UrbanDrainageEntry[]> {
  const raw = (await import("../raw/form-1__urban-drainage-cleaned.json")) as {
    default: { data: UrbanDrainageEntry[] };
  };
  console.log(raw.default.data);
  return raw.default.data;
}
