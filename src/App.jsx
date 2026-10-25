import { useState, useMemo, useEffect } from "react";
import IndiaMap from "./components/IndiaMap";
import { STATE_DEPENDENCY_DATA } from "./data/stateDependencyData";
import { getDynamicInsightsData } from "./data/insightsData";
import {
  Home,
  Search,
  Sliders,
  BarChart3,
  Info,
  Sun,
  Pause,
  AlertTriangle,
  Activity,
  BriefcaseMedical,
  Truck,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  X,
  Compass,
  Layers,
  Link2,
  Share2,
  MapPin,
  Sparkles,
  Heart,
  Lightbulb,
  AlertCircle,
  User,
  CheckCircle2,
  Navigation
} from "lucide-react";
import "./App.css";

export const REGIONAL_INTELLIGENCE_DATA = {
  "Coastal": {
    region: "Coastal",
    name: "Coastal Belt (Cyclone & Flood Risk)",
    tier: "Critical Tier 1",
    tierType: "crit",
    score: 84,
    hazard: "Bay of Bengal & Arabian Sea Storm Surge / Cyclone Alert",
    cities: ["Chennai", "Kochi", "Bhubaneswar", "Mumbai"],
    bottleneck: "Port-to-hospital arterial inundation and maritime freight depot delays.",
    bufferHours: "14 hrs",
    hospitalStrain: "78%",
    logisticsChoke: "86%",
    triageAction: "Activate coastal emergency bypass corridors & mobilize floating emergency clinics."
  },
  "North India": {
    region: "North India",
    name: "North India (Heavy Rainfall & Flooding)",
    tier: "Critical Tier 1",
    tierType: "crit",
    score: 79,
    hazard: "Yamuna & Ganga River Spills / Heavy Monsoon Cloudburst",
    cities: ["Delhi", "Chandigarh", "Jaipur", "Lucknow"],
    bottleneck: "Inter-state highway NH44 waterlogging cuts critical ambulance & freight links.",
    bufferHours: "18 hrs",
    hospitalStrain: "72%",
    logisticsChoke: "81%",
    triageAction: "Re-route northern cold-chain freight via Western ring expressways."
  },
  "Eastern Region": {
    region: "Eastern Region",
    name: "Eastern Region (Riverine Flood Risk)",
    tier: "Critical Tier 1",
    tierType: "crit",
    score: 82,
    hazard: "Brahmaputra & Delta Overflow / Rail Freight Junction Blockage",
    cities: ["Kolkata", "Patna", "Guwahati", "Bhubaneswar"],
    bottleneck: "Submerged rail freight junctions delay eastern medical distribution.",
    bufferHours: "12 hrs",
    hospitalStrain: "80%",
    logisticsChoke: "88%",
    triageAction: "Deploy elevated regional buffer caches and priority inland water ferries."
  },
  "Western Coast": {
    region: "Western Coast",
    name: "Western Coast (Storm Surge & Drainage)",
    tier: "Elevated Tier 2",
    tierType: "elev",
    score: 76,
    hazard: "Urban Drainage Saturation & Coastal High Tide",
    cities: ["Mumbai", "Ahmedabad", "Pune", "Kochi"],
    bottleneck: "Intense urban downpours overwhelm stormwater pumps, halting local delivery fleets.",
    bufferHours: "16 hrs",
    hospitalStrain: "69%",
    logisticsChoke: "79%",
    triageAction: "Shift metro hospital supply deliveries to early dawn off-peak schedules."
  },
  "Southern Region": {
    region: "Southern Region",
    name: "Southern Region (Monsoon & Transit)",
    tier: "Elevated Tier 2",
    tierType: "elev",
    score: 71,
    hazard: "Northeast Monsoon & Urban Corridor Choke Points",
    cities: ["Bengaluru", "Chennai", "Hyderabad", "Kochi"],
    bottleneck: "High-density tech corridors face power grid fluctuations & transit delays.",
    bufferHours: "22 hrs",
    hospitalStrain: "62%",
    logisticsChoke: "68%",
    triageAction: "Trigger automated substation failovers and dispatch rapid road-clearing teams."
  }
};

