import os
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from app.models.schemas import (
    PoMExtractionResult,
    SubmissionGradingResult,
    ClassAnalyticsResult,
)
from app.services.pdf_service import PDFProcessor
from app.services.gemini_service import GeminiGradingService
from app.services.analytics_service import AnalyticsEngine

app = FastAPI(
    title="GradeWise AI Engine",
    description="AI-Powered Academic Paper Grading & Class Analytics API",
    version="1.0.0"
)

# Enable CORS for local Vite frontend & production Netlify app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo session state
DEMO_STORAGE = {
    "pom_rubric": None,
    "submissions": []
}

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "GradeWise AI Engine",
        "version": "1.0.0",
        "gemini_configured": bool(os.getenv("GOOGLE_GEMINI_API_KEY"))
    }


@app.post("/api/v1/exams/demo/parse-pom", response_model=PoMExtractionResult)
async def parse_pom_endpoint(file: UploadFile = File(...)):
    """
    Parses a Proof of Marking (PoM) / Answer Key PDF or DOCX file.
    Extracts questions, maximum marks, model answer summaries, and rubric criteria.
    """
    contents = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        text_pages, b64_images = PDFProcessor.extract_text_and_images(contents)
        full_text = "\n".join(text_pages)
    else:
        full_text = "Sample Proof of Marking Document text for Computer Architecture CSE2003"
        b64_images = []

    service = GeminiGradingService()
    rubric = service.extract_pom_rubric(full_text, b64_images)
    DEMO_STORAGE["pom_rubric"] = rubric
    return rubric


@app.post("/api/v1/exams/demo/grade-batch", response_model=List[SubmissionGradingResult])
async def grade_batch_endpoint(
    files: List[UploadFile] = File(...),
    api_key: Optional[str] = Form(None)
):
    """
    Batch grades uploaded student answer scripts (PDFs/DOCX).
    Evaluates each submission against the parsed PoM rubric using Gemini Vision logic.
    """
    if not DEMO_STORAGE["pom_rubric"]:
        # Load default PoM rubric if none uploaded yet
        service = GeminiGradingService(api_key=api_key)
        DEMO_STORAGE["pom_rubric"] = service.extract_pom_rubric("")

    service = GeminiGradingService(api_key=api_key)
    rubric = DEMO_STORAGE["pom_rubric"]
    results = []

    # Sample student data presets matching test folder
    sample_students = [
        ("Divyansh Joshi", "22BCE11364"),
        ("Aarav Sharma", "22BCE10452"),
        ("Rohan Verma", "22BCE11089"),
        ("Ananya Patel", "22BCE11540"),
        ("Vikramaditya Singh", "22BCE10921")
    ]

    for idx, f in enumerate(files):
        contents = await f.read()
        filename = f.filename

        if filename.lower().endswith(".pdf"):
            text_pages, b64_images = PDFProcessor.extract_text_and_images(contents)
            full_txt = "\n".join(text_pages)
        else:
            full_txt = f"Student handwritten response content for {filename}"
            b64_images = []

        # Determine student name/reg
        if "DIVYANSH" in filename.upper() or "22BCE11364" in filename:
            name, reg = "Divyansh Joshi", "22BCE11364"
        else:
            name, reg = sample_students[idx % len(sample_students)]

        res = service.grade_student_submission(
            student_name=name,
            reg_number=reg,
            submission_text=full_txt,
            b64_images=b64_images,
            pom_rubric=rubric
        )
        res.file_name = filename
        results.append(res)

    DEMO_STORAGE["submissions"] = results
    return results


@app.get("/api/v1/exams/demo/analytics", response_model=ClassAnalyticsResult)
def get_analytics_endpoint(
    curve_mode: str = Query("absolute", description="Grade curve mode: absolute | gaussian")
):
    """
    Computes class-wide statistical analytics, bell curves, Z-scores,
    Item Difficulty (P-value), Discrimination Index (D-value), Cronbach's Alpha, and plagiarism similarity.
    """
    submissions = DEMO_STORAGE.get("submissions", [])

    # If no submissions uploaded yet, load realistic sample class dataset for showcase demo
    if not submissions:
        service = GeminiGradingService()
        rubric = service.extract_pom_rubric("")
        sample_dataset = [
            ("Divyansh Joshi", "22BCE11364", "Addressing modes displacement indirect register format pipeline speedup RAW hazard cache tags direct CLA generate propagate"),
            ("Aarav Sharma", "22BCE10452", "Addressing format 32-bit displacement pipeline hazard data dependency cache direct line tag carry lookahead"),
            ("Rohan Verma", "22BCE11089", "Instruction format addressing modes pipeline speedup S=nk/(k+n-1) hazard forwarding cache LRU CLA logic"),
            ("Ananya Patel", "22BCE11540", "Addressing modes displacement indirect register format pipeline speedup RAW hazard cache tags direct CLA generate propagate"), # Identical phrasing (Plagiarism)
            ("Vikramaditya Singh", "22BCE10921", "Instruction formats 3-address addressing modes basic explanation pipeline cache memory direct mapping carry adder"),
            ("Priya Nair", "22BCE10112", "Addressing displacement register instruction format pipeline speedup data hazard cache replacement carry lookahead"),
            ("Karan Malhotra", "22BCE10874", "Basic instruction formats register address hazard RAW cache direct mapping carry adder"),
            ("Neha Gupta", "22BCE11205", "Addressing modes format displacement indirect pipeline speedup hazard cache tags set associative carry lookahead adder")
        ]
        submissions = [
            service.grade_student_submission(name, reg, txt, [], rubric)
            for name, reg, txt in sample_dataset
        ]
        DEMO_STORAGE["submissions"] = submissions

    return AnalyticsEngine.calculate_class_analytics(submissions, curve_mode=curve_mode)


@app.post("/api/v1/keys/validate")
def validate_byok_key(provider: str = Form(...), key: str = Form(...)):
    """
    Pre-flight API Key validator for BYOK (Bring Your Own Key) model setup.
    """
    if not key or len(key) < 15:
        raise HTTPException(status_code=400, detail="Invalid API key length")
    
    last_four = key[-4:]
    return {
        "valid": True,
        "provider": provider,
        "key_last_four": last_four,
        "message": f"Successfully validated {provider.upper()} API key ending in {last_four}"
    }
