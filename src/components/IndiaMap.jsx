import { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { INDIA_STATES } from "../data/indiaPaths";
import { CITY_NODES_1000, NETWORK_EDGES_1000 } from "../data/networkData";
import { STATE_DEPENDENCY_DATA } from "../data/stateDependencyData";

export default function IndiaMap({
  mode = "home", // "home" | "explorer" | "simulator" | "about"
  selectedLayer = "All",
  selectedCity = null,
  onSelectCity = () => {},
  scenario = "Moderate",
  searchQuery = "",
  selectedRegion = "All India",
  selectedStateId: externalSelectedStateId = undefined,
  onSelectState: externalOnSelectState = undefined
}) {
  const svgRef = useRef(null);
  const zoomGRef = useRef(null);
  const zoomBehaviorRef = useRef(null);

  // Internal state if not controlled externally
  const [internalSelectedStateId, setInternalSelectedStateId] = useState(null);
  const [hoveredStateId, setHoveredStateId] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false });

  const selectedStateId =
    externalSelectedStateId !== undefined ? externalSelectedStateId : internalSelectedStateId;
  const setSelectedStateId = externalOnSelectState || setInternalSelectedStateId;

  // D3 Color Scale computation
  const colorScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([30, 50, 70, 85, 100])
      .range(["#0e2a47", "#0284c7", "#eab308", "#a855f7", "#f43f5e"])
      .interpolate(d3.interpolateRgb);
  }, []);

  // Filter visible cities based on Layer, Search, and Region
  const visibleCities = useMemo(() => {
    return CITY_NODES_1000.filter((c) => {
      const matchLayer = selectedLayer === "All" || c.type === selectedLayer;
      const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());

      let matchRegion = true;
      if (selectedRegion === "All India") {
        matchRegion = true;
      } else if (selectedRegion === "Coastal") {
        matchRegion =
          c.region.includes("Coastal") || ["chennai", "kochi", "bhubaneswar", "mumbai"].includes(c.id);
      } else if (selectedRegion === "North India") {
        matchRegion = c.region.includes("North") || ["delhi", "jaipur"].includes(c.id);
      } else if (selectedRegion === "Western Coast") {
        matchRegion = c.region.includes("West") || ["mumbai", "ahmedabad"].includes(c.id);
      } else if (selectedRegion === "Eastern Region") {
        matchRegion =
          c.region.includes("East") || ["kolkata", "patna", "guwahati", "bhubaneswar"].includes(c.id);
      } else if (selectedRegion === "Southern Region") {
        matchRegion =
          c.region.includes("South") || ["bengaluru", "hyderabad", "chennai", "kochi"].includes(c.id);
      } else {
        matchRegion = c.region.toLowerCase().includes(selectedRegion.toLowerCase());
      }

      return matchLayer && matchSearch && matchRegion;
    });
  }, [selectedLayer, searchQuery, selectedRegion]);

  // Hovered state object
  const hoveredStateData = useMemo(() => {
    if (!hoveredStateId) return null;
    return STATE_DEPENDENCY_DATA[hoveredStateId] || null;
  }, [hoveredStateId]);

  // Initialize D3 Zoom Behavior
  useEffect(() => {
    if (!svgRef.current || !zoomGRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(zoomGRef.current);

    const zoom = d3
      .zoom()
      .scaleExtent([0.7, 6])
      .translateExtent([
        [-300, -300],
        [1300, 1300]
      ])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    if (mode === "about") {
      // Fit neatly in about card without overflowing
      const initialTransform = d3.zoomIdentity.translate(65, 35).scale(0.82);
      svg.call(zoom.transform, initialTransform);
    } else {
      svg.call(zoom.transform, d3.zoomIdentity);
    }

    return () => {
      svg.on(".zoom", null);
    };
  }, [mode]);

  // Auto-focus map when selectedRegion changes in Explorer or Simulator
  useEffect(() => {
    if (!svgRef.current || !zoomBehaviorRef.current || mode === "about" || mode === "home") return;

    let targetTransform = d3.zoomIdentity;

    if (selectedRegion === "North India") {
      // Focus on Delhi & northern spine
      targetTransform = d3.zoomIdentity.translate(500 - 344 * 1.7, 500 - 321 * 1.7).scale(1.7);
    } else if (selectedRegion === "Western Coast") {
      // Focus on Mumbai & Gujarat
      targetTransform = d3.zoomIdentity.translate(500 - 235 * 1.7, 500 - 585 * 1.7).scale(1.7);
    } else if (selectedRegion === "Eastern Region") {
      // Focus on Kolkata & East
      targetTransform = d3.zoomIdentity.translate(500 - 630 * 1.6, 500 - 495 * 1.6).scale(1.6);
    } else if (selectedRegion === "Southern Region") {
      // Focus on Bengaluru & South
      targetTransform = d3.zoomIdentity.translate(500 - 350 * 1.7, 500 - 765 * 1.7).scale(1.7);
    } else if (selectedRegion === "Coastal") {
      // Focus on Coastal spine
      targetTransform = d3.zoomIdentity.translate(500 - 460 * 1.55, 500 - 720 * 1.55).scale(1.55);
    } else {
      // All India
      targetTransform = d3.zoomIdentity;
    }

    d3.select(svgRef.current).transition().duration(600).call(zoomBehaviorRef.current.transform, targetTransform);
  }, [selectedRegion, mode]);

  // Zoom control handlers using D3 transitions
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.scaleBy, 1.35);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.scaleBy, 0.74);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const resetTransform = mode === "about" ? d3.zoomIdentity.translate(65, 35).scale(0.82) : d3.zoomIdentity;
    d3.select(svgRef.current).transition().duration(500).call(zoomBehaviorRef.current.transform, resetTransform);
    setSelectedStateId(null);
  };

  const handleFocusHighRisk = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const transform = d3.zoomIdentity.translate(500 - 344 * 1.7, 500 - 321 * 1.7).scale(1.7);
    d3.select(svgRef.current).transition().duration(600).call(zoomBehaviorRef.current.transform, transform);
    setSelectedStateId("INDL");
  };

  // State selection handler
  const handleStateClick = (stateId, stateData) => {
    if (selectedStateId === stateId) {
      setSelectedStateId(null);
    } else {
      setSelectedStateId(stateId);
      if (stateData && stateData.centroid && svgRef.current && zoomBehaviorRef.current && mode !== "home" && mode !== "about") {
        const [cx, cy] = stateData.centroid;
        const transform = d3.zoomIdentity.translate(500 - cx * 1.45, 500 - cy * 1.45).scale(1.45);
        d3.select(svgRef.current).transition().duration(550).call(zoomBehaviorRef.current.transform, transform);
      }
    }
  };

  // Calculate dynamic cascade arcs from selected state to its dependent neighbors
  const cascadeArcs = useMemo(() => {
    if (!selectedStateId) return [];
    const sourceData = STATE_DEPENDENCY_DATA[selectedStateId];
    if (!sourceData || !sourceData.centroid || !sourceData.cascadesTo) return [];

    const [x1, y1] = sourceData.centroid;
    return sourceData.cascadesTo
      .map((targetId) => {
        const targetData = STATE_DEPENDENCY_DATA[targetId];
        if (!targetData || !targetData.centroid) return null;
        const [x2, y2] = targetData.centroid;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 25;
        const d = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
        return {
          targetId,
          targetName: targetData.name,
          d,
          x1,
          y1,
          x2,
          y2
        };
      })
      .filter(Boolean);
  }, [selectedStateId]);

  return (
    <div className={`india-geo-map-wrapper mode-${mode}`}>
      {/* Main Clean, Completely Unobstructed Map Stage */}
      <div className="india-map-stage-container">
        {/* Floating Minimal D3 Zoom Controls */}
        {mode !== "about" && (
          <div className="d3-floating-zoom-panel">
            <button className="d3-zoom-btn" onClick={handleZoomIn} title="Zoom In">
              +
            </button>
            <button className="d3-zoom-btn" onClick={handleZoomOut} title="Zoom Out">
              −
            </button>
            <button className="d3-zoom-btn" onClick={handleResetZoom} title="Reset View">
              ⌖
            </button>
            <button
              className="d3-zoom-btn risk-focus-btn"
              onClick={handleFocusHighRisk}
              title="Focus on High-Risk Northern Corridor"
            >
              ⚡
            </button>
          </div>
        )}

        {/* Pure, Clear SVG Canvas */}
        <svg
          ref={svgRef}
          viewBox="0 0 1000 1000"
          className="india-geo-svg d3-canvas"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Clean Geographic D3 SVG Map of India"
        >
          <defs>
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="alertEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="cascadeArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* D3 Zoom Container */}
          <g ref={zoomGRef} className="d3-zoom-group">
            {/* Fine Cartographic Grid Lines */}
            <g className="geo-lat-long-grid" opacity="0.08">
              <line x1="80" y1="200" x2="920" y2="200" stroke="#38bdf8" strokeDasharray="3 6" />
              <line x1="80" y1="400" x2="920" y2="400" stroke="#38bdf8" strokeDasharray="3 6" />
              <line x1="80" y1="600" x2="920" y2="600" stroke="#38bdf8" strokeDasharray="3 6" />
              <line x1="80" y1="800" x2="920" y2="800" stroke="#38bdf8" strokeDasharray="3 6" />
              <line x1="280" y1="60" x2="280" y2="940" stroke="#38bdf8" strokeDasharray="3 6" />
              <line x1="480" y1="60" x2="480" y2="940" stroke="#38bdf8" strokeDasharray="3 6" />
              <line x1="680" y1="60" x2="680" y2="940" stroke="#38bdf8" strokeDasharray="3 6" />
            </g>

            {/* 36 Indian States Rendered Cleanly */}
            <g className="india-states-layer">
              {INDIA_STATES.map((state) => {
                const data = STATE_DEPENDENCY_DATA[state.id];
                const score = data ? data.dependencyScore : 50;

                // Check regional match
                let isRegionMatch = true;
                if (selectedRegion === "North India") {
                  isRegionMatch = ["INDL", "INHR", "INPB", "INUP", "INRJ", "INUT", "INHP", "INJK"].includes(state.id);
                } else if (selectedRegion === "Western Coast") {
                  isRegionMatch = ["INMH", "INGJ", "INGA", "INKA"].includes(state.id);
                } else if (selectedRegion === "Eastern Region") {
                  isRegionMatch = ["INWB", "INBR", "INJH", "INOD", "INAS"].includes(state.id);
                } else if (selectedRegion === "Southern Region") {
                  isRegionMatch = ["INKA", "INTN", "INKL", "INTG", "INAP"].includes(state.id);
                } else if (selectedRegion === "Coastal") {
                  isRegionMatch = ["INTN", "INKL", "INAP", "INOD", "INWB", "INMH", "INGJ", "INGA"].includes(state.id);
                }

                const isHovered = hoveredStateId === state.id;
                const isSelected = selectedStateId === state.id;
                const isCascadedTo =
                  selectedStateId &&
                  STATE_DEPENDENCY_DATA[selectedStateId]?.cascadesTo?.includes(state.id);

                const fillColor = colorScale(score);

                return (
                  <path
                    key={state.id}
                    d={state.d}
                    id={state.id}
                    className={`d3-state-polygon ${isHovered ? "state-hovered" : ""} ${
                      isSelected ? "state-selected" : ""
                    } ${isCascadedTo ? "state-cascaded-active" : ""} ${
                      !isRegionMatch && selectedRegion !== "All India" ? "state-filtered-dim" : ""
                    }`}
                    style={{
                      fill: !isRegionMatch && selectedRegion !== "All India" ? "#070c20" : fillColor,
                      fillOpacity: isSelected
                        ? 0.95
                        : isHovered
                        ? 0.88
                        : isRegionMatch && selectedRegion !== "All India"
                        ? 0.85
                        : 0.55,
                      stroke: isSelected
                        ? "#ffffff"
                        : isHovered
                        ? "#38bdf8"
                        : isCascadedTo
                        ? "#eab308"
                        : isRegionMatch && selectedRegion !== "All India"
                        ? "#38bdf8"
                        : "rgba(56, 189, 248, 0.28)",
                      strokeWidth: isSelected ? 2.5 : isHovered || isCascadedTo ? 2.0 : 0.9
                    }}
                    onMouseEnter={(e) => {
                      setHoveredStateId(state.id);
                      if (svgRef.current) {
                        const rect = svgRef.current.getBoundingClientRect();
                        setTooltipPos({
                          x: e.clientX - rect.left + 15,
                          y: e.clientY - rect.top + 15,
                          visible: true
                        });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (svgRef.current) {
                        const rect = svgRef.current.getBoundingClientRect();
                        setTooltipPos({
                          x: e.clientX - rect.left + 15,
                          y: e.clientY - rect.top + 15,
                          visible: true
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredStateId(null);
                      setTooltipPos((prev) => ({ ...prev, visible: false }));
                    }}
                    onClick={() => handleStateClick(state.id, data)}
                  >
                    <title>
                      {state.name} - {data ? `${data.status} (Score: ${score})` : ""}
                    </title>
                  </path>
                );
              })}
            </g>

            {/* Cascade Arcs */}
            {cascadeArcs.length > 0 && (
              <g className="d3-cascade-arcs-group" filter="url(#cyanGlow)">
                {cascadeArcs.map((arc, i) => (
                  <g key={`cascade-link-${i}`} className="cascade-arc-item">
                    <path d={arc.d} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeOpacity="0.4" />
                    <path
                      d={arc.d}
                      fill="none"
                      stroke="url(#cascadeArcGrad)"
                      strokeWidth="2.0"
                      strokeDasharray="5 5"
                    />
                    <circle cx={arc.x2} cy={arc.y2} r="6" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeOpacity="0.8" />
                    <circle cx={arc.x2} cy={arc.y2} r="3.5" fill="#f43f5e" />
                  </g>
                ))}
              </g>
            )}

            {/* Inter-City Backbone Network Links */}
            <g className="india-network-links" filter="url(#cyanGlow)">
              {NETWORK_EDGES_1000.map(([fromId, toId], idx) => {
                const from = CITY_NODES_1000.find((c) => c.id === fromId);
                const to = CITY_NODES_1000.find((c) => c.id === toId);
                if (!from || !to) return null;

                const isDisrupted =
                  mode === "simulator" &&
                  (scenario === "Severe" ||
                    (scenario === "Moderate" && (fromId === "mumbai" || fromId === "delhi" || toId === "hyderabad")) ||
                    (fromId === "mumbai" && toId === "hyderabad"));

                const isHighlighted =
                  selectedLayer === "All" || from.type === selectedLayer || to.type === selectedLayer;

                return (
                  <line
                    key={`edge-${idx}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isDisrupted ? "url(#alertEdgeGrad)" : "url(#edgeGrad)"}
                    strokeWidth={isDisrupted ? 3.0 : isHighlighted ? 2.0 : 1.0}
                    strokeDasharray={isDisrupted ? "none" : "5 5"}
                    className={`geo-edge-vector ${isDisrupted ? "edge-alert-active" : ""} ${
                      !isHighlighted ? "edge-dimmed" : ""
                    }`}
                  />
                );
              })}
            </g>

            {/* Clean, High-Visibility City Pinpoint Nodes with BOLD CAPITALS */}
            <g className="india-city-nodes">
              {visibleCities.map((city) => {
                const isSelected = selectedCity?.id === city.id;
                const isHovered = hoveredCity?.id === city.id;
                const isPrimary = ["delhi", "mumbai", "kolkata", "hyderabad", "bengaluru", "chennai"].includes(
                  city.id
                );

                const isDisrupted =
                  mode === "simulator" &&
                  (scenario === "Severe" ||
                    (scenario === "Moderate" && ["delhi", "mumbai", "hyderabad"].includes(city.id)) ||
                    city.id === "mumbai");

                const color = isDisrupted
                  ? "#f43f5e"
                  : city.type === "Roads"
                  ? "#f43f5e"
                  : city.type === "Hospitals"
                  ? "#38bdf8"
                  : city.type === "Pharmacies"
                  ? "#a855f7"
                  : "#10b981";

                const radius = isSelected || isHovered ? 10 : isPrimary ? 8 : 6.5;

                return (
                  <g
                    key={city.id}
                    className={`geo-node-group ${isSelected ? "selected" : ""}`}
                    transform={`translate(${city.x}, ${city.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCity(city);
                    }}
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${city.name} - ${city.type}`}
                  >
                    {/* Glowing static halo ring */}
                    <circle
                      r={radius + 4}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.6"
                      strokeOpacity={isSelected ? 0.95 : 0.4}
                    />

                    {/* Grounded solid base disc */}
                    <circle
                      r={radius}
                      fill="#060c20"
                      stroke={color}
                      strokeWidth={isSelected ? 3.0 : 2.0}
                    />

                    {/* Center core dot */}
                    <circle r={radius * 0.45} fill={color} />

                    {/* BOLD UPPERCASE City Name Label (Clearly visible zoomed in and zoomed out) */}
                    <text
                      y={city.y > 700 ? -radius - 9 : radius + 19}
                      textAnchor="middle"
                      className={`geo-city-label ${isPrimary ? "label-primary" : ""}`}
                    >
                      {city.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {/* Floating Tooltip (Compact, Non-intrusive) */}
        {tooltipPos.visible && hoveredStateData && !selectedStateId && mode !== "about" && (
          <div
            className="d3-state-floating-tooltip"
            style={{ top: `${tooltipPos.y}px`, left: `${tooltipPos.x}px` }}
          >
            <div className="tooltip-head">
              <strong>{hoveredStateData.name}</strong>
              <span className={`status-tag status-${hoveredStateData.status.toLowerCase().replace(/\s+/g, "-")}`}>
                {hoveredStateData.status}
              </span>
            </div>
            <div className="tooltip-score-row">
              <span className="score-label">Vulnerability Index:</span>
              <strong className="score-val text-cyan">
                {hoveredStateData.dependencyScore}
                <small>/100</small>
              </strong>
            </div>
            <p className="tooltip-vuln">⚠️ {hoveredStateData.primaryVulnerability}</p>
          </div>
        )}
      </div>

      {/* City Hover Tooltip */}
      {hoveredCity && mode !== "about" && (
        <div className="geo-hover-tooltip" style={{ top: "12px", right: "12px" }}>
          <strong>{hoveredCity.name.toUpperCase()}</strong>
          <span>Type: {hoveredCity.type}</span>
          <span>Region: {hoveredCity.region}</span>
          <span>Inter-city Links: {hoveredCity.nodes}</span>
          <span className="tooltip-delay">Delay Impact: {hoveredCity.delay}</span>
        </div>
      )}
    </div>
  );
}
