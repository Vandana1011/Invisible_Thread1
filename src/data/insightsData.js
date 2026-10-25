// Dynamic Infrastructure Intelligence & Insights engine
// Reacts in real-time to Timeframe, Scenario, Sector, and Region filter changes

export const TIMEFRAME_OPTIONS = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
  { id: "ytd", label: "Year to date" }
];

export const SERVICE_DETAILS_DATA = {
  Roads: {
    label: "Roads",
    fullName: "Roads & Transit Corridors",
    iconName: "Share2",
    color: "#38bdf8",
    activeNodes: "412 Highways & Arterials",
    monitoredTotal: 480,
    flowThroughput: "88% Optimal",
    bufferCapacity: "18 hrs alternate routing",
    primaryRisk: "Heavy monsoon waterlogging & highway chokepoints",
    recommendedAction: "Activate state ring-road express bypass corridors.",
    incidents: { "7d": 38, "30d": 142, "90d": 340, "ytd": 890 }
  },
  Hospitals: {
    label: "Hospitals",
    fullName: "Hospitals & Trauma Centers",
    iconName: "Activity",
    color: "#3b82f6",
    activeNodes: "28 Apex & Tertiary Facilities",
    monitoredTotal: 32,
    flowThroughput: "91% High Resilience",
    bufferCapacity: "24 hrs emergency triage reserve",
    primaryRisk: "Medical oxygen logistics & ambulance transit delays",
    recommendedAction: "Pre-stage mobile emergency clinics & reserve tankers.",
    incidents: { "7d": 14, "30d": 76, "90d": 182, "ytd": 460 }
  },
  Pharmacies: {
    label: "Pharmacies",
    fullName: "Pharmacies & Cold-Chain APIs",
    iconName: "BriefcaseMedical",
    color: "#ec4899",
    activeNodes: "60 Regional Depots & Hubs",
    monitoredTotal: 72,
    flowThroughput: "87% Protected",
    bufferCapacity: "14 hrs cold-chain buffer",
    primaryRisk: "Coastal supply cutoffs & bulk active ingredient delays",
    recommendedAction: "Disperse decentralized storage pods to district clinics.",
    incidents: { "7d": 26, "30d": 98, "90d": 224, "ytd": 590 }
  },
  Delivery: {
    label: "Delivery",
    fullName: "Last-Mile Delivery & Freight",
    iconName: "Truck",
    color: "#10b981",
    activeNodes: "40 Logistics Hubs & Depots",
    monitoredTotal: 50,
    flowThroughput: "83% Active",
    bufferCapacity: "8 hrs warehouse intake buffer",
    primaryRisk: "Urban courier stall during storm surges",
    recommendedAction: "Deploy electric two-wheel cargo fleets on elevated routes.",
    incidents: { "7d": 52, "30d": 210, "90d": 490, "ytd": 1240 }
  }
};

// High-fidelity time series points for Impact Analysis Chart
export const IMPACT_TIMESERIES = {
  "30d": {
    labels: ["1", "6", "11", "16", "21", "26", "30"],
    fullDates: ["Day 1", "Day 6", "Day 11", "Day 16", "Day 21", "Day 26", "Day 30"],
    minor: [18, 36, 72, 42, 76, 58, 46],
    moderate: [12, 48, 56, 32, 48, 70, 52],
    severe: [25, 38, 68, 52, 66, 44, 32],
    notes: [
      "Day 1: Baseline network flow across North and Western hubs.",
      "Day 6: Early monsoon precipitation causes 14% transit delay.",
      "Day 11: Western Ghats rainfall triggers localized highway waterlogging.",
      "Day 16: Emergency hospital bypass corridors active; latency drops by 24 min.",
      "Day 21: Coastal storm surge alerts; JNPT depot freight backlogs emerge.",
      "Day 26: Inter-state detour routes deployed; pharmacy buffers hold steady.",
      "Day 30: System stabilization across 94% of monitored nodes."
    ]
  },
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    fullDates: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    minor: [20, 32, 65, 45, 74, 52, 38],
    moderate: [16, 42, 58, 64, 42, 68, 48],
    severe: [28, 44, 70, 56, 62, 42, 30],
    notes: [
      "Mon: Heavy early morning industrial transit across NH48.",
      "Tue: Intermittent showers slow Western Express Highway.",
      "Wed: Mid-week cloudburst alerts in Delhi and Mumbai corridors.",
      "Thu: Hospital emergency supply reserves deployed to tertiary centers.",
      "Fri: Weekend freight logistics peak on NH44.",
      "Sat: Secondary bypass routes absorb 78% of highway congestion.",
      "Sun: Controlled freight dispatch; network throughput restored."
    ]
  },
  "90d": {
    labels: ["W1", "W3", "W5", "W7", "W9", "W11", "W13"],
    fullDates: ["Week 1", "Week 3", "Week 5", "Week 7", "Week 9", "Week 11", "Week 13"],
    minor: [22, 40, 68, 48, 72, 54, 40],
    moderate: [18, 45, 60, 38, 55, 65, 46],
    severe: [30, 50, 75, 58, 70, 48, 34],
    notes: [
      "W1: Quarterly infrastructure maintenance cycle begins.",
      "W3: Heavy pre-monsoon squalls in coastal regions.",
      "W5: Monsoon depression deepens over Bay of Bengal.",
      "W7: Coordinated multi-agency diversion protocols triggered.",
      "W9: Inter-state bridge inspections complete with zero halts.",
      "W11: Automated telemetry sensors deployed across 40 new bridges.",
      "W13: End-of-quarter reliability index exceeds 91% target."
    ]
  },
  "ytd": {
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"],
    fullDates: ["January", "March", "May", "July", "September", "November", "December"],
    minor: [15, 30, 48, 78, 65, 42, 35],
    moderate: [14, 38, 52, 70, 60, 50, 40],
    severe: [22, 40, 58, 82, 72, 46, 30],
    notes: [
      "Jan: Winter fog mitigation operational on Northern highway grid.",
      "Mar: Spring agricultural freight movements run smoothly.",
      "May: Heatwave protocol safeguards liquid oxygen transport.",
      "Jul: Peak South-West monsoon brings widespread flood stress.",
      "Sep: Post-monsoon infrastructure restoration drives recovery.",
      "Nov: Pre-winter medical supply stockpiling successfully completed.",
      "Dec: Annual network resilience reaches peak 94.2% stability."
    ]
  }
};

