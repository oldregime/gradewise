# Research Report 04: UI/UX Inspiration, Visual Design System & Aesthetics

---

## 1. Design Aesthetics & Core Principles

To deliver an **awe-dropping, modern, state-of-the-art** web application:
1. **Utility-Driven Elegance**: The layout prioritizes speed and clarity. Educators need to review 50+ papers without visual fatigue.
2. **Glassmorphism & Depth (No Clichés)**: Subtly layered surfaces with crisp border contrast, fluid typography, dark charcoal backdrop (`#0b0f19`) with crisp indigo (`#6366f1`) and emerald (`#10b981`) accents.
3. **High-Density Data Visualization**: Recharts / Chart.js styled with customized gradients, clean axes, and interactive tooltips for statistical distributions.
4. **Fluid Micro-Interactions**: Smooth CSS state transitions on hover, floating score badges, animated curve shift previews, and keyboard shortcut indicators.

---

## 2. Page & Component Layout Blueprints

### 🖥️ Page 1: Exam Workspace & Batch Upload Studio
* **Header Bar**: Project selector, Course tag (e.g., `CSE2003 - Computer Architecture`), Active status pill, Quick search bar.
* **Upload Zone**: Drag-and-drop target accepting PDFs/DOCX, showing file preview cards with OCR parsing status indicators (Progress bars: Extracted $\rightarrow$ Segmented $\rightarrow$ AI Graded).
* **Proof of Marking (PoM) Sidebar**: Displays extracted question list, total marks, and editable rubric criteria.

---

### 📑 Page 2: Split-Screen Grading Studio (The Core Workflow)

```
+-----------------------------------------------------------------------------------+
| Top Navigation Bar: [Course: CSE2003] [Student 4 of 32: Divyansh Joshi] [< Prev] [Next >] |
+------------------------------------------+----------------------------------------+
| LEFT PANE: Student PDF Canvas Viewer     | RIGHT PANE: AI Grading & Feedback Studio|
|                                          |                                        |
|  [Zoom In] [Zoom Out] [Rotate] [Fit]     |  Q1(a) Address Instruction Formats     |
|                                          |  Score: [ 4.5 ] / 5.0  (92% AI Conf)   |
|  +------------------------------------+  |  ------------------------------------  |
|  |  NAME: DIVYANSH JOSHI              |  |  Rubric Breakdown:                     |
|  |  Reg: 22BCE11364                   |  |  [x] Definition (2.0/2.0)              |
|  |                                    |  |  [x] Diagram Syntax (1.5/2.0)          |
|  |  [AI Highlighted Bounding Box Q1]  |  |  [x] Clarity (1.0/1.0)                 |
|  |  "Address instruction modes..."    |  |  ------------------------------------  |
|  |                                    |  |  AI Feedback Justification:            |
|  |                                    |  |  "Accurate definition provided. Slight |
|  |                                    |  |  oversight on 32-bit register offset"  |
|  |                                    |  |  [ Edit Feedback ]  [ + Quick Tag ]   |
|  +------------------------------------+  |                                        |
|                                          |  [ Approve Grade (Enter) ]  [ Flag ]   |
+------------------------------------------+----------------------------------------+
```

---

### 📊 Page 3: Class Analytics & Relative Grading Dashboard
* **Hero Banner**: Class Mean ($\mu$), Standard Deviation ($\sigma$), Highest Score, Lowest Score, Cronbach’s Alpha ($\alpha$).
* **Curve Adjuster**: Real-time slider controls to adjust target mean and standard deviation; instantly updates the letter grade distribution bar chart ($S, A, B, C, D, F$).
* **Item Difficulty & Discrimination Matrix**: Interactive table highlighting questions that were too easy ($P > 0.85$) or poorly discriminating ($D < 0.20$).
* **Plagiarism & Similarity Heatmap**: Pairwise matrix highlighting student paper similarities exceeding threshold $\ge 80\%$.
