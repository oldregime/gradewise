# Roadmap & AI Skills Strategy

---

## 1. Mapping AI Skills Across Project Phases

To achieve an industrial-grade, awe-dropping result, GradeWise utilizes specific agent skills across each execution phase:

| Phase | Core Objective | AI Skills & Tools Utilized | Deliverables |
| :--- | :--- | :--- | :--- |
| **Phase 1: Ideation** | Scoping, domain modeling, user stories | `domain-modeling`, `prototype` | Core vision, feature matrix, domain schema. |
| **Phase 2: Research** | Benchmarking open-source repos, AI OCR exploration, psychometrics | `research`, `firecrawl` | Open-source benchmarks, statistical formulas, UI UX blueprints. |
| **Phase 3: Planning** | System architecture, API contracts, data models, component layout | `codebase-design`, `frontend-design` | Architecture spec, API schema, database ER diagram, design system. |
| **Phase 4: Execution & UI Construction** | Building GradeWise full web app, AI parser engine, analytics studio | `frontend-design`, `vibe-coding-starter`, `generate_image`, `web-perf` | Interactive Web Application, PDF Viewer, Relative Grading Studio, Class Analytics Engine. |
| **Verification & Quality Audit** | Testing against sample papers (`question and answer sheet for testing`) | `diagnosing-bugs`, `code-review` | End-to-end paper ingestion test, statistical verification, UI responsiveness audit. |

---

## 2. Milestone Execution Breakdown

### 🚩 Milestone 1: Ideation & Research Phase *(Completed)*
- [x] Create project workspace folders (`ideation`, `research`, `planning`, `execution`).
- [x] Conduct deep research on open-source projects on GitHub (`AssessmentAI`, `Edu-Evaluator`, `Submitty`, `AutoGradeAI`).
- [x] Inspect & analyze user-provided sample test files (scanned PDFs, PoM DOCX files).
- [x] Define statistical relative grading algorithms ($Z$-Score, Gaussian Bell Curve, Item Discrimination $D$, Difficulty $P$, Cronbach's $\alpha$).
- [x] Establish UI/UX design language and visual system.

### 🚩 Milestone 2: Planning & Architecture Phase *(Completed)*
- [x] Complete System Architecture Blueprint.
- [x] Define API Endpoints & Data Model Schema.
- [x] Establish AI Prompting & JSON Schema constraints.

### 🚩 Milestone 3: Execution — Core Frontend & UI Build *(Next Step)*
- [ ] Initialize React/Vite Web Application with vanilla CSS design system tokens.
- [ ] Build **Exam Workspace & Upload Studio** (File drop zone, batch status, PoM upload).
- [ ] Build **Split-Screen Grading Studio** (PDF Canvas Viewer with bounding box highlights, AI score breakdown, feedback editor).
- [ ] Build **Statistical Analytics & Relative Grading Dashboard** (Interactive curve sliders, bell curve charts, item discrimination table, plagiarism heatmap).

### 🚩 Milestone 4: Execution — Parsing Engine & Processing Simulation
- [ ] Implement document ingestion and text/image extractor using PyMuPDF and sample test dataset.
- [ ] Wire simulated/real AI grading pipeline with structured JSON outputs based on sample answer papers (`DIVYANSH JOSHI 22BCE11364 CSE2003.pdf`, `CSE2003 Midterm PoM`).
- [ ] Verify relative grading math and interactive curve adjustment on class dataset.
