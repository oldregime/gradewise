# GradeWise System Architecture & Design Specification

This document details the architectural blueprints, system container boundaries, processing sequence flows, database schema, security BYOK pipeline, and directory layout for **GradeWise**.

---

## 1. System Context Diagram (C4 Context)

The C4 Context diagram illustrates how teachers interact with GradeWise and how GradeWise interfaces with external cloud infrastructure and AI services.

```mermaid
graph TD
    Teacher["Teacher / Educator<br/>[Person]"]
    
    subgraph GW["GradeWise System"]
        SystemBox["GradeWise AI Grading Platform<br/>[System Box]<br/>Automates PDF proof-of-marks extraction, rubric creation, multi-modal grading, and split-screen verification."]
    end

    Gemini["Google Gemini API<br/>[External Service]<br/>Multimodal AI Model (Gemini 1.5 Pro / Flash) for vision evaluation and structured JSON extraction."]
    Supabase["Supabase Cloud Platform<br/>[External Service]<br/>Managed PostgreSQL, Auth RLS, Realtime state engine."]
    OCI["Oracle Cloud Infrastructure (OCI)<br/>[External Infrastructure]<br/>Oracle A1 Flex VM Hosting & High-Performance Object Storage for PDF assets."]

    Teacher -->|"Uploads PoMs, Submissions & Views Graded Results"| SystemBox
    SystemBox -->|"Sends vision prompts & receives structured evaluation JSON"| Gemini
    SystemBox -->|"Authenticates users, reads/writes relational data via RLS"| Supabase
    SystemBox -->|"Stores & retrieves raw PDF files via pre-signed S3 URLs"| OCI
```

---

## 2. Container Diagram (C4 Container)

The Container diagram breaks down the GradeWise System into its runtime components, communication protocols, and hosting providers.

```mermaid
graph TB
    Teacher["Teacher / Educator<br/>[User Browser]"]

    subgraph Netlify["Netlify Cloud Platform"]
        ReactApp["React 19 + Vite SPA<br/>[Container: TypeScript / React / Vanilla CSS]<br/>Serves responsive UI, split-screen PDF viewer, canvas annotations, and state hooks."]
    end

    subgraph OracleVM["Oracle Cloud Infrastructure (A1 Flex VM Host)"]
        Caddy["Caddy Reverse Proxy<br/>[Container: Docker]<br/>Auto HTTPS / SSL termination, dynamic DNS routing, rate limiting."]
        FastAPI["FastAPI Backend Service<br/>[Container: Docker / Python 3.11]<br/>REST API, PyMuPDF image renderer, BYOK AES-256-GCM cipher, Gemini client, pre-signed URL generator."]
    end

    subgraph ManagedDB["Supabase Managed Cloud"]
        PostgreSQL[("PostgreSQL Database<br/>[Container: Managed DB]<br/>Relational schema, row-level security (RLS), encrypted credentials, evaluation tables.")]
    end

    subgraph ObjectStorage["Oracle Cloud Infrastructure"]
        OCIStorage[("OCI Object Storage<br/>[Container: S3-Compatible Bucket]<br/>Stores raw PoM PDFs and student submission PDFs.")]
    end

    subgraph ExternalAI["External AI Provider"]
        GeminiAPI["Google Gemini API<br/>[External REST/gRPC]<br/>Vision LLM processing multimodal page images."]
    end

    Teacher -->|"HTTPS / WSS"| ReactApp
    Teacher -->|"Direct S3 Upload via Pre-signed URL"| OCIStorage
    ReactApp -->|"REST API Requests"| Caddy
    ReactApp -->|"Direct Auth & Client Queries (RLS)"| PostgreSQL
    Caddy -->|"Proxy pass (Port 8000)"| FastAPI
    FastAPI -->|"S3 API (boto3 / oci-sdk)"| OCIStorage
    FastAPI -->|"Postgres Connection / Service Role API"| PostgreSQL
    FastAPI -->|"HTTPS Multimodal Vision Requests"| GeminiAPI
```

---

## 3. Processing Pipeline Sequence

This sequence diagram depicts the end-to-end processing pipeline for Proof of Marks (PoM) rubric generation and student submission evaluation.

