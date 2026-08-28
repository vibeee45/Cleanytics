# Cleanytics

Cleanytics is a product concept for an AI-powered data cleaning and analytics platform. The current repository contains the frontend user experience for a web app that helps users upload messy spreadsheets, review cleaning results, and explore dashboards.

## What the project is about

The idea is simple: turn messy business data into clean, useful information quickly.

A typical user flow looks like this:

1. Sign in or create an account.
2. Upload a CSV or Excel file.
3. Let the system clean and organize the data.
4. Review results through dashboards, history, and settings.
5. Download or share the cleaned dataset.

## Current status

This repository is currently a frontend prototype.

It includes:
- a polished login/signup experience
- a dashboard-style workspace after login
- mock datasets and UI states for history, analytics, and settings
- no real backend or database connection yet

## Project structure

- [Frontend](Frontend) — main frontend application
  - [Frontend/LoginNew/src](Frontend/LoginNew/src) — React components and screens
  - [Frontend/LoginNew/src/App.jsx](Frontend/LoginNew/src/App.jsx) — main app logic and authentication flow
  - [Frontend/LoginNew/src/components](Frontend/LoginNew/src/components) — UI modules such as dashboard, analytics, history, and settings
  - [Frontend/LoginNew/src/screens](Frontend/LoginNew/src/screens) — screen entry points
  - [Frontend/LoginNew/src/styles](Frontend/LoginNew/src/styles) — CSS styling

## Tech stack

- React 19
- Vite
- lucide-react

## How to run locally

From the project root:

```bash
cd Frontend/LoginNew
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Planned backend scope

The next step is to build a backend that will provide:

- user authentication
- file upload handling
- data cleaning and validation logic
- dataset history storage
- analytics and reporting APIs

A strong backend choice for this product would be FastAPI or Flask with a database such as PostgreSQL or SQLite.

## Notes for the client

This folder represents the product vision and user experience. It is a strong foundation for a real SaaS platform, but the backend and data processing engine still need to be implemented.


