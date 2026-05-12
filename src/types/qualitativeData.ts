export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  UTM_Easting: number;
  UTM_Northing: number;
  UTM_Zone: string;
}

export type HazardSeverity = "Very High" | "High" | "Medium" | "Low" | "";

export interface QualitativeHazardEntry {
  ec5_uuid: string;
  title: string;
  created_at: string;
  uploaded_at: string;
  date: string; // 1_Select_the_date
  time: string; // 2_Indicate_the_time
  wasLocationCorrect: "Yes" | "No"; // 3_Was_this_location_
  location: LocationData; // 4_Tap_to_update_loca
  severity: HazardSeverity; // 5_How_severe_was_the
  hazardPhotoUrl: string | null; // 6_Take_a_picture_of_
  hasHighWaterMark: "Yes" | "No"; // 7_Is_there_an_existi
  waterHeightCm: number | string | null; // 8_What_is_the_height
  waterMarkPhotoUrl: string | null; // 9_Take_a_photo_of_th
  isWaterbodyNearby: "Yes" | "No" | ""; // 10_Is_there_a_waterb
}

export interface EpicollectResponse<T> {
  data: T[];
}
