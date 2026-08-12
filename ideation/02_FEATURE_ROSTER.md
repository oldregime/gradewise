# GradeWise — Feature Roster & Capabilities Matrix

---

## 1. Core Platform Capabilities

### 📄 Module A: Multi-Format Document Ingestion & Parsing
* **Supported Inputs**: PDF (Digital & Scanned), DOCX, JPEG, PNG, TIFF.
* **Batch Processing**: Simultaneous upload of entire class rosters (e.g., 50–200 papers at once).
* **Automatic Split & Match**: Matches student submission files with student IDs / Register Numbers (e.g., extracting `22BCE11364` or student names from paper cover headers).

### 🤖 Module B: Intelligent Question & Answer Segmentation
* **Question Extraction**: Auto-detects question numbers (Q1, Q2(a), Section B, etc.) from Master Question Papers or Proof of Marking (PoM).
* **Bounding Box / Snippet Mapping**: Maps student response regions to corresponding questions.
* **Multi-Page Answer Alignment**: Gracefully handles answers spanning across multiple pages.

### 🧠 Module C: AI Semantic Evaluation Engine
* **Rubric-Aligned Scoring**: Evaluates answers based on criteria (Clarity, Technical Correctness, Key Concepts, Calculations, Structural Presentation).
* **Partial Credit Allocation**: Computes step-by-step partial marks with transparent justification.
* **Multimodal Visual Analysis**: Evaluates handwritten mathematical equations, logic diagrams, computer architecture schematics (like CPU pipelines, memory hierarchies), and code blocks.
* **Similarity & Plagiarism Check**: Calculates pairwise semantic similarity across student submissions to flag suspicious copying or identical phrasing.

### 🎛️ Module D: Teacher Verification & Human-in-the-Loop Canvas
* **Split-Screen Studio**: Left pane: Original paper viewer with bounding box highlights; Right pane: Interactive scoring panel with AI rationale and editable grade sliders.
* **1-Click AI Feedback Customization**: Allows teachers to override scores, edit feedback comments, or save boilerplate feedback snippets.
* **Bulk Audit Mode**: Quick keyboard navigation (`J`/`K` or `Down`/`Up`) to rapidly audit papers.

### 📊 Module E: Advanced Statistical & Relative Grading Engine
* **Dynamic Grading Curves**:
  * **Absolute Grading**: Direct percentage mapping.
  * **Gaussian / Bell Curve**: Normal distribution curve fitting with configurable Mean ($\mu$) and Standard Deviation ($\sigma$).
  * **Z-Score Normalization**: Standardized score transformation $Z = \frac{X - \mu}{\sigma}$.
  * **Percentile Rank & Stanine**: Percentile-based bucket distribution.
* **Psychometric Item Analysis**:
  * **Difficulty Index ($P$-value)**: Percentage of students answering a question correctly.
  * **Discrimination Index ($D$-value)**: Ability of a question to differentiate high performers from low performers.
  * **Reliability Metrics**: Cronbach's Alpha ($\alpha$) coefficient for test consistency.
* **Interactive Visual Analytics**: Interactive histograms, box plots, cumulative density functions (CDF), and radar charts of class domain strengths.

---

## 2. "Fancy AI" Features (Next-Gen Enhancements)

1. **AI Question Difficulty Predictor**: AI evaluates question papers *before* grading to predict expected class difficulty.
2. **Automated Rubric Generator from Proof of Marking (PoM)**: Feed a teacher's sample solution / PoM DOCX/PDF, and AI auto-builds multi-tier rubrics.
3. **Student Learning Gap Synthesis**: Auto-generates summary reports for professors showing common class misunderstandings (e.g., "72% of students missed the pipeline hazard detection logic in Q3").
4. **Adaptive Feedback Tone Selector**: Switch feedback style between *Encouraging*, *Academic*, *Direct*, or *Constructive Remedial*.
