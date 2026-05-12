import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_CONFIG, DRAINAGE_ASSET_ICONS } from "../config/mapConfig";
import type { VulnerabilityExposureEntry } from "../types/vulnerabilityExposure";
import type { UrbanDrainageEntry } from "../types/urbanDrainage";
import type { QualitativeHazardEntry } from "../types/qualitativeData";

interface MapProps {
  vulnerabilityData: VulnerabilityExposureEntry[];
  drainageData: UrbanDrainageEntry[];
  hazardData: QualitativeHazardEntry[];
  visibleLayers: Record<string, boolean>;
}

/**
 * Helper to build the Vulnerability & Exposure popup
 */
function buildVulnerabilityPopup(entry: VulnerabilityExposureEntry): string {
  const kindTags = entry.buildingKind
    .map((k) => `<span class="popup-tag tag-kind">${k}</span>`)
    .join("");
  const charTags = entry.buildingCharacter
    .map((c) => `<span class="popup-tag tag-char">${c}</span>`)
    .join("");

  const photo = entry.photoUrl
    ? `<a href="${entry.photoUrl}" target="_blank" rel="noreferrer">
         <img src="${entry.photoUrl}" alt="Site photo" class="popup-photo" />
       </a>`
    : "";

  return `
    <div class="popup-inner">
      ${photo}
      <div class="popup-body">
        <div class="popup-form-label">Vulnerability &amp; Exposure</div>
        <div class="popup-row"><span class="popup-label">Date</span><span class="popup-value">${entry.date} · ${entry.time}</span></div>
        ${entry.buildingKind.length ? `<div class="popup-row"><span class="popup-label">Use</span><span class="popup-value">${kindTags}</span></div>` : ""}
        ${entry.buildingCharacter.length ? `<div class="popup-row"><span class="popup-label">Condition</span><span class="popup-value">${charTags}</span></div>` : ""}
        <div class="popup-uuid">${entry.ec5_uuid}</div>
      </div>
    </div>`;
}

/**
 * Helper to build the Urban Drainage popup
 */
function buildDrainagePopup(entry: UrbanDrainageEntry): string {
  const icon = DRAINAGE_ASSET_ICONS[entry.assetType] ?? "❓";
  const photo = entry.photoUrl
    ? `<a href="${entry.photoUrl}" target="_blank" rel="noreferrer">
         <img src="${entry.photoUrl}" alt="Site photo" class="popup-photo" />
       </a>`
    : "";

  const defectTag =
    entry.visibleDefects === true
      ? `<span class="popup-tag tag-warn">⚠ Visible defects</span>`
      : entry.visibleDefects === false
        ? `<span class="popup-tag tag-ok">✓ No defects</span>`
        : "";

  const landUseTag = entry.urbanLandUse
    ? `<span class="popup-tag tag-land">${entry.urbanLandUse}</span>`
    : "";

  return `
    <div class="popup-inner">
      ${photo}
      <div class="popup-body">
        <div class="popup-form-label">Urban Drainage</div>
        <div class="popup-asset-title">${icon} ${entry.assetType}</div>
        ${entry.material ? `<div class="popup-row"><span class="popup-label">Material</span><span class="popup-value">${entry.material}</span></div>` : ""}
        ${entry.internalDimensionMm ? `<div class="popup-row"><span class="popup-label">Diameter</span><span class="popup-value">${entry.internalDimensionMm} mm</span></div>` : ""}
        ${entry.flowDirection ? `<div class="popup-row"><span class="popup-label">Flow</span><span class="popup-value">${entry.flowDirection}</span></div>` : ""}
        ${defectTag || landUseTag ? `<div class="popup-row"><span class="popup-label">Status</span><span class="popup-value">${defectTag}${landUseTag}</span></div>` : ""}
        ${entry.notes ? `<div class="popup-notes">${entry.notes}</div>` : ""}
        <div class="popup-uuid">${entry.ec5_uuid}</div>
      </div>
    </div>`;
}

/**
 * Helper to build the Qualitative Hazard popup with a photo slider
 */
