from __future__ import annotations
from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Dict, Any
from enum import Enum


class CriterionStatus(str, Enum):
    FULL = "FULL"
    PARTIAL = "PARTIAL"
    NONE = "NONE"


class RubricCriterionEvaluation(BaseModel):
    criterion_id: str = Field(description="Unique identifier or index of the rubric criterion")
    criterion_name: str = Field(description="Short description e.g. 'Definition', 'Diagram', 'Derivation'")
    allocated_marks: float = Field(ge=0.0, description="Maximum marks for this criterion")
    awarded_marks: float = Field(ge=0.0, description="Marks awarded — must be <= allocated_marks")
    quoted_evidence: str = Field(
        description="Verbatim quote from student. Required even for 0-mark criteria."
    )
    deduction_reason: Optional[str] = Field(
        None, description="Required when awarded_marks < allocated_marks."
    )
    status: CriterionStatus = CriterionStatus.FULL

    @model_validator(mode="after")
    def check_awarded_lte_allocated(self) -> RubricCriterionEvaluation:
        if self.awarded_marks > self.allocated_marks:
            self.awarded_marks = self.allocated_marks
        return self


class QuestionGradingResult(BaseModel):
    question_number: str = Field(description="Question ID e.g. 'Q1(a)'")
    max_marks: float = Field(ge=0.0)
    total_awarded_marks: float = Field(ge=0.0)
    transcription: str = Field(description="Verbatim transcription of student's answer.")
    rubric_evaluations: List[RubricCriterionEvaluation] = Field(default_factory=list)
    overall_feedback: str = Field(description="1–3 sentence constructive student feedback.")
    confidence_score: float = Field(ge=0.0, le=1.0, default=0.92)
    flagged_for_human_review: bool = False
    flag_reason: Optional[str] = None
    handwriting_illegible: bool = False
    page_numbers: List[int] = Field(default_factory=lambda: [1])
    bounding_box: Optional[Dict[str, float]] = Field(
        default_factory=lambda: {"x": 50.0, "y": 150.0, "width": 500.0, "height": 300.0}
    )

    @model_validator(mode="after")
    def verify_marks_sum(self) -> QuestionGradingResult:
        if self.rubric_evaluations:
            computed = round(sum(c.awarded_marks for c in self.rubric_evaluations), 2)
            self.total_awarded_marks = min(computed, self.max_marks)
        return self


class SubmissionGradingResult(BaseModel):
    submission_id: str
    student_name: str
    student_register_number: str
    exam_id: str
    question_results: List[QuestionGradingResult]
    total_raw_score: float
    max_possible_score: float
    percentage: float
    letter_grade: str
    z_score: float = 0.0
    overall_confidence: float
    processing_time_seconds: float
    file_name: str


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
    exam_title: Optional[str] = "Computer Architecture and Organization Midterm"
    course_code: Optional[str] = "CSE2003"
    total_marks: float = 50.0
    questions: List[PoMQuestion] = Field(default_factory=list)
    extraction_confidence: float = 0.95
    extraction_notes: Optional[str] = "Successfully parsedProof of Marking"


class ClassAnalyticsResult(BaseModel):
    exam_id: str
    total_students: int
    mean_score: float
    median_score: float
    std_dev: float
    min_score: float
    max_score: float
    cronbach_alpha: float
    grade_distribution: Dict[str, int]
    item_analysis: List[Dict[str, Any]]
    plagiarism_matrix: List[Dict[str, Any]]
