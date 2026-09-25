
# ResumeForge — Antigravity Development Specification

## 1. PROJECT CONTEXT

Build a production-quality web application called:

**ResumeForge — Intelligent Resume Builder & Document Generation Platform**

This is a dedicated resume engineering platform for students, freshers, and early-career developers.

The existing CareerCraft project already contains career preparation modules including resume building and ATS functionality. Do NOT copy CareerCraft's UI, navigation, visual design, dashboard structure, or implementation.

ResumeForge must be a separate product with a different visual identity and architecture.

The core technical problem is:

```text
Structured Resume Data
        ↓
Resume Template Engine
        ↓
LaTeX Generation
        ↓
Isolated LaTeX Compilation
        ↓
PDF
        ↓
Live Preview
        ↓
Download / Version
```

The product must feel like a modern professional document editor, not a college CRUD project.

---

# 2. REQUIRED ARCHITECTURE

## Frontend

Use:

* React
* TypeScript
* Vite
* Tailwind CSS
* Coconut UI where appropriate
* shadcn/ui + Radix primitives where Coconut UI does not provide the required component
* Lucide React
* Motion for React animations
* React Hook Form
* Zod
* TanStack Query
* React Router
* React-PDF
* Sonner
* dnd-kit

Frontend architecture:

```text
React + TypeScript
        ↓
React Router
        ↓
Feature-based components
        ↓
React Hook Form + Zod
        ↓
TanStack Query
        ↓
REST API
```

Do not put all application logic inside one component.

Use a feature-oriented structure:

```text
src/
├── app/
├── components/
├── features/
│   ├── auth/
│   ├── resume/
│   ├── editor/
│   ├── templates/
│   ├── preview/
│   ├── job-analysis/
│   └── settings/
├── hooks/
├── lib/
├── services/
├── types/
├── routes/
└── styles/
```

---

# 3. BACKEND ARCHITECTURE

Use:

```text
Django
Django REST Framework
PostgreSQL
Redis
Celery
```

Architecture:

```text
React Frontend
      ↓
REST API
      ↓
Django REST Framework
      ↓
PostgreSQL
      ↓
Redis
      ↓
Celery Worker
      ↓
LaTeX Compilation Worker
      ↓
Generated PDF
```

Do not make the frontend communicate directly with PostgreSQL.

Do not expose the LaTeX compiler to the browser.

---

# 4. DOCUMENT GENERATION ARCHITECTURE

The user must NEVER need to understand LaTeX.

The user enters normal form data:

```text
Name
Email
Education
Projects
Skills
Experience
Certifications
```

The backend converts this structured data into a controlled LaTeX template.

Example:

```text
User Data
    ↓
Resume JSON
    ↓
Template Renderer
    ↓
Controlled LaTeX Source
    ↓
Compilation Queue
    ↓
Celery
    ↓
Isolated LaTeX Worker
    ↓
PDF
```

Do not allow arbitrary user-submitted LaTeX compilation.

Escape user content before inserting it into templates.

---

# 5. PDF COMPILATION

LaTeX compilation must be isolated.

Use Docker for the compilation worker.

The worker must have:

* Temporary working directory
* Restricted filesystem access
* Execution timeout
* Memory/resource limits where practical
* No unnecessary network access
* Cleanup after compilation
* Controlled compiler commands

The main Django application must not directly execute arbitrary LaTeX submitted by users.

Compilation states:

```text
QUEUED
PROCESSING
SUCCESS
FAILED
```

The frontend should display the current state.

---

# 6. PDF PREVIEW

Use React-PDF to display generated PDF documents.

The preview area must support:

* Page navigation
* Zoom
* Fit width
* Page count
* Loading state
* Compilation error state
* Empty state

The preview should update after successful generation.

Do not fake a PDF preview using HTML.

The actual generated PDF must be displayed.

---

# 7. PRIMARY UI CONCEPT

Do NOT build a generic admin dashboard.

The main product experience should resemble a professional document editor.

