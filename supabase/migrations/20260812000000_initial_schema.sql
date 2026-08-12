-- GradeWise Production Database Schema & Row-Level Security (RLS) Migration

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tenants Table (Multi-tenant SaaS isolation)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    institution_domain TEXT,
    grade_scale_config JSONB DEFAULT '{"S": 90, "A": 80, "B": 70, "C": 60, "D": 50, "F": 0}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Teachers / Users Table
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'professor',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Exams Table
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL,
    title TEXT NOT NULL,
    total_marks FLOAT NOT NULL DEFAULT 50.0,
    review_threshold FLOAT NOT NULL DEFAULT 0.85,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'review', 'published')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Questions & Rubrics Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    question_number TEXT NOT NULL,
    question_text TEXT,
    max_marks FLOAT NOT NULL,
    model_answer_summary TEXT,
    rubric_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_register_number TEXT NOT NULL,
    file_path TEXT NOT NULL,
    total_raw_score FLOAT DEFAULT 0.0,
    max_possible_score FLOAT NOT NULL,
    percentage FLOAT DEFAULT 0.0,
    letter_grade TEXT DEFAULT 'F',
    z_score FLOAT DEFAULT 0.0,
    overall_confidence FLOAT DEFAULT 0.90,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Evaluations Table (Question-level AI grading results)
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    awarded_marks FLOAT NOT NULL,
    transcription TEXT,
    rubric_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    overall_feedback TEXT,
    confidence_score FLOAT NOT NULL DEFAULT 0.90,
    flagged_for_human_review BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    bounding_box JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) across all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Teachers can only access data belonging to their Tenant
CREATE POLICY "Teachers access tenant exams"
    ON public.exams FOR ALL
    USING (tenant_id IN (SELECT tenant_id FROM public.teachers WHERE id = auth.uid()));

CREATE POLICY "Teachers access tenant submissions"
    ON public.submissions FOR ALL
    USING (exam_id IN (
        SELECT id FROM public.exams WHERE tenant_id IN (
            SELECT tenant_id FROM public.teachers WHERE id = auth.uid()
        )
    ));
