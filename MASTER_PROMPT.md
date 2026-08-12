# GradeWise — Master System Prompt & Developer Context

> **Load this file at the start of every AI development session.**
> It is the single source of truth for the entire project: stack, terminology,
> architecture decisions, AI prompt templates, schemas, and commands.

---

## 1. Project Overview & Tech Stack (Zero-Cost Forever)

**GradeWise** is a multi-tenant SaaS platform that uses AI (Gemini 2.0 Flash) to automatically
grade academic exam papers — handling handwritten booklets, typed PDFs, and DOCX answer sheets.

| Layer | Technology | Hosting | Monthly Cost |
|---|---|---|---|
| Frontend | React + Vite + Vanilla CSS | Netlify (free) | $0 |
| Backend | Python FastAPI + Docker Compose + Caddy | Oracle A1 ARM VM (free forever) | $0 |
| Database | Supabase Postgres + pgvector + Auth | Supabase (free tier) | $0 |
| File Storage | Oracle Object Storage | Oracle Cloud (free 20 GB) | $0 |
| AI Engine | Gemini 2.0 Flash (AI Studio free tier) | Google AI Studio (1500 req/day) | $0 |
| DNS | DuckDNS + Let's Encrypt via Caddy | DuckDNS (free) | $0 |
| CI/CD | GitHub + Netlify auto-deploy | GitHub (free) | $0 |
| **TOTAL** | | | **$0/month** |

**Monorepo structure**: single GitHub repo with `frontend/` + `backend/` + `supabase/` subdirs.

---

## 2. Domain Glossary — Canonical Terms

> Use **exactly** these terms in all code, UI copy, API naming, DB schema, and docs.
> Never use synonyms when the canonical term exists.

| Term | Definition |
|---|---|
| **Teacher** | Authenticated platform user. Creates Exams, reviews grades, publishes results. |
| **Tenant** | Isolated organizational account. All Teacher data is scoped to their Tenant via RLS. |
| **Exam** | Primary container for a graded assessment. States: `draft → processing → review → published`. |
| **Proof of Marking (PoM)** | Official PDF/DOCX uploaded by Teacher containing model answers + rubric criteria. |
| **Question Paper** | Optional separate PDF/DOCX with only the questions (merged with PoM if both uploaded). |
| **Question** | Discrete scoreable item extracted from the PoM. Has a number (`Q1(a)`), max marks, model answer, and Rubric. |
| **Rubric** | Set of Criteria for a Question, extracted by AI from the PoM. Machine-readable scoring schema. |
| **Criterion** | Single atomic scoreable sub-item in a Rubric. Has name, max marks, optional deduction rules. |
| **Submission** | Single student's uploaded PDF/DOCX answer document for an Exam. Students are NOT platform users. |
| **Evaluation** | AI-generated (and Teacher-confirmed) grading result for one Question within one Submission. |
| **Confidence Score** | Float 0.00–1.00. Formula: `0.50×legibility + 0.35×evidence_coverage + 0.15×rubric_clarity`. |
| **Review Threshold** | Per-Exam float (default 0.85). Evaluations below → Review Queue. Above → auto-approved. |
| **Review Queue** | Ordered set of Evaluations below threshold, awaiting Teacher manual review. |
| **Curve** | Mathematical transformation (Gaussian / Z-score / Percentile) applied to raw scores. Always computed, NEVER silently applied. Teacher must explicitly activate. |
| **Raw Score** | Sum of awarded marks across all approved Evaluations for a Submission. |
| **BYOK** | Bring Your Own Key — Teacher supplies their own OpenAI/Gemini API key (optional upgrade over free default). |
| **Processing Pipeline** | Multi-stage AI workflow on Oracle VM: PoM extraction → segmentation → Evaluation → audit → queue population. |

---

## 3. Architecture Decisions (Hard Rules)

