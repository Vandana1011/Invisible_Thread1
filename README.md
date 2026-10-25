# Invisible Thread | Critical Infrastructure Intelligence

> **An interactive geospatial & systemic resilience platform** mapping cascading delays and hidden interdependencies across essential urban services (Hospitals, Emergency Logistics, Road Networks, and Pharmaceutical Supply Chains).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🌐 Live Deployments

- **Live Application URL**: [https://ais-pre-hamv7zylewubksce3mgigg-768551743797.asia-southeast1.run.app](https://ais-pre-hamv7zylewubksce3mgigg-768551743797.asia-southeast1.run.app)
- **Development Preview URL**: [https://ais-dev-hamv7zylewubksce3mgigg-768551743797.asia-southeast1.run.app](https://ais-dev-hamv7zylewubksce3mgigg-768551743797.asia-southeast1.run.app)

---

## 🚀 Deploying to Vercel

The repository comes pre-configured with `vercel.json` for seamless Vite Single-Page Application (SPA) routing and zero-configuration asset optimization.

### Method 1: 1-Click Git Import (Recommended)

1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Vercel automatically detects the Vite framework and applies the settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your custom Vercel link (`https://<project-name>.vercel.app`) will be live in under 45 seconds!

### Method 2: Deploy via Vercel CLI

In your terminal / project folder:

```bash
# 1. Install or run Vercel CLI
npx vercel

# 2. Follow the interactive prompts:
# - Set up and deploy? [Y]
# - Which scope? [Your Account]
# - Link to existing project? [N]
# - Project name? [invisible-thread]
# - In which directory is your code located? [./]

# 3. For immediate Production deployment:
npx vercel --prod
```

### Method 3: Automated CI/CD with Vercel Token

If deploying from CI/CD (GitHub Actions, GitLab CI, or terminal script):

```bash
# Set your Vercel authentication token
export VERCEL_TOKEN="your_vercel_token_here"

# Deploy directly to production without prompts
npx vercel --token $VERCEL_TOKEN --prod --yes
```

---

## 🛠️ Key Modules & Architecture

1. **Home (`/`)**:
   - High-impact mission narrative with systemic risk counter, core problem framing, and seamless navigation.
2. **Explorer (`02_Explorer`)**:
   - Interactive SVG-driven geospatial network map.
   - Highlights critical infrastructure nodes (hospitals, arterial highways, supply depots, emergency pharmacies).
   - High-contrast, scalable district naming with dynamic vulnerability ratings and dependency badges.
3. **Simulator (`03_Simulator`)**:
   - Live systemic failure cascade simulator.
   - Inject choke points (flooding, route severance, grid outage) and observe ripple delays across downstream hospitals and delivery nodes.
4. **Insights (`04_Insights`)**:
   - **Service Performance**: Interactive latency/throughput monitors across Roads, Medical Hubs, Pharmacies, and Logistics with stress-test scenario modes (*Minor, Moderate, Severe*).
   - **Impact Analysis**: Dynamic SVG time-series curves with interactive crosshairs, timeframe switches (24h, 7d, 30d), and pinpoint diagnostics.
5. **About (`05_About`)**:
   - Methodology breakdown, network graph architecture, and structured boundary-fitted topology view.
6. **Closing (`06_Closing`)**:
   - Policy recommendations, mitigation levers, and key resilient infrastructure takeaways.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server on http://localhost:3000
npm run dev

# Run oxlint check
npm run lint

# Build production bundle to /dist
npm run build
```

---

## ⚙️ Configuration Files

- `vercel.json` — Pre-configured SPA rewrite rules to ensure deep-linking and browser navigation without 404 errors:
  ```json
  {
    "framework": "vite",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- `vite.config.ts` — Optimized bundle splits and fast-refresh config.
- `metadata.json` — Application capabilities and permission manifest.