Desktop layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ ResumeForge       Resume: Python Developer       Save ●      │
│                                              Generate PDF     │
├───────────────────────┬──────────────────────────────────────┤
│                       │                                      │
│  RESUME SECTIONS      │             PDF PREVIEW              │
│                       │                                      │
│  ◉ Personal           │       ┌──────────────────────┐       │
│  ◉ Summary            │       │                      │       │
│  ◉ Education          │       │      RESUME          │       │
│  ◉ Experience         │       │                      │       │
│  ◉ Projects           │       │      Preview         │       │
│  ◉ Skills             │       │                      │       │
│  ◉ Certifications     │       │                      │       │
│                       │       └──────────────────────┘       │
│  + Add Section        │                                      │
│                       │        Zoom  −  100%  +              │
└───────────────────────┴──────────────────────────────────────┘
```

This editor is the heart of the application.

---

# 8. VISUAL DESIGN

Create a modern SaaS/document-editor aesthetic.

Avoid:

* Generic Bootstrap dashboards
* Excessive gradients
* Excessive glassmorphism
* Giant cards everywhere
* Excessive animations
* College-project appearance
* Copying CareerCraft's visual design

Use:

* Strong typography
* White/neutral document canvas
* Dark application chrome where appropriate
* Subtle borders
* Soft shadows
* High information density
* Clear spacing
* Professional editor controls
* Small micro-interactions
* Keyboard-friendly controls

The generated resume itself must remain visually professional and printable.

---

# 9. COLOR SYSTEM

Use a restrained professional palette.

Application UI:

* Neutral background
* White editor surfaces
* Dark text
* Muted secondary text
* One primary accent
* Semantic success/warning/error colors

Do not use five different accent colors.

The PDF preview should look like an actual A4 paper sheet.

---

# 10. LANDING PAGE

Create a separate marketing landing page.

Hero:

```text
Build once.
Generate a professional resume anywhere.

Create structured resumes, switch templates,
preview the real PDF, and tailor your resume
to the job you're applying for.
```

Primary CTA:

```text
Create Resume
```

Secondary CTA:

```text
Explore Templates
```

Show an animated resume preview.

Use Motion for:

* Hero entrance
* Resume paper reveal
* Template transitions
* Section animations
* CTA hover states
* Scroll reveal

Animations must be subtle and fast.

---

# 11. DASHBOARD

The dashboard should NOT resemble CareerCraft.

Keep it document-focused.

Display:

```text
Your Resumes

[ Create New Resume ]

Python Developer
Updated 2 hours ago
Version 3
[Edit] [Preview] [Duplicate]

Backend Developer
Updated yesterday
Version 2
[Edit] [Preview] [Duplicate]
```

Also show:

```text
Recent Documents
Templates
Job Analyses
```

No learning cards.

No interview cards.

No roadmap cards.

No placement preparation modules.

---

# 12. RESUME EDITOR

The editor should support:

## Personal Information

* Name
* Email
* Phone
* Location
* LinkedIn
* GitHub
* Portfolio

## Professional Summary

Textarea with character guidance.

## Education

Repeatable entries.

Support:

```text
Add
Edit
Delete
Reorder
```

## Experience

Repeatable entries.

## Projects

Repeatable entries.

Each project:

* Name
* Description
* Technologies
* GitHub URL
* Live URL
* Bullet points

## Skills

Categorized skills.

Example:

```text
Programming
Python, Java, C

Frameworks
Django, FastAPI

Databases
PostgreSQL, SQLite

Tools
Git, Docker, Linux
```

## Certifications

Repeatable entries.

## Achievements

Optional.

## Custom Section

Allow the user to add an optional custom section.

---

# 13. DRAG AND DROP

Use dnd-kit for section ordering.

Example:

```text
☷ Personal
☷ Summary
☷ Education
☷ Projects
☷ Skills
☷ Certifications
```

Dragging a section changes the generated resume order.

Do not implement fake drag-and-drop.

Persist the section ordering.

---

# 14. TEMPLATE SYSTEM

Templates are not hardcoded into React.

Template metadata comes from the backend.

Example:

```json
{
  "id": 1,
  "name": "Minimal ATS",
  "category": "ATS",
  "preview": "/templates/minimal.png",
  "supported_sections": [
    "summary",
    "education",
    "experience",
    "projects",
    "skills"
  ]
}
```

Templates should contain controlled LaTeX source.

The user selects:

```text
Minimal ATS
Modern Developer
Classic Professional
Technical Resume
```

Start with 3 templates.

Do not build 20 templates initially.

---

# 15. JOB DESCRIPTION ANALYZER

Provide a dedicated interface:

```text
Paste Job Description