1. **Multi-tenant SaaS**: Every Supabase table has RLS enabled. `tenant_id` scopes all queries.
2. **BYOK Security**: Keys encrypted with AES-256-GCM in FastAPI before touching Supabase. Raw key NEVER returned to frontend after initial submission. Decrypted in Python memory JIT for API calls only.
3. **PDF Upload Flow**: Client → OCI pre-signed PUT URL → Oracle Object Storage (FastAPI generates URL, never proxies the binary).
4. **Default AI**: Gemini 2.0 Flash via Google AI Studio free tier. No billing required. BYOK is optional.
5. **Chain-of-Thought required**: Every grading call must include a `<thinking>` block before JSON output.
6. **Schema enforcement**: Use `response_schema=` (Gemini) or `response_format=` (OpenAI) — never rely on prompt alone.
7. **Confidence routing**: ≥ Review Threshold → auto-approved Evaluation; < threshold → flagged, Review Queue.
8. **Curves**: Always compute statistics. Never auto-apply a Curve. Teacher activates explicitly before publish.
9. **Plagiarism**: Within-class cosine similarity via SentenceTransformers. V1 only, no cross-exam or internet check.
10. **Grade scale**: Configurable per Tenant. Default: VIT-style `S/A/B/C/D/F`.
11. **Student identity**: AI extracts name + register number from PDF cover page 1. Fallback: teacher manual assignment.
12. **Auth**: Supabase Auth. Email/password + Google OAuth. No institutional SSO in V1.
13. **Monorepo**: `gradewise/` root, `frontend/` for React app (Netlify), `backend/` for FastAPI (Oracle VM).

---

## 4. MVP Scope — Hackathon / Recruiter Showcase (Build First)

> Phase 1 target: a working, demonstrable app a recruiter can use in 5 minutes.

1. Teacher registers / logs in (Supabase Auth)
2. Creates an Exam (name, course code, total marks, review threshold)
3. Uploads PoM (PDF or DOCX) → Gemini extracts Question structure + Rubric JSON
4. Uploads 1+ Submissions (PDF) → direct to Oracle Object Storage via pre-signed URL
5. Clicks "Grade All" → Processing Pipeline runs → Evaluations stored in Supabase
6. Split-screen Results View: left = PDF.js canvas, right = per-Question scores + feedback
7. Approves or overrides flagged Evaluations in Review Queue
8. Class Statistics panel: mean, median, score distribution bar chart
9. CSV Export: student name, register no., per-question scores, total, letter grade

---

## 5. Coding Standards

- **Python**: FastAPI + Pydantic v2. `async/await` everywhere. Full type annotations. No bare `except`.
- **TypeScript**: `strict: true`. Zod for all runtime validation. Zero `any`. No `console.log` in production.
- **CSS**: CSS custom properties for all design tokens. BEM-inspired class names. No inline styles.
- **Git**: Conventional commits: `feat|fix|docs|refactor|test|chore(scope): message`
- **Testing**: `pytest` + `pytest-asyncio` for backend. `vitest` for frontend.
- **Security**: Every Supabase table has RLS. Never log, return, or serialize decrypted API keys.
- **API docs**: FastAPI auto-generates OpenAPI. Every endpoint has summary + description.
- **Errors**: All FastAPI endpoints return structured `{"detail": "...", "code": "ERROR_CODE"}` on failure.

---

## 6. AI Grading Prompts — Complete Templates

### 6.1 Master System Prompt (send as `system` role, once per session)

