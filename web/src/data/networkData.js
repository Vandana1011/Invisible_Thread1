// Geographically accurate coordinates on a 1000x1000 viewBox matching the India SVG map
export const CITY_NODES_1000 = [
  { id: "delhi", name: "Delhi", x: 344, y: 321, type: "Hospitals", region: "North India", nodes: 38, risk: "Moderate", delay: "+40m" },
  { id: "mumbai", name: "Mumbai", x: 235, y: 585, type: "Roads", region: "Western Coast", nodes: 44, risk: "High", delay: "+60m" },
  { id: "kolkata", name: "Kolkata", x: 630, y: 495, type: "Pharmacies", region: "Eastern Region", nodes: 26, risk: "High", delay: "+25m" },
  { id: "hyderabad", name: "Hyderabad", x: 410, y: 642, type: "Hospitals", region: "Central / Deccan", nodes: 32, risk: "Low", delay: "+15m" },
  { id: "bengaluru", name: "Bengaluru", x: 350, y: 765, type: "Delivery", region: "Southern Region", nodes: 35, risk: "Moderate", delay: "+15m" },
  { id: "chennai", name: "Chennai", x: 420, y: 775, type: "Pharmacies", region: "Coastal Region", nodes: 29, risk: "High", delay: "+35m" },
  { id: "jaipur", name: "Jaipur", x: 295, y: 360, type: "Roads", region: "North West", nodes: 18, risk: "Low", delay: "+20m" },
  { id: "ahmedabad", name: "Ahmedabad", x: 210, y: 490, type: "Roads", region: "Western", nodes: 22, risk: "Moderate", delay: "+30m" },
  { id: "nagpur", name: "Nagpur", x: 410, y: 535, type: "Hospitals", region: "Central", nodes: 19, risk: "Low", delay: "+10m" },
  { id: "patna", name: "Patna", x: 540, y: 380, type: "Pharmacies", region: "Eastern", nodes: 16, risk: "Moderate", delay: "+18m" },
  { id: "bhubaneswar", name: "Bhubaneswar", x: 580, y: 580, type: "Delivery", region: "Eastern Coast", nodes: 15, risk: "High", delay: "+25m" },
  { id: "kochi", name: "Kochi", x: 305, y: 865, type: "Delivery", region: "Coastal South", nodes: 14, risk: "High", delay: "+30m" },
  { id: "guwahati", name: "Guwahati", x: 760, y: 390, type: "Hospitals", region: "North East", nodes: 12, risk: "Moderate", delay: "+15m" }
];

export const NETWORK_EDGES_1000 = [
  ["delhi", "jaipur"], ["delhi", "patna"], ["delhi", "nagpur"],
  ["jaipur", "ahmedabad"],
  ["ahmedabad", "mumbai"],
  ["mumbai", "nagpur"], ["mumbai", "hyderabad"], ["mumbai", "bengaluru"],
  ["nagpur", "patna"], ["nagpur", "hyderabad"], ["nagpur", "bhubaneswar"],
  ["patna", "kolkata"], ["patna", "guwahati"],
  ["bhubaneswar", "kolkata"],
  ["hyderabad", "bhubaneswar"], ["hyderabad", "chennai"], ["hyderabad", "bengaluru"],
  ["bengaluru", "chennai"], ["bengaluru", "kochi"],
  ["chennai", "kochi"], ["delhi", "kolkata"]
];