```mermaid
sequenceDiagram
    autonumber
    actor T as Teacher
    participant FE as React SPA (Frontend)
    participant API as FastAPI Backend
    participant OCI as OCI Object Storage
    participant GEM as Gemini 1.5 Vision API
    participant DB as Supabase PostgreSQL

    rect rgb(240, 248, 255)
        note over T, DB: Phase A: Proof of Marks (PoM) Upload & Rubric Extraction
        T->>FE: Select Exam & Upload PoM PDF
        FE->>API: POST /api/v1/exams/{id}/pom/presigned-url
        API-->>FE: Return Pre-signed PUT URL & Object Key
        FE->>OCI: PUT /raw-pdfs/pom_exam123.pdf (Direct Upload)
        OCI-->>FE: HTTP 200 OK
        FE->>API: POST /api/v1/exams/{id}/pom/process {object_key}
        API->>OCI: Download PDF Bytes
        OCI-->>API: PDF Stream
        API->>API: Render PDF pages to PNG images via PyMuPDF (fitz)
        API->>GEM: Send PoM Images + Rubric Extraction Prompt
        GEM-->>API: Return Structured Rubric JSON Schema
        API->>DB: Store Exam Rubric & Question Criteria
        DB-->>API: Confirmation (Rubric ID)
        API-->>FE: Processing Complete (Rubric Ready)
        FE->>T: Display Generated Rubric for Review/Edits
    end

    rect rgb(255, 250, 240)
        note over T, DB: Phase B: Student Submission Evaluation Flow
        T->>FE: Upload Student Submission PDF
        FE->>API: POST /api/v1/submissions/presigned-url
        API-->>FE: Return Pre-signed PUT URL
        FE->>OCI: PUT /raw-pdfs/submission_sub456.pdf (Direct Upload)
        OCI-->>FE: HTTP 200 OK
        FE->>API: POST /api/v1/submissions/evaluate {submission_id, object_key}
        API->>DB: Fetch Exam Rubric & Criteria for Exam
        DB-->>API: Exam Rubric Data
        API->>OCI: Download Submission PDF Bytes
        OCI-->>API: Submission PDF Stream
        API->>API: Render Submission pages to PNG images
        API->>GEM: Send Submission Images + Rubric Context + Evaluation Prompt
        GEM-->>API: Return Per-Question Evaluation JSON (Marks, Justification, Page Refs)
        API->>DB: Store Evaluation & Criterion Scores
        DB-->>API: Saved Evaluation Record
        API-->>FE: Return Evaluation Results
        FE->>T: Render Results in Split-Screen UI (PDF + Interactive Marks)
    end
```

---

## 4. Database Schema (Entity-Relationship Diagram)

The relational database model enforces tenant isolation, multi-teacher collaboration, structured exam rubrics, and detailed per-criterion evaluation scores.

```mermaid
erDiagram
    TENANTS ||--o{ TEACHERS : "has"
    TEACHERS ||--o{ EXAMS : "creates"
    TEACHERS ||--o{ USER_API_KEYS : "owns"
    EXAMS ||--o{ QUESTIONS : "contains"
    EXAMS ||--o{ SUBMISSIONS : "receives"
    QUESTIONS ||--o| RUBRICS : "defines"
    RUBRICS ||--o{ CRITERIA : "includes"
    SUBMISSIONS ||--o| EVALUATIONS : "generates"
    EVALUATIONS ||--o{ EVALUATION_CRITERIA : "details"
    CRITERIA ||--o{ EVALUATION_CRITERIA : "scores"

    TENANTS {
        uuid id PK
        string name
        timestamp created_at
    }

    TEACHERS {
        uuid id PK
        uuid tenant_id FK
        uuid auth_user_id FK
        string email
        string full_name
        string role
        timestamp created_at
    }

    USER_API_KEYS {
        uuid id PK
        uuid teacher_id FK
        string encrypted_gemini_key
        string key_fingerprint
        timestamp created_at
        timestamp updated_at
    }

    EXAMS {
        uuid id PK
        uuid tenant_id FK
        uuid teacher_id FK
        string title
        string subject
        float total_marks
        string pom_pdf_url
        string status
        timestamp created_at
    }

    QUESTIONS {
        uuid id PK
        uuid exam_id FK
        int question_number
        float max_marks
        string instruction
        timestamp created_at
    }

    RUBRICS {
        uuid id PK
        uuid exam_id FK
        uuid question_id FK
        float total_question_marks
        string schema_version
        timestamp created_at
    }

    CRITERIA {
        uuid id PK
        uuid rubric_id FK
        string title
        string description
        float max_points
        string penalty_conditions
        timestamp created_at
    }

    SUBMISSIONS {
        uuid id PK
        uuid exam_id FK
        string student_name
        string student_id_code
        string submission_pdf_url
        string status
        float total_score
        timestamp graded_at
        timestamp created_at
    }

    EVALUATIONS {
        uuid id PK
        uuid submission_id FK
        float total_awarded_marks
        string feedback_summary
        float confidence_score
        string status
        string graded_by
        timestamp created_at
    }

    EVALUATION_CRITERIA {
        uuid id PK
        uuid evaluation_id FK
        uuid question_id FK
        uuid criterion_id FK
        float score
        string justification
        string page_reference
        timestamp created_at
    }
```