┌────────────────────────────────────────┐
│ Python Developer                       │
│                                        │
│ We are looking for a developer with    │
│ Python, Django, PostgreSQL...          │
└────────────────────────────────────────┘

[Analyze Job]
```

Results:

```text
JOB MATCH ANALYSIS

Present
✓ Python
✓ Django
✓ Git
✓ REST API

Partially represented
◐ PostgreSQL

Missing
○ Docker
○ Redis
```

Never invent a skill or experience.

The system should identify missing terms, not automatically add false qualifications.

---

# 16. RESUME VERSIONING

Users should be able to create versions.

Example:

```text
Python Developer — v1
Python Developer — v2
Backend Developer — v3
Django Developer — v4
```

Actions:

```text
Rename
Duplicate
Restore
Delete
Download
```

A version should preserve its own structured resume data.

---

# 17. API DESIGN

Use REST API.

Example endpoints:

```text
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/

GET    /api/resumes/
POST   /api/resumes/
GET    /api/resumes/:id/
PATCH  /api/resumes/:id/
DELETE /api/resumes/:id/

GET    /api/resumes/:id/versions/
POST   /api/resumes/:id/versions/

GET    /api/templates/
GET    /api/templates/:id/

POST   /api/resumes/:id/generate/
GET    /api/documents/:id/
GET    /api/documents/:id/status/
GET    /api/documents/:id/download/

POST   /api/job-analysis/
GET    /api/job-analysis/:id/
```

Use serializers, permissions, validation, pagination, and consistent error responses.

---

# 18. DATABASE

Use PostgreSQL.

Core entities:

```text
User
Resume
ResumeVersion
Education
Experience
Project
Skill
Certification
CustomSection
Template
GeneratedDocument
JobDescription
JobKeyword
KeywordMatch
```

Use proper foreign keys and indexes.

Do not store the complete resume as one unstructured text blob.

---

# 19. REDIS + CELERY

Use Redis as the broker/backend where appropriate.

Celery tasks:

```text
generate_resume_pdf
compile_latex
cleanup_temp_files
analyze_job_description
```

Example:

```text
User clicks Generate PDF
        ↓
Django creates GeneratedDocument
        ↓
Celery task queued
        ↓
Redis
        ↓
Worker
        ↓
LaTeX Docker worker
        ↓
PDF generated
        ↓
Status = SUCCESS
        ↓
Frontend refreshes preview
```

---

# 20. FRONTEND STATE

Use:

### React Hook Form

For complex resume forms.

### Zod

For validation.

### TanStack Query

For API data and server state.

### Local React state

For temporary UI state.

Do not put everything into Redux.

Redux is unnecessary for the initial architecture.

---

# 21. ANIMATION RULES

Use:

```bash
npm install motion
```

Use:

```typescript
import { motion, AnimatePresence } from "motion/react";
```

Animations:

* Page transitions
* Section expand/collapse
* Add/remove resume item
* Template selection
* PDF generation state
* Toast notifications
* Modal transitions
* Drag/drop feedback

Avoid animating every text element.

Animation should communicate state, not decorate everything.

---

# 22. ICONS

Use:

```bash
npm install lucide-react
```

Use Lucide icons consistently.

Examples:

```text
FileText
User
GraduationCap
Briefcase
FolderGit2
Code2
Award
Download
Eye
Plus
Trash2
GripVertical
Settings
Sparkles
```

Do not mix five icon libraries.

---

# 23. PDF LIBRARY

Use:

```bash
npm install react-pdf
```

React-PDF is for displaying generated PDFs.

Do NOT use React-PDF to replace the LaTeX backend.

The architecture remains:

```text
LaTeX → PDF
```

not:

```text
React → PDF
```

---

# 24. NOTIFICATION SYSTEM

Use Sonner:

```bash
npm install sonner
```

Examples:

```text
Resume saved
PDF generation started
PDF generated successfully
Failed to generate PDF
Version restored
```

Do not use browser alert().

---

# 25. RESPONSIVE DESIGN

Desktop:

Editor + PDF side by side.

Tablet:

Editor and preview switchable.

Mobile:

Use tabs:

```text
[Edit] [Preview]
```

Do not force a two-column layout onto mobile.

---

# 26. ACCESSIBILITY

Implement:

* Keyboard navigation
* Visible focus states
* Proper labels
* ARIA where required
* Accessible dialogs
* Color contrast
* Reduced-motion support
* Screen-reader-friendly form errors

Do not rely only on color to communicate validation.

---

# 27. PERFORMANCE

Avoid regenerating PDFs on every keystroke.

Use:

```text
Auto-save → structured data
Generate PDF → explicit user action
```

Optionally debounce auto-save.

PDF compilation must happen asynchronously.

---

# 28. ERROR STATES

Every major operation must have:

* Loading state
* Empty state
* Success state
* Error state

Example PDF generation:

```text
Preparing document...
       ↓
