// Dynamic Infrastructure Intelligence & Insights engine
// Reacts in real-time to Timeframe, Scenario, Sector, and Region filter changes

export const TIMEFRAME_OPTIONS = [
  { id: "24h", label: "Last 24 Hours" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "90d", label: "Last 90 Days" },
  { id: "annual", label: "Annual (2026)" }
];

export const SCENARIO_FILTER_OPTIONS = [
  { id: "all", label: "All Scenarios" },
  { id: "minor", label: "Minor Disruption" },
  { id: "moderate", label: "Moderate Strain" },
  { id: "severe", label: "Severe Outage" }
];

export const SECTOR_FILTER_OPTIONS = [
  { id: "all", label: "All Sectors", icon: "🌐" },
  { id: "roads", label: "Roads & Transit", icon: "🛣️" },
  { id: "hospitals", label: "Hospitals & Triage", icon: "🏥" },
  { id: "pharmacies", label: "Pharmacies & APIs", icon: "💊" },
  { id: "delivery", label: "Last-Mile Delivery", icon: "📦" }
];

export const REGION_FILTER_OPTIONS = [
  "All India",
  "North India",
  "Western Coast",
  "Eastern Region",
  "Southern Region"
];

export function getDynamicInsightsData({
  timeframe = "30d",
  scenario = "all",
  sector = "all",
  region = "All India"
}) {
  // Base multipliers based on timeframe
  const tfMultipliers = {
    "24h": { health: 71, criticalCount: 6, perf: 84, risk: "High", delay: "+58 min" },
    "7d": { health: 75, criticalCount: 4, perf: 89, risk: "Medium", delay: "+42 min" },
    "30d": { health: 78, criticalCount: 3, perf: 92, risk: "Medium", delay: "+35 min" },
    "90d": { health: 83, criticalCount: 2, perf: 94, risk: "Low", delay: "+24 min" },
    "annual": { health: 86, criticalCount: 2, perf: 95, risk: "Low", delay: "+18 min" }
  };

  // Scenario impact modifier
  const scenModifiers = {
    all: { healthDelta: 0, critDelta: 0, perfDelta: 0, riskOverride: null },
    minor: { healthDelta: +10, critDelta: -2, perfDelta: +6, riskOverride: "Low" },
    moderate: { healthDelta: -4, critDelta: +2, perfDelta: -4, riskOverride: "Medium" },
    severe: { healthDelta: -24, critDelta: +6, perfDelta: -22, riskOverride: "Critical" }
  };

  // Sector impact modifier
  const sectorModifiers = {
    all: { roads: 88, hospitals: 91, pharma: 87, delivery: 83 },
    roads: { roads: 74, hospitals: 89, pharma: 84, delivery: 68 },
    hospitals: { roads: 86, hospitals: 72, pharma: 80, delivery: 85 },
    pharmacies: { roads: 89, hospitals: 82, pharma: 69, delivery: 82 },
    delivery: { roads: 79, hospitals: 90, pharma: 86, delivery: 65 }
  };

  const tf = tfMultipliers[timeframe] || tfMultipliers["30d"];
  const sc = scenModifiers[scenario] || scenModifiers["all"];
  const sm = sectorModifiers[sector] || sectorModifiers["all"];

  // Compute final headline metrics
  const healthPct = Math.min(98, Math.max(38, tf.health + sc.healthDelta));
  const criticalCount = Math.max(1, tf.criticalCount + sc.critDelta);
  const performancePct = Math.min(99, Math.max(45, tf.perf + sc.perfDelta));
  const riskLevel = sc.riskOverride || tf.risk;

  // Compute sector bars
  const sectors = [
    {
      label: "Roads",
      pct: Math.min(100, Math.max(30, sm.roads + sc.perfDelta)),
      color: "#38bdf8",
      icon: "🛣️",
      incidents: timeframe === "24h" ? 18 : timeframe === "7d" ? 64 : 142
    },
    {
      label: "Hospitals",
      pct: Math.min(100, Math.max(30, sm.hospitals + sc.perfDelta)),
      color: "#a855f7",
      icon: "🏥",
      incidents: timeframe === "24h" ? 8 : timeframe === "7d" ? 28 : 76
    },
    {
      label: "Pharmacies",
      pct: Math.min(100, Math.max(30, sm.pharma + sc.perfDelta)),
      color: "#ec4899",
      icon: "💊",
      incidents: timeframe === "24h" ? 12 : timeframe === "7d" ? 42 : 98
    },
    {
      label: "Delivery",
      pct: Math.min(100, Math.max(30, sm.delivery + sc.perfDelta)),
      color: "#10b981",
      icon: "📦",
      incidents: timeframe === "24h" ? 24 : timeframe === "7d" ? 88 : 210
    }
  ];

  // Dynamic Chart Points & Curves based on timeframe
  const xLabels =
    timeframe === "24h"
      ? ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"]
      : timeframe === "7d"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : timeframe === "30d"
      ? ["Day 1", "Day 6", "Day 11", "Day 16", "Day 21", "Day 26", "Day 30"]
      : timeframe === "90d"
      ? ["W1", "W3", "W5", "W7", "W9", "W11", "W13"]
      : ["Q1", "Q2", "Q3", "Q4", "Q1 '27", "Q2 '27", "Q3 '27"];

  // Generate dynamic SVG path strings according to scenario & sector
  const getChartPaths = () => {
    if (scenario === "severe") {
      return {
        severe: "M 30 130 Q 80 30, 140 25 T 250 20 T 350 15",
        moderate: "M 30 135 Q 90 70, 150 60 T 260 50 T 350 45",
        minor: "M 30 140 Q 90 100, 150 90 T 260 85 T 350 80"
      };
    } else if (scenario === "minor") {
      return {
        severe: "M 30 130 Q 80 120, 140 125 T 250 115 T 350 110",
        moderate: "M 30 135 Q 90 130, 150 128 T 260 120 T 350 118",
        minor: "M 30 142 Q 90 138, 150 135 T 260 130 T 350 128"
      };
    } else {
      return {
        severe: "M 30 110 Q 80 50, 140 70 T 250 40 T 350 35",
        moderate: "M 30 125 Q 90 85, 150 95 T 260 70 T 350 65",
        minor: "M 30 140 Q 90 120, 150 130 T 260 115 T 350 110"
      };
    }
  };

  // Generate dynamic contextual insights
  const keyInsights = [];

  if (sector === "pharmacies" || sector === "all") {
    keyInsights.push({
      icon: "💊",
      title: "Active API Supply Buffer",
      desc:
        timeframe === "24h"
          ? "Immediate 18-hour buffer holds in 28 states; Delhi and Assam pharmacies report critical antibiotic backorders."
          : "Coastal states show a 4.2-day prescription cushion; inland arterial blockades deplete local stocks 2.4x faster."
    });
  }

  if (sector === "roads" || sector === "delivery" || sector === "all") {
    keyInsights.push({
      icon: "🚚",
      title: "Transit & Delivery Latency",
      desc:
        scenario === "severe"
          ? "Arterial collapse on NH48 and NH44 increases cross-state transit times by +68 minutes, cascading into regional stockouts."
          : `During ${timeframe} tracking, alternate secondary routes absorbed 78% of highway congestion with minimal last-mile delay.`
    });
  }

  if (sector === "hospitals" || sector === "all") {
    keyInsights.push({
      icon: "🏥",
      title: "Acute Care & Triage Resilience",
      desc:
        region !== "All India"
          ? `In ${region}, tertiary hospital referral load stabilizes at ${healthPct}% capacity under current contingency protocol.`
          : "Tertiary medical centers in Delhi, Mumbai, and Hyderabad maintain emergency operational resilience via priority oxygen pipelines."
    });
  }

  if (region !== "All India") {
    keyInsights.push({
      icon: "📍",
      title: `${region} Regional Analysis`,
      desc: `Monitored cross-border corridors in ${region} reflect an infrastructure dependency score of ${100 - healthPct}/100.`
    });
  }

  // Active Incident Watchlist entries
  const incidentLogs = [
    {
      id: "INC-801",
      location: region === "All India" ? "NH44 Delhi-Agra Arterial" : `${region} Primary Freight Corridor`,
      sector: "Roads",
      severity: scenario === "severe" ? "Critical" : "Moderate",
      impact: "Delayed liquid medical oxygen transport; alternate bypass active",
      time: "24m ago"
    },
    {
      id: "INC-802",
      location: region === "All India" ? "Saraighat Brahmaputra Gateway (Assam)" : `${region} Secondary Transit`,
      sector: "Delivery",
      severity: "High",
      impact: "Freight bottleneck delaying vaccine cold chain into 4 NE states",
      time: "1h 12m ago"
    },
    {
      id: "INC-803",
      location: "JNPT Container Terminal (Maharashtra)",
      sector: "Pharmacies",
      severity: "Moderate",
      impact: "Bulk API customs clearance backlog; supply buffer holding",
      time: "3h ago"
    }
  ];

  return {
    healthPct,
    criticalCount,
    performancePct,
    riskLevel,
    sectors,
    xLabels,
    chartPaths: getChartPaths(),
    keyInsights,
    incidentLogs
  };
}
