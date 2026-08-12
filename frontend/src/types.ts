export interface RubricCriterionEvaluation {
  criterion_id: string;
  criterion_name: string;
  allocated_marks: number;
  awarded_marks: number;
  quoted_evidence: string;
  deduction_reason?: string;
  status: 'FULL' | 'PARTIAL' | 'NONE';
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface QuestionGradingResult {
  question_number: string;
  max_marks: number;
  total_awarded_marks: number;
  transcription: string;
  rubric_evaluations: RubricCriterionEvaluation[];
  overall_feedback: string;
  confidence_score: number;
  flagged_for_human_review: boolean;
  flag_reason?: string;
  handwriting_illegible?: boolean;
  page_numbers: number[];
  bounding_box?: BoundingBox;
}

export interface SubmissionGradingResult {
  submission_id: string;
  student_name: string;
  student_register_number: string;
  exam_id: string;
  question_results: QuestionGradingResult[];
  total_raw_score: number;
  max_possible_score: number;
  percentage: number;
  letter_grade: string;
  z_score: number;
  overall_confidence: number;
  processing_time_seconds: number;
  file_name: string;
}

export interface PoMRubricCriterion {
  criterion_id: string;
  description: string;
  max_marks: number;
  keywords: string[];
}

export interface PoMQuestion {
  question_number: string;
  question_text: string;
  max_marks: number;
  model_answer_summary: string;
  rubric_criteria: PoMRubricCriterion[];
}

export interface PoMExtractionResult {
  exam_title: string;
  course_code: string;
  total_marks: number;
  questions: PoMQuestion[];
  extraction_confidence: number;
  extraction_notes?: string;
}

export interface ItemAnalysisRecord {
  question_number: string;
  max_marks: number;
  average_score: number;
  difficulty_index_p: number;
  discrimination_index_d: number;
  evaluation_status: string;
}

export interface PlagiarismRecord {
  student_1: string;
  reg_1: string;
  student_2: string;
  reg_2: string;
  similarity_percentage: number;
  flagged: boolean;
}

export interface ClassAnalyticsResult {
  exam_id: string;
  total_students: number;
  mean_score: number;
  median_score: number;
  std_dev: number;
  min_score: number;
  max_score: number;
  cronbach_alpha: number;
  grade_distribution: Record<string, number>;
  item_analysis: ItemAnalysisRecord[];
  plagiarism_matrix: PlagiarismRecord[];
}
