import { useState, useMemo } from "react";
import IndiaMap from "./components/IndiaMap";
import { STATE_DEPENDENCY_DATA } from "./data/stateDependencyData";
import {
  getDynamicInsightsData,
  TIMEFRAME_OPTIONS,
  SCENARIO_FILTER_OPTIONS,
  SECTOR_FILTER_OPTIONS,
  REGION_FILTER_OPTIONS
} from "./data/insightsData";
import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("Home");
  const [selectedScenario, setSelectedScenario] = useState("Minor"); // Minor | Moderate | Severe
  const [activeDisruptionType, setActiveDisruptionType] = useState("Road Blockage");
  const [selectedLayer, setSelectedLayer] = useState("All");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All India");
  const [timelineStep, setTimelineStep] = useState(0);

  // Dynamic Insights Option State
  const [insightTimeframe, setInsightTimeframe] = useState("30d");
  const [insightScenario, setInsightScenario] = useState("all");
  const [insightSector, setInsightSector] = useState("all");
  const [insightRegion, setInsightRegion] = useState("All India");

  // Dynamic Insights calculation that reacts to EVERY filter change
  const dynamicInsights = useMemo(() => {
    return getDynamicInsightsData({
      timeframe: insightTimeframe,
      scenario: insightScenario,
      sector: insightSector,
      region: insightRegion
    });
  }, [insightTimeframe, insightScenario, insightSector, insightRegion]);

  // Selected State Diagnostic Object
  const inspectedState = useMemo(() => {
    if (!selectedStateId) return null;
    return STATE_DEPENDENCY_DATA[selectedStateId] || null;
  }, [selectedStateId]);

  // Scenario multipliers
  const scenarioStats = useMemo(() => {
    if (selectedScenario === "Minor") {
      return {
        hospitalsAffected: 6,
        totalHospitals: 28,
        pharmaciesAffected: 12,
        totalPharmacies: 60,
        deliveryAffected: 8,
        totalDelivery: 40,
        timeSaving: "~24 min",
        timeline: [
          { name: "Road Blockage", time: "0 - 15 min", desc: "Local arterial congestion" },
          { name: "Hospital Delay", time: "15 - 30 min", desc: "Minor triage slowdown" },
          { name: "Pharmacy Shortage", time: "30 - 60 min", desc: "Supply buffer absorbs impact" },
          { name: "Delivery Delay", time: "1 - 2 hrs", desc: "Minimal downstream lag" }
        ]
      };
    } else if (selectedScenario === "Moderate") {
      return {
        hospitalsAffected: 12,
        totalHospitals: 28,
        pharmaciesAffected: 22,
        totalPharmacies: 60,
        deliveryAffected: 14,
        totalDelivery: 40,
        timeSaving: "~41 min",
        timeline: [
          { name: "Road Blockage", time: "0 - 30 min", desc: "Flooding & heavy road obstruction" },
          { name: "Hospital Delay", time: "30 - 90 min", desc: "Ambulance & staff access delayed" },
          { name: "Pharmacy Shortage", time: "1 - 3 hrs", desc: "Medicine availability hits low stock" },
          { name: "Delivery Delay", time: "3 - 6 hrs", desc: "Courier fleets stall in transit" }
        ]
      };
    } else {
      return {
        hospitalsAffected: 21,
        totalHospitals: 28,
        pharmaciesAffected: 48,
        totalPharmacies: 60,
        deliveryAffected: 32,
        totalDelivery: 40,
        timeSaving: "~68 min",
        timeline: [
          { name: "Road Blockage", time: "0 - 60 min", desc: "Severe arterial highway collapse" },
          { name: "Hospital Delay", time: "90 - 180 min", desc: "Critical emergency triage overload" },
          { name: "Pharmacy Shortage", time: "3 - 8 hrs", desc: "Vital prescription stockouts" },
          { name: "Delivery Delay", time: "6 - 14 hrs", desc: "Complete last-mile halt" }
        ]
      };
    }
  }, [selectedScenario]);

  return (
    <div className="it-app-shell">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="it-sidebar">
        {/* Brand Lockup */}
        <div className="sidebar-brand">
          <div className="brand-infinity-icon">
            <svg viewBox="0 0 36 20" className="infinity-svg">
              <path
                d="M9,10 C3,3 0,7 0,10 C0,13 3,17 9,10 C15,3 21,17 27,10 C33,3 36,7 36,10 C36,13 33,17 27,10 C21,3 15,17 9,10 Z"
                className="infinity-path"
              />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-main">Invisible</span>
            <span className="brand-sub">Thread</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {[
            { id: "Home", label: "Home", icon: "⌂" },
            { id: "Explorer", label: "Explorer", icon: "⌘" },
            { id: "Simulator", label: "Simulator", icon: "⚙" },
            { id: "Insights", label: "Insights", icon: "📊" },
            { id: "About", label: "About", icon: "ⓘ" }
          ].map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => {
                setCurrentPage(item.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer Quote */}
        <div className="sidebar-footer-quote">
          <p className="quote-text">
            Same road.<br />
            Different outcomes.<br />
            <span className="quote-highlight">See the chain.</span>
          </p>
          <div className="quote-wave" />
        </div>
      </aside>

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <div className="it-main-wrapper">
        {/* Top Header Bar */}
        <header className="it-top-header">
          <div className="header-breadcrumbs">
            <span className="bc-root">Invisible Thread</span>
            <span className="bc-sep">/</span>
            <span className="bc-current">{currentPage}</span>
          </div>

          <div className="header-actions">
            <button className="theme-toggle-btn" title="Toggle illumination" aria-label="Toggle illumination">
              ☼
            </button>
            <button
              className="launch-sim-cta"
              onClick={() => {
                setCurrentPage("Simulator");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Launch simulator <span>→</span>
            </button>
          </div>
        </header>

        {/* ================= VIEW: HOME PAGE ================= */}
        {currentPage === "Home" && (
          <main className="view-home">
            {/* Hero Split Section */}
            <section className="home-hero-split">
              <div className="hero-text-col">
                <span className="hero-kicker">INFRASTRUCTURE · DEPENDENCY · RESILIENCE</span>
                <h1 className="hero-heading">
                  When one <span className="word-link">link</span> breaks,{" "}
                  <span className="word-everything">everything</span> feels it.
                </h1>
                <p className="hero-lead">
                  Essential services do not exist in isolation. Discover the hidden dependencies that turn one disruption
                  into a chain reaction.
                </p>
                <div className="hero-cta-group">
                  <button className="btn-primary-glow" onClick={() => setCurrentPage("Explorer")}>
                    Explore the network <span>→</span>
                  </button>
                  <button className="btn-secondary-outline" onClick={() => setCurrentPage("Simulator")}>
                    <span className="btn-play-icon">▶</span> Run a scenario
                  </button>
                </div>
              </div>

              {/* Glowing India Network Map on Hero */}
              <div className="hero-map-col">
                <div className="india-network-stage">
                  <IndiaMap mode="home" scenario={selectedScenario} />

                  {/* Floating Service Legend */}
                  <div className="floating-legend">
                    <span className="legend-item"><i className="legend-dot road" /> Roads</span>
                    <span className="legend-item"><i className="legend-dot hospital" /> Hospitals</span>
                    <span className="legend-item"><i className="legend-dot pharmacy" /> Pharmacies</span>
                    <span className="legend-item"><i className="legend-dot delivery" /> Delivery</span>
                  </div>
                </div>
              </div>
            </section>

            {/* "THE INVISIBLE THREAD: One disruption. Four connected services." Strip */}
            <section className="home-thread-strip">
              <span className="strip-kicker">THE INVISIBLE THREAD</span>
              <h2 className="strip-heading">One disruption. Four connected services.</h2>

              <div className="thread-cards-flow">
                <div className="thread-step-card road">
                  <div className="step-icon-wrap road-icon">⚠️</div>
                  <div className="step-meta">
                    <strong>Road Blockage</strong>
                    <span>Traffic & transport delay</span>
                  </div>
                </div>

                <span className="flow-arrow">→</span>

                <div className="thread-step-card hospital">
                  <div className="step-icon-wrap hospital-icon">🏥</div>
                  <div className="step-meta">
                    <strong>Hospital Delay</strong>
                    <span>Access & supply slow</span>
                  </div>
                </div>

                <span className="flow-arrow">→</span>

                <div className="thread-step-card pharmacy">
                  <div className="step-icon-wrap pharmacy-icon">💊</div>
                  <div className="step-meta">
                    <strong>Pharmacy Shortage</strong>
                    <span>Medicine availability low</span>
                  </div>
                </div>

                <span className="flow-arrow">→</span>

                <div className="thread-step-card delivery">
                  <div className="step-icon-wrap delivery-icon">🚚</div>
                  <div className="step-meta">
                    <strong>Delivery Delay</strong>
                    <span>Medicine arrives late</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 Metric KPI Cards */}
            <section className="home-kpi-grid">
              <div className="kpi-card">
                <span className="kpi-label">Service types</span>
                <strong className="kpi-number">04</strong>
                <span className="kpi-sub">Roads · Hospitals · Pharmacy · Delivery</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Dependency links</span>
                <strong className="kpi-number">03</strong>
                <span className="kpi-sub">Illustrative links in sample model</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Scenario modes</span>
                <strong className="kpi-number">03</strong>
                <span className="kpi-sub">Minor · Moderate · Severe</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Response option</span>
                <strong className="kpi-number">41 <small>min</small></strong>
                <span className="kpi-sub">Sample alternative route estimate</span>
              </div>
            </section>

            {/* Bottom "01 / THE IDEA" Discovery Strip */}
            <section className="home-idea-strip">
              <div className="idea-col-left">
                <span className="idea-step">01 / THE IDEA</span>
                <h3>See beyond the outage.</h3>
              </div>
              <p className="idea-desc">
                Not just what failed. What depends on it, how delays travel, and where a backup can make a difference.
              </p>
              <button className="idea-cta-btn" onClick={() => setCurrentPage("About")}>
                Discover the approach <span>→</span>
              </button>
            </section>
          </main>
        )}

        {/* ================= VIEW: EXPLORER PAGE ================= */}
        {currentPage === "Explorer" && (
          <main className="view-explorer">
            {/* Page Header */}
            <div className="page-header-row">
              <div>
                <span className="view-kicker">EXPLORE</span>
                <h1 className="view-heading">Explore the Network</h1>
                <p className="view-lead">Visualize how critical infrastructure and essential services are connected across India.</p>
              </div>

              {/* Service Filter Tabs */}
              <div className="layer-filter-tabs">
                {["All", "Roads", "Hospitals", "Pharmacies", "Delivery"].map((layer) => (
                  <button
                    key={layer}
                    className={`filter-pill ${selectedLayer === layer ? "active" : ""}`}
                    onClick={() => setSelectedLayer(layer)}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="search-bar-row">
              <div className="search-input-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search for a city or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Main Split: Left Map with Layers, Right Overviews */}
            <div className="explorer-content-split">
              {/* Left Column: Interactive India Map Canvas */}
              <div className="explorer-map-card">
                <div className="explorer-map-canvas">
                  <IndiaMap
                    mode="explorer"
                    selectedLayer={selectedLayer}
                    selectedCity={selectedCity}
                    onSelectCity={setSelectedCity}
                    searchQuery={searchQuery}
                    selectedRegion={selectedRegion}
                    selectedStateId={selectedStateId}
                    onSelectState={setSelectedStateId}
                  />
                </div>

                {/* Infrastructure Layer Buttons */}
                <div className="infrastructure-layers-bar">
                  <span className="layers-label">Infrastructure Layers:</span>
                  <div className="layer-btns">
                    {[
                      { id: "Roads", label: "Road Network", icon: "🛣️" },
                      { id: "Hospitals", label: "Hospitals", icon: "🏥" },
                      { id: "Pharmacies", label: "Pharmacies", icon: "💊" },
                      { id: "Delivery", label: "Delivery Routes", icon: "📦" }
                    ].map((l) => (
                      <button
                        key={l.id}
                        className={`layer-btn ${selectedLayer === l.id ? "active" : ""}`}
                        onClick={() => setSelectedLayer(selectedLayer === l.id ? "All" : l.id)}
                      >
                        <span>{l.icon}</span> {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Side Status Overlay / State Diagnostics (Keeps Map Clean) */}
              <div className="explorer-sidebar-col">
                {inspectedState ? (
                  /* Dedicated Side Status Overlay for Selected State */
                  <div className="state-side-diagnostic-panel">
                    <div className="side-panel-header">
                      <div>
                        <span className="side-kicker">INFRASTRUCTURE STATUS OVERLAY</span>
                        <h2 className="side-state-name">{inspectedState.name}</h2>
                        <span className="side-state-region">{inspectedState.region}</span>
                      </div>
                      <button
                        className="btn-close-side-overlay"
                        onClick={() => setSelectedStateId(null)}
                        title="Close state overlay"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Status Badge Banner */}
                    <div className={`side-status-banner status-${inspectedState.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      <span className="side-status-tag">{inspectedState.status.toUpperCase()}</span>
                      <div className="side-score-box">
                        <strong>{inspectedState.dependencyScore}</strong>
                        <small>Vulnerability Index</small>
                      </div>
                    </div>

                    {/* Primary Bottleneck */}
                    <div className="side-panel-group">
                      <label className="side-label">PRIMARY BOTTLENECK</label>
                      <p className="side-desc">{inspectedState.primaryVulnerability}</p>
                    </div>

                    {/* 4 Metric Chips */}
                    <div className="side-metrics-grid">
                      <div className="side-metric-chip">
                        <span>Hospital Strain</span>
                        <strong className="text-cyan">{inspectedState.metrics.hospitalStrain}%</strong>
                      </div>
                      <div className="side-metric-chip">
                        <span>Highway Choke</span>
                        <strong className="text-purple">{inspectedState.metrics.logisticsChoke}%</strong>
                      </div>
                      <div className="side-metric-chip">
                        <span>Pharma Buffer</span>
                        <strong className="text-pink">{inspectedState.metrics.pharmaStockout}%</strong>
                      </div>
                      <div className="side-metric-chip">
                        <span>Power Grid</span>
                        <strong className="text-amber">{inspectedState.metrics.powerGridStress}%</strong>
                      </div>
                    </div>

                    {/* Facilities Breakdown */}
                    <div className="side-facilities-card">
                      <div className="side-fac-row">
                        <span>🏥 Hospitals:</span>
                        <strong>{inspectedState.criticalFacilities.hospitals}</strong>
                      </div>
                      <div className="side-fac-row">
                        <span>🚚 Freight Hubs:</span>
                        <strong>{inspectedState.criticalFacilities.logisticsHubs}</strong>
                      </div>
                      <div className="side-fac-row">
                        <span>💊 Pharma Depots:</span>
                        <strong>{inspectedState.criticalFacilities.pharmaDepots}</strong>
                      </div>
                      <div className="side-fac-row">
                        <span>⏱️ Autonomous Buffer:</span>
                        <strong className="text-cyan">{inspectedState.bufferHours} hrs</strong>
                      </div>
                    </div>

                    {/* Operational Insight */}
                    <div className="side-insight-callout">
                      <span className="insight-ico">💡</span>
                      <p>{inspectedState.keyInsight}</p>
                    </div>

                    {/* Cascading Downstream States */}
                    <div className="side-cascades-group">
                      <label className="side-label">CASCADES TO NEIGHBORS ({inspectedState.cascadesTo.length})</label>
                      <div className="side-neighbor-pills">
                        {inspectedState.cascadesTo.map((targetId) => {
                          const target = STATE_DEPENDENCY_DATA[targetId];
                          return (
                            <button
                              key={targetId}
                              className="neighbor-pill-btn"
                              onClick={() => setSelectedStateId(targetId)}
                              title={`Inspect ${target?.name || targetId}`}
                            >
                              <span>{target?.name || targetId}</span>
                              <small>Score {target?.dependencyScore}</small>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button className="btn-back-overview" onClick={() => setSelectedStateId(null)}>
                      ← Back to National Overview
                    </button>
                  </div>
                ) : (
                  /* National Overview When No State is Selected */
                  <>
                    <div className="explorer-stats-card">
                      <h3 className="card-heading">Infrastructure Status</h3>
                      <div className="stat-rows-list">
                        <div className="stat-row">
                          <span className="stat-left"><i className="icon-blue">🏛️</i> States & UTs</span>
                          <strong className="stat-right">36</strong>
                        </div>
                        <div className="stat-row">
                          <span className="stat-left"><i className="icon-pink">🚨</i> Critical States</span>
                          <strong className="stat-right text-pink">14</strong>
                        </div>
                        <div className="stat-row">
                          <span className="stat-left"><i className="icon-purple">🔗</i> Vital Corridors</span>
                          <strong className="stat-right">84</strong>
                        </div>
                        <div className="stat-row">
                          <span className="stat-left"><i className="icon-green">📦</i> Service Sectors</span>
                          <strong className="stat-right">4</strong>
                        </div>
                      </div>
                    </div>

                    <div className="explorer-stats-card">
                      <h3 className="card-heading">Highest Dependency States</h3>
                      <div className="vulnerable-list">
                        {[
                          { id: "INDL", num: 1, name: "Delhi", sub: "Score 88 · Acute Triage" },
                          { id: "INAS", num: 2, name: "Assam", sub: "Score 86 · Gateway Corridor" },
                          { id: "INMH", num: 3, name: "Maharashtra", sub: "Score 84 · Port Spine" },
                          { id: "INWB", num: 4, name: "West Bengal", sub: "Score 82 · Siliguri Choke" },
                          { id: "INBR", num: 5, name: "Bihar", sub: "Score 81 · Flood Exposure" }
                        ].map((r) => (
                          <div
                            key={r.num}
                            className="vulnerable-item clickable-vuln-row"
                            onClick={() => setSelectedStateId(r.id)}
                            role="button"
                            tabIndex={0}
                            title={`Inspect ${r.name} status`}
                          >
                            <span className="vuln-badge">{r.num}</span>
                            <div className="vuln-meta-col">
                              <span className="vuln-name">{r.name}</span>
                              <small className="vuln-sub-text">{r.sub}</small>
                            </div>
                            <span className="vuln-arrow">→</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="region-select-box">
                      <label className="select-label">Select a Region</label>
                      <select
                        className="region-dropdown"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                      >
                        <option value="All India">All India</option>
                        <option value="North India">North India</option>
                        <option value="Western Coast">Western Coast</option>
                        <option value="Eastern Region">Eastern Region</option>
                        <option value="Southern Region">Southern Region</option>
                      </select>
                    </div>

                    <div className="node-helper-note">
                      <span className="helper-icon">💡</span>
                      <span>Click any state on the map to inspect its full infrastructure dependency diagnostics right here on the side.</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        )}

        {/* ================= VIEW: SIMULATOR PAGE ================= */}
        {currentPage === "Simulator" && (
          <main className="view-simulator">
            {/* Header */}
            <div className="page-header-row">
              <div>
                <span className="view-kicker">SIMULATOR</span>
                <h1 className="view-heading">Run a Disruption Scenario</h1>
                <p className="view-lead">See how a single disruption can create a chain of impacts across essential services.</p>
              </div>

              {/* Scenario Mode Pill Toggle */}
              <div className="scenario-pill-selector">
                <span className="selector-title">Select a Scenario:</span>
                <div className="pill-group">
                  {["Minor", "Moderate", "Severe"].map((scen) => (
                    <button
                      key={scen}
                      className={`scen-pill ${selectedScenario === scen ? "active" : ""}`}
                      onClick={() => setSelectedScenario(scen)}
                    >
                      {scen}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3-Panel Central Simulator Layout */}
            <div className="simulator-stage-grid">
              {/* Left Panel: Disruption Type Options */}
              <div className="sim-panel disruption-types-card">
                <h3 className="card-heading">Disruption Type</h3>

                <div className="disruption-options-list">
                  {[
                    { id: "Road Blockage", label: "Road Blockage", sub: "Flooding or traffic delay", icon: "🛣️" },
                    { id: "Hospital Overload", label: "Hospital Overload", sub: "High patient inflow", icon: "🏥" },
                    { id: "Pharmacy Shortage", label: "Pharmacy Shortage", sub: "Supply chain disruption", icon: "💊" },
                    { id: "Delivery Delay", label: "Delivery Delay", sub: "Logistics or weather issues", icon: "🚚" }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      className={`disruption-card ${activeDisruptionType === opt.id ? "selected" : ""}`}
                      onClick={() => setActiveDisruptionType(opt.id)}
                    >
                      <span className="disrupt-icon">{opt.icon}</span>
                      <div className="disrupt-text">
                        <strong>{opt.label}</strong>
                        <span>{opt.sub}</span>
                      </div>
                      {activeDisruptionType === opt.id && <span className="select-check">✓</span>}
                    </button>
                  ))}
                </div>

                <button
                  className="btn-run-simulation"
                  onClick={() => {
                    setTimelineStep((prev) => (prev + 1) % 4);
                  }}
                >
                  Run Simulation <span>→</span>
                </button>
              </div>

              {/* Center Panel: Map with Propagating Cascades */}
              <div className="sim-panel sim-map-card">
                <div className="sim-map-inner">
                  <IndiaMap
                    mode="simulator"
                    scenario={selectedScenario}
                    selectedCity={selectedCity}
                    onSelectCity={setSelectedCity}
                  />
                </div>
              </div>

              {/* Right Panel: Impact Spread & Alternative Route */}
              <div className="sim-panel sim-impact-card">
                <h3 className="card-heading">Impact Spread</h3>

                <div className="impact-metrics-list">
                  <div className="impact-metric-row">
                    <div className="impact-icon-badge hospital">🏥</div>
                    <div className="impact-metric-meta">
                      <span>Hospitals</span>
                      <strong>
                        {scenarioStats.hospitalsAffected} / {scenarioStats.totalHospitals}
                      </strong>
                    </div>
                    <span className="impact-pct text-cyan">
                      {Math.round((scenarioStats.hospitalsAffected / scenarioStats.totalHospitals) * 100)}%
                    </span>
                  </div>

                  <div className="impact-metric-row">
                    <div className="impact-icon-badge pharmacy">💊</div>
                    <div className="impact-metric-meta">
                      <span>Pharmacies Affected</span>
                      <strong>
                        {scenarioStats.pharmaciesAffected} / {scenarioStats.totalPharmacies}
                      </strong>
                    </div>
                    <span className="impact-pct text-purple">
                      {Math.round((scenarioStats.pharmaciesAffected / scenarioStats.totalPharmacies) * 100)}%
                    </span>
                  </div>

                  <div className="impact-metric-row">
                    <div className="impact-icon-badge delivery">🚚</div>
                    <div className="impact-metric-meta">
                      <span>Delivery Delays</span>
                      <strong>
                        {scenarioStats.deliveryAffected} / {scenarioStats.totalDelivery}
                      </strong>
                    </div>
                    <span className="impact-pct text-pink">
                      {Math.round((scenarioStats.deliveryAffected / scenarioStats.totalDelivery) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Alternative Route Card */}
                <div className="alt-route-preview-box">
                  <div className="alt-header">
                    <span>Alternative Route</span>
                    <small>Estimated time saving</small>
                  </div>
                  <div className="alt-body">
                    <div className="alt-mini-graphic">
                      <svg viewBox="0 0 100 60" className="alt-mini-svg">
                        <line x1="10" y1="45" x2="45" y2="15" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                        <line x1="10" y1="45" x2="55" y2="50" stroke="#10b981" strokeWidth="2.5" />
                        <line x1="55" y1="50" x2="90" y2="20" stroke="#10b981" strokeWidth="2.5" />
                        <circle cx="10" cy="45" r="3" fill="#38bdf8" />
                        <circle cx="55" cy="50" r="3" fill="#10b981" />
                        <circle cx="90" cy="20" r="3" fill="#38bdf8" />
                      </svg>
                    </div>
                    <div className="alt-save-text">
                      <strong>{scenarioStats.timeSaving}</strong>
                      <button className="btn-view-route" onClick={() => setCurrentPage("Response Planning")}>
                        View Route →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Panel: Live Impact Timeline */}
            <div className="sim-panel live-impact-timeline-panel">
              <h3 className="card-heading">Live Impact Timeline</h3>

              <div className="timeline-flow-track">
                {scenarioStats.timeline.map((step, idx) => (
                  <div
                    key={step.name}
                    className={`timeline-step-item ${idx <= timelineStep ? "active" : ""}`}
                    onClick={() => setTimelineStep(idx)}
                  >
                    <div className="timeline-dot-connector">
                      <div className="step-circle">{idx + 1}</div>
                      {idx < 3 && <div className="step-connecting-line" />}
                    </div>
                    <strong className="timeline-step-title">{step.name}</strong>
                    <span className="timeline-step-time">{step.time}</span>
                    <span className="timeline-step-desc">{step.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ================= VIEW: INSIGHTS PAGE ================= */}
        {currentPage === "Insights" && (
          <main className="view-insights">
            {/* Header */}
            <div className="page-header-row">
              <div>
                <span className="view-kicker">INSIGHTS & INTELLIGENCE</span>
                <h1 className="view-heading">Network Health & Sector Analytics</h1>
                <p className="view-lead">
                  Real-time infrastructure dependency metrics, resilience scores, and cascading delay intelligence.
                </p>
              </div>

              {/* Dynamic Region Filter */}
              <div className="date-select-wrap">
                <span className="filter-hint-label">Region:</span>
                <select
                  className="date-filter-dropdown"
                  value={insightRegion}
                  onChange={(e) => setInsightRegion(e.target.value)}
                >
                  {REGION_FILTER_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Filter Control Ribbon (Reacts instantly) */}
            <div className="insights-filter-ribbon">
              {/* Timeframe Buttons */}
              <div className="filter-group">
                <span className="filter-group-lbl">TIMEFRAME:</span>
                <div className="btn-filter-pills">
                  {TIMEFRAME_OPTIONS.map((tf) => (
                    <button
                      key={tf.id}
                      className={`filter-pill-btn ${insightTimeframe === tf.id ? "active" : ""}`}
                      onClick={() => setInsightTimeframe(tf.id)}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenario Severity Filter */}
              <div className="filter-group">
                <span className="filter-group-lbl">SCENARIO:</span>
                <div className="btn-filter-pills">
                  {SCENARIO_FILTER_OPTIONS.map((sc) => (
                    <button
                      key={sc.id}
                      className={`filter-pill-btn ${insightScenario === sc.id ? "active" : ""}`}
                      onClick={() => setInsightScenario(sc.id)}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector Focus Filter */}
              <div className="filter-group">
                <span className="filter-group-lbl">SECTOR:</span>
                <div className="btn-filter-pills">
                  {SECTOR_FILTER_OPTIONS.map((sec) => (
                    <button
                      key={sec.id}
                      className={`filter-pill-btn ${insightSector === sec.id ? "active" : ""}`}
                      onClick={() => setInsightSector(sec.id)}
                    >
                      <span>{sec.icon}</span> {sec.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 Summary Dynamic Metric Cards */}
            <div className="insights-summary-grid">
              {/* Card 1: Network Health Donut */}
              <div className="insight-metric-card">
                <div className="donut-wrap">
                  <svg viewBox="0 0 100 100" className="donut-svg">
                    <circle cx="50" cy="50" r="38" className="donut-bg" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      className="donut-progress"
                      style={{
                        strokeDasharray: 238,
                        strokeDashoffset: 238 - (238 * dynamicInsights.healthPct) / 100,
                        stroke:
                          dynamicInsights.healthPct > 75
                            ? "#10b981"
                            : dynamicInsights.healthPct > 60
                            ? "#38bdf8"
                            : dynamicInsights.healthPct > 45
                            ? "#eab308"
                            : "#f43f5e"
                      }}
                    />
                  </svg>
                  <div className="donut-center">
                    <strong>{dynamicInsights.healthPct}%</strong>
                    <small>
                      {dynamicInsights.healthPct > 80
                        ? "Optimal"
                        : dynamicInsights.healthPct > 65
                        ? "Stable"
                        : "Degraded"}
                    </small>
                  </div>
                </div>
                <div className="card-meta">
                  <span className="meta-label">Network Health</span>
                  <span className="meta-sub">
                    {insightTimeframe.toUpperCase()} · {insightScenario.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Card 2: Critical Regions */}
              <div className="insight-metric-card">
                <div className="icon-badge-box purple">🚨</div>
                <div className="card-meta">
                  <span className="meta-label">Critical States</span>
                  <strong className="meta-val text-pink">{dynamicInsights.criticalCount}</strong>
                  <span className="meta-sub text-pink">High vulnerability areas</span>
                </div>
              </div>

              {/* Card 3: Service Performance */}
              <div className="insight-metric-card">
                <div className="icon-badge-box cyan">✓</div>
                <div className="card-meta">
                  <span className="meta-label">Service Performance</span>
                  <strong className="meta-val text-cyan">{dynamicInsights.performancePct}%</strong>
                  <span className="meta-sub text-green">Cross-sector uptime</span>
                </div>
              </div>

              {/* Card 4: Risk Level */}
              <div className="insight-metric-card">
                <div className="icon-badge-box pink">⚠️</div>
                <div className="card-meta">
                  <span className="meta-label">Active Risk Tier</span>
                  <strong
                    className={`meta-val ${
                      dynamicInsights.riskLevel === "Critical"
                        ? "text-pink"
                        : dynamicInsights.riskLevel === "High"
                        ? "text-amber"
                        : "text-cyan"
                    }`}
                  >
                    {dynamicInsights.riskLevel}
                  </strong>
                  <span className="meta-sub">{insightRegion} focus</span>
                </div>
              </div>
            </div>

            {/* Middle Section: 3-Column Dynamic Insights Breakdown */}
            <div className="insights-content-grid">
              {/* Col 1: Service Performance Progress Bars */}
              <div className="insights-panel-box">
                <div className="panel-title-row">
                  <h3 className="panel-title">Service Performance</h3>
                  <span className="panel-sub-tag">{insightTimeframe.toUpperCase()}</span>
                </div>

                <div className="service-progress-list">
                  {dynamicInsights.sectors.map((s) => (
                    <div key={s.label} className="service-bar-item">
                      <div className="bar-labels">
                        <span>
                          <span className="bar-icon">{s.icon}</span> {s.label}
                        </span>
                        <div className="bar-val-meta">
                          <strong>{s.pct}%</strong>
                          <small className="incidents-count">({s.incidents} incidents)</small>
                        </div>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 2: Multi-line Impact Analysis Chart */}
              <div className="insights-panel-box">
                <div className="chart-header">
                  <h3 className="panel-title">Impact Velocity Curve</h3>
                  <div className="chart-legend">
                    <span className="leg-item"><i className="leg-dot minor" /> Minor</span>
                    <span className="leg-item"><i className="leg-dot mod" /> Moderate</span>
                    <span className="leg-item"><i className="leg-dot sev" /> Severe</span>
                  </div>
                </div>

                <div className="svg-chart-container">
                  <svg viewBox="0 0 360 160" className="impact-chart-svg" preserveAspectRatio="none">
                    {[40, 80, 120].map((y) => (
                      <line
                        key={y}
                        x1="30"
                        y1={y}
                        x2="350"
                        y2={y}
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="2 3"
                      />
                    ))}

                    {/* Severe Line */}
                    <path
                      d={dynamicInsights.chartPaths.severe}
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="2.5"
                    />
                    {/* Moderate Line */}
                    <path
                      d={dynamicInsights.chartPaths.moderate}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2.5"
                    />
                    {/* Minor Line */}
                    <path
                      d={dynamicInsights.chartPaths.minor}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <div className="chart-x-axis">
                    {dynamicInsights.xLabels.map((lbl, idx) => (
                      <span key={idx}>{lbl}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 3: Key Insights Dynamic Bullet Card */}
              <div className="insights-panel-box">
                <h3 className="panel-title">Active Intelligence Findings</h3>

                <div className="key-insights-list">
                  {dynamicInsights.keyInsights.map((ins, i) => (
                    <div key={i} className="insight-bullet-item">
                      <span className="insight-icon">{ins.icon}</span>
                      <div className="insight-copy-col">
                        <strong>{ins.title}</strong>
                        <p>{ins.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn-view-detailed-report" onClick={() => setCurrentPage("Simulator")}>
                  Launch Interactive Simulator <span>→</span>
                </button>
              </div>
            </div>

            {/* Real-Time Disruption Watchlist Log */}
            <div className="insights-incident-watchlist-section">
              <div className="watchlist-header">
                <div>
                  <span className="watchlist-kicker">MONITORED INCIDENTS</span>
                  <h3 className="watchlist-title">Recent Disruption Signals ({insightRegion})</h3>
                </div>
                <button className="btn-explore-map" onClick={() => setCurrentPage("Explorer")}>
                  Inspect On Map →
                </button>
              </div>

              <div className="incident-cards-row">
                {dynamicInsights.incidentLogs.map((log) => (
                  <div key={log.id} className="incident-log-card">
                    <div className="incident-top">
                      <span className="inc-id">{log.id}</span>
                      <span className={`inc-sev sev-${log.severity.toLowerCase()}`}>{log.severity}</span>
                    </div>
                    <strong className="inc-location">{log.location}</strong>
                    <p className="inc-impact">{log.impact}</p>
                    <div className="inc-footer">
                      <span className="inc-sec">Sector: {log.sector}</span>
                      <span className="inc-time">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ================= VIEW: ABOUT PAGE ================= */}
        {currentPage === "About" && (
          <main className="view-about">
            <div className="page-header-row">
              <div>
                <span className="view-kicker">ABOUT</span>
                <h1 className="view-heading">Why Invisible Thread?</h1>
                <p className="view-lead">Because infrastructure is not just about what you see, but what keeps it all connected.</p>
              </div>
            </div>

            <div className="about-split-stage">
              {/* Left Column: Constellation Map with Quote */}
              <div className="about-visual-card">
                <div className="about-mesh-wrap">
                  <IndiaMap mode="about" />
                </div>
                <p className="about-card-quote">It's not just a map. It's a smarter way to see the bigger picture.</p>
              </div>

              {/* Right Column: Problem, Solution, and Features */}
              <div className="about-details-col">
                <div className="about-info-block">
                  <div className="info-badge-icon">⚠️</div>
                  <div className="info-copy">
                    <h3>The Problem</h3>
                    <p>
                      Natural disasters, technical failures, and unexpected disruptions can break critical
                      infrastructure — causing a ripple effect across healthcare, supply chains, and communities.
                    </p>
                  </div>
                </div>

                <div className="about-info-block">
                  <div className="info-badge-icon solution">✓</div>
                  <div className="info-copy">
                    <h3>Our Solution</h3>
                    <p>
                      We simulate and visualize the cascading impacts across dependent services, helping decision-makers
                      identify vulnerabilities and plan better responses.
                    </p>
                  </div>
                </div>

                <div className="about-features-container">
                  <h4 className="features-title">Key Features</h4>
                  <div className="features-capsules-grid">
                    <div className="feature-capsule">
                      <span className="f-icon">🗺️</span>
                      <div>
                        <strong>Interactive Network Map</strong>
                        <small>Explore service connections</small>
                      </div>
                    </div>
                    <div className="feature-capsule">
                      <span className="f-icon">⚙️</span>
                      <div>
                        <strong>Scenario Simulation</strong>
                        <small>Test different disruption levels</small>
                      </div>
                    </div>
                    <div className="feature-capsule">
                      <span className="f-icon">📊</span>
                      <div>
                        <strong>Impact Analysis</strong>
                        <small>Understand cascading effects</small>
                      </div>
                    </div>
                    <div className="feature-capsule">
                      <span className="f-icon">🛣️</span>
                      <div>
                        <strong>Alternative Routes</strong>
                        <small>Find faster, safer options</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRAND BRAND SPLASH BANNER (Panel 6) */}
            <div className="about-grand-splash">
              <div className="splash-infinity">
                <svg viewBox="0 0 54 30" className="splash-infinity-svg">
                  <path
                    d="M13.5,15 C4.5,4.5 0,10.5 0,15 C0,19.5 4.5,25.5 13.5,15 C22.5,4.5 31.5,25.5 40.5,15 C49.5,4.5 54,10.5 54,15 C54,19.5 49.5,25.5 40.5,15 C31.5,4.5 22.5,25.5 13.5,15 Z"
                    className="infinity-path-splash"
                  />
                </svg>
              </div>
              <h2 className="splash-title">Invisible Thread</h2>
              <span className="splash-tag">INFRASTRUCTURE INTELLIGENCE</span>
              <p className="splash-motto">
                <span className="text-cyan">Connected</span> today. Safer tomorrow.
              </p>
            </div>
          </main>
        )}

        {/* Global Footer */}
        <footer className="it-global-footer">
          <div className="footer-left-brand">
            <span className="footer-infinity">∞</span>
            <div className="footer-brand-title">
              <strong>Invisible Thread</strong>
              <small>INFRASTRUCTURE INTELLIGENCE</small>
            </div>
          </div>

          <div className="footer-center-nav">
            <button onClick={() => setCurrentPage("Home")}>Home</button>
            <button onClick={() => setCurrentPage("Explorer")}>Explorer</button>
            <button onClick={() => setCurrentPage("Simulator")}>Simulator</button>
            <button onClick={() => setCurrentPage("Insights")}>Insights</button>
            <button onClick={() => setCurrentPage("About")}>About</button>
          </div>

          <div className="footer-right-copy">
            <div className="footer-social-icons">
              <span>in</span>
              <span>𝕏</span>
              <span>git</span>
            </div>
            <span className="copyright-text">© 2026 Invisible Thread. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
