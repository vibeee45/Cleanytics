# Cleanytics Frontend

This frontend represents the user experience for Cleanytics, a data-cleaning and analytics platform aimed at helping businesses turn messy datasets into usable insights.

## What this frontend includes

- a polished authentication experience with login, signup, and password reset views
- a modern dashboard workspace after sign-in
- mock analytics, history, settings, and support sections
- theme support including dark mode and color accent selection
- UI flows for uploading datasets and reviewing status

## Current product direction

The project is moving from a visual prototype toward a full product architecture based on:

- FastAPI for the backend API layer
- PostgreSQL for reliable relational storage
- background workers for file processing and cleaning jobs
- object storage for uploaded files and exported results

## Main app flow

1. The user lands on the authentication experience.
2. After login, the app transitions into the dashboard workspace.
3. The dashboard allows users to manage datasets, view analytics, access history, and adjust settings.
4. In the future, this UI will connect to real backend services for uploading, cleaning, and reporting.

## Main frontend files

- [src/App.jsx](src/App.jsx) — main app logic, routing between auth and dashboard views
- [src/components/DashboardApp.jsx](src/components/DashboardApp.jsx) — main dashboard experience and simulated data handling
- [src/components/Dashboard.jsx](src/components/Dashboard.jsx) — dashboard home view
- [src/components/History.jsx](src/components/History.jsx) — dataset history UI
- [src/components/Settings.jsx](src/components/Settings.jsx) — user and workspace settings UI
- [src/components/AnalyticsDashboard.jsx](src/components/AnalyticsDashboard.jsx) — analytics and metrics view

## Tech stack

- React 19
- Vite
- lucide-react

## Run locally

```bash
npm install
npm run dev
```

## Important note

This is currently a frontend prototype. The full backend, real file processing, PostgreSQL integration, and production-scale workflows are planned next.

## Upcoming backend integration

The frontend will soon connect to:

- authentication APIs
- dataset upload endpoints
- cleaning job processing APIs
- analytics and dashboard APIs
- history and audit endpoints
