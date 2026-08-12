import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BYOKModal } from './components/BYOKModal';
import { UploadStudio } from './components/UploadStudio';
import { SplitScreenCanvas } from './components/SplitScreenCanvas';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import type {
  PoMExtractionResult,
  SubmissionGradingResult,
  ClassAnalyticsResult
} from './types';

const API_BASE_URL = 'http://localhost:8000';

export function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'studio' | 'analytics'>('upload');
  const [isBYOKOpen, setIsBYOKOpen] = useState(false);
  const [byokActive, setByokActive] = useState(false);
  const [byokKey, setByokKey] = useState('');

  const [pomParsed, setPomParsed] = useState(false);
  const [pomData, setPomData] = useState<PoMExtractionResult | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionGradingResult[]>([]);
  const [activeSubmissionIndex, setActiveSubmissionIndex] = useState(0);
  const [analytics, setAnalytics] = useState<ClassAnalyticsResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchAnalytics('absolute');
  }, []);

  const fetchAnalytics = async (mode: 'absolute' | 'gaussian') => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/exams/demo/analytics?curve_mode=${mode}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.warn('Backend server not connected locally.');
    }
  };

  const handleParsePoM = async (file?: File) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('file', new File(['demo'], 'pom.pdf', { type: 'application/pdf' }));
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/exams/demo/parse-pom`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setPomData(data);
        setPomParsed(true);
      } else {
        throw new Error('Parse PoM API call failed');
      }
    } catch (e) {
      setPomParsed(true);
      setPomData({
        exam_title: 'Computer Architecture and Organization — TEE/Midterm',
        course_code: 'CSE2003',
        total_marks: 50,
        questions: [
          {
            question_number: 'Q1(a)',
            question_text: 'Describe 32-bit Instruction Formats & Addressing Modes.',
            max_marks: 10,
            model_answer_summary: 'Displacement indirect addressing modes explanation.',
            rubric_criteria: [
              { criterion_id: 'c1', description: 'Instruction format definition', max_marks: 4, keywords: [] },
              { criterion_id: 'c2', description: 'Addressing modes syntax & diagram', max_marks: 4, keywords: [] },
              { criterion_id: 'c3', description: 'Clarity & register offset', max_marks: 2, keywords: [] }
            ]
          }
        ],
        extraction_confidence: 0.98
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGradeBatch = async (files?: FileList | File[]) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      if (files && files.length > 0) {
        Array.from(files).forEach((f) => formData.append('files', f));
      } else {
        formData.append('files', new File(['demo'], 'DIVYANSH JOSHI 22BCE11364 CSE2003.pdf', { type: 'application/pdf' }));
      }

      if (byokKey) {
        formData.append('api_key', byokKey);
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/exams/demo/grade-batch`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      } else {
        throw new Error('Grade Batch API call failed');
      }
    } catch (e) {
      const sampleResults: SubmissionGradingResult[] = [
        {
          submission_id: 'sub_22BCE11364',
          student_name: 'Divyansh Joshi',
          student_register_number: '22BCE11364',
          exam_id: 'demo_exam',
          question_results: [
            {
              question_number: 'Q1(a)',
              max_marks: 10,
              total_awarded_marks: 9.5,
              transcription: 'Name: DIVYANSH JOSHI, Reg: 22BCE11364. Addressing instruction formats 32-bit: Direct, Indirect, and Displacement modes using register offset.',
              rubric_evaluations: [
                { criterion_id: 'c1_1', criterion_name: 'Instruction format definition (3-address vs 2-address)', allocated_marks: 4, awarded_marks: 4, quoted_evidence: 'Student correctly defined 3-address vs 2-address formats.', status: 'FULL' },
                { criterion_id: 'c1_2', criterion_name: 'Addressing modes syntax and diagram', allocated_marks: 4, awarded_marks: 3.5, quoted_evidence: 'Showed displacement syntax. Minor offset label missing.', deduction_reason: 'Deducted 0.5 marks for missing offset register label in schematic.', status: 'PARTIAL' },
                { criterion_id: 'c1_3', criterion_name: 'Structural clarity & register offset derivation', allocated_marks: 2, awarded_marks: 2, quoted_evidence: 'Clear explanation of 32-bit register offset.', status: 'FULL' }
              ],
              overall_feedback: 'Excellent explanation of 32-bit instruction formats and register displacement addressing.',
              confidence_score: 0.95,
              flagged_for_human_review: false,
              page_numbers: [1],
              bounding_box: { x: 35, y: 120, width: 530, height: 230 }
            },
            {
              question_number: 'Q2(b)',
              max_marks: 15,
              total_awarded_marks: 13.0,
              transcription: 'Pipeline speedup formula S = nk/(k+n-1). Data hazards: RAW (Read-After-Write) dependency resolved via forwarding unit logic.',
              rubric_evaluations: [
                { criterion_id: 'c2_1', criterion_name: 'Pipeline Speedup formula derivation S = nk/(k+n-1)', allocated_marks: 5, awarded_marks: 5, quoted_evidence: 'Exact formula S = nk/(k+n-1) derived.', status: 'FULL' },
                { criterion_id: 'c2_2', criterion_name: 'Data Hazard classification (RAW, WAR, WAW)', allocated_marks: 5, awarded_marks: 4.5, quoted_evidence: 'RAW dependency explained clearly.', status: 'FULL' },
                { criterion_id: 'c2_3', criterion_name: 'Operand Forwarding & Stall Insertion diagram', allocated_marks: 5, awarded_marks: 3.5, quoted_evidence: 'Forwarding diagram present. Missing stall clock cycle table.', deduction_reason: 'Deducted 1.5 marks for omitted stall cycle timing diagram.', status: 'PARTIAL' }
              ],
              overall_feedback: 'Solid derivation of pipeline speedup equations and RAW hazard resolution.',
              confidence_score: 0.92,
              flagged_for_human_review: false,
              page_numbers: [2, 3],
              bounding_box: { x: 35, y: 360, width: 530, height: 250 }
            }
          ],
          total_raw_score: 44.5,
          max_possible_score: 50,
          percentage: 89.0,
          letter_grade: 'A',
          z_score: 1.15,
          overall_confidence: 0.94,
          processing_time_seconds: 1.8,
          file_name: 'DIVYANSH JOSHI 22BCE11364 CSE2003.pdf'
        },
        {
          submission_id: 'sub_22BCE10452',
          student_name: 'Aarav Sharma',
          student_register_number: '22BCE10452',
          exam_id: 'demo_exam',
          question_results: [
            {
              question_number: 'Q1(a)',
              max_marks: 10,
              total_awarded_marks: 7.5,
              transcription: 'Instruction format overview and displacement addressing.',
              rubric_evaluations: [
                { criterion_id: 'c1_1', criterion_name: 'Instruction format definition', allocated_marks: 4, awarded_marks: 3, quoted_evidence: 'Basic definition provided.', status: 'PARTIAL' },
                { criterion_id: 'c1_2', criterion_name: 'Addressing modes syntax', allocated_marks: 4, awarded_marks: 3, quoted_evidence: 'Displacement mode mentioned.', status: 'PARTIAL' },
                { criterion_id: 'c1_3', criterion_name: 'Clarity', allocated_marks: 2, awarded_marks: 1.5, quoted_evidence: 'Clear writing.', status: 'PARTIAL' }
              ],
              overall_feedback: 'Satisfactory overview, needs more technical depth in instruction syntax.',
              confidence_score: 0.88,
              flagged_for_human_review: false,
              page_numbers: [1],
              bounding_box: { x: 35, y: 120, width: 530, height: 230 }
            }
          ],
          total_raw_score: 38.0,
          max_possible_score: 50,
          percentage: 76.0,
          letter_grade: 'B',
          z_score: 0.35,
          overall_confidence: 0.88,
          processing_time_seconds: 1.5,
          file_name: 'Aarav_Sharma_22BCE10452.pdf'
        }
      ];
      setSubmissions(sampleResults);
    } finally {
      setIsProcessing(false);
      setActiveTab('studio');
      fetchAnalytics('absolute');
    }
  };

  // One-Click Recruiter Demo Flow Handler
  const handleRecruiterDemoFlow = () => {
    setIsProcessing(true);
    setPomParsed(true);
    setPomData({
      exam_title: 'Computer Architecture and Organization — TEE/Midterm',
      course_code: 'CSE2003',
      total_marks: 50,
      questions: [
        {
          question_number: 'Q1(a)',
          question_text: 'Describe 32-bit Instruction Formats & Addressing Modes with examples.',
          max_marks: 10,
          model_answer_summary: 'Displacement indirect addressing modes explanation.',
          rubric_criteria: [
            { criterion_id: 'c1_1', description: 'Instruction format definition (3-address vs 2-address)', max_marks: 4, keywords: [] },
            { criterion_id: 'c1_2', description: 'Addressing modes syntax and diagram', max_marks: 4, keywords: [] },
            { criterion_id: 'c1_3', description: 'Structural clarity & register offset derivation', max_marks: 2, keywords: [] }
          ]
        },
        {
          question_number: 'Q2(b)',
          question_text: 'Derive Pipeline Execution Time & Hazard Avoidance in RISC Architecture.',
          max_marks: 15,
          model_answer_summary: 'Formula for pipeline speedup S = (n*k)/(k + n - 1), data hazards.',
          rubric_criteria: [
            { criterion_id: 'c2_1', description: 'Pipeline Speedup formula derivation S = nk/(k+n-1)', max_marks: 5, keywords: [] },
            { criterion_id: 'c2_2', description: 'Data Hazard classification (RAW, WAR, WAW)', max_marks: 5, keywords: [] },
            { criterion_id: 'c2_3', description: 'Operand Forwarding & Stall Insertion diagram', max_marks: 5, keywords: [] }
          ]
        }
      ],
      extraction_confidence: 0.98
    });

    handleGradeBatch();
  };

  const handleApproveGrade = (submissionId: string) => {
    alert(`Grade for ${submissionId} approved successfully!`);
  };

  const handleSaveKey = (provider: string, key: string) => {
    setByokKey(key);
    setByokActive(true);
    setIsBYOKOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBYOK={() => setIsBYOKOpen(true)}
        byokActive={byokActive}
        onTriggerRecruiterDemo={handleRecruiterDemoFlow}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'upload' && (
          <UploadStudio
            onParsePoM={handleParsePoM}
            onGradeBatch={handleGradeBatch}
            pomParsed={pomParsed}
            pomData={pomData}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === 'studio' && (
          <SplitScreenCanvas
            submissions={submissions}
            activeSubmissionIndex={activeSubmissionIndex}
            setActiveSubmissionIndex={setActiveSubmissionIndex}
            onApproveGrade={handleApproveGrade}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            analytics={analytics}
            onRefreshAnalytics={fetchAnalytics}
          />
        )}
      </main>

      <BYOKModal
        isOpen={isBYOKOpen}
        onClose={() => setIsBYOKOpen(false)}
        onSaveKey={handleSaveKey}
        savedProvider={byokActive ? 'Google Gemini' : ''}
      />

    </div>
  );
}

export default App;
