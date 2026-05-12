export type AssetType =
  | "Manhole"
  | "Pipe"
  | "Culvert"
  | "Open Canal"
  | "Outlet / Inlet"
  | "Retention Basin"
  | "Pump"
  | "Pump Station"
  | "Flood Protection"
  | "Treatment Plant"
  | "Unknown";

export type Material = "Concrete" | "Metal" | "Other";
export type FlowDirection = "North" | "South" | "East" | "West";
export type UrbanLandUse =
  | "Residential"
  | "Industrial"
  | "Commercial"
  | "Public administration";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  UTM_Northing?: number;
  UTM_Easting?: number;
  UTM_Zone?: string;
}

export interface UrbanDrainageEntry {
  ec5_uuid: string;
  created_at: string;
  uploaded_at: string;
  assetType: AssetType;
  location: LocationData;
  material?: Material;
  internalDimensionMm?: number;
  flowDirection?: FlowDirection;
  visibleDefects?: boolean;
  urbanLandUse?: UrbanLandUse;
  notes?: string;
  photoUrl?: string;
}
