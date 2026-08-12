# Cleanytics Enterprise Production Plan & Architecture Upgrade

## Executive Summary

Cleanytics is an AI-powered SaaS platform for automated data cleaning, normalization, and business analytics. The project currently possesses a highly polished, feature-complete React 19 frontend prototype (`Frontend/LoginNew/src`). However, the backend architecture, data processing engine, database models, and API integrations are currently non-existent.

This plan upgrades the initial Copilot-generated proposal into an enterprise-ready architecture featuring high-performance asynchronous processing, LLM-based semantic cleaning, and real-time streaming notifications.

---

## User Review & Key Architectural Upgrades

> [!IMPORTANT]
> **Key Architecture Decisions for Approval:**
> 1. **Data Engine Upgrade (`Pandas` → `Polars` / `DuckDB`):** Standard Pandas is prone to memory bottlenecks and single-threaded execution on multi-gigabyte files. We will use **Polars** and **DuckDB** with PyArrow memory mapping for 10x-50x faster processing and streaming capabilities.
> 2. **AI & LLM Integration Layer:** Added a dedicated LLM processing service (OpenAI / Claude API integration) for semantic anomaly detection, automated column classification, and smart missing-data imputation.
> 3. **Real-time Job Updates (`WebSockets` / `SSE`):** Replaced static HTTP polling with WebSocket event streaming so users see live progress (% complete, rows processed, nulls filled) inside `DashboardApp.jsx`.
> 4. **Direct-to-S3 Multi-part Uploads:** Implemented Presigned Upload URLs so heavy CSV/Excel files upload directly from the browser to Object Storage (S3/MinIO), bypassing FastAPI app server memory limits.

---

## Proposed System Architecture

```
[React 19 Frontend UI]
       │
       ├─── HTTP/REST ────────► [FastAPI API Gateway] ────► [PostgreSQL (AsyncPG)]
       │                              │
       ├─── WebSockets ───────────────┤ (Auth, User & Dataset Metadata)
       │                              ▼
       └─── Direct Upload ─────► [S3 / MinIO Storage]
                                      │
                                      ▼
                               [Redis Queue]
                                      │
                                      ▼
                        [Polars & LLM Cleaning Worker]
                                      │
                                      ▼
                        [Cleaned Dataset & Metrics S3]
```

---

## Proposed Changes & File Structure

### 1. Backend Core (`/Backend`)

#### [NEW] [main.py](file:///c:/Users/HP/Desktop/Python%20File/Cleanytics/Backend/app/main.py)
- FastAPI entry point with CORS middleware, rate limiting, and router registration.

#### [NEW] [config.py](file:///c:/Users/HP/Desktop/Python%20File/Cleanytics/Backend/app/core/config.py)
- Pydantic settings management loading environment variables (PostgreSQL URI, Redis, S3 Keys, JWT secrets, LLM API Keys).

#### [NEW] [database.py](file:///c:/Users/HP/Desktop/Python%20File/Cleanytics/Backend/app/core/database.py)
- Async SQLAlchemy engine configuration and session dependency injection.

#### [NEW] [models](file:///c:/Users/HP/Desktop/Python%20File/Cleanytics/Backend/app/models)
- Database schema definitions:
  - `user.py`: User account, authentication credentials, role RBAC.
  - `dataset.py`: Dataset metadata, file path, original vs cleaned status, row/column counts.
  - `dataset_version.py`: Versioning tracking with quality scores and delta diffs.
  - `job.py`: Asynchronous job status, progress %, and logs.

#### [NEW] [services/cleaning_engine.py](file:///c:/Users/HP/Desktop/Python%20File/Cleanytics/Backend/app/services/cleaning_engine.py)
- Polars & DuckDB processing pipeline implementing:
  - Automated null imputation (statistical & LLM semantic).
  - Duplicate detection & deduplication.
  - String standardization, datetime auto-parsing, and regex sanitization.
  - Outlier detection via IQR / Z-Score.
  - Automatic calculation of Data Quality Score (0-100).

#### [NEW] [services/llm_service.py](file:///c:/Users/HP/Desktop/Python%20File/Cleanytics/Backend/app/services/llm_service.py)
- LLM abstraction module for prompt-based column categorization, messy text normalization, and custom business rule execution.

#### [NEW] [workers/celery_worker.py](file:///c:/Users/HP/Desktop/Python%20File/Cleanytics/Backend/app/workers/celery_worker.py)
- Background processing task workers listening on Redis for incoming dataset cleaning jobs.

---

### 2. Frontend Integration (`/Frontend/LoginNew/src`)

#### [NEW] [services/api.js](file:///c:/Users/HP/Desktop/Python%20File/Cleanytics/Frontend/LoginNew/src/services/api.js)
- Centralized Axios HTTP client with JWT automatic header injection and token refresh logic.

#### [MODIFY] [DashboardApp.jsx](file:///c:/Users/HP/Desktop/Python%20File/Cleanytics/Frontend/LoginNew/src/components/DashboardApp.jsx)
- Connect mock states (uploading, dataset history, analytics stats, settings) to real backend REST endpoints and WebSocket progress streams.

#### [MODIFY] [App.jsx](file:///c:/Users/HP/Desktop/Python%20File/Cleanytics/Frontend/LoginNew/src/App.jsx)
- Connect AuthForm to backend `/auth/register` and `/auth/login` APIs with token storage in secure HttpOnly storage / state.

---

## Technical Phased Roadmap

### Phase 1: Environment & Base Backend (Days 1-2)
- Set up `Backend/` directory structure with FastAPI and Docker Compose (PostgreSQL 16 + Redis 7).
- Implement database migrations via Alembic.
- Build User Auth system with JWT tokens (login, signup, current user verification).

### Phase 2: File Ingestion & Storage Pipeline (Days 3-4)
- Set up S3 / MinIO storage service.
- Implement `/datasets/upload` and presigned upload URL endpoints.
- Parse file schemas (CSV, XLSX, Parquet) with PyArrow / Polars metadata extractors.

### Phase 3: High-Performance Data Cleaning Engine (Days 5-7)
- Implement Polars automated data cleaning transformations.
- Build the Data Quality Scoring algorithm (calculating completeness, accuracy, uniqueness, consistency).
- Integrate Celery background worker queues with Redis backend.

### Phase 4: AI/LLM Integration & Real-time WebSockets (Days 8-9)
- Build LLM service wrapper for semantic column analysis and dirty text cleaning.
- Implement WebSocket broadcast channels for live job progress updates.

### Phase 5: Frontend API Integration & End-to-End Testing (Days 10-12)
- Wire up `DashboardApp.jsx`, `History.jsx`, `AnalyticsDashboard.jsx`, and `Settings.jsx` to real API endpoints.
- Conduct load testing (handling 100MB+ datasets) and automated unit/integration test suite.

---

## Verification Plan

### Automated Tests
- Run `pytest` backend test suite for API routes, auth workflows, and cleaning engine functions.
- Run `vitest` / `npm test` frontend unit tests.

### Manual Verification
- Test file upload of messy CSV/Excel datasets via browser UI.
- Verify live WebSocket progress updates in the dashboard.
- Download cleaned dataset files and inspect version comparison diffs.
