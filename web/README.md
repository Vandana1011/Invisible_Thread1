# Invisible Thread

### See the thread before it snaps.

Invisible Thread is a prototype exploring how delays in one everyday service can propagate through connected services.

## The Problem

Roads, hospitals, pharmacies, and medicine delivery may depend on one another. A disruption to one service can create secondary and downstream delays that are difficult to see when services are considered separately.

## Features

- **Scenario simulation:** Explore Minor, Moderate, and Severe disruptions.
- **Dependency Explorer:** Explore relationships between connected services.
- **Impact analysis:** View propagated delays and illustrative risk thresholds.
- **Response Planning:** Explore a simulated backup route.
- **Insights:** Review scenario impacts.

## Example

`Main Road → City Hospital → Central Pharmacy → Medicine Delivery`

For an illustrative 60-minute disruption, the model calculates 40 minutes of delay at the hospital, 25 minutes at the pharmacy, and 15 minutes at medicine delivery.

## Technology

- React, JavaScript, CSS, Vite
- Python, Pandas, NetworkX for the separate analysis prototype

## Run Locally

From the `web` directory, run:

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Limitations

This is a hackathon prototype using illustrative dependencies, delay tolerances, thresholds, and route estimates. It does not use live traffic or emergency-service data and must not be used for real emergency decisions.

## Vision

Make hidden dependencies visible so people can explore how disruptions may spread and consider possible response options.
