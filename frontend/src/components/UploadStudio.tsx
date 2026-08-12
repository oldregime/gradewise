import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, Sparkles, ArrowRight, BookOpen, FileCheck } from 'lucide-react';
import type { PoMExtractionResult } from '../types';

interface UploadStudioProps {
  onParsePoM: (file?: File) => void;
  onGradeBatch: (files?: FileList | File[]) => void;
  pomParsed: boolean;
  pomData: PoMExtractionResult | null;
  isProcessing: boolean;
}

export const UploadStudio: React.FC<UploadStudioProps> = ({
  onParsePoM,
  onGradeBatch,
  pomParsed,
  pomData,
  isProcessing,
}) => {
  const [pomFile, setPomFile] = useState<File | null>(null);
  const [studentFiles, setStudentFiles] = useState<File[]>([]);

  const handlePomFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPomFile(e.target.files[0]);
    }
  };

  const handleStudentFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStudentFiles(Array.from(e.target.files));
    }
  };

  const sampleStudentPapers = [
    { name: 'DIVYANSH JOSHI 22BCE11364 CSE2003.pdf', pages: 11, size: '1.9 MB' },
    { name: 'CSE4019_DIVYANSH JOSHI_22BCE11364.pdf', pages: 13, size: '5.1 MB' },
    { name: 'tee computer.pdf', pages: 13, size: '4.2 MB' },
    { name: 'C11+C12+C13_CSE2003_CAO_100118_Student_Copy.pdf', pages: 2, size: '844 KB' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '16px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
              Exam Ingestion & Proof of Marking Studio
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Upload your official Proof of Marking (PoM) answer key and batch student answer sheets.
            </p>
          </div>
          <div className="badge badge-emerald" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <Sparkles size={16} />
            <span>AI Multimodal Vision Active</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Proof of Marking Upload */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px' }}>
              <BookOpen size={20} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Step 1: Proof of Marking (PoM)</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Answer key / Rubric document (PDF or DOCX)</p>
            </div>
          </div>

          <label
            htmlFor="pom-file-input"
            style={{
              display: 'block',
              border: '2px dashed rgba(99, 102, 241, 0.4)',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              background: 'rgba(99, 102, 241, 0.04)',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
          >
            <input
              id="pom-file-input"
              type="file"
              accept=".pdf,.docx"
              onChange={handlePomFileSelect}
              style={{ display: 'none' }}
            />
            <UploadCloud size={40} color="#818cf8" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>
              {pomFile ? pomFile.name : 'Click to Pick or Drag Proof of Marking PDF'}
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Supports PDF, DOCX (Proof of Marking / Model Answer Key)
            </span>
          </label>

          {!pomParsed ? (
            <button
              onClick={() => onParsePoM(pomFile || undefined)}
              className="btn-primary"
              disabled={isProcessing}
              style={{ width: '100%', padding: '12px' }}
            >
              <Sparkles size={16} />
              <span>{isProcessing ? 'AI Extracting Rubric...' : 'Extract Rubric & Questions with AI'}</span>
            </button>
          ) : (
            <div>
              <div className="badge badge-emerald" style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                <CheckCircle size={16} />
                <span>Rubric Extracted: {pomData?.questions.length || 4} Questions ({pomData?.total_marks || 50.0} Total Marks)</span>
              </div>

              {pomData && (
                <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginBottom: '8px' }}>
                    {pomData.course_code} — {pomData.exam_title}
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {pomData.questions.map((q) => (
                      <div key={q.question_number} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <span>{q.question_number}: {q.question_text.slice(0, 45)}...</span>
                        <span className="badge badge-indigo" style={{ padding: '2px 6px' }}>{q.max_marks} marks</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Student Submission Batch Upload */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px' }}>
              <FileCheck size={20} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Step 2: Student Paper Batch</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Scanned handwritten answer booklets</p>
            </div>
          </div>

          <label
            htmlFor="student-files-input"
            style={{
              display: 'block',
              background: '#0f172a',
              borderRadius: '12px',
              padding: '16px',
              border: '1px dashed rgba(16, 185, 129, 0.4)',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
          >
            <input
              id="student-files-input"
              type="file"
              multiple
              accept=".pdf"
              onChange={handleStudentFilesSelect}
              style={{ display: 'none' }}
            />
            <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '10px' }}>
              {studentFiles.length > 0
                ? `Selected ${studentFiles.length} Upload Files:`
                : `Sample Test Batch (${sampleStudentPapers.length} Submissions — click to change):`}
            </h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(studentFiles.length > 0
                ? studentFiles.map((f) => ({ name: f.name, pages: 'PDF', size: `${(f.size / 1024 / 1024).toFixed(1)} MB` }))
                : sampleStudentPapers
              ).map((paper, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: '#1e293b',
                    borderRadius: '8px',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="#10b981" />
                    <span style={{ fontWeight: 600 }}>{paper.name}</span>
                  </div>
                  <span style={{ color: '#64748b' }}>{paper.pages} ({paper.size})</span>
                </div>
              ))}
            </div>
          </label>

          <button
            onClick={() => onGradeBatch(studentFiles.length > 0 ? studentFiles : undefined)}
            className="btn-primary"
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #10b981, #059669)'
            }}
          >
            <span>{isProcessing ? 'AI Processing Batch Papers...' : 'Start AI Batch Grading & Analysis'}</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

    </div>
  );
};
