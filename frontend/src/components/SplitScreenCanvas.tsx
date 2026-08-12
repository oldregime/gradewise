import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Edit3,
  Check,
  User,
  HelpCircle,
  FileText
} from 'lucide-react';
import type { SubmissionGradingResult } from '../types';

interface SplitScreenCanvasProps {
  submissions: SubmissionGradingResult[];
  activeSubmissionIndex: number;
  setActiveSubmissionIndex: (idx: number) => void;
  onApproveGrade: (submissionId: string) => void;
}

export const SplitScreenCanvas: React.FC<SplitScreenCanvasProps> = ({
  submissions,
  activeSubmissionIndex,
  setActiveSubmissionIndex,
  onApproveGrade,
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);
  const [customFeedback, setCustomFeedback] = useState('');

  if (!submissions || submissions.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
        <h3>No graded submissions loaded yet. Please run batch upload first.</h3>
      </div>
    );
  }

  const currentStudent = submissions[activeSubmissionIndex];
  const currentQuestion = currentStudent.question_results[activeQuestionIndex];

  const handlePrevStudent = () => {
    if (activeSubmissionIndex > 0) {
      setActiveSubmissionIndex(activeSubmissionIndex - 1);
      setActiveQuestionIndex(0);
    }
  };

  const handleNextStudent = () => {
    if (activeSubmissionIndex < submissions.length - 1) {
      setActiveSubmissionIndex(activeSubmissionIndex + 1);
      setActiveQuestionIndex(0);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)', background: '#080c14' }}>
      
      {/* Sub-Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 24px', background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        
        {/* Student Selector & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={handlePrevStudent} disabled={activeSubmissionIndex === 0} className="btn-secondary" style={{ padding: '6px 10px' }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
              Paper {activeSubmissionIndex + 1} of {submissions.length}
            </span>
            <button onClick={handleNextStudent} disabled={activeSubmissionIndex === submissions.length - 1} className="btn-secondary" style={{ padding: '6px 10px' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1e293b', padding: '6px 14px', borderRadius: '8px' }}>
            <User size={16} color="#818cf8" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentStudent.student_name}</span>
            <span className="badge badge-indigo" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
              {currentStudent.student_register_number}
            </span>
          </div>
        </div>

        {/* Paper Score & Grade Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
              {currentStudent.total_raw_score} / {currentStudent.max_possible_score} ({currentStudent.percentage}%)
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Overall Score</span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '1.2rem'
          }}>
            {currentStudent.letter_grade}
          </div>

          <button
            onClick={() => onApproveGrade(currentStudent.submission_id)}
            className="btn-primary"
            style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <Check size={16} />
            <span>Approve Grade</span>
          </button>
        </div>

      </div>

      {/* Main Split-Screen Studio Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
        
        {/* LEFT PANE: Student PDF Canvas Viewer */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.08)', background: '#0b0f19' }}>
          
          {/* Canvas Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#0f172a' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} />
              <span>{currentStudent.file_name} — Page {currentQuestion ? currentQuestion.page_numbers[0] : 1}</span>
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))} className="btn-secondary" style={{ padding: '4px 8px' }}>
                <ZoomOut size={14} />
              </button>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{zoomLevel}%</span>
              <button onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))} className="btn-secondary" style={{ padding: '4px 8px' }}>
                <ZoomIn size={14} />
              </button>
            </div>
          </div>

          {/* PDF Page Mock View with AI Bounding Box Highlight */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div
              style={{
                width: `${(600 * zoomLevel) / 100}px`,
                minHeight: '750px',
                background: '#ffffff',
                borderRadius: '8px',
                padding: '40px',
                color: '#0f172a',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                position: 'relative',
                fontFamily: 'serif'
              }}
            >
              {/* Paper Cover Header */}
              <div style={{ borderBottom: '2px solid #000', pb: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>VIT UNIVERSITY — Interim Semester</h3>
                  <p style={{ fontSize: '0.85rem' }}>Name: <b>{currentStudent.student_name}</b> | Reg No: <b>{currentStudent.student_register_number}</b></p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                  <p>Course: CSE2003</p>
                  <p>Slot: C11+C12+C13</p>
                </div>
              </div>

              {/* Handwritten Content Simulation */}
              <div style={{ lineHeight: 1.8, fontSize: '0.95rem', color: '#1e293b' }}>
                <h4 style={{ fontFamily: 'sans-serif', fontWeight: 'bold', color: '#4338ca', marginBottom: '8px' }}>
                  Ans {currentQuestion ? currentQuestion.question_number : 'Q1(a)'}:
                </h4>

                <div style={{ fontStyle: 'italic', background: '#f8fafc', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #6366f1' }}>
                  {currentQuestion ? currentQuestion.transcription : 'Student response text...'}
                </div>

                <div style={{ marginTop: '20px', padding: '14px', border: '1px dashed #cbd5e1', borderRadius: '6px', background: '#fafafa' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#64748b' }}>[Handwritten Schematic / Logic Diagram Detected]</p>
                  <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                    CPU Bus Architecture Diagram (Address: 32-bit, Control: R/W)
                  </div>
                </div>
              </div>

              {/* AI Bounding Box Highlight Overlay */}
              {currentQuestion && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${currentQuestion.bounding_box?.y || 120}px`,
                    left: `${currentQuestion.bounding_box?.x || 30}px`,
                    width: `${currentQuestion.bounding_box?.width || 540}px`,
                    height: `${currentQuestion.bounding_box?.height || 220}px`,
                    border: '2px solid #10b981',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '8px',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    padding: '6px'
                  }}
                >
                  <span style={{ background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>
                    AI Evaluated: {currentQuestion.question_number} ({currentQuestion.total_awarded_marks}/{currentQuestion.max_marks} marks)
                  </span>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* RIGHT PANE: AI Grading & Feedback Studio */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto', background: '#0f172a' }}>
          
          {/* Question Selector Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', pb: '6px' }}>
            {currentStudent.question_results.map((q, idx) => (
              <button
                key={q.question_number}
                onClick={() => setActiveQuestionIndex(idx)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: activeQuestionIndex === idx ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                  background: activeQuestionIndex === idx ? '#1e293b' : '#080c14',
                  color: activeQuestionIndex === idx ? '#ffffff' : '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{q.question_number}</span>
                <span className="badge badge-indigo" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>
                  {q.total_awarded_marks}/{q.max_marks}
                </span>
              </button>
            ))}
          </div>

          {currentQuestion && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Question Header Card */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentQuestion.question_number}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Max Marks: {currentQuestion.max_marks}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="badge badge-emerald">
                      <Sparkles size={14} />
                      <span>{(currentQuestion.confidence_score * 100).toFixed(0)}% AI Conf</span>
                    </div>

                    {currentQuestion.flagged_for_human_review && (
                      <div className="badge badge-amber">
                        <AlertTriangle size={14} />
                        <span>Needs Review</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0b0f19', padding: '12px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Awarded Score:</span>
                  <input
                    type="number"
                    step="0.5"
                    max={currentQuestion.max_marks}
                    min={0}
                    defaultValue={currentQuestion.total_awarded_marks}
                    style={{
                      width: '80px',
                      padding: '6px 10px',
                      background: '#1e293b',
                      border: '1px solid #6366f1',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/ {currentQuestion.max_marks} marks</span>
                </div>
              </div>

              {/* Rubric Criteria Breakdown */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#cbd5e1' }}>
                  Rubric Criteria Breakdown:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentQuestion.rubric_evaluations.map((crit) => (
                    <div
                      key={crit.criterion_id}
                      style={{
                        padding: '12px',
                        background: '#0b0f19',
                        borderRadius: '8px',
                        border: crit.awarded_marks === crit.allocated_marks ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{crit.criterion_name}</span>
                        <span className={crit.awarded_marks === crit.allocated_marks ? 'badge badge-emerald' : 'badge badge-amber'}>
                          {crit.awarded_marks} / {crit.allocated_marks}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '4px' }}>
                        Quoted Evidence: "{crit.quoted_evidence}"
                      </p>

                      {crit.deduction_reason && (
                        <p style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 500 }}>
                          ⚠️ {crit.deduction_reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Feedback & Justification */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cbd5e1' }}>
                    AI Feedback Justification:
                  </h4>
                  <button
                    onClick={() => setIsEditingFeedback(!isEditingFeedback)}
                    style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                  >
                    <Edit3 size={14} />
                    <span>{isEditingFeedback ? 'Save' : 'Edit Feedback'}</span>
                  </button>
                </div>

                {isEditingFeedback ? (
                  <textarea
                    defaultValue={currentQuestion.overall_feedback}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0b0f19',
                      border: '1px solid #6366f1',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, background: '#0b0f19', padding: '12px', borderRadius: '8px' }}>
                    "{currentQuestion.overall_feedback}"
                  </p>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
