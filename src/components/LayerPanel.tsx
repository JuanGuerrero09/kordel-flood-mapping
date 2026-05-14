import { LAYER_CONFIG } from "../config/mapConfig";

interface LayerPanelProps {
  visibleLayers: Record<string, boolean>;
  onToggle: (layerId: string) => void;
  counts: Record<string, number>;
  visibleAssetTypes: Record<string, boolean>;
  onToggleAssetType: (assetType: string) => void;
  assetTypeCounts: Record<string, number>;
  isOpen: boolean; // Tracks if the burger menu is open
}

export function LayerPanel({
  visibleLayers,
  onToggle,
  counts,
  // visibleAssetTypes,
  // onToggleAssetType,
  // assetTypeCounts,
  isOpen,
}: LayerPanelProps) {
  return (
    <div className={`layer-panel ${isOpen ? "is-open" : "is-closed"}`}>
      <div className="panel-header">
        <span className="panel-title">Kordel Map</span>
        <span className="panel-subtitle">Field Data Viewer</span>
      </div>

      <div className="panel-section-label">Layers</div>

      <div className="layer-items-container">
        {Object.values(LAYER_CONFIG).map((layer) => {
          const visible = visibleLayers[layer.id] ?? true;
          const count = counts[layer.id] ?? 0;
          {
            /* const isDrainage = layer.id === "urban-drainage"; */
          }

          return (
            <div key={layer.id} className="layer-group">
              {/* Clean Row Layout instead of a giant button */}
              <div className="layer-item-row">
                <div className="layer-item-meta">
                  <span
                    className="layer-dot"
                    style={{ background: layer.color }}
                  />
                  <span className="layer-icon">{layer.iconSymbol}</span>
                  <span className="layer-label">{layer.label}</span>
                  <span className="layer-count">({count})</span>
                </div>

                {/* Main Layer Sliding Toggle Switch */}
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={() => onToggle(layer.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Sub-filtering options for Urban Drainage */}
              {/* {isDrainage && visible && ( */}
              {/*   <div className="sub-filter-panel"> */}
              {/*     {Object.keys(DRAINAGE_ASSET_ICONS).map((type) => { */}
              {/*       const isAssetVisible = visibleAssetTypes[type] ?? true; */}
              {/*       const subCount = assetTypeCounts[type] || 0; */}
              {/**/}
              {/*       if (subCount === 0) return null; */}
              {/**/}
              {/*       return ( */}
              {/*         <div key={type} className="sub-filter-item"> */}
              {/*           <div className="sub-filter-info"> */}
              {/*             <span className="sub-filter-icon"> */}
              {/*               {DRAINAGE_ASSET_ICONS[type]} */}
              {/*             </span> */}
              {/*             <span className="sub-filter-label">{type}</span> */}
              {/*             <span className="sub-filter-count">({subCount})</span> */}
              {/*           </div> */}
              {/**/}
              {/*           <label className="toggle-switch sub-toggle"> */}
              {/*             <input */}
              {/*               type="checkbox" */}
              {/*               checked={isAssetVisible} */}
              {/*               onChange={() => onToggleAssetType(type)} */}
              {/*             /> */}
              {/*             <span className="toggle-slider"></span> */}
              {/*           </label> */}
              {/*         </div> */}
              {/*       ); */}
              {/*     })} */}
              {/*   </div> */}
              {/* )} */}
            </div>
          );
        })}
      </div>

      <div className="panel-footer">
        <span>© OpenStreetMap contributors</span>
      </div>
    </div>
  );
}
