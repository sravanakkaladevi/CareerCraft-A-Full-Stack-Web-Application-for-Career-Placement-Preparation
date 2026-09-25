# 🚀 CareerCraft — Full-Stack Web Application for Career Placement Preparation

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Django](https://img.shields.io/badge/Django-5.0-092E20?logo=django)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.14-red?logo=django)](https://www.django-rest-framework.org/)

**CareerCraft** is an end-to-end, production-ready Full-Stack Career Placement Preparation Platform. Designed for students, freshers, job seekers, and experienced professionals, it offers resume building, ATS keyword scanning, AI mock interviews, domain skill projects, learning roadmaps, and an integrated **AI Agent (Beta)**.

---

## ✨ Key Features

1. **Personalized Onboarding Q&A & Interest-Based Workspace**:
   - Interactive 3-step onboarding questionnaire on registration/login.
   - Collects role status (*Student, Fresher, Experienced, Career Switcher*), target career goal (*Full-Stack Developer, AI/ML Specialist, etc.*), and tech interests.
   - Dynamically filters workspace content, courses, skill projects, and interview questions tailored specifically to each user's career aim.

2. **AI Career Agent (Beta & Custom API Key Integration)**:
   - Integrated AI Agent for instant resume optimization, ATS keyword recommendations, and STAR-method interview practice.
   - Out-of-the-box simulated AI engine + support for custom **OpenAI** (`sk-...`) and **Google Gemini** (`AIza...`) API keys.

3. **LaTeX & PDF Resume Builder (Resume Forge)**:
   - Multi-template gallery (*ATS Clean, Tech Developer, Classic Corporate*).
   - Real-time live PDF preview, drag-and-drop section reordering, version history, and clean single-scrollbar PDF rendering.

4. **ATS Scanner & Matcher**:
   - Parses resume content against target job descriptions.
   - Calculates percentage ATS match score and provides missing keyword alerts.

5. **AI-Powered Mock Interview Simulator**:
   - Timed practice tests across Data Structures, Algorithms, Web Development, Python, DBMS, System Design, and OS.
   - Instant scoring, detailed solution explanations, and performance metrics.

6. **Skill Assessment & Project Incubator**:
   - Blueprints for 8 domain projects with technology stacks, system architectures, and GitHub reference code.

7. **Developer Learning Hub**:
   - Structured roadmaps, syntax cheat sheets, coding lessons, and tech articles.

8. **Admin Control Center**:
   - Comprehensive CRUD operations (Create, Edit, Delete) for Users, Resumes, ATS Scans, Mock Interviews, Learning Courses, Skill Projects, and Job Postings.
   - Seamless **"← Back to User App"** button for quick admin navigation.

---

## 🏗️ Architecture Overview

```text
               ┌──────────────────────────────────────────┐
               │    React 19 + TypeScript + Vite SPA      │
               │         (Port 5173 / Production)         │
               └────────────────────┬─────────────────────┘
                                    │  REST API (CORS Enabled)
                                    ▼
               ┌──────────────────────────────────────────┐
               │         Django REST Framework API        │
               │                (Port 8000)               │
               └───┬────────────────┬─────────────────┬───┘
                   │                │                 │
                   ▼                ▼                 ▼
          ┌────────────────┐┌──────────────┐┌──────────────────┐
          │ SQLite / Postgres││ ReportLab PDF││  AI Agent Beta   │
          │   Database     ││  PDF Engine  ││ (Custom LLM Key) │
          └────────────────┘└──────────────┘└──────────────────┘
```

---

## 🛠️ Prerequisites & Download Links

Before running CareerCraft locally, ensure you have installed the following:

| Tool / Dependency | Logo Badge | Recommended Version | Official Download Link |
| :--- | :---: | :--- | :--- |
| **Node.js** (includes npm) | ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white) | `v18.0` or higher | [Download Node.js](https://nodejs.org/en/download/) |
| **Python** | ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) | `v3.10` or higher | [Download Python](https://www.python.org/downloads/) |
| **MiKTeX / LaTeX Compiler** | ![LaTeX](https://img.shields.io/badge/LaTeX_MiKTeX-008080?logo=latex&logoColor=white) | Latest | [Download MiKTeX (LaTeX Engine)](https://miktex.org/download) |
| **Docker Desktop** (Optional) | ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) | Latest | [Download Docker Desktop](https://www.docker.com/products/docker-desktop/) |
| **Git** | ![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white) | Latest | [Download Git](https://git-scm.com/downloads) |
| **VS Code** (Optional IDE) | ![VS Code](https://img.shields.io/badge/VS_Code-007ACC?logo=visualstudiocode&logoColor=white) | Latest | [Download VS Code](https://code.visualstudio.com/) |

---

## ⚡ Quick Start & Local Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/sravanakkaladevi/CareerCraft-A-Full-Stack-Web-Application-for-Career-Placement-Preparation.git
cd CareerCraft-A-Full-Stack-Web-Application-for-Career-Placement-Preparation
```

---

### 2. Backend Setup (Django REST Framework)

#### On Windows (PowerShell / Command Prompt):
```powershell
# Create & Activate Virtual Environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Dependencies
pip install django djangorestframework django-cors-headers reportlab pillow pydantic

# Run Database Migrations
python manage.py migrate

# Seed Default Sample Data & Super Admin
python scratch/seed_sravan.py

# Start Django Backend Server
python manage.py runserver 0.0.0.0:8000
```

#### On macOS / Linux:
```bash
# Create & Activate Virtual Environment
python3 -m venv venv
source venv/bin/activate

# Install Dependencies
pip install django djangorestframework django-cors-headers reportlab pillow pydantic

# Run Database Migrations
python3 manage.py migrate

# Seed Default Sample Data & Super Admin
python3 scratch/seed_sravan.py

# Start Django Backend Server
python3 manage.py runserver 0.0.0.0:8000
```

* Backend API Root: `http://127.0.0.1:8000/api/`

---

### 3. Frontend Setup (React 19 + TypeScript + Vite)

In a new terminal window:

```bash
cd resumeforge-frontend

# Install Dependencies
npm install

# Start Vite Development Server
npm run dev
```

* Frontend Web App: `http://localhost:5173/`

---

## 🤖 AI Agent (Beta) & Custom LLM Setup

1. Open CareerCraft in your browser at `http://localhost:5173/`.
2. Click the **AI Agent (Beta)** button in the top navbar or bottom corner.
3. Out of the box, the simulated AI Career Agent functions automatically.
4. To connect your custom LLM API key:
   - Open the **API Key Settings** tab inside the AI Agent modal.
   - Enter your **OpenAI API Key** (`sk-proj-...`) or **Google Gemini Key** (`AIzaSy...`).
   - Click **Save API Key Settings**.



## 🚀 Pushing Changes to GitHub

To push your latest changes to GitHub:

```bash
git add .
git commit -m "Add personalized onboarding Q&A, interest-based content filtering, AI Agent (Beta) module with API Key setup, and updated README documentation"
git push origin main
```

---

## 📄 License & Maintainer

Developed for complete developer placement preparation, resume engineering, and career acceleration.

* **Repository**: [CareerCraft GitHub Repository](https://github.com/sravanakkaladevi/CareerCraft-A-Full-Stack-Web-Application-for-Career-Placement-Preparation)
* **Author / Maintainer**: Sravan Kumar
