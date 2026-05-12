import type { QualitativeHazardEntry } from "../../types/qualitativeData";

export async function loadQualitativeData(): Promise<QualitativeHazardEntry[]> {
  const raw =
    (await import("../raw/form-1__qualitative-hazard-assessment.json")) as {
      default: { data: QualitativeHazardEntry[] };
    };
  console.log(raw.default.data);
  return raw.default.data;
}