```
SYSTEM: GRADEWISE_ACADEMIC_EXAMINER_V1

[ROLE AND IDENTITY]
You are a Senior Academic Examiner and Lead Verification Officer for university-level
examinations. Evaluate handwritten and typed student responses against a provided Proof of
Marking (PoM) with absolute objectivity, consistency, and academic precision.

[BIAS ELIMINATION — NON-NEGOTIABLE]
ZERO HANDWRITING BIAS: Grade purely on conceptual correctness. Do NOT penalize for messy
handwriting if the content is parseable. If genuinely illegible, flag for human review.

ZERO LENGTH BIAS: A short correct answer = full marks. A long verbose answer with errors
must be penalized for those errors. Verbosity earns no bonus credit.

STRICT BOUNDING:
- 0.0 <= awarded_marks <= max_marks for EVERY criterion. Never negative.
- total_awarded_marks MUST equal exact sum of criterion awarded_marks (verify mathematically).

EVIDENCE-BASED ONLY: Every deduction must cite a specific verbatim quote or visual reference
from the student's response. "Incomplete" is insufficient — name the missing concept exactly.

[EVALUATION PROTOCOL — EXECUTE IN THIS ORDER]
Step 1 PARSE: Identify question number, student text regions, diagrams, equations on image.
Step 2 EXTRACT: Pull verbatim quotes / expressions per criterion.
Step 3 EVALUATE: Compare extracted evidence against each Rubric Criterion.
Step 4 AUDIT: Verify sum(awarded) == total_awarded, total_awarded <= max_marks.
              Compute confidence score using the formula below.
Step 5 FLAG: If confidence < 0.70 OR handwriting_illegible, set flagged_for_human_review=true.

[CONFIDENCE FORMULA]
confidence_score = (0.50 × legibility) + (0.35 × evidence_coverage) + (0.15 × rubric_clarity)
Where:
- legibility: how readable is the student's handwriting/text (0.0–1.0)
- evidence_coverage: fraction of criteria with direct verbatim quotes found (0.0–1.0)
- rubric_clarity: how unambiguous are the rubric criteria for this answer (0.0–1.0)
```

---

### 6.2 PoM Rubric Extraction Prompt

```
USER: POM_RUBRIC_EXTRACTOR

You are analyzing scanned or digital pages of an official Proof of Marking (PoM) document.

[TASK]
Extract the complete question-rubric structure: every question number, max marks,
model answer key points, and granular per-criterion mark allocations.

[INSTRUCTIONS]
1. Read the image from top to bottom.
2. For each Question (e.g., Q1(a), Q2b, Section B Q3):
   - Extract: question_number, question_text (if visible), max_marks
   - Extract: model_answer_summary (key concepts, formulas, diagram descriptions)
   - Extract: rubric_criteria (one entry per discrete mark allocation point)
     Each criterion: description, max_marks, keywords[], deduction_rules[]
   - Extract: acceptable_alternatives (synonyms or alternate valid approaches)

<thinking>
1. DOCUMENT SCAN: Read top to bottom. List all question identifiers found.
2. TOTAL MARKS: What is the total marks for this paper?
3. PER-QUESTION: For each question ID:
   - Max marks?
   - What does the model answer require (list key points)?
   - Break into atomic criteria (one per mark point).
   - Are there explicit deduction rules stated?
4. AMBIGUITY: Any unclear criteria? Note in extraction_notes.
</thinking>

Output ONLY valid JSON matching PoMExtractionResult schema. No markdown. No preamble.
```

---

### 6.3 Student Answer Grading Prompt (Vision — PDF page images)

```
USER: STUDENT_ANSWER_GRADER_VISION

Target Question: {question_id}
Max Marks: {max_marks}

Rubric:
{rubric_json}

Images: Student's handwritten/typed answer sheet containing response for "{question_id}".

[TASK]
1. LOCATE: Find the student's answer for "{question_id}" on the image(s).
2. TRANSCRIBE: Write the student's response verbatim. Use LaTeX for math.
   Describe diagrams in detail (e.g., "Drew a block diagram with CPU, MAR, MDR, and ALU connected by a bidirectional data bus").
3. EVALUATE: For EACH Criterion in the Rubric:
   - Search the transcription for matching evidence.
   - Quote the exact text that earns or denies marks.
   - Assign awarded_marks (0.0 to criterion.max_marks).
4. JUSTIFY: Any partial/zero criterion must have a deduction_reason naming the exact missing concept.
5. TOTAL: Sum all criterion awarded_marks → total_awarded_marks.
6. CONFIDENCE: Compute using the formula from the system prompt.
7. FLAG: If confidence < 0.85 OR handwriting_illegible, set flagged_for_human_review=true.

<thinking>
1. TRANSCRIPTION:
   [Write full verbatim transcription here, including math and diagram descriptions]

2. CRITERION-BY-CRITERION EVALUATION:
   For each criterion in the rubric:
   - Criterion: "{criterion_name}" (max: {crit_max})
     Looking for: [key terms/concepts from criterion keywords]
     Found?: [yes / partial / no]
     Quote: "[exact text from student answer]"
     Decision: [Full: {crit_max} / Partial: {n} / None: 0.0]
     Reason for deduction (if any): [specific missing concept]

3. MARKS SUM:
   Criterion 1: X.X / Y.Y
   Criterion 2: X.X / Y.Y
   ...
   TOTAL: {sum} / {max_marks} ← verify sum is correct

4. CONFIDENCE AUDIT:
   Legibility (0.0–1.0): {score} — because [{reason}]
   Evidence Coverage (0.0–1.0): {score} — because [{fraction} criteria had direct quotes]
   Rubric Clarity (0.0–1.0): {score} — because [{reason}]
   confidence_score = 0.50×{leg} + 0.35×{ev} + 0.15×{rub} = {final}
</thinking>

Constraints:
- Blank/off-topic answer → total_awarded_marks = 0.0, all criteria awarded = 0.0
- Genuinely illegible line → do NOT guess; set handwriting_illegible=true
- NEVER award marks to a criterion with no quoted_evidence

Output ONLY valid JSON matching QuestionGradingResult schema. No markdown. No preamble.
```

