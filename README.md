# E‑Vaccination — Project Summary

This repository contains a full-stack E‑Vaccination system: a React frontend, a Node/Express backend API, and an ML microservice for analytics and predictions.

1) The problem I addressed
--------------------------------
Vaccination programs require reliable logistics, near‑real‑time visibility of stock and movements, and early warning when waste or shortages occur. This project demonstrates a working proof‑of‑concept that:

- consolidates operational data from hubs and vaccination sites,
- provides visual dashboards for administrators and staff,
- detects risk (high wastage, low stock) and recommends actions,
- and uses ML to forecast short‑term wastage so managers can proactively intervene.

2) System architecture and technologies used
-------------------------------------------
Overview

The system is split into three cooperating components:

- Frontend (React + Vite): user, staff and admin UIs, routing and presentation logic.
- Backend (Node / Express): REST API, authentication, persistence hooks and business logic.
- ML service (Flask): data processing, lightweight prediction API, and static ML dashboard.

Key technologies

- Frontend: React, React Router, Tailwind CSS, Vite
- Backend: Node.js, Express, Mongoose (MongoDB), JWT (auth), CORS
- ML: Python, Flask, Pandas, NumPy, scikit‑learn (models), Chart.js (visuals in the ML dashboard)
- Others: Docker-friendly design (no mandatory Dockerfile in repo), CSV datasets for offline testing

3) Key features
----------------
- Dashboard overview: key KPIs (total vaccines, administered, wastage rate, active hubs)
- Movement tracking: searchable, filterable transfer records between hubs
- Wastage analytics: reasons, top hubs, and time‑series trends
- Predictions: 7‑day wastage forecasts (model-backed or heuristic fallback)
- Smart insights: automated alerts (high wastage, low stock, weekend patterns) and short recommendations
- Role-based UI surface: routes and pages separated for users, staff and admin

4) Use of AI / automation
-------------------------
The ML component provides automated forecasting and data‑driven recommendations:

- Wastage prediction: a trained model (or heuristic fallback) generates a 7‑day forecast of expected wastage rates per hub or overall. This helps operations plan reallocation and training.
- Automated insights: simple rule‑based analytics aggregate the datasets to detect high‑risk hubs, low stock events, and anomalous patterns (e.g., higher weekend wastage). These are surfaced as prioritized recommendations.

Design choices

- The ML backend falls back to a lightweight heuristic when a serialized model is not available. This ensures the dashboard remains useful in development and demo environments.

5) Future improvements
----------------------
Short to medium term

- End‑to‑end tests and a CI pipeline to validate API contracts and UI snapshots.
- Componentize the ML dashboard fully into React (remove injected global Bootstrap CSS) or serve it in an iframe for strict style isolation.
- Add role management and RBAC enforcement on the backend with comprehensive tests.
- Improve model accuracy by adding richer temporal features, backtesting and cross‑validation; track model drift in production.

Long term / optional

- Multi‑region support with tenancy and scalable queueing for large‑scale data ingestion.
- Deployable IaC (Bicep/Terraform) and container images with a deployment pipeline.
- Streaming ingestion (near real‑time) from hub devices or mobile collectors and real‑time alerts via WebSockets or push notifications.

Getting started
---------------
See the component READMEs for step‑by‑step developer instructions:

- `frontend/README.md` — frontend dev & build
- `backend/README.md` — backend dev & environment variables
- `ml/README.md` — data, model and the Flask microservice

If you want, I can also produce a short CONTRIBUTING.md and a small checklist for production readiness (security, observability, and deployment).

