# Execution Report 01: Test Suite & Sample Dataset Analysis

---

## 1. Test Dataset Breakdown

The user provided a realistic sample dataset located at:
`question and answer sheet for testing/`

| File Name | Format | Pages / Size | Category / Document Type | Pipeline Processing Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `C11+C12+C13_CSE2003_..._Midterm_PoM - Student Copy.pdf` | Digital PDF | 1 Page / 362 KB | **Proof of Marking (PoM) / Answer Key** | PyMuPDF text extraction $\rightarrow$ AI auto-generates structured question schema (Q1-Q5, Max marks). |
| `D11+D12_CSE4029_..._TEE_PoM_Student Copy.docx` | DOCX | 104 KB | **Proof of Marking (PoM) / Model Answer Sheet** | `python-docx` table parser $\rightarrow$ Extracts questions, marking schemes, and rubric criteria tables. |
| `DIVYANSH JOSHI 22BCE11364 CSE2003.pdf` | Scanned PDF | 11 Pages / 1.9 MB | **Student Handwritten Submission Booklet** | High-res page rendering $\rightarrow$ Multimodal Vision LLM identifies questions (Q1, Q2, Q3) and grades handwriting. |
| `CSE4019_DIVYANSH JOSHI_22BCE11364.pdf` | Scanned PDF | 13 Pages / 5.1 MB | **Student Handwritten Submission Booklet** | Multimodal Vision LLM grades subjective responses, diagrams, and code snippets. |
| `tee computer.pdf` | Scanned PDF | 13 Pages / 4.2 MB | **Student Handwritten Submission Booklet** | Evaluates multi-page answers and calculations. |
| `C11+C12+C13_CSE2003_CAO_..._TEE(Online)_Student_Copy.pdf` | Digital PDF | 2 Pages / 844 KB | **Online Exam Question Paper** | Question extraction & rubric mapping. |

---

## 2. Test Execution Benchmarks for GradeWise

When GradeWise executes grading on this dataset, it will perform:
1. **Header Metadata Extraction**: Auto-extracts `Student Name: Divyansh Joshi` and `Register No: 22BCE11364` from page cover pages.
2. **Question-Wise Alignment**: Matches handwritten answers in `DIVYANSH JOSHI 22BCE11364 CSE2003.pdf` against the criteria in `CSE2003 Midterm PoM`.
3. **Multimodal Scoring**: Scores questions on Computer Architecture & Organization (Addressing modes, Instruction pipelines, Cache memory design) with detailed criterion breakdown.
4. **Relative Grading Curve Verification**: Aggregates scores across all test papers to generate class-wide statistical curves ($Z$-scores, Gaussian distribution, $P$-values, $D$-values).
