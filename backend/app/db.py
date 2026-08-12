import sqlite3
import json
import os
from typing import Dict, Any, List, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "gradewise.db")

def init_db():
    """Initializes SQLite database tables for exams, rubrics, and student submissions."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS poms (
        id TEXT PRIMARY KEY,
        course_code TEXT,
        exam_title TEXT,
        total_marks REAL,
        data_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        exam_id TEXT,
        student_name TEXT,
        student_reg TEXT,
        total_score REAL,
        max_possible REAL,
        percentage REAL,
        letter_grade TEXT,
        z_score REAL,
        confidence REAL,
        file_name TEXT,
        data_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

def save_pom(pom_id: str, course_code: str, title: str, total_marks: float, pom_dict: Dict[str, Any]):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO poms (id, course_code, exam_title, total_marks, data_json) VALUES (?, ?, ?, ?, ?)",
        (pom_id, course_code, title, total_marks, json.dumps(pom_dict))
    )
    conn.commit()
    conn.close()

def get_latest_pom() -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT data_json FROM poms ORDER BY created_at DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row[0])
    return None

def save_submission(sub_dict: Dict[str, Any]):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO submissions (id, exam_id, student_name, student_reg, total_score, max_possible, percentage, letter_grade, z_score, confidence, file_name, data_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            sub_dict["submission_id"],
            sub_dict.get("exam_id", "demo_exam"),
            sub_dict["student_name"],
            sub_dict["student_register_number"],
            sub_dict["total_raw_score"],
            sub_dict["max_possible_score"],
            sub_dict["percentage"],
            sub_dict["letter_grade"],
            sub_dict.get("z_score", 0.0),
            sub_dict.get("overall_confidence", 0.9),
            sub_dict.get("file_name", ""),
            json.dumps(sub_dict)
        )
    )
    conn.commit()
    conn.close()

def get_all_submissions() -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT data_json FROM submissions ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [json.loads(r[0]) for r in rows]
