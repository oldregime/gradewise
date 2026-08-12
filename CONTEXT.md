# GradeWise — Domain Glossary (Ubiquitous Language)

> This file is the single source of truth for canonical terminology in the GradeWise codebase,
> UI copy, API naming, database schema, and all documentation. Terms listed here are binding.
> Do NOT use synonyms or paraphrases when the canonical term exists.

---

## Core Domain Entities

**Teacher**
An authenticated user of the GradeWise platform. Creates Exams, uploads PoMs and Submissions, configures grading parameters, reviews the Evaluation queue, and publishes results. Teachers are the only platform users with login credentials. Each Teacher belongs to exactly one Tenant.

**Tenant**
An isolated organizational account on the GradeWise multi-tenant SaaS platform. All of a Teacher's Exams, Submissions, Evaluations, and API keys are scoped to the Tenant and are never visible to other Tenants. Row-Level Security (RLS) enforces this boundary at the database level.

**Exam**
The primary container for a graded assessment event. An Exam has one Proof of Marking, one or more Questions (extracted from the PoM), and a batch of Submissions from students. The Exam progresses through lifecycle states: `draft → processing → review → published`.

**Proof of Marking (PoM)**
An official document (PDF or DOCX) uploaded by the Teacher that contains the model answers, mark allocations, and rubric criteria for all Questions in an Exam. The PoM is the ground truth from which the AI extracts the Rubric. A PoM may contain both questions and answers in one document, or the Teacher may upload a separate Question Paper alongside a standalone Answer Key. Do NOT call this an "answer key" or "marking scheme" in isolation — the canonical term is PoM.

**Question Paper**
An optional separate document (PDF/DOCX) containing only the questions posed to students. When uploaded alongside a PoM, GradeWise merges them. Not all exam formats include a separate Question Paper.

**Question**
A discrete scoreable item extracted from the PoM. Has a question number (e.g., `Q1(a)`, `Q2b`), a maximum mark allocation, a model answer, and an associated Rubric. Do NOT call this a "problem" or "item" in code or UI.

**Rubric**
The set of Criteria associated with a Question, extracted from the PoM by the AI. Defines exactly how marks are allocated per sub-concept. Do NOT conflate Rubric with "marking scheme" — a Rubric is the structured, machine-readable form after AI extraction.

**Criterion**
A single atomic, scoreable sub-item within a Rubric. Has a name, maximum mark allocation, and optionally an explicit deduction rule. Examples: `"Definition (1.5 marks)"`, `"Diagram completeness (2.0 marks)"`. Plural: Criteria.

**Submission**
A single student's uploaded answer document (PDF or DOCX) for a specific Exam. Identified by student metadata (name, register number) extracted from the document cover page. Students are NOT platform users — they have no login. Do NOT call this an "answer sheet" or "paper" in code; use Submission.

**Evaluation**
The AI-generated (and Teacher-confirmed) grading result for a specific Question within a Submission. Contains: awarded marks per Criterion, quoted evidence from the student's handwriting, AI feedback text, a Confidence Score, and a flag indicating whether it has been approved by the Teacher.

**Confidence Score**
A numeric value between 0.00 and 1.00 representing the AI's self-assessed accuracy for a given Evaluation. Computed as: `0.50 × legibility + 0.35 × evidence_coverage + 0.15 × rubric_clarity`. Evaluations below the Teacher's configured **Review Threshold** are automatically routed to the Review Queue.

**Review Queue**
The ordered set of Evaluations with Confidence Score below the Exam's configured Review Threshold, awaiting manual Teacher review and approval. Teachers work through the Review Queue in the Split-Screen Grading Studio before publishing.

**Review Threshold**
A per-Exam configurable value (default: 0.85) set by the Teacher. Evaluations with Confidence Score ≥ Review Threshold are auto-approved; those below are added to the Review Queue.

---

## Statistical & Grading Concepts

**Curve**
A mathematical transformation (Gaussian Bell Curve, Z-Score, or Percentile) applied to raw Exam scores to produce normalized letter grades. Curves are always computed for insight but are NEVER applied automatically — the Teacher must explicitly activate a Curve before grades are published.

**Raw Score**
The sum of awarded marks across all approved Evaluations for a student's Submission, expressed as an absolute number (e.g., `34.5 / 50`).

**Letter Grade**
The categorical grade (S, A, B, C, D, F — following VIT-style CGPA) assigned to a Submission, derived from either absolute percentage thresholds or from a Curve. Configurable per Tenant.

**Item Analysis**
A post-grading statistical report per Question containing the Difficulty Index (P) and Discrimination Index (D) across all Submissions in an Exam. Part of the Analytics Dashboard but does not affect individual grades.

**Difficulty Index (P)**
Fraction of students who scored full marks on a Question. Values: `>0.85` = very easy; `0.30–0.85` = ideal range; `<0.30` = very difficult.

**Discrimination Index (D)**
Difference in average Question score between the top 27% and bottom 27% of students, normalized to maximum marks. Values: `≥0.40` = excellent; `<0.20` = poor (question needs review).

---

## Infrastructure & BYOK Concepts

**BYOK (Bring Your Own Key)**
A feature allowing each Teacher to supply their own OpenAI and/or Google Gemini API keys. Keys are validated pre-flight, encrypted using Supabase Vault, and never returned to the frontend after initial submission. The backend proxy decrypts keys in-memory just-in-time per request.

**Processing Pipeline**
The multi-stage AI workflow triggered on an Exam after all Submissions are uploaded: (1) PoM Rubric Extraction → (2) Per-Submission segmentation → (3) Per-Question Evaluation → (4) Audit verification → (5) Review Queue population. Runs on the Oracle A1 VM backend.
