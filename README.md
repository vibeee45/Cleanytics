<div align="center">

# Cleanytics

### AI-Powered Data Cleaning & Analytics Platform

</div>

Cleanytics is a product concept for an AI-powered data cleaning and analytics platform. The current repository contains the frontend user experience for a web app that helps users upload messy spreadsheets, review cleaning results, and explore dashboards.

## What the project is about

The idea is simple: turn messy business data into clean, useful information quickly.

A typical user flow looks like this:

1. Sign in or create an account.
2. Upload a CSV or Excel file.
3. Let the system clean and organize the data.
4. Review results through dashboards, history, and settings.
5. Download or share the cleaned dataset.

## Version 2 Updates

* Added dashboard triggers
* Fixed bugs and improved UI
* Improved dashboard interactions
* Added `run_project.bat` for easy startup
* Added localhost access
* Updated README documentation

## Current status

This repository is currently a frontend prototype.

It includes:

* Login/signup experience
* Dashboard workspace
* Dashboard triggers and interactions
* Mock datasets
* History, analytics, and settings
* No real backend or database connection yet

## Project structure

* [Frontend](Frontend) — main frontend application

  * [Frontend/LoginNew/src](Frontend/LoginNew/src) — React components and screens
  * [Frontend/LoginNew/src/App.jsx](Frontend/LoginNew/src/App.jsx) — main app logic and authentication flow
  * [Frontend/LoginNew/src/components](Frontend/LoginNew/src/components) — dashboard, analytics, history, and settings
  * [Frontend/LoginNew/src/screens](Frontend/LoginNew/src/screens) — screen entry points
  * [Frontend/LoginNew/src/styles](Frontend/LoginNew/src/styles) — CSS styling
* `run_project.bat` — starts the project on Windows


## How to run locally

### Using `run_project.bat`

Double-click:

```text
run_project.bat
```

The project will start and the terminal will show the local Vite URL.

Open the localhost link shown in the terminal, for example:

```text
http://localhost:5173
```

### Manual setup

From the project root:

```bash
cd Frontend/LoginNew
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Planned backend scope

The next step is to build a backend that will provide:

* User authentication
* File upload handling
* Data cleaning and validation
* Dataset history storage
* Analytics and reporting APIs

A strong backend choice for this product would be FastAPI or Flask with PostgreSQL or SQLite.

## Notes for the client

Version 2 improves the frontend experience with dashboard triggers, bug fixes, and an easier project startup process.

The backend and data processing engine still need to be implemented.