---

## 5. BYOK (Bring Your Own Key) Security Flow

To respect teacher privacy and manage operational API costs, GradeWise supports BYOK. API keys are encrypted at rest using AES-256-GCM with a server-side `ENCRYPTION_SECRET` and decrypted Just-In-Time (JIT) in memory.

```mermaid
sequenceDiagram
    autonumber
    actor T as Teacher
    participant FE as React Frontend
    participant API as FastAPI Backend
    participant GEM as Gemini API (Ping Check)
    participant DB as Supabase PostgreSQL

    rect rgb(245, 245, 255)
        note over T, DB: Part 1: Key Submission & Secure Storage
        T->>FE: Input personal Gemini API Key (`AIzaSy...`) in Settings
        FE->>API: POST /api/v1/user/keys {api_key}
        API->>GEM: GET /v1beta/models (Validation Ping with User Key)
        alt Key Invalid
            GEM-->>API: 401 Unauthorized / Invalid Key
            API-->>FE: 400 Bad Request ("Invalid Gemini API Key")
            FE->>T: Show Error Notification
        else Key Valid
            GEM-->>API: 200 OK (Model List)
            API->>API: Generate 12-byte random IV (Initialization Vector)
            API->>API: Encrypt API Key with AES-256-GCM using `ENCRYPTION_SECRET`
            API->>API: Mask key string for display (`AIzaSy...X9a`)
            API->>DB: UPSERT user_api_keys (encrypted_gemini_key, key_fingerprint)
            DB-->>API: Success Response
            API-->>FE: HTTP 200 OK {masked_key: "AIzaSy...X9a"}
            FE->>T: Display Masked Key ("Key Verified & Saved")
        end
    end

    rect rgb(255, 245, 245)
        note over T, DB: Part 2: JIT Decryption during Evaluation Pipeline
        API->>DB: Fetch user_api_keys for active teacher
        DB-->>API: Return encrypted_gemini_key & IV
        API->>API: Decrypt key in-memory using `ENCRYPTION_SECRET`
        API->>GEM: Execute Multimodal Grading Request using decrypted User Key
        GEM-->>API: Return Grading Evaluation Response
        API->>API: Explicitly overwrite/wipe decrypted key from memory buffer
    end
```

---

## 6. Monorepo Directory Structure

Below is the complete structural layout of the `gradewise` repository:

```
gradewise/
├── CONTEXT.md
├── MASTER_PROMPT.md  
├── TOOLS_AND_SKILLS.md
├── README.md
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml
│       └── backend-ci.yml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── pdf/
│   │   │   ├── rubric/
│   │   │   └── grading/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ExamDetails.tsx
│   │   │   ├── GradingView.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useGrading.ts
│   │   │   └── usePDFViewer.ts
│   │   ├── lib/
│   │   │   ├── supabaseClient.ts
│   │   │   └── api.ts
│   │   └── styles/
│   │       └── index.css
│   ├── public/
│   │   └── favicon.ico
│   ├── index.html
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── exams.py
│   │   │   ├── rubrics.py
│   │   │   ├── submissions.py
│   │   │   └── keys.py
│   │   ├── services/
│   │   │   ├── gemini_service.py
│   │   │   ├── oci_storage.py
│   │   │   ├── pdf_service.py
│   │   │   └── encryption_service.py
│   │   ├── models/
│   │   │   ├── domain.py
│   │   │   └── schemas.py
│   │   ├── prompts/
│   │   │   ├── pom_rubric_prompt.py
│   │   │   └── submission_eval_prompt.py
│   │   └── utils/
│   │       ├── security.py
│   │       └── logger.py
│   ├── tests/
│   │   ├── test_encryption.py
│   │   ├── test_pdf.py
│   │   └── test_grading.py
│   ├── main.py
│   ├── pyproject.toml
│   └── Dockerfile
├── supabase/
│   ├── migrations/
│   │   └── 20260812000000_initial_schema.sql
│   └── seed.sql
├── docker-compose.yml
├── Caddyfile
└── planning/
    ├── 01_PROJECT_PLAN.md
    ├── 02_TECH_STACK.md
    ├── 03_PROMPT_ENGINEERING_STRATEGY.md
    ├── 04_BYOK_SECURITY_AND_COST.md
    └── 05_ARCHITECTURE_DIAGRAM.md
```
