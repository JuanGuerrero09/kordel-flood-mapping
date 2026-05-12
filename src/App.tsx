import { useEffect, useState } from "react";
import { Map } from "./components/Map";
import { LayerPanel } from "./components/LayerPanel";
import { loadVulnerabilityExposure } from "./data/loaders/loadVulnerabilityExposure";
import { loadUrbanDrainage } from "./data/loaders/loadUrbanDrainage";
import { loadQualitativeData } from "./data/loaders/loadQualitativeData"; // New loader
import type { VulnerabilityExposureEntry } from "./types/vulnerabilityExposure";
import type { UrbanDrainageEntry } from "./types/urbanDrainage";
import type { QualitativeHazardEntry } from "./types/qualitativeData"; // New type
import "./app.css";

export default function App() {
  const [vulnerabilityData, setVulnerabilityData] = useState<
    VulnerabilityExposureEntry[]
  >([]);
  const [drainageData, setDrainageData] = useState<UrbanDrainageEntry[]>([]);
  const [hazardData, setHazardData] = useState<QualitativeHazardEntry[]>([]); // New state

  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    "vulnerability-exposure": true,
    "urban-drainage": true,
    "qualitative-hazard": true, // New layer visibility
  });

  useEffect(() => {
    loadVulnerabilityExposure().then(setVulnerabilityData);
    loadUrbanDrainage().then(setDrainageData);
    loadQualitativeData().then(setHazardData); // Fetch hazard data
  }, []);

  const toggleLayer = (id: string) =>
    setVisibleLayers((prev) => ({ ...prev, [id]: !prev[id] }));

  const counts = {
    "vulnerability-exposure": vulnerabilityData.length,
    "urban-drainage": drainageData.length,
    "qualitative-hazard": hazardData.length, // Update counts for sidebar
  };

  return (
    <div className="app-shell">
      <LayerPanel
        visibleLayers={visibleLayers}
        onToggle={toggleLayer}
        counts={counts}
      />
      <div className="map-container">
        <Map
          vulnerabilityData={vulnerabilityData}
          drainageData={drainageData}
          hazardData={hazardData} // Pass hazard data to Map
          visibleLayers={visibleLayers}
        />
      </div>
    </div>
  );
}
