// Metric definition metadata
export const OVERLAY_METRICS = [
  { id: "overallRisk", label: "Overall Dependency", shortLabel: "Overall", desc: "Composite cross-sector infrastructure dependency score", unit: "/100" },
  { id: "hospitalStrain", label: "Hospital & Triage", shortLabel: "Healthcare", desc: "Emergency bed capacity & acute referral overload vulnerability", unit: "/100" },
  { id: "logisticsChoke", label: "Freight & Highways", shortLabel: "Logistics", desc: "Arterial highway congestion & freight transit chokepoint index", unit: "/100" },
  { id: "pharmaStockout", label: "Pharma Buffer", shortLabel: "Pharma", desc: "Prescription stockout risk & replenishment delay index", unit: "/100" },
  { id: "powerGridStress", label: "Power Grid", shortLabel: "Power", desc: "Electrical transmission stress & substation vulnerability", unit: "/100" }
];

// Comprehensive Infrastructure Dependency Status data for all 36 Indian States and Union Territories
export const STATE_DEPENDENCY_DATA = {
  INDL: {
    id: "INDL",
    name: "Delhi",
    region: "North India",
    dependencyScore: 88,
    status: "Critical",
    metrics: {
      overallRisk: 88,
      hospitalStrain: 92,
      logisticsChoke: 84,
      pharmaStockout: 78,
      powerGridStress: 85
    },
    primaryVulnerability: "High-density acute healthcare intake & arterial NH44 transit choke",
    cascadesTo: ["INHR", "INUP", "INRJ", "INPB"],
    criticalFacilities: { hospitals: 142, logisticsHubs: 38, pharmaDepots: 64 },
    bufferHours: 18,
    centroid: [344, 321],
    keyInsight: "Consumes 80% of regional emergency care capacity; 12-hour arterial delay triggers triage backlog across 3 neighboring states."
  },
  INMH: {
    id: "INMH",
    name: "Maharashtra",
    region: "Western Region",
    dependencyScore: 84,
    status: "Critical",
    metrics: {
      overallRisk: 84,
      hospitalStrain: 81,
      logisticsChoke: 95,
      pharmaStockout: 72,
      powerGridStress: 80
    },
    primaryVulnerability: "JNPT maritime container gateway, NH48 freight corridor & monsoon flood exposure",
    cascadesTo: ["INGJ", "INKA", "INTG", "INMP", "INGA"],
    criticalFacilities: { hospitals: 210, logisticsHubs: 88, pharmaDepots: 115 },
    bufferHours: 24,
    centroid: [285, 595],
    keyInsight: "Critical national pharmaceutical distribution spine; a disruption in Mumbai port logistics slows supply to 6 adjoining states within 36 hours."
  },
  INTG: {
    id: "INTG",
    name: "Telangana",
    region: "Southern Region",
    dependencyScore: 71,
    status: "Elevated Risk",
    metrics: {
      overallRisk: 71,
      hospitalStrain: 68,
      logisticsChoke: 74,
      pharmaStockout: 86,
      powerGridStress: 62
    },
    primaryVulnerability: "Genome Valley bulk active pharma (API) production & central freight crossroads",
    cascadesTo: ["INAP", "INKA", "INMH", "INCT"],
    criticalFacilities: { hospitals: 98, logisticsHubs: 42, pharmaDepots: 92 },
    bufferHours: 32,
    centroid: [405, 645],
    keyInsight: "Produces 33% of India's vaccines; local power or road blockages delay cold-chain shipments nationally."
  },
  INKA: {
    id: "INKA",
    name: "Karnataka",
    region: "Southern Region",
    dependencyScore: 66,
    status: "Elevated Risk",
    metrics: {
      overallRisk: 66,
      hospitalStrain: 62,
      logisticsChoke: 70,
      pharmaStockout: 65,
      powerGridStress: 68
    },
    primaryVulnerability: "Tech logistics orchestration, Bengaluru electronic freight & Western Ghats road slips",
    cascadesTo: ["INTN", "INKL", "INTG", "INAP", "INMH", "INGA"],
    criticalFacilities: { hospitals: 124, logisticsHubs: 56, pharmaDepots: 76 },
    bufferHours: 36,
    centroid: [330, 740],
    keyInsight: "Core southern logistics dispatch brain; route failure diverts freight across congested coastal passes."
  },
  INTN: {
    id: "INTN",
    name: "Tamil Nadu",
    region: "Southern Region",
    dependencyScore: 73,
    status: "Elevated Risk",
    metrics: {
      overallRisk: 73,
      hospitalStrain: 74,
      logisticsChoke: 78,
      pharmaStockout: 69,
      powerGridStress: 71
    },
    primaryVulnerability: "Coastal cyclone vulnerability, Chennai port logistics & specialized medical tourism load",
    cascadesTo: ["INKA", "INKL", "INAP"],
    criticalFacilities: { hospitals: 168, logisticsHubs: 64, pharmaDepots: 84 },
    bufferHours: 28,
    centroid: [400, 830],
    keyInsight: "Highest concentration of specialized healthcare facilities in the South; coastal storm surges cause immediate cross-border patient diversion."
  },
  INWB: {
    id: "INWB",
    name: "West Bengal",
    region: "Eastern Region",
    dependencyScore: 82,
    status: "Critical",
    metrics: {
      overallRisk: 82,
      hospitalStrain: 85,
      logisticsChoke: 89,
      pharmaStockout: 79,
      powerGridStress: 76
    },
    primaryVulnerability: "Siliguri Corridor ('Chicken's Neck') bottleneck & Sundarbans tidal inundation",
    cascadesTo: ["INAS", "INBR", "INJH", "INOR", "INSK"],
    criticalFacilities: { hospitals: 154, logisticsHubs: 48, pharmaDepots: 72 },
    bufferHours: 20,
    centroid: [630, 520],
    keyInsight: "Sole terrestrial pipeline connecting 8 North-Eastern states to mainland supply chains."
  },
  INGJ: {
    id: "INGJ",
    name: "Gujarat",
    region: "Western Region",
    dependencyScore: 68,
    status: "Elevated Risk",
    metrics: {
      overallRisk: 68,
      hospitalStrain: 58,
      logisticsChoke: 82,
      pharmaStockout: 70,
      powerGridStress: 64
    },
    primaryVulnerability: "Mundra & Kandla petrochemical pipelines, chemical pharma synthesis corridor",
    cascadesTo: ["INMH", "INRJ", "INMP"],
    criticalFacilities: { hospitals: 118, logisticsHubs: 72, pharmaDepots: 88 },
    bufferHours: 40,
    centroid: [205, 510],
    keyInsight: "Supplies raw chemical precursors for national medicine manufacture; strong highway infrastructure provides alternative inland rerouting."
  },
  INUP: {
    id: "INUP",
    name: "Uttar Pradesh",
    region: "North India",
    dependencyScore: 79,
    status: "Critical",
    metrics: {
      overallRisk: 79,
      hospitalStrain: 88,
      logisticsChoke: 76,
      pharmaStockout: 83,
      powerGridStress: 72
    },
    primaryVulnerability: "Massive population footprint, acute secondary referral triage load across Gangetic plain",
    cascadesTo: ["INDL", "INBR", "INMP", "INHR", "INUT", "INJH"],
    criticalFacilities: { hospitals: 280, logisticsHubs: 65, pharmaDepots: 140 },
    bufferHours: 22,
    centroid: [460, 390],
    keyInsight: "Dense secondary referral dependencies mean rural hospital distress rapidly propagates upward to Lucknow and Delhi hubs."
  },
  INRJ: {
    id: "INRJ",
    name: "Rajasthan",
    region: "North West",
    dependencyScore: 54,
    status: "Moderate",
    metrics: {
      overallRisk: 54,
      hospitalStrain: 50,
      logisticsChoke: 62,
      pharmaStockout: 56,
      powerGridStress: 60
    },
    primaryVulnerability: "Vast geographical distances, extreme heat strain on cold chains & desert highway transit",
    cascadesTo: ["INGJ", "INMP", "INUP", "INHR", "INPB"],
    criticalFacilities: { hospitals: 94, logisticsHubs: 36, pharmaDepots: 52 },
    bufferHours: 48,
    centroid: [270, 380],
    keyInsight: "Expansive solar generation provides local resilience; long travel times make remote clinics vulnerable to single road blockades."
  },
  INMP: {
    id: "INMP",
    name: "Madhya Pradesh",
    region: "Central India",
    dependencyScore: 61,
    status: "Moderate",
    metrics: {
      overallRisk: 61,
      hospitalStrain: 64,
      logisticsChoke: 68,
      pharmaStockout: 60,
      powerGridStress: 52
    },
    primaryVulnerability: "Heartland transit crossroads; high through-traffic vulnerability with fewer parallel alternate expressways",
    cascadesTo: ["INUP", "INRJ", "INGJ", "INMH", "INCT"],
    criticalFacilities: { hospitals: 110, logisticsHubs: 44, pharmaDepots: 62 },
    bufferHours: 42,
    centroid: [390, 490],
    keyInsight: "National freight crossover junction connecting North and South India freight arteries."
  },
  INBR: {
    id: "INBR",
    name: "Bihar",
    region: "Eastern Region",
    dependencyScore: 81,
    status: "Critical",
    metrics: {
      overallRisk: 81,
      hospitalStrain: 89,
      logisticsChoke: 77,
      pharmaStockout: 85,
      powerGridStress: 74
    },
    primaryVulnerability: "Annual Kosi/Ganga flood displacement, high patient-to-bed ratio & rural supply fragmentation",
    cascadesTo: ["INUP", "INWB", "INJH"],
    criticalFacilities: { hospitals: 82, logisticsHubs: 24, pharmaDepots: 45 },
    bufferHours: 16,
    centroid: [570, 395],
    keyInsight: "Low inventory buffer in rural health sub-centers means stockouts occur within 48 hours of transit severance."
  },
  INAP: {
    id: "INAP",
    name: "Andhra Pradesh",
    region: "Southern Region",
    dependencyScore: 72,
    status: "Elevated Risk",
    metrics: {
      overallRisk: 72,
      hospitalStrain: 70,
      logisticsChoke: 76,
      pharmaStockout: 73,
      powerGridStress: 68
    },
    primaryVulnerability: "Long coastline cyclone exposure, Vizag port industrial logistics & Krishna-Godavari delta bridges",
    cascadesTo: ["INTG", "INTN", "INKA", "INOR", "INCT"],
    criticalFacilities: { hospitals: 112, logisticsHubs: 46, pharmaDepots: 68 },
    bufferHours: 30,
    centroid: [430, 720],
    keyInsight: "Crucial maritime container and bulk raw material feeder line into the Deccan plateau."
  },
  INKL: {
    id: "INKL",
    name: "Kerala",
    region: "Southern Region",
    dependencyScore: 64,
    status: "Moderate",
    metrics: {
      overallRisk: 64,
      hospitalStrain: 55,
      logisticsChoke: 75,
      pharmaStockout: 62,
      powerGridStress: 64
    },
    primaryVulnerability: "Linear coastal topology, heavy monsoon landslide chokepoints along Western Ghat passes",
    cascadesTo: ["INTN", "INKA"],
    criticalFacilities: { hospitals: 135, logisticsHubs: 32, pharmaDepots: 58 },
    bufferHours: 34,
    centroid: [315, 855],
    keyInsight: "World-class primary public healthcare network cushions local triage, but depends on Palakkad Gap for 70% of food and pharma transit."
  },
  INOR: {
    id: "INOR",
    name: "Odisha",
    region: "Eastern Coast",
    dependencyScore: 74,
    status: "Elevated Risk",
    metrics: {
      overallRisk: 74,
      hospitalStrain: 72,
      logisticsChoke: 79,
      pharmaStockout: 76,
      powerGridStress: 70
    },
    primaryVulnerability: "Bay of Bengal tropical cyclone landfall frequency & coastal grid infrastructure vulnerability",
    cascadesTo: ["INWB", "INJH", "INCT", "INAP"],
    criticalFacilities: { hospitals: 88, logisticsHubs: 34, pharmaDepots: 46 },
    bufferHours: 26,
    centroid: [550, 560],
    keyInsight: "National model in disaster evacuation; however, electrical transmission repairs post-cyclone take 7-10 days in coastal pockets."
  },
  INAS: {
    id: "INAS",
    name: "Assam",
    region: "North East",
    dependencyScore: 86,
    status: "Critical",
    metrics: {
      overallRisk: 86,
      hospitalStrain: 84,
      logisticsChoke: 92,
      pharmaStockout: 88,
      powerGridStress: 80
    },
    primaryVulnerability: "Brahmaputra annual flooding, reliance on Saraighat bridge & gateway to all 7 NE states",
    cascadesTo: ["INWB", "INAR", "INMN", "INML", "INMZ", "INNL", "INTR"],
    criticalFacilities: { hospitals: 62, logisticsHubs: 22, pharmaDepots: 36 },
    bufferHours: 14,
    centroid: [750, 410],
    keyInsight: "Gateway to the entire North East. Any disruption in Guwahati creates cascading emergency stockouts across 6 neighboring states."
  },
  INPB: {
    id: "INPB",
    name: "Punjab",
    region: "North India",
    dependencyScore: 48,
    status: "Resilient",
    metrics: {
      overallRisk: 48,
      hospitalStrain: 46,
      logisticsChoke: 52,
      pharmaStockout: 44,
      powerGridStress: 50
    },
    primaryVulnerability: "Dense road grid redundancy, well-established grain transit corridors",
    cascadesTo: ["INHR", "INHP", "INJK", "INRJ"],
    criticalFacilities: { hospitals: 86, logisticsHubs: 38, pharmaDepots: 54 },
    bufferHours: 54,
    centroid: [310, 260],
    keyInsight: "High road network density allows seamless rerouting with under 15% transit delay penalty."
  },
  INHR: {
    id: "INHR",
    name: "Haryana",
    region: "North India",
    dependencyScore: 56,
    status: "Moderate",
    metrics: {
      overallRisk: 56,
      hospitalStrain: 58,
      logisticsChoke: 60,
      pharmaStockout: 52,
      powerGridStress: 55
    },
    primaryVulnerability: "High-volume peripheral expressways (KMP/KGP) around the National Capital Region",
    cascadesTo: ["INDL", "INPB", "INUP", "INRJ", "INHP"],
    criticalFacilities: { hospitals: 92, logisticsHubs: 58, pharmaDepots: 62 },
    bufferHours: 44,
    centroid: [320, 310],
    keyInsight: "Acts as NCR's outer shock absorber; arterial roadblocks divert thousands of heavy freight carriers overnight."
  },
  INJH: {
    id: "INJH",
    name: "Jharkhand",
    region: "Eastern Region",
    dependencyScore: 69,
    status: "Elevated Risk",
    metrics: {
      overallRisk: 69,
      hospitalStrain: 74,
      logisticsChoke: 70,
      pharmaStockout: 71,
      powerGridStress: 62
    },
    primaryVulnerability: "Heavy mineral and coal freight rail congestion & tribal district healthcare access gaps",
    cascadesTo: ["INBR", "INWB", "INOR", "INCT", "INUP"],
    criticalFacilities: { hospitals: 58, logisticsHubs: 26, pharmaDepots: 38 },
    bufferHours: 32,
    centroid: [550, 480],
    keyInsight: "Critical source of coal for thermal power plants powering 5 eastern states."
  },
  INCT: {
    id: "INCT",
    name: "Chhattisgarh",
    region: "Central India",
    dependencyScore: 65,
    status: "Moderate",
    metrics: {
      overallRisk: 65,
      hospitalStrain: 67,
      logisticsChoke: 66,
      pharmaStockout: 68,
      powerGridStress: 58
    },
    primaryVulnerability: "Dense forest terrain in southern Bastar, heavy mining freight corridors",
    cascadesTo: ["INMP", "INOR", "INTG", "INAP", "INMH", "INJH", "INUP"],
    criticalFacilities: { hospitals: 52, logisticsHubs: 20, pharmaDepots: 32 },
    bufferHours: 38,
    centroid: [460, 560],
    keyInsight: "Major power surplus exporter to Maharashtra and Gujarat; grid interconnects are vital."
  },
  INUT: {
    id: "INUT",
    name: "Uttaranchal",
    region: "North India",
    dependencyScore: 76,
    status: "Critical",
    metrics: {
      overallRisk: 76,
      hospitalStrain: 78,
      logisticsChoke: 86,
      pharmaStockout: 75,
      powerGridStress: 65
    },
    primaryVulnerability: "Fragile Himalayan slopes, flash flood vulnerabilities & single-access mountain highways",
    cascadesTo: ["INUP", "INHP", "INHR"],
    criticalFacilities: { hospitals: 48, logisticsHubs: 16, pharmaDepots: 34 },
    bufferHours: 24,
    centroid: [400, 270],
    keyInsight: "Char Dham mountain pilgrimage corridors see catastrophic supply line cuts during cloudburst events."
  },
  INHP: {
    id: "INHP",
    name: "Himachal Pradesh",
    region: "North India",
    dependencyScore: 67,
    status: "Elevated Risk",
    metrics: {
      overallRisk: 67,
      hospitalStrain: 60,
      logisticsChoke: 81,
      pharmaStockout: 63,
      powerGridStress: 65
    },
    primaryVulnerability: "Baddi Asia pharma manufacturing cluster; heavy monsoon cloudburst vulnerability",
    cascadesTo: ["INPB", "INHR", "INUT", "INJK", "INLA"],
    criticalFacilities: { hospitals: 44, logisticsHubs: 22, pharmaDepots: 65 },
    bufferHours: 36,
    centroid: [350, 220],
    keyInsight: "Produces 35% of India's domestic pharmaceutical dosage formulations in Baddi industrial zone."
  },
  INJK: {
    id: "INJK",
    name: "Jammu and Kashmir",
    region: "Northern Frontier",
    dependencyScore: 78,
    status: "Critical",
    metrics: {
      overallRisk: 78,
      hospitalStrain: 75,
      logisticsChoke: 88,
      pharmaStockout: 80,
      powerGridStress: 69
    },
    primaryVulnerability: "NH44 Jammu-Srinagar highway landslides, winter snowfall isolating mountain valleys",
    cascadesTo: ["INPB", "INHP", "INLA"],
    criticalFacilities: { hospitals: 54, logisticsHubs: 18, pharmaDepots: 36 },
    bufferHours: 20,
    centroid: [280, 140],
    keyInsight: "Valley districts depend entirely on the Qazigund tunnel arterial link for liquid medical oxygen."
  },
  INLA: {
    id: "INLA",
    name: "Ladakh",
    region: "Northern Frontier",
    dependencyScore: 85,
    status: "Critical",
    metrics: {
      overallRisk: 85,
      hospitalStrain: 79,
      logisticsChoke: 96,
      pharmaStockout: 90,
      powerGridStress: 76
    },
    primaryVulnerability: "Extreme altitude, 6-month winter pass closures (Zoji La / Rohtang) & solar microgrids",
    cascadesTo: ["INJK", "INHP"],
    criticalFacilities: { hospitals: 14, logisticsHubs: 6, pharmaDepots: 12 },
    bufferHours: 72,
    centroid: [370, 110],
    keyInsight: "Requires 6-month pre-winter advance stocking of critical medicines and diesel generation supplies."
  },
  INGA: {
    id: "INGA",
    name: "Goa",
    region: "Western Coast",
    dependencyScore: 45,
    status: "Resilient",
    metrics: {
      overallRisk: 45,
      hospitalStrain: 42,
      logisticsChoke: 50,
      pharmaStockout: 48,
      powerGridStress: 40
    },
    primaryVulnerability: "High medical tourism ratio; relies on Belagavi and Kolhapur for oxygen and food buffer",
    cascadesTo: ["INMH", "INKA"],
    criticalFacilities: { hospitals: 22, logisticsHubs: 12, pharmaDepots: 18 },
    bufferHours: 60,
    centroid: [265, 715],
    keyInsight: "High per-capita hospital bed availability provides strong immediate absorption capacity."
  },
  INSK: {
    id: "INSK",
    name: "Sikkim",
    region: "North East",
    dependencyScore: 80,
    status: "Critical",
    metrics: {
      overallRisk: 80,
      hospitalStrain: 72,
      logisticsChoke: 94,
      pharmaStockout: 82,
      powerGridStress: 72
    },
    primaryVulnerability: "NH10 Teesta river landslide vulnerability; single lifelined road into Gangtok",
    cascadesTo: ["INWB"],
    criticalFacilities: { hospitals: 16, logisticsHubs: 8, pharmaDepots: 18 },
    bufferHours: 24,
    centroid: [635, 335],
    keyInsight: "Monsoon floods frequently cut NH10 for 5+ days, isolating specialized referral healthcare."
  },
  INML: {
    id: "INML",
    name: "Meghalaya",
    region: "North East",
    dependencyScore: 73,
    status: "Elevated Risk",
    metrics: {
      overallRisk: 73,
      hospitalStrain: 70,
      logisticsChoke: 80,
      pharmaStockout: 76,
      powerGridStress: 66
    },
    primaryVulnerability: "World's highest rainfall belt, steep plateau escarpments & single NH6 arterial lifeline",
    cascadesTo: ["INAS"],
    criticalFacilities: { hospitals: 26, logisticsHubs: 10, pharmaDepots: 20 },
    bufferHours: 28,
    centroid: [730, 440],
    keyInsight: "Bridges connecting Jaintia Hills to Assam frequently encounter flash-flooding in peak monsoon."
  },
  INTR: {
    id: "INTR",
    name: "Tripura",
    region: "North East",
    dependencyScore: 77,
    status: "Critical",
    metrics: {
      overallRisk: 77,
      hospitalStrain: 74,
      logisticsChoke: 85,
      pharmaStockout: 80,
      powerGridStress: 70
    },
    primaryVulnerability: "Nearly surrounded by international boundary; relies on narrow Assam road link",
    cascadesTo: ["INAS", "INMZ"],
    criticalFacilities: { hospitals: 24, logisticsHubs: 10, pharmaDepots: 22 },
    bufferHours: 22,
    centroid: [740, 495],
    keyInsight: "Geographical isolation makes fuel and oxygen tanker transit highly sensitive to Barak valley highway blocks."
  },
  INMN: {
    id: "INMN",
    name: "Manipur",
    region: "North East",
    dependencyScore: 83,
    status: "Critical",
    metrics: {
      overallRisk: 83,
      hospitalStrain: 81,
      logisticsChoke: 90,
      pharmaStockout: 85,
      powerGridStress: 76
    },
    primaryVulnerability: "NH2 and NH37 mountain highway blockades, valley-hill distribution divides",
    cascadesTo: ["INAS", "INNL", "INMZ"],
    criticalFacilities: { hospitals: 28, logisticsHubs: 10, pharmaDepots: 24 },
    bufferHours: 18,
    centroid: [810, 455],
    keyInsight: "Highway disruptions can inflate essential drug market prices by 40% within 72 hours."
  },
  INNL: {
    id: "INNL",
    name: "Nagaland",
    region: "North East",
    dependencyScore: 76,
    status: "Critical",
    metrics: {
      overallRisk: 76,
      hospitalStrain: 74,
      logisticsChoke: 84,
      pharmaStockout: 78,
      powerGridStress: 68
    },
    primaryVulnerability: "Sub-Himalayan seismic zone, landslides on Dimapur-Kohima arterial corridor",
    cascadesTo: ["INAS", "INMN", "INAR"],
    criticalFacilities: { hospitals: 22, logisticsHubs: 8, pharmaDepots: 18 },
    bufferHours: 24,
    centroid: [820, 410],
    keyInsight: "Dimapur serves as the single railhead for both Nagaland and parts of Manipur."
  },
  INMZ: {
    id: "INMZ",
    name: "Mizoram",
    region: "North East",
    dependencyScore: 75,
    status: "Critical",
    metrics: {
      overallRisk: 75,
      hospitalStrain: 70,
      logisticsChoke: 86,
      pharmaStockout: 79,
      powerGridStress: 65
    },
    primaryVulnerability: "Ridge-top town locations, Silchar-Aizawl road landslides during rainy season",
    cascadesTo: ["INAS", "INTR", "INMN"],
    criticalFacilities: { hospitals: 18, logisticsHubs: 6, pharmaDepots: 16 },
    bufferHours: 26,
    centroid: [770, 520],
    keyInsight: "Deep dependency on single Silchar highway for refrigerated vaccine transports."
  },
  INAR: {
    id: "INAR",
    name: "Arunachal Pradesh",
    region: "North East",
    dependencyScore: 79,
    status: "Critical",
    metrics: {
      overallRisk: 79,
      hospitalStrain: 73,
      logisticsChoke: 92,
      pharmaStockout: 84,
      powerGridStress: 68
    },
    primaryVulnerability: "Vast mountainous frontier, isolated river valleys separated by rugged ridges",
    cascadesTo: ["INAS", "INNL"],
    criticalFacilities: { hospitals: 24, logisticsHubs: 8, pharmaDepots: 16 },
    bufferHours: 24,
    centroid: [830, 320],
    keyInsight: "Inter-valley transit often requires descending into Assam before ascending the next ridge."
  },
  INCH: {
    id: "INCH",
    name: "Chandigarh",
    region: "North India",
    dependencyScore: 42,
    status: "Resilient",
    metrics: {
      overallRisk: 42,
      hospitalStrain: 55,
      logisticsChoke: 40,
      pharmaStockout: 38,
      powerGridStress: 35
    },
    primaryVulnerability: "Tri-city medical referral overload (PGIMER) from surrounding 4 states",
    cascadesTo: ["INPB", "INHR", "INHP"],
    criticalFacilities: { hospitals: 24, logisticsHubs: 14, pharmaDepots: 28 },
    bufferHours: 64,
    centroid: [336, 254],
    keyInsight: "Premier referral hospital PGIMER absorbs emergency cascades from across Punjab, Haryana, and HP."
  },
  INPY: {
    id: "INPY",
    name: "Puducherry",
    region: "Southern Coast",
    dependencyScore: 50,
    status: "Moderate",
    metrics: {
      overallRisk: 50,
      hospitalStrain: 48,
      logisticsChoke: 54,
      pharmaStockout: 50,
      powerGridStress: 48
    },
    primaryVulnerability: "Enclave geography surrounded by Tamil Nadu, storm surge vulnerability",
    cascadesTo: ["INTN"],
    criticalFacilities: { hospitals: 18, logisticsHubs: 8, pharmaDepots: 16 },
    bufferHours: 48,
    centroid: [425, 805],
    keyInsight: "JIPMER provides robust tertiary resilience, but medical logistics depend on Chennai transit lines."
  },
  INDH: {
    id: "INDH",
    name: "Dādra and Nagar Haveli and Damān and Diu",
    region: "Western Coast",
    dependencyScore: 46,
    status: "Resilient",
    metrics: {
      overallRisk: 46,
      hospitalStrain: 42,
      logisticsChoke: 52,
      pharmaStockout: 45,
      powerGridStress: 45
    },
    primaryVulnerability: "Industrial manufacturing enclave with strong proximity to Gujarat/Maharashtra expressways",
    cascadesTo: ["INGJ", "INMH"],
    criticalFacilities: { hospitals: 12, logisticsHubs: 16, pharmaDepots: 20 },
    bufferHours: 52,
    centroid: [238, 577],
    keyInsight: "Direct access to Western Dedicated Freight Corridor buffers manufacturing continuity."
  },
  INLD: {
    id: "INLD",
    name: "Lakshadweep",
    region: "Island Territory",
    dependencyScore: 89,
    status: "Critical",
    metrics: {
      overallRisk: 89,
      hospitalStrain: 85,
      logisticsChoke: 98,
      pharmaStockout: 94,
      powerGridStress: 80
    },
    primaryVulnerability: "Remote archipelago logistics, 100% reliant on sea & air cargo from Kochi mainland",
    cascadesTo: ["INKL"],
    criticalFacilities: { hospitals: 4, logisticsHubs: 2, pharmaDepots: 4 },
    bufferHours: 36,
    centroid: [220, 830],
    keyInsight: "Monsoon sea turbulence halts ferry transport; critical patient transfers require Navy helicopter sorties."
  },
  INAN: {
    id: "INAN",
    name: "Andaman and Nicobar",
    region: "Island Territory",
    dependencyScore: 87,
    status: "Critical",
    metrics: {
      overallRisk: 87,
      hospitalStrain: 83,
      logisticsChoke: 95,
      pharmaStockout: 91,
      powerGridStress: 78
    },
    primaryVulnerability: "1200 km mainland sea distance, cyclone vulnerability & inter-island ferry reliance",
    cascadesTo: ["INTN", "INWB"],
    criticalFacilities: { hospitals: 8, logisticsHubs: 4, pharmaDepots: 8 },
    bufferHours: 48,
    centroid: [780, 860],
    keyInsight: "Mainland medical resupply ships take 3-4 days from Chennai or Kolkata; local reserve storage is paramount."
  }
};

// Summary metrics across India
export const NATIONAL_DEPENDENCY_SUMMARY = {
  totalStates: 36,
  criticalCount: 14,
  elevatedCount: 11,
  moderateCount: 7,
  resilientCount: 4,
  averageDependencyScore: 71.4,
  highestRiskState: "Lakshadweep & Delhi",
  mostResilientState: "Chandigarh & Goa",
  vitalCorridorsMonitored: 84
};
