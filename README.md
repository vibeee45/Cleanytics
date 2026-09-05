<div align="center">

# Cleanytics

### AI-Powered Data Cleaning & Analytics Platform

<br>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=21&duration=3000&pause=1000&color=06B6D4&center=true&vCenter=true&width=700&lines=Clean+Data.+Better+Insights.;Upload+%E2%86%92+Clean+%E2%86%92+Analyze;AI-Powered+Data+Cleaning;Smart+Analytics+Dashboard;Built+with+React+%26+FastAPI" alt="Typing Animation"/>

<br><br>

<a href="https://github.com/vibeee45/Cleanytics">
<img src="https://img.shields.io/badge/⭐%20GitHub-Cleanytics-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</a>

<a href="#-team-members">
<img src="https://img.shields.io/badge/Team-3%20Members-06b6d4?style=for-the-badge" alt="Team"/>
</a>

<a href="#-project-information">
<img src="https://img.shields.io/badge/Version-2.0-2563eb?style=for-the-badge" alt="Version"/>
</a>

<br><br>

<img src="https://img.shields.io/badge/Status-Active%20Development-f59e0b?style=for-the-badge"/>
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>

<br><br>

<hr>

</div>

## 📊 Turn Messy Data Into Meaningful Insights

**Cleanytics** is an AI-powered data cleaning and analytics platform designed to transform messy CSV and Excel datasets into clean, structured, and meaningful information.

The platform combines a modern React frontend with a FastAPI backend to provide authentication, dataset management, analytics, audit logging, health monitoring, and background job tracking.

---

## 📌 About Cleanytics

Cleanytics aims to make data cleaning and analysis easier for users who work with large or messy datasets.

### 🎯 Main Goal

> **Upload your data → Clean it → Analyze it → Get better insights.**

### Typical Workflow

```
User
 │
 ▼
Login / Register
 │
 ▼
Upload CSV / Excel
 │
 ▼
Dataset Processing
 │
 ▼
Data Cleaning
 │
 ▼
Analytics & Quality
 │
 ▼
Dashboard
 │
 ▼
History / Audit / Export
```

---

## ✨ Key Features

<table>
<tr>

<td align="center" width="33%">

<h2>🔐</h2>

<h3>Authentication</h3>

User registration, login, token refresh and password recovery.

</td>

<td align="center" width="33%">

<h2>📁</h2>

<h3>Dataset Management</h3>

Upload and manage CSV and Excel datasets.

</td>

<td align="center" width="33%">

<h2>📊</h2>

<h3>Analytics</h3>

Dashboard statistics and dataset-level analytics.

</td>

</tr>

<tr>

<td align="center">

<h2>🧹</h2>

<h3>Data Cleaning</h3>

Dataset processing and quality tracking.

</td>

<td align="center">

<h2>📝</h2>

<h3>Audit History</h3>

Track user actions and application activity.

</td>

<td align="center">

<h2>⚡</h2>

<h3>Background Jobs</h3>

Track long-running dataset processing tasks.

</td>

</tr>

<tr>

<td align="center">

<h2>❤️</h2>

<h3>Health Monitoring</h3>

Monitor backend and database availability.

</td>

<td align="center">

<h2>👤</h2>

<h3>User Management</h3>

Manage user profiles and admin access.

</td>

<td align="center">

<h2>📈</h2>

<h3>Dashboard</h3>

View dataset statistics and quality information.

</td>

</tr>
</table>

---

## 🚀 Version 2 Updates

| Update                 | Status |
| :--------------------- | :----: |
| Dashboard              |    ✅   |
| Dashboard Triggers     |    ✅   |
| Dashboard Interactions |    ✅   |
| UI Improvements        |    ✅   |
| Bug Fixes              |    ✅   |
| Localhost Support      |    ✅   |
| Frontend Integration   |    ✅   |
| FastAPI Backend        |    ✅   |
| API v1 Structure       |    ✅   |
| Database Integration   |   🔄   |
| Advanced Data Cleaning |   🔄   |
| AI Cleaning Engine     |   🔮   |

---

## 🏗️ System Architecture

<div align="center">

