import { useEffect, useState, useMemo } from "react";
import { Map } from "./components/Map";
import { LayerPanel } from "./components/LayerPanel";
import { loadVulnerabilityExposure } from "./data/loaders/loadVulnerabilityExposure";
import { loadUrbanDrainage } from "./data/loaders/loadUrbanDrainage";
import { loadQualitativeData } from "./data/loaders/loadQualitativeData";
import { DRAINAGE_ASSET_ICONS } from "./config/mapConfig";
import type { VulnerabilityExposureEntry } from "./types/vulnerabilityExposure";
import type { UrbanDrainageEntry } from "./types/urbanDrainage";
import type { QualitativeHazardEntry } from "./types/qualitativeData";
import "./app.css";

export default function App() {
  const [vulnerabilityData, setVulnerabilityData] = useState<
    VulnerabilityExposureEntry[]
  >([]);
  const [drainageData, setDrainageData] = useState<UrbanDrainageEntry[]>([]);
  const [hazardData, setHazardData] = useState<QualitativeHazardEntry[]>([]);

  // Hamburger drawer trigger state
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    "vulnerability-exposure": true,
    "urban-drainage": true,
    "qualitative-hazard": true,
  });

  const [visibleAssetTypes, setVisibleAssetTypes] = useState<
    Record<string, boolean>
  >(() => {
    const configRegistry: Record<string, boolean> = {};
    Object.keys(DRAINAGE_ASSET_ICONS).forEach((type) => {
      configRegistry[type] = true;
    });
    return configRegistry;
  });

  useEffect(() => {
    loadVulnerabilityExposure().then(setVulnerabilityData);
    loadUrbanDrainage().then(setDrainageData);
    loadQualitativeData().then(setHazardData);
  }, []);

  const toggleLayer = (id: string) =>
    setVisibleLayers((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleAssetType = (assetType: string) =>
    setVisibleAssetTypes((prev) => ({
      ...prev,
      [assetType]: !prev[assetType],
    }));

  const assetTypeCounts = useMemo(() => {
    const subTotals: Record<string, number> = {};
    drainageData.forEach((item) => {
      subTotals[item.assetType] = (subTotals[item.assetType] || 0) + 1;
    });
    return subTotals;
  }, [drainageData]);

  const filteredDrainageData = useMemo(() => {
    return drainageData.filter(
      (item) => visibleAssetTypes[item.assetType] ?? true,
    );
  }, [drainageData, visibleAssetTypes]);

  const counts = {
    "vulnerability-exposure": vulnerabilityData.length,
    "urban-drainage": filteredDrainageData.length,
    "qualitative-hazard": hazardData.length,
  };

  return (
    <div className="app-shell">
      {/* Floating Hamburger Menu Action Icon */}
      <button
        className={`burger-menu-btn ${isPanelOpen ? "burger-active" : ""}`}
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        title="Toggle Layer Control Panel"
      >
        {isPanelOpen ? "✕" : "☰"}
      </button>

      <LayerPanel
        visibleLayers={visibleLayers}
        onToggle={toggleLayer}
        counts={counts}
        visibleAssetTypes={visibleAssetTypes}
        onToggleAssetType={toggleAssetType}
        assetTypeCounts={assetTypeCounts}
        isOpen={isPanelOpen}
      />

      <div className="map-container">
        <Map
          vulnerabilityData={vulnerabilityData}
          drainageData={filteredDrainageData}
          hazardData={hazardData}
          visibleLayers={visibleLayers}
        />
      </div>
    </div>
  );
}