Compiling LaTeX...
       ↓
Generating PDF...
       ↓
Ready
```

Failure:

```text
PDF generation failed

The document could not be compiled.

[View details] [Try again]
```

---

# 29. SECURITY

Implement:

* JWT or secure session authentication
* CSRF protection where applicable
* CORS configuration
* Object-level authorization
* File access validation
* Input sanitization
* LaTeX escaping
* Compilation isolation
* Rate limiting for PDF generation
* Temporary file cleanup

A user must never be able to access another user's generated documents by changing an ID in the URL.

---

# 30. DEVELOPMENT QUALITY

Do not produce a single huge React component.

Use reusable components:

```text
ResumeSection
SectionHeader
SortableSection
EducationForm
ExperienceForm
ProjectForm
SkillEditor
TemplateCard
PDFPreview
GenerationStatus
JobMatchCard
VersionList
```

Use TypeScript interfaces/types for API responses.

Avoid `any` unless unavoidable.

Use environment variables for API URLs.

---

# 31. ENVIRONMENT

Frontend:

```text
VITE_API_URL
```

Backend:

```text
DATABASE_URL
REDIS_URL
SECRET_KEY
DEBUG
ALLOWED_HOSTS
```

Never hardcode credentials.

---

# 32. DEVELOPMENT ORDER

Build in this order:

### Phase 1

React + TypeScript + Tailwind + component system.

### Phase 2

Landing page and application shell.

### Phase 3

Authentication UI.

### Phase 4

Resume editor.

### Phase 5

PostgreSQL + Django REST API.

### Phase 6

Resume CRUD.

### Phase 7

Template engine.

### Phase 8

LaTeX generation.

### Phase 9

Dockerized LaTeX compilation.

### Phase 10

Redis + Celery.

### Phase 11

PDF preview.

### Phase 12

Version management.

### Phase 13

Job description analysis.

### Phase 14

Security hardening.

### Phase 15

Testing.

### Phase 16

Deployment.

---

# 33. IMPORTANT PRODUCT RULE

Do not build a fake demo.

Every visible feature must connect to a real backend workflow.

If the UI displays:

```text
PDF Generated
```

there must actually be a generated PDF.

If the UI displays:

```text
Version 3
```

there must actually be a version stored in PostgreSQL.

If the UI displays:

```text
Job Match: 82%
```

there must be an actual analysis behind it.

Do not hardcode dashboard statistics or fake ATS scores.

---

# 34. DIFFERENTIATION FROM CAREERCRAFT

CareerCraft is a broad career-preparation platform.

ResumeForge is a dedicated resume document engineering platform.

Do not add:

* Interview quizzes
* Learning courses
* Roadmaps
* Blogs
* Placement preparation
* Generic assessments
* Career dashboard modules

The main engineering focus must remain:

```text
Resume Data
     ↓
Schema
     ↓
Template
     ↓
LaTeX
     ↓
Secure Compilation
     ↓
PDF
     ↓
Preview
     ↓
Version
     ↓
Job-specific Analysis
```

---

# 35. FINAL QUALITY BAR

The final application must look like a real SaaS product that could be used by students and freshers.

It should demonstrate:

* React
* TypeScript
* REST API
* Django
* Django REST Framework
* PostgreSQL
* Redis
* Celery
* Docker
* LaTeX
* PDF processing
* Authentication
* Data modeling
* Async processing
* Security
* API integration
* Responsive UI
* Production-quality component architecture

Do not optimize for the number of npm packages.

Optimize for a small number of technologies used correctly.