```
┌──────────────────────────────────────┐
│          React 19 Frontend           │
│                                      │
│  Login • Dashboard • Analytics       │
│  History • Settings • Upload         │
└──────────────────┬───────────────────┘
                   │
                   │ REST API
                   ▼
┌──────────────────────────────────────┐
│          FastAPI Backend             │
│                                      │
│              /api/v1                 │
│                                      │
│  Auth • Users • Datasets             │
│  Analytics • Audit • Jobs • Health    │
└──────────────────┬───────────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│    Database     │  │ Background Jobs │
│                 │  │                 │
│ PostgreSQL      │  │ Celery          │
│ SQLite Fallback │  │ Task Tracking   │
└─────────────────┘  └─────────────────┘
```

</div>

---

# ⚙️ Backend API

The Cleanytics backend provides a versioned API layer located at:

```
Backend/app/api/v1/
```

### API Modules

```
Backend/
└── app/
    └── api/
        └── v1/
            ├── __init__.py
            ├── analytics.py
            ├── audit.py
            ├── auth.py
            ├── datasets.py
            ├── health.py
            ├── jobs.py
            └── users.py
```

---

## 🔐 `auth.py` — Authentication

**Location:**

```
Backend/app/api/v1/auth.py
```

### Use

Handles user authentication and account security.

### Responsibilities

* User registration
* User login
* Access token generation
* Refresh token handling
* Password recovery
* Password reset
* Authentication rate limiting

### Main Routes

```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
```