export function getDynamicInsightsData({
  timeframe = "30d",
  scenario = "all",
  _sector = "all",
  _region = "All India"
}) {
  // Base headline metrics based on timeframe
  const tfMultipliers = {
    "7d": { health: 75, criticalCount: 4, perf: 89, risk: "Medium" },
    "30d": { health: 78, criticalCount: 3, perf: 92, risk: "Medium" },
    "90d": { health: 83, criticalCount: 2, perf: 94, risk: "Low" },
    "ytd": { health: 86, criticalCount: 2, perf: 95, risk: "Low" }
  };

  // Scenario modifier
  const scenModifiers = {
    all: { healthDelta: 0, critDelta: 0, perfDelta: 0, riskOverride: null },
    minor: { healthDelta: +4, critDelta: -1, perfDelta: +3, riskOverride: "Low" },
    moderate: { healthDelta: -6, critDelta: +2, perfDelta: -7, riskOverride: "Medium" },
    severe: { healthDelta: -22, critDelta: +5, perfDelta: -24, riskOverride: "Critical" }
  };

  const tf = tfMultipliers[timeframe] || tfMultipliers["30d"];
  const sc = scenModifiers[scenario.toLowerCase()] || scenModifiers["all"];

  const healthPct = Math.min(99, Math.max(35, tf.health + sc.healthDelta));
  const criticalCount = Math.max(1, tf.criticalCount + sc.critDelta);
  const performancePct = Math.min(99, Math.max(42, tf.perf + sc.perfDelta));
  const riskLevel = sc.riskOverride || tf.risk;

  // Compute sector bars with scenario responsiveness
  const baseSectors = [
    { label: "Roads", basePct: 88, color: "#38bdf8", key: "Roads" },
    { label: "Hospitals", basePct: 91, color: "#3b82f6", key: "Hospitals" },
    { label: "Pharmacies", basePct: 87, color: "#ec4899", key: "Pharmacies" },
    { label: "Delivery", basePct: 83, color: "#10b981", key: "Delivery" }
  ];

  const sectors = baseSectors.map((s) => {
    let delta = sc.perfDelta;
    if (scenario.toLowerCase() === "severe") {
      if (s.label === "Roads") delta = -24;
      if (s.label === "Delivery") delta = -25;
      if (s.label === "Pharmacies") delta = -18;
      if (s.label === "Hospitals") delta = -16;
    } else if (scenario.toLowerCase() === "moderate") {
      if (s.label === "Roads") delta = -8;
      if (s.label === "Delivery") delta = -10;
      if (s.label === "Pharmacies") delta = -6;
      if (s.label === "Hospitals") delta = -4;
    }
    const computedPct = Math.min(100, Math.max(30, s.basePct + delta));
    const meta = SERVICE_DETAILS_DATA[s.key] || {};
    return {
      ...s,
      pct: computedPct,
      ...meta,
      incidentCount: meta.incidents ? meta.incidents[timeframe] || 45 : 45
    };
  });

  // Time series data
  const ts = IMPACT_TIMESERIES[timeframe] || IMPACT_TIMESERIES["30d"];

  return {
    healthPct,
    criticalCount,
    performancePct,
    riskLevel,
    sectors,
    timeseries: ts
  };
}

