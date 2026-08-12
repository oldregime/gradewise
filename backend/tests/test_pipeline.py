import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import init_db
from app.services.analytics_service import AnalyticsEngine
from app.models.schemas import SubmissionGradingResult, QuestionGradingResult, RubricCriterionEvaluation, CriterionStatus

# Initialize database schema for unit tests
init_db()

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["app"] == "GradeWise AI Engine"

def test_analytics_endpoint():
    response = client.get("/api/v1/exams/demo/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "mean_score" in data
    assert "std_dev" in data
    assert "cronbach_alpha" in data
    assert "item_analysis" in data

def test_validate_key_endpoint():
    response = client.post("/api/v1/keys/validate", data={"provider": "gemini", "key": "AIzaSyTestKey999999"})
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True
    assert data["key_last_four"] == "9999"

def test_analytics_engine_math():
    sample_sub = SubmissionGradingResult(
        submission_id="sub_test",
        student_name="Test Student",
        student_register_number="22BCE9999",
        exam_id="demo_exam",
        question_results=[
            QuestionGradingResult(
                question_number="Q1",
                max_marks=10.0,
                total_awarded_marks=8.0,
                transcription="Sample text",
                rubric_evaluations=[
                    RubricCriterionEvaluation(
                        criterion_id="c1",
                        criterion_name="Criterion 1",
                        allocated_marks=10.0,
                        awarded_marks=8.0,
                        quoted_evidence="Evidence text",
                        status=CriterionStatus.PARTIAL
                    )
                ],
                overall_feedback="Good work",
                confidence_score=0.95,
                flagged_for_human_review=False
            )
        ],
        total_raw_score=8.0,
        max_possible_score=10.0,
        percentage=80.0,
        letter_grade="A",
        z_score=0.0,
        overall_confidence=0.95,
        processing_time_seconds=1.0,
        file_name="test.pdf"
    )

    analytics = AnalyticsEngine.calculate_class_analytics([sample_sub], curve_mode="absolute")
    assert analytics.total_students == 1
    assert analytics.mean_score == 80.0
    assert analytics.max_score == 80.0