[View auth.py](https://github.com/vibeee45/Cleanytics/blob/main/Backend/app/api/v1/auth.py)

---

## 📁 `datasets.py` — Dataset Management

**Location:**

```
Backend/app/api/v1/datasets.py
```

### Use

Handles CSV and Excel dataset uploads and dataset management.

### Responsibilities

* Upload datasets
* Process uploaded files
* Store dataset metadata
* Create dataset versions
* List user datasets
* Preview dataset information

### Main Routes

```
POST /datasets/upload
GET  /datasets
GET  /datasets/{dataset_id}
```

### Dataset Flow

```
CSV / Excel
     │
     ▼
Upload API
     │
     ▼
File Processing
     │
     ▼
Dataset Metadata
     │
     ▼
Dataset Version
     │
     ▼
Database
```

[View datasets.py](https://github.com/vibeee45/Cleanytics/blob/main/Backend/app/api/v1/datasets.py)

---

## 📊 `analytics.py` — Analytics

**Location:**

```
Backend/app/api/v1/analytics.py
```

### Use

Provides dashboard and dataset-level analytics.

### Responsibilities

* Dashboard statistics
* Dataset statistics
* Data quality information
* Row and column counts
* Storage information
* Dataset summaries

### Main Routes

```
GET /analytics/dashboard
GET /analytics/datasets/{dataset_id}
```

### Analytics Flow

```
Dataset
   │
   ▼
Latest Dataset Version
   │
   ▼
Data Analysis
   │
   ├── Rows
   ├── Columns
   ├── Quality
   ├── Storage
   └── Summary
   │
   ▼
Analytics API
   │
   ▼
React Dashboard
```

[View analytics.py](https://github.com/vibeee45/Cleanytics/blob/main/Backend/app/api/v1/analytics.py)

---

## 👤 `users.py` — User Management

**Location:**

```
Backend/app/api/v1/users.py
```

### Use

Handles authenticated user profiles and admin-level user management.

### Responsibilities

* Get current user
* Update current user
* Validate access tokens
* Admin authorization
* List users

### Main Routes

```
GET /users/me
PUT /users/me
GET /users
```

### Authorization Flow

```
Access Token
     │
     ▼
Token Validation
     │
     ▼
Find User
     │
     ▼
Authenticated User
     │
     ├── Normal User
     │
     └── Admin User
```

[View users.py](https://github.com/vibeee45/Cleanytics/blob/main/Backend/app/api/v1/users.py)

---

## 📝 `audit.py` — Audit Logs

**Location:**

```
Backend/app/api/v1/audit.py
```

### Use

Provides audit and activity history for authenticated users.

### Responsibilities

* Retrieve audit logs
* Track user actions
* Track entity type
* Track entity ID
* Pagination support

### Main Route

```
GET /audit/logs
```

### Audit Flow

```
User Action
     │
     ▼
Audit Service
     │
     ▼
Audit Log
     │
     ▼
GET /audit/logs
     │
     ▼
History / Activity
```

[View audit.py](https://github.com/vibeee45/Cleanytics/blob/main/Backend/app/api/v1/audit.py)

---

## ❤️ `health.py` — Health Monitoring

**Location:**

```
Backend/app/api/v1/health.py
```

### Use

Checks backend and database availability.

### Main Route

```
GET /health
```

### Health Flow

```
Health Request
      │
      ▼
Database Check
      │
      ├── PostgreSQL
      │
      └── SQLite Fallback
      │
      ▼
Health Status
```

This allows the application to determine whether the backend database connection is available.

[View health.py](https://github.com/vibeee45/Cleanytics/blob/main/Backend/app/api/v1/health.py)

---

## ⚡ `jobs.py` — Background Jobs

**Location:**

```
Backend/app/api/v1/jobs.py
```

### Use

Tracks background dataset-processing tasks.

### Responsibilities

* Track Celery tasks
* Get task status
* Track progress
* Return processing messages
* Return task results

### Main Route

```
GET /jobs/{task_id}
```

### Job Flow

```
Dataset Processing
       │
       ▼
   Celery Task
       │
       ▼
    Task ID
       │
       ▼
GET /jobs/{task_id}
       │
       ▼
┌─────────────────┐
│ Status          │
│ Progress        │
│ Message         │
│ Result          │
└─────────────────┘
```

[View jobs.py](https://github.com/vibeee45/Cleanytics/blob/main/Backend/app/api/v1/jobs.py)

---

## 🧩 API Module Overview

<div align="center">

<table>

<tr>

<td align="center" width="25%">

<h2>🔐</h2>

<b>auth.py</b>

<br><br>

Authentication

</td>

<td align="center" width="25%">

<h2>👤</h2>

<b>users.py</b>

<br><br>

User Management

</td>

<td align="center" width="25%">

<h2>📁</h2>

<b>datasets.py</b>

<br><br>

Dataset Management

</td>

<td align="center" width="25%">

<h2>📊</h2>

<b>analytics.py</b>

<br><br>

Analytics

</td>

</tr>

<tr>

<td align="center">

<h2>📝</h2>

<b>audit.py</b>

<br><br>

Audit Logs

</td>

<td align="center">

<h2>❤️</h2>

<b>health.py</b>

<br><br>

Health Monitoring

</td>

<td align="center">

<h2>⚡</h2>

<b>jobs.py</b>

<br><br>

Background Jobs

</td>

<td align="center">

<h2>🔗</h2>

<b>v1</b>

<br><br>

API Version

</td>

</tr>

</table>

</div>

---

## 🧠 Backend Request Flow

```
                    React Frontend
                          │
                          ▼
                   FastAPI Router
                          │
                          ▼
                     /api/v1
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
      Auth            Datasets          Analytics
        │                 │                 │
        ▼                 ▼                 ▼
      Users            Services         Analysis
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
                       Database
                          │
                          ▼
                  PostgreSQL / SQLite

                          │
                          ▼
                     Celery Jobs
                          │
                          ▼
                  Background Tasks
```

---

# 🛠️ Tech Stack

## 🎨 Frontend

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,js,html,css" />

<br><br>

<img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>

</div>

---

## ⚙️ Backend

<div align="center">

<img src="https://skillicons.dev/icons?i=python,fastapi" />

<br><br>

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
<img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white"/>
<img src="https://img.shields.io/badge/Pydantic-E92063?style=for-the-badge"/>

</div>

---

## 🗄️ Database

<div align="center">

<img src="https://skillicons.dev/icons?i=postgresql,sqlite" />

<br><br>

<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white"/>

</div>

---

## ⚡ Background Processing

<div align="center">

<img src="https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white"/>
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"/>

</div>

---

## 📊 Data Processing

<div align="center">

<img src="https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white"/>

</div>

---

## 🔧 Development Tools

<div align="center">

<img src="https://skillicons.dev/icons?i=git,github,npm,vscode" />

<br><br>

<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"/>
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/>
<img src="https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>

</div>

---

# 📁 Project Structure

```
Cleanytics/
│
├── Frontend/
│   └── LoginNew/
│       ├── src/
│       │   ├── components/
│       │   ├── screens/
│       │   ├── styles/
│       │   ├── App.jsx
│       │   └── main.jsx
│       │
│       ├── package.json
│       └── vite.config.js
│
├── Backend/
│   └── app/
│       ├── api/
│       │   └── v1/
│       │       ├── __init__.py
│       │       ├── analytics.py
│       │       ├── audit.py
│       │       ├── auth.py
│       │       ├── datasets.py
│       │       ├── health.py
│       │       ├── jobs.py
│       │       └── users.py
│       │
│       ├── core/
│       ├── models/
│       ├── schemas/
│       ├── services/
│       └── workers/
│
├── run_project.bat
│
└── README.md
```

---

# 💻 How to Run

## ⚡ Frontend

```bash
cd Frontend/LoginNew
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## ⚙️ Backend

```bash
cd Backend
```

Create virtual environment:

```bash
python -m venv .venv
```

Activate on Windows:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server using the project's configured backend entry point.

FastAPI documentation:

```
http://localhost:8000/docs
```

Alternative documentation:

```
http://localhost:8000/redoc
```

---

# 🪟 Windows Quick Start

You can also start the project using:

```
run_project.bat
```

Double-click:

```
run_project.bat
```

Then open the localhost URL shown in the terminal.

---

# 🔗 API Base Structure

```
/api/v1/
```

Main API groups:

```
/api/v1/auth
/api/v1/users
/api/v1/datasets
/api/v1/analytics
/api/v1/audit
/api/v1/jobs
/health
```

---

# 🔐 Security

Cleanytics includes authentication and authorization features such as:

* Access tokens
* Refresh tokens
* Bearer authentication
* Authenticated user validation
* Admin authorization
* Password reset flow
* Authentication rate limiting
* Dataset upload protection

---

# 📊 Data Processing Flow

```
CSV / Excel File
       │
       ▼
Dataset Upload API
       │
       ▼
Upload Service
       │
       ▼
Dataset Metadata
       │
       ▼
Dataset Version
       │
       ▼
Background Processing
       │
       ▼
Data Cleaning
       │
       ▼
Quality Analysis
       │
       ▼
Analytics API
       │
       ▼
Dashboard
```

---

# 👥 Team Members

<div align="center">

<table>
<tr>

<td align="center" width="30%">

<a href="https://github.com/Janmejay2005">

<img src="https://github.com/Janmejay2005.png" width="90" height="90" alt="Janmejay Kumar Singh"/>

</a>

<br><br>

<b>Janmejay Kumar Singh</b>

<br><br>

<img src="https://img.shields.io/badge/Project%20Coordinator%20%26%20Tester-2563eb?style=flat-square"/>

<br><br>

<a href="https://github.com/Janmejay2005">
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/>
</a>

<a href="https://www.linkedin.com/in/janmejay-kumar-singh-ab50b1272">
<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white"/>
</a>

</td>

<td align="center" width="30%">

<a href="https://github.com/vibeee45">

<img src="https://github.com/vibeee45.png" width="90" height="90" alt="Vansh Bhardwaj"/>

</a>

<br><br>

<b>Vansh Bhardwaj</b>

<br><br>

<img src="https://img.shields.io/badge/Backend%20%26%20Database%20Connection-06b6d4?style=flat-square"/>

<br><br>

<a href="https://github.com/vibeee45">
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/>
</a>

<a href="https://www.linkedin.com/in/vansh-bhardwaj-526731325">
<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white"/>
</a>

</td>

<td align="center" width="30%">

<a href="https://github.com/chaurasiyalucky241-cmd">

<img src="https://github.com/chaurasiyalucky241-cmd.png" width="90" height="90" alt="Lucky Chaurasiya"/>

</a>

<br><br>

<b>Lucky Chaurasiya</b>

<br><br>

<img src="https://img.shields.io/badge/Frontend%20%26%20Database-7c3aed?style=flat-square"/>

<br><br>

<a href="https://github.com/chaurasiyalucky241-cmd">
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/>
</a>

<a href="https://www.linkedin.com/in/lucky-chaurasiya-97946336b">
<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white"/>
</a>

</td>

</tr>
</table>

</div>

---

# 🚀 Roadmap

| Phase | Feature                  | Status |
| :---: | :----------------------- | :----: |
|   01  | Frontend UI              |    ✅   |
|   02  | Dashboard                |    ✅   |
|   03  | Dashboard Triggers       |    ✅   |
|   04  | Authentication API       |    ✅   |
|   05  | Dataset API              |    ✅   |
|   06  | Analytics API            |    ✅   |
|   07  | User API                 |    ✅   |
|   08  | Audit API                |    ✅   |
|   09  | Health API               |    ✅   |
|   10  | Background Jobs API      |    ✅   |
|   11  | Advanced Cleaning Engine |   🔄   |
|   12  | AI Data Cleaning         |   🔮   |
|   13  | Advanced Data Quality    |   🔮   |
|   14  | Cloud Deployment         |   🔮   |

---

# 🌟 Future Improvements

### 🤖 AI

* AI-powered automatic data cleaning
* Smart anomaly detection
* Intelligent data quality suggestions
* Automated data transformation
* AI-generated dataset insights

### 📊 Analytics

* Advanced charts
* Real-time analytics
* Data quality reports
* Custom dashboards
* Advanced statistical analysis

### 🧹 Data Cleaning

* Missing-value suggestions
* Duplicate detection
* Outlier detection
* Data normalization
* Automated column type detection

### ☁️ Infrastructure

* Cloud deployment
* Scalable database
* Production Redis
* Distributed Celery workers
* Monitoring and logging

---

# 📋 Project Information

<div align="center">

<table>

<tr>
<th>Property</th>
<th>Details</th>
</tr>

<tr>
<td><b>Project Name</b></td>
<td>Cleanytics</td>
</tr>

<tr>
<td><b>Version</b></td>
<td>2.0</td>
</tr>

<tr>
<td><b>Frontend</b></td>
<td>React 19 + Vite</td>
</tr>

<tr>
<td><b>Backend</b></td>
<td>FastAPI + Python</td>
</tr>

<tr>
<td><b>Database</b></td>
<td>PostgreSQL / SQLite</td>
</tr>

<tr>
<td><b>Data Processing</b></td>
<td>Pandas</td>
</tr>

<tr>
<td><b>Background Processing</b></td>
<td>Celery</td>
</tr>

<tr>
<td><b>API Version</b></td>
<td>v1</td>
</tr>

<tr>
<td><b>Project Coordinator & Tester</b></td>
<td>Janmejay Kumar Singh</td>
</tr>

<tr>
<td><b>Backend & Database Connection</b></td>
<td>Vansh Bhardwaj</td>
</tr>

<tr>
<td><b>Frontend & Database</b></td>
<td>Lucky Chaurasiya</td>
</tr>

</table>

</div>

---

# 🔗 Important Links

<div align="center">

<a href="https://github.com/vibeee45/Cleanytics">
<img src="https://img.shields.io/badge/⭐%20Main%20Repository-181717?style=for-the-badge&logo=github&logoColor=white"/>
</a>

<a href="https://github.com/vibeee45/Cleanytics/tree/main/Backend/app/api/v1">
<img src="https://img.shields.io/badge/⚙️%20Backend%20API%20v1-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
</a>

</div>

---

# 📝 Project Status

Cleanytics is actively being developed as a complete data cleaning and analytics platform.

The project currently combines:

```
React Frontend
      +
FastAPI Backend
      +
Database Layer
      +
Dataset APIs
      +
Analytics APIs
      +
Authentication
      +
Audit Logs
      +
Background Jobs
```

The next major focus is expanding the data-cleaning engine, improving analytics, and introducing AI-powered data quality and transformation features.

---

<div align="center">

## Clean Data. Better Insights.

<br>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=19&duration=3000&pause=1000&color=06B6D4&center=true&vCenter=true&width=650&lines=Build+Smarter.;Clean+Better.;Analyze+Faster.;Cleanytics+Team" alt="Footer Animation"/>

<br><br>

<a href="https://github.com/vibeee45/Cleanytics">

<img src="https://img.shields.io/badge/⭐%20Star%20Cleanytics-06b6d4?style=for-the-badge&logo=github&logoColor=white"/>

</a>

<br><br>

<b>Made with React • FastAPI • Python • Data</b>

</div>