function buildHazardPopup(entry: QualitativeHazardEntry): string {
  const photos = [];
  if (entry.hazardPhotoUrl)
    photos.push({ url: entry.hazardPhotoUrl, label: "Hazard Site" });
  if (entry.waterMarkPhotoUrl)
    photos.push({ url: entry.waterMarkPhotoUrl, label: "Water Mark" });

  const hasMultiple = photos.length > 1;
  const uuid = entry.ec5_uuid;

  // CSS-only slider logic using radio buttons
  const sliderHtml =
    photos.length > 0
      ? `<div class="popup-slider">
        ${photos
          .map(
            (_, i) => `
          <input type="radio" name="slider-${uuid}" id="s-${uuid}-${i}" ${i === 0 ? "checked" : ""} class="slider-state">
        `,
          )
          .join("")}
        
        <div class="slider-viewport">
          ${photos
            .map(
              (p, i) => `
            <div class="slider-slide slide-${i}">
              <a href="${p.url}" target="_blank" rel="noreferrer" class="photo-link">
                <img src="${p.url}" alt="${p.label}" class="popup-photo" title="Click to enlarge" />
              </a>
              <div class="photo-badge">${p.label}</div>
              
              ${
                hasMultiple
                  ? `
                <div class="slider-controls">
                  <label for="s-${uuid}-${i === 0 ? photos.length - 1 : i - 1}" class="slider-arrow prev">❮</label>
                  <label for="s-${uuid}-${i === photos.length - 1 ? 0 : i + 1}" class="slider-arrow next">❯</label>
                </div>
              `
                  : ""
              }
            </div>
          `,
            )
            .join("")}
        </div>
      </div>`
      : "";

  const severityClass =
    entry.severity?.toLowerCase().replace(/\s+/g, "-") || "none";

  return `
    <div class="popup-inner">
      ${sliderHtml}
      <div class="popup-body">
        <div class="popup-form-label">Qualitative Hazard Assessment</div>
        <div class="popup-row">
          <span class="popup-label">Severity</span>
          <span class="popup-tag severity-${severityClass}">${entry.severity || "Not Specified"}</span>
        </div>
        ${
          entry.waterHeightCm
            ? `
          <div class="popup-row">
            <span class="popup-label">Water Height</span>
            <span class="popup-value"><strong>${entry.waterHeightCm} cm</strong></span>
          </div>`
            : ""
        }
        <div class="popup-row">
          <span class="popup-label">Waterbody?</span>
          <span class="popup-value">${entry.isWaterbodyNearby || "N/A"}</span>
        </div>
        <div class="popup-uuid">${entry.ec5_uuid}</div>
      </div>
    </div>`;
}

export function Map({
  vulnerabilityData,
  drainageData,
  hazardData,
  visibleLayers,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const vulnMarkersRef = useRef<maplibregl.Marker[]>([]);
  const drainMarkersRef = useRef<maplibregl.Marker[]>([]);
  const hazardMarkersRef = useRef<maplibregl.Marker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_CONFIG.style,
      center: MAP_CONFIG.initialCenter,
      zoom: MAP_CONFIG.initialZoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
      maxBounds: MAP_CONFIG.maxBounds,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current.addControl(
      new maplibregl.ScaleControl({ unit: "metric" }),
      "bottom-right",
    );

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Vulnerability Markers Effect
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    vulnMarkersRef.current.forEach((m) => m.remove());
    vulnMarkersRef.current = [];
    if (!(visibleLayers["vulnerability-exposure"] ?? true)) return;

    vulnerabilityData.forEach((entry) => {
      const el = document.createElement("div");
      el.className = "marker marker-vulnerability";
      el.innerHTML = "🏠";
      const popup = new maplibregl.Popup({
        offset: 18,
        maxWidth: "300px",
        className: "kordel-popup",
      }).setHTML(buildVulnerabilityPopup(entry));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([entry.location.longitude, entry.location.latitude])
        .setPopup(popup)
        .addTo(map);

      vulnMarkersRef.current.push(marker);
    });
  }, [vulnerabilityData, visibleLayers]);

  // Drainage Markers Effect
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    drainMarkersRef.current.forEach((m) => m.remove());
    drainMarkersRef.current = [];
    if (!(visibleLayers["urban-drainage"] ?? true)) return;

    drainageData.forEach((entry) => {
      const icon = DRAINAGE_ASSET_ICONS[entry.assetType] ?? "❓";
      const el = document.createElement("div");
      el.className = "marker marker-drainage";
      el.innerHTML = icon;
      el.title = entry.assetType;
      const popup = new maplibregl.Popup({
        offset: 18,
        maxWidth: "300px",
        className: "kordel-popup",
      }).setHTML(buildDrainagePopup(entry));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([entry.location.longitude, entry.location.latitude])
        .setPopup(popup)
        .addTo(map);

      drainMarkersRef.current.push(marker);
    });
  }, [drainageData, visibleLayers]);

  // Qualitative Hazard Markers Effect
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    hazardMarkersRef.current.forEach((m) => m.remove());
    hazardMarkersRef.current = [];
    if (!(visibleLayers["qualitative-hazard"] ?? true)) return;

    hazardData.forEach((entry) => {
      const el = document.createElement("div");
      el.className = "marker marker-hazard";
      el.innerHTML = "⚠️";
      const popup = new maplibregl.Popup({
        offset: 18,
        maxWidth: "320px",
        className: "kordel-popup",
      }).setHTML(buildHazardPopup(entry));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([entry.location.longitude, entry.location.latitude])
        .setPopup(popup)
        .addTo(map);

      hazardMarkersRef.current.push(marker);
    });
  }, [hazardData, visibleLayers]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
