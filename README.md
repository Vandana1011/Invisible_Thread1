# Invisible Thread
### Critical Infrastructure Intelligence & Cascading Impact Simulation

**Invisible Thread** is an interactive prototype that explores how disruptions in one essential urban service can affect other connected services. It helps users visualize hidden dependencies between road networks, hospitals, pharmacies, and medicine delivery systems.

The project focuses on a critical question:

**What happens when one disruption creates a chain reaction across essential services?**

## The Problem

Urban services are interconnected, but disruptions are often considered in isolation. A blocked road, for example, may delay hospital access, affect pharmacy replenishment, or slow medicine deliveries.

Understanding these dependencies can help identify potential vulnerabilities and support better-informed response planning.

## Our Solution

Invisible Thread represents essential services as a connected network and allows users to explore illustrative disruption scenarios. By tracing dependencies and downstream effects, the prototype demonstrates how a localized disruption may propagate through a wider service network.

The goal is to make complex interdependencies easier to understand and help users explore possible mitigation strategies.

## Key Features

### 1. Home
Introduces the problem, project objectives, and the relationship between connected essential services.

### 2. Explorer
Provides a visual representation of the infrastructure network, its service nodes, and their dependencies.

### 3. Simulator
Allows users to explore disruption scenarios and observe potential cascading impacts across connected services.

### 4. Insights
Presents visual summaries and scenario-related indicators to help users understand network vulnerabilities and potential service impacts.

### 5. About & Methodology
Explains the motivation, conceptual approach, intended use, and limitations of the project.

### 6. Response Planning
Highlights possible mitigation approaches, including exploring alternative routes where supported by the prototype.

## How It Works

1. **Represent the network:** Model essential services as connected nodes and dependencies.
2. **Introduce a disruption:** Select a supported scenario or disruption severity.
3. **Trace dependencies:** Follow the connections between affected services.
4. **Explore cascading impacts:** Observe the potential downstream consequences shown by the simulation.
5. **Consider mitigation:** Examine available response options and alternative routes.

## Technology Stack

- **Frontend:** React
- **Build Tool:** Vite
- **Languages:** JavaScript / TypeScript, depending on the module
- **Visualization:** SVG-based network and data visualizations
- **Deployment:** Vercel
- **Development Assistance:** Google AI Studio

*The exact libraries and implementation details may vary across modules.*

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Vandana1011/Invisible_Thread1.git
cd Invisible_Thread1
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### Production Build

```bash
npm run build
```

The production build output is generated in the `dist` directory when configured as a standard Vite project.

## Project Limitations

- Scenario outputs should be treated as illustrative unless supported by validated data and a documented calculation method.
- The prototype should not be considered a live emergency monitoring or dispatch system unless it is connected to verified real-time data sources.
- Simulated impacts depend on the assumptions, dependency relationships, and parameters used by the implementation.
- Alternative routes and estimated delays should not be interpreted as operational recommendations without validation against real road conditions and travel data.

## Future Scope

- Integrate verified infrastructure and transport datasets.
- Validate dependency relationships with domain experts.
- Improve scenario calibration and uncertainty reporting.
- Evaluate alternative routes using reliable travel-time and accessibility data.
- Expand testing, accessibility, and mobile responsiveness.

## Live Demo

**Live Application:** https://invisible-threadaxion.vercel.app/

## Project Information

**Project:** Invisible Thread  
**Hackathon:** AXION Hackathon  
**Repository:** [Vandana1011/Invisible_Thread1](https://github.com/Vandana1011/Invisible_Thread1)

## Acknowledgements

This project was developed with AI-assisted development tools. The implementation, outputs, and limitations should be reviewed and validated before real-world use.
