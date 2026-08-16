# Cleanytics Backend Architecture Plan

## 1. Goal

There is one more goal that is of colour that the dashboard should be preferred and the LOGO Color

Build a scalable, production-ready backend for Cleanytics using FastAPI and PostgreSQL.

The backend must support:
- user authentication and authorization
- dataset upload and storage
- data cleaning workflows
- versioning and history tracking
- analytics and reporting
- large file handling for business-level data
- secure, scalable deployment

## 2. Recommended architecture

### High-level overview

Client → Frontend → FastAPI API → Business Services → PostgreSQL
                                   ↓
                              Redis / Queue
                                   ↓
                           Background Workers
                                   ↓
                           Object Storage (S3/MinIO)

### Main components

1. FastAPI application
   - main API layer
   - request validation
   - authentication handling
   - service orchestration

2. PostgreSQL database
   - relational data storage
   - users, organizations, datasets, jobs, audit logs, settings

3. Redis
   - caching
   - background job queue
   - rate limiting
   - session support if needed

4. Background workers
   - file processing
   - cleaning jobs
   - analytics generation
   - notifications

5. Object storage
   - uploaded CSV/Excel files
   - processed files
   - backups and exports

6. Monitoring and observability
   - logs
   - metrics
   - error tracking
   - health checks

## 3. Tech stack

### Backend core
- Python 3.11+
- FastAPI
- Uvicorn / Gunicorn
- Pydantic
- SQLAlchemy or SQLModel
- Alembic
- AsyncPG
- python-jose / passlib / bcrypt

### Database
- PostgreSQL 15+
- pgAdmin or DBeaver for management

### Background jobs
- Celery with Redis
- or RQ with Redis

### File handling
- pandas
- openpyxl / xlrd
- pyarrow
- python-multipart

### Storage and deployment
- S3-compatible storage (AWS S3 or MinIO)
- Docker
- Docker Compose for development
- Nginx / Traefik for reverse proxy
- GitHub Actions for CI/CD

## 4. Backend module structure

A clean backend structure should look like this:

```text
app/
  main.py
  api/
    v1/
      auth.py
      users.py
      datasets.py
      jobs.py
      analytics.py
      health.py
  core/
    config.py
    security.py
    database.py
    logging.py
  models/
    user.py
    organization.py
    dataset.py
    dataset_version.py
    cleaning_job.py
    audit_log.py
  schemas/
    user.py
    dataset.py
    job.py
    analytics.py
  services/
    auth_service.py
    upload_service.py
    cleaning_service.py
    analytics_service.py
    notification_service.py
  workers/
    cleaning_worker.py
    analytics_worker.py
  tests/
```

## 5. Core features to implement

### A. Authentication and user management
- signup/login
- email/password auth
- JWT access and refresh tokens
- password reset flow
- role-based access control
- admin and user roles

### B. Organization and team management
- users belong to organizations
- team members with different permissions
- workspace-based data isolation

### C. Dataset management
- upload CSV/Excel files
- file metadata storage
- file status: uploaded, processing, completed, failed
- dataset version history
- delete/restore support

### D. Data cleaning pipeline
- detect missing values
- remove duplicates
- normalize column names
- infer data types
- standardize dates and text
- outlier detection basics
- cleaning rule templates

### E. Job processing system
- asynchronous jobs for large files
- progress tracking
- failure handling and retries
- job logs and status updates

### F. Analytics and reporting
- row/column counts
- data quality score
- duplicate rate
- missing value rate
- cleaning summary report
- dashboard metrics

### G. Audit and history
- every important action logged
- dataset history
- user activity log
- audit trail for compliance

### H. Notifications
- email or in-app notifications
- job completion alerts
- error alerts
- password reset emails

## 6. PostgreSQL database design

### Main tables

#### users
- id
- email
- password_hash
- full_name
- is_active
- is_admin
- created_at
- updated_at

#### organizations
- id
- name
- owner_id
- created_at

