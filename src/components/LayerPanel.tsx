import { LAYER_CONFIG } from "../config/mapConfig";

interface LayerPanelProps {
  visibleLayers: Record<string, boolean>;
  onToggle: (layerId: string) => void;
  counts: Record<string, number>;
}

export function LayerPanel({
  visibleLayers,
  onToggle,
  counts,
}: LayerPanelProps) {
  return (
    <div className="layer-panel">
      <div className="panel-header">
        <span className="panel-title">Kordel Map</span>
        <span className="panel-subtitle">Field Data Viewer</span>
      </div>

      <div className="panel-section-label">Layers</div>

      {Object.values(LAYER_CONFIG).map((layer) => {
        const visible = visibleLayers[layer.id] ?? true;
        const count = counts[layer.id] ?? 0;

        return (
          <button
            key={layer.id}
            className={`layer-item ${visible ? "layer-active" : "layer-inactive"}`}
            onClick={() => onToggle(layer.id)}
          >
            <span className="layer-dot" style={{ background: layer.color }} />
            <span className="layer-icon">{layer.iconSymbol}</span>
            <span className="layer-label">{layer.label}</span>
            <span className="layer-count">{count}</span>
            <span className="layer-toggle">{visible ? "👁" : "👁‍🗨"}</span>
          </button>
        );
      })}

      <div className="panel-footer">
        <span>© OpenStreetMap contributors</span>
      </div>
    </div>
  );
}