function buildImpactPath(values, total = 7) {
  if (!values || values.length === 0) return "";
  const getX = (i) => 20 + i * ((340 - 40) / (total - 1));
  const getY = (v) => 135 - (v / 100) * 115;
  const pts = values.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("Home");
  const [isIlluminated, setIsIlluminated] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("Minor"); // Minor | Moderate | Severe
  const [activeDisruptionType, setActiveDisruptionType] = useState("Road Blockage");
  const [selectedLayer, setSelectedLayer] = useState("All");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All India");
  const [timelineStep, setTimelineStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Dynamic Insights Interactive State
  const [insightTimeframe, setInsightTimeframe] = useState("30d");
  const [selectedInsightService, setSelectedInsightService] = useState("Roads");
  const [visibleImpactSeries, setVisibleImpactSeries] = useState({ minor: true, moderate: true, severe: true });
  const [hoveredImpactIndex, setHoveredImpactIndex] = useState(null);
  const [pinnedImpactIndex, setPinnedImpactIndex] = useState(null);

  // Dynamic Insights calculation that reacts to timeframe, scenario, service, and region
  const dynamicInsights = useMemo(() => {
    return getDynamicInsightsData({
      timeframe: insightTimeframe,
      scenario: selectedScenario.toLowerCase(),
      sector: selectedInsightService ? selectedInsightService.toLowerCase() : "all",
      region: selectedRegion || "All India"
    });
  }, [insightTimeframe, selectedScenario, selectedInsightService, selectedRegion]);

  // Selected State Diagnostic Object
  const inspectedState = useMemo(() => {
    if (!selectedStateId) return null;
    return STATE_DEPENDENCY_DATA[selectedStateId] || null;
  }, [selectedStateId]);

  // Scenario multipliers matching the reference screenshots
  const scenarioStats = useMemo(() => {
    if (selectedScenario === "Minor") {
      return {
        hospitalsAffected: 6,
        totalHospitals: 28,
        hospitalsPct: 21,
        pharmaciesAffected: 12,
        totalPharmacies: 60,
        pharmaciesPct: 20,
        deliveryAffected: 8,
        totalDelivery: 40,
        deliveryPct: 20,
        timeSaving: "~ 24 min",
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
        hospitalsPct: 43,
        pharmaciesAffected: 22,
        totalPharmacies: 60,
        pharmaciesPct: 37,
        deliveryAffected: 14,
        totalDelivery: 40,
        deliveryPct: 35,
        timeSaving: "~ 41 min",
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
        hospitalsPct: 75,
        pharmaciesAffected: 48,
        totalPharmacies: 60,
        pharmaciesPct: 80,
        deliveryAffected: 32,
        totalDelivery: 40,
        deliveryPct: 80,
        timeSaving: "~ 68 min",
        timeline: [
          { name: "Road Blockage", time: "0 - 60 min", desc: "Severe arterial highway collapse" },
          { name: "Hospital Delay", time: "90 - 180 min", desc: "Critical emergency triage overload" },
          { name: "Pharmacy Shortage", time: "3 - 8 hrs", desc: "Vital prescription stockouts" },
          { name: "Delivery Delay", time: "6 - 14 hrs", desc: "Complete last-mile halt" }
        ]
      };
    }
  }, [selectedScenario]);

  // Simulation playback timer
  useEffect(() => {
    let interval = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setTimelineStep((prev) => {
          if (prev >= 3) {
            setIsSimulating(false);
            return 3;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <div className={`it-app-shell ${isIlluminated ? "illuminated-ambient" : ""}`}>
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="it-sidebar">
        {/* Brand Lockup */}
        <div className="sidebar-brand" onClick={() => setCurrentPage("Home")} style={{ cursor: "pointer" }}>
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
            { id: "Home", label: "Home", icon: <Home size={18} /> },
            { id: "Explorer", label: "Explorer", icon: <Search size={18} /> },
            { id: "Simulator", label: "Simulator", icon: <Sliders size={18} /> },
            { id: "Insights", label: "Insights", icon: <BarChart3 size={18} /> },
            { id: "About", label: "About", icon: <Info size={18} /> },
            { id: "Vision", label: "Vision", icon: <Sparkles size={18} /> }
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
        <div
          className="sidebar-footer-quote"
          onClick={() => setCurrentPage("Vision")}
          style={{ cursor: "pointer" }}
          title="Click to view full vision presentation"
        >
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
            {currentPage !== "Home" && (
              <>
                <span className="bc-root" onClick={() => setCurrentPage("Home")} style={{ cursor: "pointer" }}>
                  Invisible Thread
                </span>
                <span className="bc-sep">/</span>
                <span className="bc-current">{currentPage}</span>
              </>
            )}
          </div>

          <div className="header-actions">
            <button
              className={`theme-toggle-btn ${isIlluminated ? "illuminated" : ""}`}
              onClick={() => setIsIlluminated((prev) => !prev)}
              title={isIlluminated ? "Ambient Illumination ON" : "Toggle illumination"}
              aria-label="Toggle illumination"
            >
              <Sun size={15} />
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
                  <span className="word-everything">everything</span>{" "}
                  <span className="word-feels-it">feels it.</span>
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
                  <IndiaMap
                    mode="home"
                    scenario={selectedScenario}
                    selectedLayer={selectedLayer}
                    onSelectCity={(city) => {
                      setSelectedCity(city);
                      setCurrentPage("Explorer");
                    }}
                  />

                  {/* Floating Service Legend */}
                  <div className="floating-legend">
                    <span
                      className={`legend-item ${selectedLayer === "Roads" ? "active" : ""}`}
                      onClick={() => setSelectedLayer((prev) => (prev === "Roads" ? "All" : "Roads"))}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="legend-dot road" /> Roads
                    </span>
                    <span
                      className={`legend-item ${selectedLayer === "Hospitals" ? "active" : ""}`}
                      onClick={() => setSelectedLayer((prev) => (prev === "Hospitals" ? "All" : "Hospitals"))}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="legend-dot hospital" /> Hospitals
                    </span>
                    <span
                      className={`legend-item ${selectedLayer === "Pharmacies" ? "active" : ""}`}
                      onClick={() => setSelectedLayer((prev) => (prev === "Pharmacies" ? "All" : "Pharmacies"))}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="legend-dot pharmacy" /> Pharmacies
                    </span>
                    <span
                      className={`legend-item ${selectedLayer === "Delivery" ? "active" : ""}`}
                      onClick={() => setSelectedLayer((prev) => (prev === "Delivery" ? "All" : "Delivery"))}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="legend-dot delivery" /> Delivery
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* "THE INVISIBLE THREAD: One disruption. Four connected services." Strip */}
            <section className="home-thread-strip">
              <span className="strip-kicker">THE INVISIBLE THREAD</span>
              <h2 className="strip-heading">One disruption. Four connected services.</h2>

              <div className="thread-cards-flow">
                <div
                  className="thread-step-card road"
                  onClick={() => {
                    setActiveDisruptionType("Road Blockage");
                    setCurrentPage("Simulator");
                  }}
                  style={{ cursor: "pointer" }}
                  title="Test Road Blockage in Simulator"
                >
                  <div className="step-icon-wrap road-icon">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="step-meta">
                    <strong>Road Blockage</strong>
                    <span>Traffic & transport delay</span>
                  </div>
                </div>

                <span className="flow-arrow">→</span>

                <div
                  className="thread-step-card hospital"
                  onClick={() => {
                    setActiveDisruptionType("Hospital Overload");
                    setCurrentPage("Simulator");
                  }}
                  style={{ cursor: "pointer" }}
                  title="Test Hospital Delay in Simulator"
                >
                  <div className="step-icon-wrap hospital-icon">
                    <Activity size={20} />
                  </div>
                  <div className="step-meta">
                    <strong>Hospital Delay</strong>
                    <span>Access & supply slow</span>
                  </div>
                </div>

                <span className="flow-arrow">→</span>

                <div
                  className="thread-step-card pharmacy"
                  onClick={() => {
                    setActiveDisruptionType("Pharmacy Shortage");
                    setCurrentPage("Simulator");
                  }}
                  style={{ cursor: "pointer" }}
                  title="Test Pharmacy Shortage in Simulator"
                >
                  <div className="step-icon-wrap pharmacy-icon">
                    <BriefcaseMedical size={20} />
                  </div>
                  <div className="step-meta">
                    <strong>Pharmacy Shortage</strong>
                    <span>Medicine availability low</span>
                  </div>
                </div>

                <span className="flow-arrow">→</span>

                <div
                  className="thread-step-card delivery"
                  onClick={() => {
                    setActiveDisruptionType("Delivery Delay");
                    setCurrentPage("Simulator");
                  }}
                  style={{ cursor: "pointer" }}
                  title="Test Delivery Delay in Simulator"
                >
                  <div className="step-icon-wrap delivery-icon">
                    <Truck size={20} />
                  </div>
                  <div className="step-meta">
                    <strong>Delivery Delay</strong>
                    <span>Medicine arrives late</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 Metric KPI Cards */}
            <section className="home-kpi-grid">
              <div className="kpi-card" onClick={() => setCurrentPage("Explorer")} style={{ cursor: "pointer" }}>
                <span className="kpi-label">Service types</span>
                <strong className="kpi-number">04</strong>
                <span className="kpi-sub">Roads · Hospitals · Pharmacy · Delivery</span>
              </div>

              <div className="kpi-card" onClick={() => setCurrentPage("Explorer")} style={{ cursor: "pointer" }}>
                <span className="kpi-label">Dependency links</span>
                <strong className="kpi-number">03</strong>
                <span className="kpi-sub">Illustrative links in sample model</span>
              </div>

              <div className="kpi-card" onClick={() => setCurrentPage("Simulator")} style={{ cursor: "pointer" }}>
                <span className="kpi-label">Scenario modes</span>
                <strong className="kpi-number">03</strong>
                <span className="kpi-sub">Minor · Moderate · Severe</span>
              </div>

              <div className="kpi-card" onClick={() => setShowRouteModal(true)} style={{ cursor: "pointer" }}>
                <span className="kpi-label">Response option</span>
                <strong className="kpi-number">
                  41 <small>min</small>
                </strong>
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
                <p className="view-lead">
                  Visualize how critical infrastructure and essential services are connected across India.
                </p>
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
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for a city or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="search-clear-btn" onClick={() => setSearchQuery("")}>
                    ✕
                  </button>
                )}
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
                      { id: "Roads", label: "Road Network", icon: <Share2 size={13} /> },
                      { id: "Hospitals", label: "Hospitals", icon: <Activity size={13} /> },
                      { id: "Pharmacies", label: "Pharmacies", icon: <BriefcaseMedical size={13} /> },
                      { id: "Delivery", label: "Delivery Routes", icon: <Truck size={13} /> }
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

              {/* Right Column: Side Status Overlay / State Diagnostics */}
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
                    <div
                      className={`side-status-banner status-${inspectedState.status.toLowerCase().replace(/\s+/g, "-")}`}
                    >
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
                        <span>Hospitals:</span>
                        <strong>{inspectedState.criticalFacilities.hospitals}</strong>
                      </div>
                      <div className="side-fac-row">
                        <span>Freight Hubs:</span>
                        <strong>{inspectedState.criticalFacilities.logisticsHubs}</strong>
                      </div>
                      <div className="side-fac-row">
                        <span>Pharma Depots:</span>
                        <strong>{inspectedState.criticalFacilities.pharmaDepots}</strong>
                      </div>
                      <div className="side-fac-row">
                        <span>Autonomous Buffer:</span>
                        <strong className="text-cyan">{inspectedState.bufferHours} hrs</strong>
                      </div>
                    </div>

                    {/* Operational Insight */}
                    <div className="side-insight-callout">
                      <Lightbulb size={16} className="insight-ico text-amber" />
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
                  /* National Overview When No State is Selected (Matches 02_Explorer Screenshot) */
                  <>
                    <div className="explorer-stats-card">
                      <h3 className="card-heading">Network Overview</h3>
                      <div className="stat-rows-list">
                        <div className="stat-row">
                          <span className="stat-left">
                            <span className="stat-icon-wrap blue">
                              <Share2 size={14} />
                            </span>{" "}
                            Total Nodes
                          </span>
                          <strong className="stat-right">152</strong>
                        </div>
                        <div className="stat-row">
                          <span className="stat-left">
                            <span className="stat-icon-wrap purple">
                              <Link2 size={14} />
                            </span>{" "}
                            Connections
                          </span>
                          <strong className="stat-right">482</strong>
                        </div>
                        <div className="stat-row">
                          <span className="stat-left">
                            <span className="stat-icon-wrap cyan">
                              <Compass size={14} />
                            </span>{" "}
                            Regions
                          </span>
                          <strong className="stat-right">28</strong>
                        </div>
                        <div className="stat-row">
                          <span className="stat-left">
                            <span className="stat-icon-wrap green">
                              <Layers size={14} />
                            </span>{" "}
                            Service Types
                          </span>
                          <strong className="stat-right">4</strong>
                        </div>
                      </div>
                    </div>

                    <div className="explorer-stats-card">
                      <h3 className="card-heading">Top Vulnerable Regions</h3>
                      <div className="vulnerable-list">
                        {[
                          { num: 1, name: "Coastal (Cyclone/Flood Risk)", reg: "Coastal" },
                          { num: 2, name: "North India (Heavy Rainfall)", reg: "North India" },
                          { num: 3, name: "Eastern Region (Flood Risk)", reg: "Eastern Region" },
                          { num: 4, name: "Western Coast (Storm Surge)", reg: "Western Coast" },
                          { num: 5, name: "Southern Region (Monsoon)", reg: "Southern Region" }
                        ].map((r) => (
                          <div
                            key={r.num}
                            className={`vulnerable-item clickable-vuln-row ${
                              selectedRegion === r.reg ? "selected-region-row" : ""
                            }`}
                            onClick={() => setSelectedRegion(r.reg)}
                            role="button"
                            tabIndex={0}
                            title={`Filter to ${r.name}`}
                          >
                            <span className="vuln-badge">{r.num}</span>
                            <div className="vuln-meta-col">
                              <span className="vuln-name">{r.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="region-select-box">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <label className="select-label" style={{ marginBottom: 0 }}>Select a Region</label>
                        {selectedRegion !== "All India" && (
                          <button
                            className="btn-clear-region"
                            onClick={() => setSelectedRegion("All India")}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--cyan)",
                              fontSize: "11px",
                              fontFamily: "var(--font-mono)",
                              cursor: "pointer",
                              padding: "2px 6px"
                            }}
                          >
                            Reset (All India) ✕
                          </button>
                        )}
                      </div>
                      <select
                        className="region-dropdown"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                      >
                        <option value="All India">All India</option>
                        <option value="North India">North India (Heavy Rainfall)</option>
                        <option value="Western Coast">Western Coast (Storm Surge)</option>
                        <option value="Eastern Region">Eastern Region (Flood Risk)</option>
                        <option value="Southern Region">Southern Region (Monsoon)</option>
                        <option value="Coastal">Coastal (Cyclone/Flood Risk)</option>
                      </select>
                    </div>

                    {/* Dedicated Regional Diagnostic Card when a region is selected */}
                    {selectedRegion !== "All India" && REGIONAL_INTELLIGENCE_DATA[selectedRegion] && (
                      <div className="regional-diagnostic-card">
                        <div className="regional-card-header">
                          <div>
                            <span className="regional-kicker">REGIONAL INTELLIGENCE</span>
                            <h4 className="regional-title">{REGIONAL_INTELLIGENCE_DATA[selectedRegion].name}</h4>
                          </div>
                          <span className={`regional-tier-badge ${REGIONAL_INTELLIGENCE_DATA[selectedRegion].tierType}`}>
                            {REGIONAL_INTELLIGENCE_DATA[selectedRegion].tier}
                          </span>
                        </div>

                        <div className="regional-threat-row">
                          <AlertTriangle size={14} className="text-pink shrink-0" />
                          <span>{REGIONAL_INTELLIGENCE_DATA[selectedRegion].hazard}</span>
                        </div>

                        <div className="side-metrics-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                          <div className="side-metric-chip">
                            <span>Vulnerability Index</span>
                            <strong className="text-pink">{REGIONAL_INTELLIGENCE_DATA[selectedRegion].score}/100</strong>
                          </div>
                          <div className="side-metric-chip">
                            <span>Hospital Strain</span>
                            <strong className="text-cyan">{REGIONAL_INTELLIGENCE_DATA[selectedRegion].hospitalStrain}</strong>
                          </div>
                          <div className="side-metric-chip">
                            <span>Logistics Choke</span>
                            <strong className="text-purple">{REGIONAL_INTELLIGENCE_DATA[selectedRegion].logisticsChoke}</strong>
                          </div>
                          <div className="side-metric-chip">
                            <span>Buffer Window</span>
                            <strong className="text-amber">{REGIONAL_INTELLIGENCE_DATA[selectedRegion].bufferHours}</strong>
                          </div>
                        </div>

                        <div className="regional-bottleneck-box">
                          <div style={{ fontSize: "9px", color: "#94a3b8", fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "1px", marginBottom: "4px" }}>
                            PRIMARY BOTTLENECK
                          </div>
                          <p style={{ margin: 0, fontSize: "11px", color: "#e2e8f0", lineHeight: 1.5 }}>
                            {REGIONAL_INTELLIGENCE_DATA[selectedRegion].bottleneck}
                          </p>
                        </div>

                        <div className="regional-cities-chips">
                          <div style={{ fontSize: "9px", color: "#94a3b8", fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "1px", marginBottom: "4px" }}>
                            CONNECTED REGIONAL CITIES
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {REGIONAL_INTELLIGENCE_DATA[selectedRegion].cities.map((c) => (
                              <button
                                key={c}
                                className="regional-city-pill"
                                onClick={() => setSelectedCity(c)}
                                title={`Focus node ${c} on map`}
                                style={{
                                  cursor: "pointer",
                                  border: selectedCity === c ? "1px solid #38bdf8" : undefined,
                                  background: selectedCity === c ? "rgba(56, 189, 248, 0.3)" : undefined
                                }}
                              >
                                {c.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="regional-action-box">
                          <ShieldCheck size={16} className="text-emerald-400 shrink-0" style={{ marginTop: "2px" }} />
                          <div style={{ fontSize: "11px", color: "#a7f3d0", lineHeight: 1.4 }}>
                            <strong>Triage Action:</strong> {REGIONAL_INTELLIGENCE_DATA[selectedRegion].triageAction}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="node-helper-note">
                      <User size={18} className="helper-icon text-cyan" />
                      <span>Click on a node or state to view details and see how it's connected.</span>
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
                <p className="view-lead">
                  See how a single disruption can create a chain of impacts across essential services.
                </p>
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

            {/* 3-Panel Central Simulator Layout (Matches 03_Simulator Screenshot) */}
            <div className="simulator-stage-grid">
              {/* Left Panel: Disruption Type Options */}
              <div className="sim-panel disruption-types-card">
                <h3 className="card-heading">Disruption Type</h3>

                <div className="disruption-options-list">
                  {[
                    {
                      id: "Road Blockage",
                      label: "Road Blockage",
                      sub: "Flooding or traffic delay",
                      icon: <AlertTriangle size={18} />
                    },
                    {
                      id: "Hospital Overload",
                      label: "Hospital Overload",
                      sub: "High patient inflow",
                      icon: <Activity size={18} />
                    },
                    {
                      id: "Pharmacy Shortage",
                      label: "Pharmacy Shortage",
                      sub: "Supply chain disruption",
                      icon: <BriefcaseMedical size={18} />
                    },
                    {
                      id: "Delivery Delay",
                      label: "Delivery Delay",
                      sub: "Logistics or weather issues",
                      icon: <Truck size={18} />
                    }
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
                      {activeDisruptionType === opt.id && (
                        <span className="select-check text-cyan">
                          <ChevronDown size={14} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  className="btn-run-simulation"
                  onClick={() => {
                    if (isSimulating) {
                      setIsSimulating(false);
                    } else {
                      setTimelineStep(0);
                      setIsSimulating(true);
                    }
                  }}
                >
                  {isSimulating ? (
                    <>
                      Pause Simulation <Pause size={14} />
                    </>
                  ) : (
                    <>
                      Run Simulation <span>→</span>
                    </>
                  )}
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
                    <div className="impact-icon-badge hospital">
                      <Activity size={18} />
                    </div>
                    <div className="impact-metric-meta">
                      <span>Hospitals</span>
                      <strong>
                        {scenarioStats.hospitalsAffected} / {scenarioStats.totalHospitals}
                      </strong>
                    </div>
                    <span className="impact-pct text-cyan">{scenarioStats.hospitalsPct}%</span>
                  </div>

                  <div className="impact-metric-row">
                    <div className="impact-icon-badge pharmacy">
                      <BriefcaseMedical size={18} />
                    </div>
                    <div className="impact-metric-meta">
                      <span>Pharmacies Affected</span>
                      <strong>
                        {scenarioStats.pharmaciesAffected} / {scenarioStats.totalPharmacies}
                      </strong>
                    </div>
                    <span className="impact-pct text-purple">{scenarioStats.pharmaciesPct}%</span>
                  </div>

                  <div className="impact-metric-row">
                    <div className="impact-icon-badge delivery">
                      <Truck size={18} />
                    </div>
                    <div className="impact-metric-meta">
                      <span>Delivery Delays</span>
                      <strong>
                        {scenarioStats.deliveryAffected} / {scenarioStats.totalDelivery}
                      </strong>
                    </div>
                    <span className="impact-pct text-pink">{scenarioStats.deliveryPct}%</span>
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
                        <line x1="10" y1="45" x2="45" y2="15" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 3" />
                        <line x1="10" y1="45" x2="55" y2="50" stroke="#10b981" strokeWidth="2.5" />
                        <line x1="55" y1="50" x2="90" y2="20" stroke="#10b981" strokeWidth="2.5" />
                        <circle cx="10" cy="45" r="3.5" fill="#38bdf8" />
                        <circle cx="55" cy="50" r="3.5" fill="#10b981" />
                        <circle cx="90" cy="20" r="3.5" fill="#38bdf8" />
                        <text x="45" y="12" fill="#f43f5e" fontSize="7" fontWeight="bold">✕</text>
                      </svg>
                    </div>
                    <div className="alt-save-text">
                      <strong>{scenarioStats.timeSaving}</strong>
                      <button className="btn-view-route" onClick={() => setShowRouteModal(true)}>
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
                    onClick={() => {
                      setTimelineStep(idx);
                      setIsSimulating(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="timeline-dot-connector">
                      <div className="step-circle">
                        {idx === 0 ? (
                          <AlertTriangle size={12} />
                        ) : idx === 1 ? (
                          <Activity size={12} />
                        ) : idx === 2 ? (
                          <BriefcaseMedical size={12} />
                        ) : (
                          <Truck size={12} />
                        )}
                      </div>
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
                <span className="view-kicker">INSIGHTS</span>
                <h1 className="view-heading">Network Health & Insights</h1>
                <p className="view-lead">
                  Understand the current state of the infrastructure, service performance and key insights from the illustrative dataset.
                </p>
              </div>

              {/* Dynamic Timeframe Dropdown */}
              <div className="date-select-wrap">
                <select
                  className="date-filter-dropdown"
                  value={insightTimeframe}
                  onChange={(e) => setInsightTimeframe(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="ytd">Year to date</option>
                </select>
              </div>
            </div>

            {/* 4 Summary Dynamic Metric Cards (Matches 04_Insights Screenshot) */}
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
                        stroke: "#38bdf8"
                      }}
                    />
                  </svg>
                  <div className="donut-center">
                    <strong>{dynamicInsights.healthPct}%</strong>
                    <small>{dynamicInsights.healthPct >= 75 ? "Stable" : "Critical"}</small>
                  </div>
                </div>
                <div className="card-meta">
                  <span className="meta-label">Network Health</span>
                  <strong className="meta-val">{dynamicInsights.healthPct}%</strong>
                  <span className="meta-sub text-cyan">
                    {dynamicInsights.healthPct >= 75 ? "Stable" : "Alert Active"}
                  </span>
                </div>
              </div>

              {/* Card 2: Critical Regions */}
              <div className="insight-metric-card">
                <div className="icon-badge-box purple">
                  <MapPin size={22} />
                </div>
                <div className="card-meta">
                  <span className="meta-label">Critical Regions</span>
                  <strong className="meta-val text-pink">{dynamicInsights.criticalCount}</strong>
                  <span className="meta-sub text-pink">High risk areas</span>
                </div>
              </div>

              {/* Card 3: Service Performance */}
              <div className="insight-metric-card">
                <div className="icon-badge-box cyan">
                  <ShieldCheck size={22} />
                </div>
                <div className="card-meta">
                  <span className="meta-label">Service Performance</span>
                  <strong className="meta-val text-cyan">{dynamicInsights.performancePct}%</strong>
                  <span className="meta-sub text-green">Overall efficiency</span>
                </div>
              </div>

              {/* Card 4: Risk Level */}
              <div className="insight-metric-card">
                <div className="icon-badge-box pink">
                  <AlertCircle size={22} />
                </div>
                <div className="card-meta">
                  <span className="meta-label">Risk Level</span>
                  <strong className="meta-val text-amber">{dynamicInsights.riskLevel}</strong>
                  <span className="meta-sub">Watchlist active</span>
                </div>
              </div>
            </div>

            {/* Middle Section: 3-Column Dynamic Insights Breakdown */}
            <div className="insights-content-grid">
              {/* Col 1: Service Performance Progress Bars (Interactive with Telemetry Drawer) */}
              <div className="insights-panel-box">
                <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 className="panel-title">Service Performance</h3>
                  <div style={{ display: "flex", gap: "4px" }} title="Stress test scenario on services">
                    {["Minor", "Moderate", "Severe"].map((scen) => (
                      <button
                        key={scen}
                        type="button"
                        onClick={() => setSelectedScenario(scen)}
                        style={{
                          fontSize: "9px",
                          fontFamily: "var(--font-mono)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          border: selectedScenario === scen ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.08)",
                          background: selectedScenario === scen ? "rgba(56, 189, 248, 0.2)" : "transparent",
                          color: selectedScenario === scen ? "#38bdf8" : "#94a3b8",
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {scen}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="service-progress-list">
                  {dynamicInsights.sectors.map((s) => {
                    const isSelected = selectedInsightService === s.label;
                    const iconMap = {
                      Roads: <Share2 size={13} />,
                      Hospitals: <Activity size={13} />,
                      Pharmacies: <BriefcaseMedical size={13} />,
                      Delivery: <Truck size={13} />
                    };

                    return (
                      <div
                        key={s.label}
                        className={`service-bar-item ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedInsightService(s.label)}
                        title={`Click to inspect ${s.label} telemetry & diagnostics`}
                      >
                        <div className="bar-labels">
                          <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                            <span style={{ color: s.color, display: "flex", alignItems: "center" }}>
                              {iconMap[s.label] || <Share2 size={13} />}
                            </span>
                            <span style={{ fontWeight: isSelected ? "700" : "500" }}>{s.label}</span>
                          </span>
                          <strong style={{ color: s.pct < 70 ? "#f43f5e" : s.pct < 85 ? "#f59e0b" : "#ffffff" }}>
                            {s.pct}%
                          </strong>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${s.pct}%`,
                              backgroundColor: s.color,
                              boxShadow: `0 0 10px ${s.color}66`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Sector Telemetry Detail Drawer */}
                {(() => {
                  const activeSector =
                    dynamicInsights.sectors.find((s) => s.label === selectedInsightService) ||
                    dynamicInsights.sectors[0];
                  const statusClass = activeSector.pct >= 85 ? "opt" : activeSector.pct >= 70 ? "warn" : "crit";
                  const statusLabel =
                    activeSector.pct >= 85 ? "OPERATIONAL" : activeSector.pct >= 70 ? "DEGRADED" : "CRITICAL STRAIN";

                  return (
                    <div className="service-detail-drawer">
                      <div className="service-drawer-header">
                        <span className="service-drawer-title">
                          <span style={{ color: activeSector.color }}>
                            {activeSector.label === "Roads" && <Share2 size={14} />}
                            {activeSector.label === "Hospitals" && <Activity size={14} />}
                            {activeSector.label === "Pharmacies" && <BriefcaseMedical size={14} />}
                            {activeSector.label === "Delivery" && <Truck size={14} />}
                          </span>
                          {activeSector.fullName || activeSector.label}
                        </span>
                        <span className={`service-status-pill ${statusClass}`}>{statusLabel}</span>
                      </div>

                      <div className="service-stats-grid">
                        <div className="service-stat-cell">
                          <span className="service-stat-label">Active Nodes</span>
                          <span className="service-stat-value">{activeSector.activeNodes || "412 Active"}</span>
                        </div>
                        <div className="service-stat-cell">
                          <span className="service-stat-label">Buffer Capacity</span>
                          <span className="service-stat-value">{activeSector.bufferCapacity || "18 hrs buffer"}</span>
                        </div>
                        <div className="service-stat-cell">
                          <span className="service-stat-label">Incidents ({insightTimeframe})</span>
                          <span className="service-stat-value" style={{ color: "#f43f5e" }}>
                            {activeSector.incidentCount || 42} alerts
                          </span>
                        </div>
                        <div className="service-stat-cell">
                          <span className="service-stat-label">Flow Resilience</span>
                          <span className="service-stat-value" style={{ color: "#38bdf8" }}>
                            {activeSector.flowThroughput || `${activeSector.pct}% Optimal`}
                          </span>
                        </div>
                      </div>

                      <p className="service-risk-note">
                        <strong>Risk:</strong> {activeSector.primaryRisk}
                      </p>

                      <div className="service-drawer-actions">
                        <button
                          type="button"
                          className="service-btn-jump"
                          onClick={() => {
                            setSelectedLayer(activeSector.label);
                            setCurrentPage("Explorer");
                          }}
                          title="Open layer in Network Explorer"
                        >
                          <Search size={12} /> Explorer
                        </button>
                        <button
                          type="button"
                          className="service-btn-jump"
                          style={{
                            background: "rgba(168, 85, 247, 0.12)",
                            borderColor: "rgba(168, 85, 247, 0.35)",
                            color: "#c084fc"
                          }}
                          onClick={() => {
                            const mapDisrupt = {
                              Roads: "Road Blockage",
                              Hospitals: "Hospital Delay",
                              Pharmacies: "Pharmacy Shortage",
                              Delivery: "Delivery Delay"
                            };
                            setActiveDisruptionType(mapDisrupt[activeSector.label] || "Road Blockage");
                            setCurrentPage("Simulator");
                          }}
                          title="Run failure cascade in Simulator"
                        >
                          <Sliders size={12} /> Simulate
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Col 2: Multi-line Impact Analysis Chart (Interactive with Toggleable Series, Crosshair, & Tooltip) */}
              <div className="insights-panel-box">
                <div className="chart-header">
                  <h3 className="panel-title">Impact Analysis</h3>
                  <div className="chart-legend">
                    <button
                      type="button"
                      className={`chart-legend-btn ${visibleImpactSeries.minor ? "active" : "inactive"}`}
                      onClick={() => setVisibleImpactSeries((p) => ({ ...p, minor: !p.minor }))}
                      title="Click to toggle Minor curve"
                    >
                      <i className="leg-dot minor" /> Minor
                    </button>
                    <button
                      type="button"
                      className={`chart-legend-btn ${visibleImpactSeries.moderate ? "active" : "inactive"}`}
                      onClick={() => setVisibleImpactSeries((p) => ({ ...p, moderate: !p.moderate }))}
                      title="Click to toggle Moderate curve"
                    >
                      <i className="leg-dot mod" /> Moderate
                    </button>
                    <button
                      type="button"
                      className={`chart-legend-btn ${visibleImpactSeries.severe ? "active" : "inactive"}`}
                      onClick={() => setVisibleImpactSeries((p) => ({ ...p, severe: !p.severe }))}
                      title="Click to toggle Severe curve"
                    >
                      <i className="leg-dot sev" /> Severe
                    </button>
                  </div>
                </div>

                {(() => {
                  const ts = dynamicInsights.timeseries;
                  const totalPts = ts.labels.length;
                  const getX = (idx) => 20 + idx * ((340 - 40) / (totalPts - 1));
                  const getY = (val) => 135 - (val / 100) * 115;

                  const minorPath = buildImpactPath(ts.minor, totalPts);
                  const modPath = buildImpactPath(ts.moderate, totalPts);
                  const sevPath = buildImpactPath(ts.severe, totalPts);

                  const activeIdx =
                    hoveredImpactIndex !== null
                      ? hoveredImpactIndex
                      : pinnedImpactIndex !== null
                      ? pinnedImpactIndex
                      : null;

                  return (
                    <div className="svg-chart-container">
                      {/* Floating Tooltip Bubble when hovering over any data point */}
                      {activeIdx !== null && (
                        <div className="chart-tooltip-bubble">
                          <div className="chart-tooltip-header">
                            <span>{ts.fullDates ? ts.fullDates[activeIdx] : `Step ${ts.labels[activeIdx]}`}</span>
                            <span style={{ color: "#94a3b8", fontSize: "9px" }}>
                              {insightTimeframe === "7d"
                                ? "Daily Trajectory"
                                : insightTimeframe === "30d"
                                ? "Monthly Trend"
                                : "Aggregated Log"}
                            </span>
                          </div>
                          <div className="chart-tooltip-values">
                            {visibleImpactSeries.minor && (
                              <div className="chart-tooltip-val-item">
                                <i className="leg-dot minor" style={{ width: "5px", height: "5px" }} />
                                <span style={{ color: "#ec4899" }}>Minor: {ts.minor[activeIdx]}%</span>
                              </div>
                            )}
                            {visibleImpactSeries.moderate && (
                              <div className="chart-tooltip-val-item">
                                <i className="leg-dot mod" style={{ width: "5px", height: "5px" }} />
                                <span style={{ color: "#a855f7" }}>Mod: {ts.moderate[activeIdx]}%</span>
                              </div>
                            )}
                            {visibleImpactSeries.severe && (
                              <div className="chart-tooltip-val-item">
                                <i className="leg-dot sev" style={{ width: "5px", height: "5px" }} />
                                <span style={{ color: "#38bdf8" }}>Sev: {ts.severe[activeIdx]}%</span>
                              </div>
                            )}
                          </div>
                          {ts.notes && ts.notes[activeIdx] && (
                            <p className="chart-tooltip-desc">{ts.notes[activeIdx]}</p>
                          )}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
                        {/* Y-Axis */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            fontSize: "9px",
                            color: "#64748b",
                            fontFamily: "var(--font-mono)",
                            paddingBottom: "16px"
                          }}
                        >
                          <span>100%</span>
                          <span>75%</span>
                          <span>50%</span>
                          <span>25%</span>
                          <span>0%</span>
                        </div>

                        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                          <svg viewBox="0 0 340 140" className="impact-chart-svg" preserveAspectRatio="none">
                            <defs>
                              <filter id="glowPink" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ec4899" floodOpacity="0.6" />
                              </filter>
                              <filter id="glowPurple" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#a855f7" floodOpacity="0.6" />
                              </filter>
                              <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#38bdf8" floodOpacity="0.6" />
                              </filter>
                            </defs>

                            {/* Horizontal Reference Grid Lines */}
                            {[20, 50, 80, 110, 135].map((y) => (
                              <line
                                key={y}
                                x1="0"
                                y1={y}
                                x2="340"
                                y2={y}
                                stroke="rgba(255,255,255,0.06)"
                                strokeDasharray="2 3"
                              />
                            ))}

                            {/* Vertical Crosshair Guide on Hover */}
                            {activeIdx !== null && (
                              <line
                                x1={getX(activeIdx)}
                                y1="18"
                                x2={getX(activeIdx)}
                                y2="135"
                                stroke="rgba(56, 189, 248, 0.4)"
                                strokeDasharray="3 3"
                                strokeWidth="1.5"
                              />
                            )}

                            {/* Minor Curve (Pink) */}
                            {visibleImpactSeries.minor && (
                              <path
                                d={minorPath}
                                fill="none"
                                stroke="#ec4899"
                                strokeWidth="2.5"
                                filter="url(#glowPink)"
                              />
                            )}

                            {/* Moderate Curve (Purple) */}
                            {visibleImpactSeries.moderate && (
                              <path
                                d={modPath}
                                fill="none"
                                stroke="#a855f7"
                                strokeWidth="2.5"
                                filter="url(#glowPurple)"
                              />
                            )}

                            {/* Severe Curve (Cyan) */}
                            {visibleImpactSeries.severe && (
                              <path
                                d={sevPath}
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="2.5"
                                filter="url(#glowCyan)"
                              />
                            )}

                            {/* Interactive Data Point Nodes */}
                            {visibleImpactSeries.minor &&
                              ts.minor.map((val, idx) => (
                                <circle
                                  key={`min-dot-${idx}`}
                                  cx={getX(idx)}
                                  cy={getY(val)}
                                  r={activeIdx === idx ? 5.5 : 3}
                                  fill="#ec4899"
                                  stroke={activeIdx === idx ? "#ffffff" : "#040714"}
                                  strokeWidth={activeIdx === idx ? 2 : 1}
                                  className="chart-data-circle"
                                  onMouseEnter={() => setHoveredImpactIndex(idx)}
                                  onMouseLeave={() => setHoveredImpactIndex(null)}
                                  onClick={() => setPinnedImpactIndex(pinnedImpactIndex === idx ? null : idx)}
                                />
                              ))}

                            {visibleImpactSeries.moderate &&
                              ts.moderate.map((val, idx) => (
                                <circle
                                  key={`mod-dot-${idx}`}
                                  cx={getX(idx)}
                                  cy={getY(val)}
                                  r={activeIdx === idx ? 5.5 : 3}
                                  fill="#a855f7"
                                  stroke={activeIdx === idx ? "#ffffff" : "#040714"}
                                  strokeWidth={activeIdx === idx ? 2 : 1}
                                  className="chart-data-circle"
                                  onMouseEnter={() => setHoveredImpactIndex(idx)}
                                  onMouseLeave={() => setHoveredImpactIndex(null)}
                                  onClick={() => setPinnedImpactIndex(pinnedImpactIndex === idx ? null : idx)}
                                />
                              ))}

                            {visibleImpactSeries.severe &&
                              ts.severe.map((val, idx) => (
                                <circle
                                  key={`sev-dot-${idx}`}
                                  cx={getX(idx)}
                                  cy={getY(val)}
                                  r={activeIdx === idx ? 5.5 : 3}
                                  fill="#38bdf8"
                                  stroke={activeIdx === idx ? "#ffffff" : "#040714"}
                                  strokeWidth={activeIdx === idx ? 2 : 1}
                                  className="chart-data-circle"
                                  onMouseEnter={() => setHoveredImpactIndex(idx)}
                                  onMouseLeave={() => setHoveredImpactIndex(null)}
                                  onClick={() => setPinnedImpactIndex(pinnedImpactIndex === idx ? null : idx)}
                                />
                              ))}
                          </svg>

                          {/* Dynamic X-Axis Labels */}
                          <div className="chart-x-axis">
                            {ts.labels.map((lbl, idx) => (
                              <span
                                key={lbl}
                                className={activeIdx === idx ? "active" : ""}
                                onMouseEnter={() => setHoveredImpactIndex(idx)}
                                onMouseLeave={() => setHoveredImpactIndex(null)}
                                onClick={() => setPinnedImpactIndex(pinnedImpactIndex === idx ? null : idx)}
                                title={`Click to inspect ${ts.fullDates ? ts.fullDates[idx] : lbl}`}
                              >
                                {lbl}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Pinned Incident Callout below Chart */}
                      {pinnedImpactIndex !== null && (
                        <div className="chart-pinned-box">
                          <div className="chart-pinned-content">
                            <span className="chart-pinned-title">
                              <MapPin size={12} className="text-cyan" />
                              {ts.fullDates ? ts.fullDates[pinnedImpactIndex] : `Interval ${ts.labels[pinnedImpactIndex]}`}{" "}
                              Diagnostics:
                            </span>
                            <span className="chart-pinned-note">
                              {ts.notes ? ts.notes[pinnedImpactIndex] : "Telemetry logs recorded within threshold."}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="btn-chart-dismiss"
                            onClick={() => setPinnedImpactIndex(null)}
                            title="Dismiss callout"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Col 3: Key Insights Dynamic Bullet Card */}
              <div className="insights-panel-box">
                <h3 className="panel-title">Key Insights</h3>

                <div className="key-insights-list">
                  <div className="insight-bullet-item">
                    <span className="insight-icon text-amber">
                      <Lightbulb size={18} />
                    </span>
                    <p>Pharmacy supply is most vulnerable in coastal regions.</p>
                  </div>

                  <div className="insight-bullet-item">
                    <span className="insight-icon text-cyan">
                      <Heart size={18} />
                    </span>
                    <p>Delivery delays increase by 32% during heavy rainfall.</p>
                  </div>

                  <div className="insight-bullet-item">
                    <span className="insight-icon text-green">
                      <ShieldCheck size={18} />
                    </span>
                    <p>Hospitals show high resilience with alternate routes.</p>
                  </div>
                </div>

                <button className="btn-view-detailed-report" onClick={() => setShowReportModal(true)}>
                  View Detailed Report <span>→</span>
                </button>
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
                <p className="view-lead">
                  Because infrastructure is not just about what you see, but what keeps it all connected.
                </p>
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
                  <div className="info-badge-icon">
                    <ShieldAlert size={22} className="text-pink" />
                  </div>
                  <div className="info-copy">
                    <h3>The Problem</h3>
                    <p>
                      Natural disasters, technical failures, and unexpected disruptions can break critical infrastructure
                      — creating a ripple effect across healthcare, supply chains, and communities.
                    </p>
                  </div>
                </div>

                <div className="about-info-block">
                  <div className="info-badge-icon solution">
                    <ShieldCheck size={22} className="text-cyan" />
                  </div>
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
                    <div
                      className="feature-capsule"
                      onClick={() => setCurrentPage("Explorer")}
                      style={{ cursor: "pointer" }}
                      title="Open Network Explorer"
                    >
                      <span className="f-icon text-cyan">
                        <Share2 size={18} />
                      </span>
                      <div>
                        <strong>Interactive Network Map</strong>
                        <small>Explore service connections</small>
                      </div>
                    </div>

                    <div
                      className="feature-capsule"
                      onClick={() => setCurrentPage("Simulator")}
                      style={{ cursor: "pointer" }}
                      title="Open Simulator"
                    >
                      <span className="f-icon text-purple">
                        <Sliders size={18} />
                      </span>
                      <div>
                        <strong>Scenario Simulation</strong>
                        <small>Test different disruption levels</small>
                      </div>
                    </div>

                    <div
                      className="feature-capsule"
                      onClick={() => setCurrentPage("Insights")}
                      style={{ cursor: "pointer" }}
                      title="Open Insights & Analytics"
                    >
                      <span className="f-icon text-pink">
                        <BarChart3 size={18} />
                      </span>
                      <div>
                        <strong>Impact Analysis</strong>
                        <small>Understand cascading effects</small>
                      </div>
                    </div>

                    <div
                      className="feature-capsule"
                      onClick={() => setShowRouteModal(true)}
                      style={{ cursor: "pointer" }}
                      title="View Alternative Routes"
                    >
                      <span className="f-icon text-green">
                        <Navigation size={18} />
                      </span>
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

        {/* ================= VIEW: VISION / CLOSING SCREEN (Screenshot 06) ================= */}
        {currentPage === "Vision" && (
          <main className="view-closing-stage">
            <div className="closing-presentation-canvas">
              {/* Left Column: Constellation Network Map */}
              <div className="closing-constellation-col">
                <IndiaMap mode="about" />
              </div>

              {/* Center Lockup: Brand, Infinity Logo, and Slogan */}
              <div className="closing-center-lockup">
                <div className="brand-infinity-icon" style={{ width: "72px", height: "40px" }}>
                  <svg viewBox="0 0 36 20" className="infinity-svg">
                    <path
                      d="M9,10 C3,3 0,7 0,10 C0,13 3,17 9,10 C15,3 21,17 27,10 C33,3 36,7 36,10 C36,13 33,17 27,10 C21,3 15,17 9,10 Z"
                      className="infinity-path"
                      style={{ strokeWidth: "3" }}
                    />
                  </svg>
                </div>
                <h1
                  style={{
                    margin: "8px 0 2px",
                    fontSize: "36px",
                    fontWeight: "800",
                    letterSpacing: "-0.5px",
                    color: "#ffffff"
                  }}
                >
                  Invisible Thread
                </h1>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "3px",
                    color: "#94a3b8",
                    fontWeight: "600"
                  }}
                >
                  INFRASTRUCTURE INTELLIGENCE
                </span>
                <p style={{ margin: "20px 0 0", fontSize: "20px", fontWeight: "600", color: "#ffffff" }}>
                  <span style={{ color: "#38bdf8" }}>Connected</span> today. Safer tomorrow.
                </p>
              </div>

              {/* Right Column: Illuminated Cyberpunk Cityscape */}
              <div className="closing-skyline-col">
                <svg viewBox="0 0 400 320" className="skyline-svg-art" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1e1035" stopOpacity="0.8" />
                      <stop offset="60%" stopColor="#0d1b3e" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#040714" />
                    </linearGradient>
                    <linearGradient id="towerGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0f172a" />
                      <stop offset="50%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0a0f1d" />
                    </linearGradient>
                    <linearGradient id="cyanRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#c084fc" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  <rect width="400" height="320" fill="url(#skyGrad)" rx="12" />

                  {/* Distant Towers */}
                  <rect x="30" y="110" width="34" height="180" fill="#13192f" />
                  <rect x="75" y="70" width="40" height="220" fill="#182344" />
                  <line x1="95" y1="40" x2="95" y2="70" stroke="#f43f5e" strokeWidth="2" />
                  <circle cx="95" cy="40" r="2.5" fill="#f43f5e" />

                  <rect x="130" y="130" width="28" height="160" fill="#12182c" />
                  <rect x="170" y="80" width="50" height="210" fill="#1b284e" />
                  <line x1="195" y1="48" x2="195" y2="80" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="195" cy="48" r="2.5" fill="#38bdf8" />

                  <rect x="235" y="100" width="45" height="190" fill="#172242" />
                  <rect x="295" y="125" width="36" height="165" fill="#131b33" />
                  <rect x="345" y="90" width="38" height="200" fill="#192548" />

                  {/* Window Grid Lights */}
                  {[90, 110, 130, 150, 170, 190, 210, 230].map((y) => (
                    <g key={y}>
                      <circle cx="85" cy={y} r="1.5" fill="#fde047" opacity="0.8" />
                      <circle cx="95" cy={y} r="1.5" fill="#38bdf8" opacity="0.9" />
                      <circle cx="105" cy={y} r="1.5" fill="#fde047" opacity="0.7" />

                      <circle cx="180" cy={y} r="1.5" fill="#38bdf8" opacity="0.9" />
                      <circle cx="195" cy={y} r="1.5" fill="#f472b6" opacity="0.8" />
                      <circle cx="210" cy={y} r="1.5" fill="#38bdf8" opacity="0.9" />

                      <circle cx="245" cy={y + 15} r="1.5" fill="#c084fc" opacity="0.8" />
                      <circle cx="260" cy={y + 15} r="1.5" fill="#fde047" opacity="0.7" />
                      <circle cx="355" cy={y} r="1.5" fill="#38bdf8" opacity="0.9" />
                      <circle cx="370" cy={y} r="1.5" fill="#fde047" opacity="0.8" />
                    </g>
                  ))}

                  {/* Bridge / Overpass structure */}
                  <path
                    d="M 10,240 Q 180,225 390,245 L 390,260 Q 180,240 10,260 Z"
                    fill="#0f172a"
                    stroke="rgba(56, 189, 248, 0.4)"
                    strokeWidth="1.5"
                  />

                  {/* Glowing Energy Ribbon Wave */}
                  <path
                    d="M 0,260 C 100,220 220,310 400,240"
                    fill="none"
                    stroke="url(#cyanRibbon)"
                    strokeWidth="3.5"
                    filter="drop-shadow(0 0 8px #38bdf8)"
                  />
                  <path
                    d="M 0,275 C 120,300 240,230 400,280"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    opacity="0.8"
                    filter="drop-shadow(0 0 8px #a855f7)"
                  />
                </svg>
              </div>

              {/* Bottom Glowing Sine Wave */}
              <div className="closing-bottom-waves">
                <svg viewBox="0 0 1200 100" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
                  <path
                    d="M 0,50 C 300,10 600,90 900,30 T 1200,60"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    opacity="0.65"
                  />
                  <path
                    d="M 0,70 C 250,90 550,20 850,80 T 1200,40"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    opacity="0.65"
                  />
                </svg>
              </div>
            </div>
          </main>
        )}

        {/* Global Footer (Matches Screenshot 06) */}
        <footer className="it-global-footer">
          <div
            className="footer-left-brand"
            onClick={() => setCurrentPage("Home")}
            style={{ cursor: "pointer" }}
          >
            <div className="brand-infinity-icon" style={{ width: "24px", height: "14px" }}>
              <svg viewBox="0 0 36 20" className="infinity-svg">
                <path
                  d="M9,10 C3,3 0,7 0,10 C0,13 3,17 9,10 C15,3 21,17 27,10 C33,3 36,7 36,10 C36,13 33,17 27,10 C21,3 15,17 9,10 Z"
                  className="infinity-path"
                />
              </svg>
            </div>
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
            <button onClick={() => setCurrentPage("Vision")}>Vision</button>
          </div>

          <div className="footer-right-copy">
            <div className="footer-social-icons">
              <span title="LinkedIn" style={{ cursor: "pointer" }}>
                in
              </span>
              <span title="GitHub" style={{ cursor: "pointer" }}>
                git
              </span>
              <span title="X / Twitter" style={{ cursor: "pointer" }}>
                𝕏
              </span>
              <span title="Discord" style={{ cursor: "pointer" }}>
                🌐
              </span>
            </div>
            <span className="copyright-text">© 2026 Invisible Thread. All rights reserved.</span>
          </div>
        </footer>
      </div>

      {/* ================= MODAL: ALTERNATIVE ROUTE ================= */}
      {showRouteModal && (
        <div className="it-modal-backdrop" onClick={() => setShowRouteModal(false)}>
          <div className="it-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="it-modal-header">
              <div className="modal-title-col">
                <span className="modal-kicker">INFRASTRUCTURE RESILIENCE ROUTING</span>
                <h2 className="modal-title">Alternative Response Corridor</h2>
              </div>
              <button className="btn-modal-close" onClick={() => setShowRouteModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="it-modal-body">
              {/* Graphic Comparison */}
              <div
                style={{
                  background: "rgba(12, 20, 48, 0.7)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  borderRadius: "12px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>PRIMARY DISRUPTION:</span>
                    <strong style={{ display: "block", color: "#f43f5e", fontSize: "15px" }}>
                      NH-44 Central Arterial Highway (Flooded / Blocked)
                    </strong>
                  </div>
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid #10b981",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      color: "#10b981",
                      fontWeight: "700",
                      fontSize: "13px"
                    }}
                  >
                    Est. Time Saved: {scenarioStats.timeSaving}
                  </div>
                </div>

                {/* SVG Route Visualization */}
                <div style={{ width: "100%", height: "130px", background: "#060a1e", borderRadius: "8px", padding: "10px" }}>
                  <svg viewBox="0 0 600 110" style={{ width: "100%", height: "100%" }}>
                    {/* Blocked route */}
                    <line x1="40" y1="55" x2="260" y2="55" stroke="#f43f5e" strokeWidth="3" strokeDasharray="5 5" />
                    <line x1="260" y1="55" x2="540" y2="55" stroke="#f43f5e" strokeWidth="3" strokeDasharray="5 5" />
                    <circle cx="260" cy="55" r="14" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="2" />
                    <text x="254" y="60" fill="#f43f5e" fontWeight="bold" fontSize="14">
                      ✕
                    </text>

                    {/* Safe Bypass Corridor */}
                    <path
                      d="M 40,55 C 100,10 200,15 260,15 C 320,15 450,15 540,55"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                    />

                    {/* Nodes */}
                    <circle cx="40" cy="55" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                    <text x="40" y="80" fill="#e2e8f0" fontSize="10" textAnchor="middle" fontWeight="bold">
                      DELHI HUB
                    </text>

                    <circle cx="540" cy="55" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text x="540" y="80" fill="#e2e8f0" fontSize="10" textAnchor="middle" fontWeight="bold">
                      TRAUMA CENTER
                    </text>
                  </svg>
                </div>
              </div>

              {/* Waypoints Breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div
                  style={{
                    background: "rgba(12, 20, 48, 0.5)",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>STANDARD ROUTE (BLOCKED)</span>
                  <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ color: "#f43f5e", fontWeight: "700" }}>Total Transit: ~82 min</span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Congestion Index: 94% Critical</span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Emergency triage: Impassable</span>
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.08)",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(16, 185, 129, 0.3)"
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#10b981" }}>OUTER RING BYPASS (ACTIVE)</span>
                  <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ color: "#10b981", fontWeight: "700" }}>Total Transit: ~41 min</span>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>Congestion Index: 16% Nominal</span>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>Emergency priority: Cleared</span>
                  </div>
                </div>
              </div>

              {/* Action notice */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12px",
                  color: "#94a3b8",
                  background: "rgba(56, 189, 248, 0.08)",
                  padding: "10px 14px",
                  borderRadius: "8px"
                }}
              >
                <CheckCircle2 size={16} className="text-cyan" />
                <span>
                  Telemetry broadcasts have signaled 14 regional ambulance fleets and 22 medicine delivery couriers.
                </span>
              </div>
            </div>

            <div className="it-modal-footer">
              <button
                className="btn-secondary-outline"
                onClick={() => setShowRouteModal(false)}
                style={{ padding: "8px 18px", fontSize: "12px" }}
              >
                Close Preview
              </button>
              <button
                className="btn-primary-glow"
                onClick={() => {
                  setShowRouteModal(false);
                  setCurrentPage("Explorer");
                }}
                style={{ padding: "8px 20px", fontSize: "12px" }}
              >
                Inspect on Map <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DETAILED REPORT ================= */}
      {showReportModal && (
        <div className="it-modal-backdrop" onClick={() => setShowReportModal(false)}>
          <div className="it-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="it-modal-header">
              <div className="modal-title-col">
                <span className="modal-kicker">INTELLIGENCE AUDIT</span>
                <h2 className="modal-title">Infrastructure Resilience Comprehensive Report</h2>
              </div>
              <button className="btn-modal-close" onClick={() => setShowReportModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="it-modal-body">
              {/* Executive Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                <div
                  style={{
                    background: "rgba(12, 20, 48, 0.6)",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(56, 189, 248, 0.2)"
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>NATIONAL RESILIENCE</span>
                  <strong style={{ display: "block", fontSize: "22px", color: "#38bdf8", marginTop: "4px" }}>
                    78%
                  </strong>
                  <span style={{ fontSize: "10px", color: "#10b981" }}>Stable · Buffer Absorptive</span>
                </div>

                <div
                  style={{
                    background: "rgba(12, 20, 48, 0.6)",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(244, 63, 94, 0.2)"
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>HIGH RISK CORRIDORS</span>
                  <strong style={{ display: "block", fontSize: "22px", color: "#f43f5e", marginTop: "4px" }}>
                    3 Regions
                  </strong>
                  <span style={{ fontSize: "10px", color: "#f43f5e" }}>Coastal, Siliguri, Deccan</span>
                </div>

                <div
                  style={{
                    background: "rgba(12, 20, 48, 0.6)",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(168, 85, 247, 0.2)"
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>CROSS-SECTOR UPTIME</span>
                  <strong style={{ display: "block", fontSize: "22px", color: "#a855f7", marginTop: "4px" }}>
                    92%
                  </strong>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>Average uptime across 4 sectors</span>
                </div>
              </div>

              {/* Sector Telemetry Table */}
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    fontWeight: "700",
                    letterSpacing: "1px",
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  SECTOR INTEGRITY BREAKDOWN:
                </span>
                <div
                  style={{
                    marginTop: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    overflow: "hidden"
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ background: "rgba(12, 20, 48, 0.9)", color: "#94a3b8", textAlign: "left" }}>
                        <th style={{ padding: "10px 14px" }}>Sector</th>
                        <th style={{ padding: "10px 14px" }}>Operational Health</th>
                        <th style={{ padding: "10px 14px" }}>Buffer Capacity</th>
                        <th style={{ padding: "10px 14px" }}>Primary Risk Exposure</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "10px 14px", color: "#ffffff", fontWeight: "600" }}>🛣️ Road Network</td>
                        <td style={{ padding: "10px 14px", color: "#38bdf8" }}>88% Optimal</td>
                        <td style={{ padding: "10px 14px" }}>18 hrs alternate routing</td>
                        <td style={{ padding: "10px 14px", color: "#94a3b8" }}>Heavy monsoon waterlogging</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "10px 14px", color: "#ffffff", fontWeight: "600" }}>🏥 Hospitals</td>
                        <td style={{ padding: "10px 14px", color: "#3b82f6" }}>91% High</td>
                        <td style={{ padding: "10px 14px" }}>24 hrs emergency triage</td>
                        <td style={{ padding: "10px 14px", color: "#94a3b8" }}>Medical oxygen replenishment</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "10px 14px", color: "#ffffff", fontWeight: "600" }}>💊 Pharmacies</td>
                        <td style={{ padding: "10px 14px", color: "#ec4899" }}>87% Protected</td>
                        <td style={{ padding: "10px 14px" }}>12 hrs cold-chain buffer</td>
                        <td style={{ padding: "10px 14px", color: "#94a3b8" }}>Coastal delivery stockouts</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "10px 14px", color: "#ffffff", fontWeight: "600" }}>🚚 Delivery Logistics</td>
                        <td style={{ padding: "10px 14px", color: "#10b981" }}>83% Active</td>
                        <td style={{ padding: "10px 14px" }}>8 hrs warehouse buffer</td>
                        <td style={{ padding: "10px 14px", color: "#94a3b8" }}>Last-mile delivery delays</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actionable recommendations */}
              <div
                style={{
                  background: "rgba(168, 85, 247, 0.08)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "10px",
                  padding: "14px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start"
                }}
              >
                <Lightbulb size={20} className="text-purple" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div style={{ fontSize: "12px", lineHeight: "1.6" }}>
                  <strong style={{ color: "#ffffff" }}>Strategic Resilience Directive:</strong> Pre-position secondary
                  trauma kits in Siliguri and coastal depots ahead of anticipated storm surges. Activating automated route
                  handoff reduces average hospital triage latency by 41 minutes.
                </div>
              </div>
            </div>

            <div className="it-modal-footer">
              <button
                className="btn-secondary-outline"
                onClick={() => setShowReportModal(false)}
                style={{ padding: "8px 18px", fontSize: "12px" }}
              >
                Close Report
              </button>
              <button
                className="btn-primary-glow"
                onClick={() => {
                  setShowReportModal(false);
                  setCurrentPage("Simulator");
                }}
                style={{ padding: "8px 20px", fontSize: "12px" }}
              >
                Run Scenario Simulator <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