#### memberships
- id
- organization_id
- user_id
- role

#### datasets
- id
- organization_id
- owner_id
- filename
- original_filename
- storage_path
- file_type
- row_count
- column_count
- status
- created_at

#### dataset_versions
- id
- dataset_id
- version_number
- cleaned_file_path
- quality_score
- summary_json
- created_at

#### cleaning_jobs
- id
- dataset_id
- user_id
- status
- started_at
- completed_at
- progress
- error_message

#### audit_logs
- id
- user_id
- action
- entity_type
- entity_id
- created_at

#### settings
- id
- organization_id
- theme_preferences
- notification_preferences
- created_at

## 7. API design plan

### Authentication endpoints
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/forgot-password
- POST /auth/reset-password

### Dataset endpoints
- POST /datasets/upload
- GET /datasets
- GET /datasets/{id}
- DELETE /datasets/{id}
- GET /datasets/{id}/history
- POST /datasets/{id}/clean

### Job endpoints
- GET /jobs
- GET /jobs/{id}
- POST /jobs/{id}/cancel

### Analytics endpoints
- GET /analytics/dashboard
- GET /analytics/datasets/{id}

### User endpoints
- GET /users/me
- PUT /users/me
- GET /users

## 8. Security plan

- use HTTPS everywhere
- hash passwords with bcrypt or argon2
- use JWT with short access tokens and refresh tokens
- enforce role-based permissions
- validate all upload types
- limit file size
- scan files for malicious content if needed
- log suspicious actions
- use environment variables for secrets

## 9. Deployment plan

### Development environment
- FastAPI local server
- PostgreSQL via Docker Compose
- Redis via Docker Compose
- MinIO for local file storage

### Production environment
- deploy API on Docker containers
- run PostgreSQL on managed service or VPS
- store files in AWS S3 or similar cloud storage
- use Nginx/Traefik as reverse proxy
- use CI/CD pipelines for deployment
- add monitoring and backups

## 10. Roadmap for development

### Phase 1 — Foundation
- set up project structure
- create FastAPI app
- configure PostgreSQL connection
- add environment configuration
- create health check endpoint
- add Docker setup

### Phase 2 — Authentication
- signup/login API
- JWT auth
- password reset flow
- basic user profile endpoints

### Phase 3 — Database and models
- create SQLAlchemy models
- create Alembic migrations
- connect frontend user flow to backend

### Phase 4 — File upload system
- upload CSV/Excel files
- validate file format
- save files to storage
- store metadata in PostgreSQL

### Phase 5 — Background processing
- create job queue
- process uploaded files asynchronously
- track job progress
- handle failures and retries

### Phase 6 — Data cleaning engine
- missing values handling
- duplicate removal
- type inference
- column normalization
- basic cleaning rules

### Phase 7 — Analytics and reporting
- quality metrics
- dataset summaries
- dashboard stats
- generated reports

### Phase 8 — History and audit trail
- dataset version history
- user action logs
- audit trail API

### Phase 9 — Security and production hardening
- RBAC
- rate limiting
- logging
- monitoring
- backup strategy

### Phase 10 — Scale and optimization
- caching
- database indexing
- async processing improvements
- container orchestration if needed

## 11. Recommended development order

Start with this order:
1. auth system
2. database models
3. upload API
4. job queue
5. cleaning engine
6. analytics API
7. production hardening

Do not try to build everything at once. Build the MVP first, then scale.

## 12. MVP version recommendation

For the first release, build only:
- signup/login
- upload CSV/Excel files
- basic cleaning workflow
- job status tracking
- dataset history
- dashboard summary metrics

That MVP will already be valuable for a client demo.

## 13. Final recommendation

Use FastAPI + PostgreSQL as the core foundation.

For a serious business product, build it in layers:
- API layer for frontend communication
- service layer for business logic
- worker layer for heavy processing
- database layer for persistence
- object storage for files

This structure will make the system easier to expand later for enterprise features.
