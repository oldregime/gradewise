# Research Report 01: Open-Source Project Benchmarks & Adaptations

---

## 1. Overview & Objectives

Rather than reinventing every single component from scratch, GradeWise leverages proven architecture patterns and open-source models/libraries discovered across top GitHub repositories. 

Below is an analysis of open-source projects relevant to GradeWise, evaluating their strengths, weaknesses, and what GradeWise will borrow, adapt, or completely overhaul.

---

## 2. GitHub Project Analysis

| Repository / Project | Architecture & Tech Stack | Key Strengths | Weaknesses / Gaps | GradeWise Adaptation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **[Fatima0923/AssessmentAI](https://github.com/Fatima0923/AssessmentAI)** | LangGraph, LangChain, FAISS RAG, OpenAI API | Multi-agent evaluation flow; RAG for rubric context; Human-in-the-loop state | Complex setup, outdated UI, lacking document layout parsing for complex handwritten exams | **Borrow**: Multi-agent state machine pattern (Extractor Agent $\rightarrow$ Evaluator Agent $\rightarrow$ Verifier Agent). |
| **[Submitty](https://github.com/Submitty/Submitty)** | PHP, Python, C++, PostgreSQL, Docker | Industrial-grade, handles 1000s of students, robust gradebook DB schema | Dated monolith UI, heavy infrastructure requirement, geared towards auto-running code tests | **Borrow**: Database schema patterns for Gradebook, Rubric scoring tables, and Audit trails. |
| **[Aarathi1535/Edu-Evaluator](https://github.com/Aarathi1535/Edu-Evaluator)** | Flask, EasyOCR, Google Gemini API | Simple pipeline for handwritten paper evaluation using Gemini | Basic Streamlit/Flask UI, lacks batch processing, no relative grading engine | **Borrow**: Gemini Vision API integration prompts for handwriting interpretation. |
| **[kishorekrrish3/AutoGradeAI](https://github.com/kishorekrrish3/AutoGradeAI)** | Python, EasyOCR, SentenceTransformers, Streamlit | Cosine similarity scoring between model answers and student answers | Only text similarity; fails on multi-step reasoning, diagrams, or subjective nuance | **Borrow**: SentenceTransformers for fast initial pairwise similarity and plagiarism screening. |
| **[securehst/ai-essay-evaluator](https://github.com/securehst/ai-essay-evaluator)** | Python, OpenAI GPT-4o-mini, Fine-Tuning | Modular scoring (multi-criteria rubrics), JSON output format | Geared only towards essay writing, no PDF bounding box viewer | **Borrow**: Structured JSON schema for rubric-based multi-criteria output. |

---

## 3. What GradeWise Keeps, Replaces, and Innovates

### 🛠️ What We Adapt/Keep from Existing Projects
1. **Multi-Agent Evaluation Lifecycle**: Inspired by `AssessmentAI` — decoupling question extraction, rubric matching, and verification into discrete pipeline steps.
2. **Multimodal LLM Vision Prompting**: Inspired by `Edu-Evaluator` — passing raw image segments directly to Gemini 2.0 / GPT-4o Vision rather than relying solely on noisy OCR text transcripts.
3. **Pairwise Vector Embeddings**: Inspired by `AutoGradeAI` — using lightweight embeddings (`SentenceTransformers` or `OpenAI text-embedding-3-small`) for rapid similarity matrix computation.

### ❌ What We Reject / Overhaul
1. **Dated, Cluttered UIs**: Most existing open-source autograders rely on basic Streamlit apps or heavy legacy server-side PHP templates. We are completely redesigning the frontend into a **modern, fluid, dark/light, glassmorphic React dashboard** with a split-screen paper editor.
2. **Static Absolute-Only Grading**: Existing tools only calculate $Score / MaxMarks$. GradeWise introduces a full **Relative Grading & Statistical Analytics Engine** with live interactive curving controls.
3. **Noisy Text OCR Dependency**: Older tools transcribe handwritten images to raw text first via Tesseract, losing spatial layout and diagram details. GradeWise uses **Multimodal Visual Reasoning** directly on document images.