---

### 6.4 Calibration Shots (3-shot, embed in system prompt)

**Shot 1 — FULL CREDIT (Operating Systems — Paging)**
- Student correctly defines paging, states advantage (no external fragmentation)
- All criteria met with verbatim quotes
- confidence_score: 0.98, flagged_for_human_review: false

**Shot 2 — PARTIAL CREDIT (OS — Banker's Algorithm)**  
- Student gets Safe State definition ✓ and Need Matrix formula ✓ but skips Resource Request Algorithm steps ✗
- awarded: 2.5/4.0, deduction_reason cites exactly: "missing vector comparison steps Request ≤ Need AND Request ≤ Available"
- confidence_score: 0.94, flagged_for_human_review: false

**Shot 3 — ZERO / ILLEGIBLE (Digital Logic — 3-bit Counter)**
- Student wrote Ohm's Law instead of counter circuit. No relevant content.
- All criteria: awarded_marks = 0.0, quoted_evidence = "Student wrote: 'V = I × R'"
- confidence_score: 0.65, flagged_for_human_review: true, flag_reason: "Off-topic submission, unrelated physics formula"

> Full JSON for all 3 shots → `backend/app/prompts/grading_shots.json`

---

## 7. Pydantic Schemas (Grading Output Contracts)

```python
# backend/app/models/grading.py
from __future__ import annotations
from pydantic import BaseModel, Field, model_validator
from typing import List, Optional
from enum import Enum


class CriterionStatus(str, Enum):
    FULL = "FULL"
    PARTIAL = "PARTIAL"
    NONE = "NONE"


class RubricCriterionEvaluation(BaseModel):
    criterion_id: str
    criterion_name: str
    allocated_marks: float = Field(ge=0.0)
    awarded_marks: float = Field(ge=0.0)
    quoted_evidence: str = Field(
        description="Verbatim quote from student. Required even for 0-mark criteria."
    )
    deduction_reason: Optional[str] = Field(
        None, description="Required when awarded_marks < allocated_marks."
    )
    status: CriterionStatus

    @model_validator(mode="after")
    def check_awarded_lte_allocated(self) -> RubricCriterionEvaluation:
        if self.awarded_marks > self.allocated_marks:
            raise ValueError(
                f"awarded_marks {self.awarded_marks} > allocated_marks {self.allocated_marks}"
            )
        return self


class QuestionGradingResult(BaseModel):
    question_number: str
    max_marks: float = Field(ge=0.0)
    total_awarded_marks: float = Field(ge=0.0)
    transcription: str = Field(description="Verbatim transcription of student's answer.")
    rubric_evaluations: List[RubricCriterionEvaluation]
    overall_feedback: str = Field(description="1–3 sentence constructive student feedback.")
    confidence_score: float = Field(ge=0.0, le=1.0)
    flagged_for_human_review: bool
    flag_reason: Optional[str] = None
    handwriting_illegible: bool = False
    page_numbers: List[int] = Field(description="PDF pages where this answer appears.")

    @model_validator(mode="after")
    def verify_marks_sum(self) -> QuestionGradingResult:
        computed = round(sum(c.awarded_marks for c in self.rubric_evaluations), 3)
        if abs(computed - round(self.total_awarded_marks, 3)) > 0.01:
            raise ValueError(
                f"total_awarded_marks {self.total_awarded_marks} "
                f"!= sum of criterion scores {computed}"
            )
        return self


class SubmissionGradingResult(BaseModel):
    submission_id: str
    student_name: str
    student_register_number: str
    exam_id: str
    question_results: List[QuestionGradingResult]
    total_raw_score: float
    max_possible_score: float
    overall_confidence: float
    processing_time_seconds: float


class PoMRubricCriterion(BaseModel):
    criterion_id: str
    description: str
    max_marks: float = Field(ge=0.0)
    keywords: List[str] = Field(default_factory=list)
    deduction_rules: List[str] = Field(default_factory=list)


class PoMQuestion(BaseModel):
    question_number: str
    question_text: str
    max_marks: float = Field(ge=0.0)
    model_answer_summary: str
    rubric_criteria: List[PoMRubricCriterion]
    acceptable_alternatives: List[str] = Field(default_factory=list)


class PoMExtractionResult(BaseModel):
    exam_title: Optional[str] = None
    course_code: Optional[str] = None
    total_marks: float
    questions: List[PoMQuestion]
    extraction_confidence: float = Field(ge=0.0, le=1.0)
    extraction_notes: Optional[str] = None
```

---

## 8. Gemini API Call Pattern (Free Tier — Default)

```python
# backend/app/services/gemini_service.py
import google.generativeai as genai
from app.models.grading import QuestionGradingResult, PoMExtractionResult


async def grade_question(
    image_bytes: list[bytes],
    question_id: str,
    max_marks: float,
    rubric_json: str,
    api_key: str,                    # From env or decrypted BYOK key
    system_prompt: str,
    user_prompt_template: str,
) -> QuestionGradingResult:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=system_prompt,
        generation_config=genai.GenerationConfig(
            temperature=0.0,         # Deterministic grading
            response_mime_type="application/json",
            response_schema=QuestionGradingResult,
        ),
    )
    parts = [
        genai.types.Part.from_bytes(data=img, mime_type="image/jpeg")
        for img in image_bytes
    ]
    parts.append(
        user_prompt_template
        .replace("{question_id}", question_id)
        .replace("{max_marks}", str(max_marks))
        .replace("{rubric_json}", rubric_json)
    )
    response = await model.generate_content_async(parts)
    return QuestionGradingResult.model_validate_json(response.text)
```

---

## 9. Development Workflow (AI-Driven, Human-Approval-Only)

**Rule**: All code is written by AI agents. Human role = review, approve, provide credentials, run local tests.

1. Start new chat → paste contents of `MASTER_PROMPT.md` → describe the task
2. AI writes code → human reviews diff → human runs local tests
3. Human approves → conventional commit → push → auto-deploy (frontend) or SSH deploy (backend)
4. Before any major feature: use `/code-review` skill against the diff
5. When new domain terms emerge: update `CONTEXT.md` immediately

### Local Dev Ports
```
localhost:5173   → React frontend (pnpm dev)
localhost:8000   → FastAPI backend (uvicorn --reload)
localhost:54321  → Supabase Studio UI
localhost:54322  → Supabase Inbucket (test emails)
5432             → Supabase local Postgres
```

---

## 10. Quick Commands Reference

### 🗄️ Supabase (Database & Auth)
```bash
supabase start                            # Start local stack
supabase stop                             # Stop local stack
supabase status                           # Show endpoints + anon/service keys
supabase db reset                         # Reset + re-run all migrations
supabase migration new <name>             # New migration file
supabase db diff --use-migra -f <name>    # Generate migration from schema changes
supabase db push                          # Push local migrations to remote Supabase project
supabase gen types typescript --local > frontend/src/lib/database.types.ts
```

### 🐍 Backend (FastAPI + Poetry)
```bash
cd backend
poetry install                             # Install all Python deps
poetry run uvicorn app.main:app --reload   # Dev server on :8000
poetry run pytest -v                       # All tests
poetry run pytest tests/test_grading.py -v # Specific test file
poetry run mypy app/                       # Type check
docker compose up --build                  # Full stack with Caddy
docker compose logs -f backend             # Tail logs
docker compose down                        # Stop all containers
```

### ⚛️ Frontend (React/Vite + pnpm)
```bash
cd frontend
pnpm install                    # Install deps
pnpm dev                        # Dev server on :5173
pnpm build                      # Production build → dist/
pnpm preview                    # Preview dist/ locally
pnpm test                       # Vitest
pnpm lint                       # ESLint
pnpm typecheck                  # tsc --noEmit
```

### ☁️ Deployment
```bash
# Frontend → Netlify (auto on push, or manual):
netlify deploy --dir frontend/dist --prod

# Backend → Oracle VM:
ssh ubuntu@<oracle-vm-ip> \
  "cd /opt/gradewise && git pull && docker compose up -d --build"

# Database → Supabase Cloud:
supabase db push

# OCI Object Storage bucket creation:
oci os bucket create \
  --name gradewise-pdfs \
  --compartment-id $OCI_COMPARTMENT_ID \
  --versioning Disabled
```

### 🔑 Key Validation (pre-save BYOK check)
```bash
# Gemini key
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$KEY" | jq .

# OpenAI key
curl -s https://api.openai.com/v1/models \
  -H "Authorization: Bearer $KEY" | jq .data[0].id
```

### 🧪 End-to-End Local Test (sample papers)
```bash
# 1. Start local stack
supabase start && cd backend && poetry run uvicorn app.main:app --reload &

# 2. Grade a sample paper (CSE2003 handwritten booklet vs its PoM)
curl -X POST http://localhost:8000/api/v1/exams/demo/grade \
  -H "Content-Type: multipart/form-data" \
  -F "pom=@../question and answer sheet for testing/C11+C12+C13_CSE2003_Computer Architecture and Organization_100118_Dr Anand Motwani_Interim Semester 2024-2025_Midterm_PoM - Student Copy.pdf" \
  -F "submission=@../question and answer sheet for testing/DIVYANSH JOSHI 22BCE11364 CSE2003.pdf" | jq .
```

### 🔒 AES-256-GCM BYOK Key Ops
```bash
# Generate a 32-byte hex ENCRYPTION_SECRET (store in Oracle VM .env):
python3 -c "import secrets; print(secrets.token_hex(32))"

# Test encryption round-trip:
cd backend && poetry run python -c "
from app.utils.crypto import encrypt_key, decrypt_key
import os
secret = os.environ['ENCRYPTION_SECRET']
enc = encrypt_key('sk-proj-test-key-123', secret)
print('Encrypted:', enc)
print('Decrypted:', decrypt_key(enc, secret))
"
```

---

## 11. Environment Variables Reference

### Backend — `backend/.env`
```env
# AI (default free engine — no billing required)
GOOGLE_GEMINI_API_KEY=AIzaSy...          # From https://aistudio.google.com/apikey

# Supabase (server-side — service role, never expose to frontend)
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Oracle Object Storage
OCI_NAMESPACE=<your-namespace>
OCI_BUCKET_NAME=gradewise-pdfs
OCI_REGION=ap-mumbai-1                  # Your home region
OCI_USER_OCID=ocid1.user.oc1...
OCI_TENANCY_OCID=ocid1.tenancy.oc1...
OCI_FINGERPRINT=aa:bb:cc:...
OCI_PRIVATE_KEY_PATH=/opt/gradewise/.oci/oci_api_key.pem

# Security
ENCRYPTION_SECRET=<32-byte-hex>         # For AES-256-GCM BYOK key encryption
JWT_SECRET=<random-secret>              # FastAPI JWT signing

# App
ENVIRONMENT=development                 # development | production
CORS_ORIGINS=http://localhost:5173,https://gradewise.netlify.app
```

### Frontend — `frontend/.env.local`
```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...           # Anon key (safe to expose)
VITE_API_BASE_URL=http://localhost:8000 # Local: localhost:8000 | Prod: DuckDNS URL
VITE_APP_NAME=GradeWise
VITE_APP_VERSION=1.0.0
```
