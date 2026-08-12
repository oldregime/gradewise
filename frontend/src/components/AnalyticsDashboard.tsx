import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Download,
  Sliders,
  CheckCircle,
  HelpCircle,
  Award,
  Printer,
  Sparkles
} from 'lucide-react';
import type { ClassAnalyticsResult } from '../types';

interface AnalyticsDashboardProps {
  analytics: ClassAnalyticsResult | null;
  onRefreshAnalytics: (curveMode: 'absolute' | 'gaussian') => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  onRefreshAnalytics,
}) => {
  const [curveMode, setCurveMode] = useState<'absolute' | 'gaussian'>('absolute');
  const [targetMean, setTargetMean] = useState<number>(72);
  const [targetSD, setTargetSD] = useState<number>(14);

  const handleCurveModeChange = (mode: 'absolute' | 'gaussian') => {
    setCurveMode(mode);
    onRefreshAnalytics(mode);
  };

  const handleExportCSV = () => {
    if (!analytics) return;
    let csvContent = 'data:text/csv;charset=utf-8,Question,Max Marks,Avg Score,Difficulty Index P,Discrimination Index D,Status\n';
    analytics.item_analysis.forEach((row) => {
      csvContent += `${row.question_number},${row.max_marks},${row.average_score},${row.difficulty_index_p},${row.discrimination_index_d},${row.evaluation_status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GradeWise_Class_Analytics_${analytics.exam_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (!analytics) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
        <h3>Loading Class Analytics...</h3>
      </div>
    );
  }

  const grades = analytics.grade_distribution;
  const maxGradeCount = Math.max(...Object.values(grades), 1);

  return (
    <div style={{ maxWidth: '1400px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '4px' }}>
            Class Analytics & Psychometric Dashboard
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Item discrimination, difficulty indices, test reliability, and relative curving.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Curve Selector */}
          <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => handleCurveModeChange('absolute')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: curveMode === 'absolute' ? '#1e293b' : 'transparent',
                color: curveMode === 'absolute' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Absolute Mode
            </button>

            <button
              onClick={() => handleCurveModeChange('gaussian')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: curveMode === 'gaussian' ? '#6366f1' : 'transparent',
                color: curveMode === 'gaussian' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Bell Curve (Z-Score)
            </button>
          </div>

          <button className="btn-secondary" onClick={handlePrintReport}>
            <Printer size={16} />
            <span>Print Report</span>
          </button>

          <button className="btn-primary" onClick={handleExportCSV}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Hero Stats Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>CLASS MEAN (μ)</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {analytics.mean_score}%
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Median: {analytics.median_score}%</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>STD DEVIATION (σ)</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
            {analytics.std_dev}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Range: {analytics.min_score}% - {analytics.max_score}%</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>CRONBACH'S ALPHA (α)</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {analytics.cronbach_alpha}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#10b981' }}>High Test Reliability</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL STUDENTS</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {analytics.total_students}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Evaluated Submissions</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>PLAGIARISM FLAGS</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: analytics.plagiarism_matrix.length > 0 ? '#f43f5e' : '#10b981', marginTop: '4px' }}>
            {analytics.plagiarism_matrix.length}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Pairwise Similarity ≥ 40%</span>
        </div>
      </div>

      {/* Interactive Bell Curve Adjustment Controls (if Gaussian mode enabled) */}
      {curveMode === 'gaussian' && (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Sliders size={18} color="#818cf8" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Interactive Bell Curve Calibration Sliders
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                <span>Target Mean (μ): <b>{targetMean}%</b></span>
                <span style={{ color: '#94a3b8' }}>Shift distribution center</span>
              </label>
              <input
                type="range"
                min={50}
                max={90}
                value={targetMean}
                onChange={(e) => setTargetMean(Number(e.target.value))}
                style={{ width: '100%', marginTop: '6px', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                <span>Target Std Dev (σ): <b>{targetSD}</b></span>
                <span style={{ color: '#94a3b8' }}>Adjust curve spread</span>
              </label>
              <input
                type="range"
                min={5}
                max={25}
                value={targetSD}
                onChange={(e) => setTargetSD(Number(e.target.value))}
                style={{ width: '100%', marginTop: '6px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Grade Distribution Chart & Plagiarism Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Grade Distribution Bar Chart */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Grade Distribution ({curveMode === 'gaussian' ? 'Relative Bell Curve' : 'Absolute Scale'})
            </h3>
            <span className="badge badge-indigo">VIT S/A/B/C/D/F System</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {Object.entries(grades).map(([grade, count]) => {
              const heightPct = Math.max(10, (count / maxGradeCount) * 100);
              return (
                <div key={grade} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8' }}>{count}</span>
                  <div
                    style={{
                      width: '100%',
                      height: `${heightPct}%`,
                      background: grade === 'S' ? '#10b981' : grade === 'F' ? '#f43f5e' : '#6366f1',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s ease'
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>{grade}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plagiarism & Pairwise Similarity Matrix */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} color="#f43f5e" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Within-Class Similarity Detection</h3>
            </div>
            <span className="badge badge-rose">Cosine Similarity</span>
          </div>

          {analytics.plagiarism_matrix.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              <CheckCircle size={32} color="#10b981" style={{ marginBottom: '8px' }} />
              <p>No high similarity phrasing detected across student papers.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {analytics.plagiarism_matrix.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#0f172a',
                    borderRadius: '8px',
                    border: item.flagged ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {item.student_1} ({item.reg_1})
                    </span>
                    <span style={{ color: '#94a3b8', margin: '0 8px' }}>↔</span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {item.student_2} ({item.reg_2})
                    </span>
                  </div>

                  <span className={item.flagged ? 'badge badge-rose' : 'badge badge-amber'}>
                    {item.similarity_percentage}% Match
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Item Analysis Matrix Table */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
          Item Psychometric Analysis (Difficulty P-Value & Discrimination D-Value)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px' }}>Question</th>
                <th style={{ padding: '12px' }}>Max Marks</th>
                <th style={{ padding: '12px' }}>Average Score</th>
                <th style={{ padding: '12px' }}>Difficulty Index (P)</th>
                <th style={{ padding: '12px' }}>Discrimination Index (D)</th>
                <th style={{ padding: '12px' }}>Evaluation Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.item_analysis.map((row) => (
                <tr key={row.question_number} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#818cf8' }}>{row.question_number}</td>
                  <td style={{ padding: '12px' }}>{row.max_marks}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{row.average_score}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={row.difficulty_index_p > 0.85 ? 'badge badge-amber' : row.difficulty_index_p < 0.3 ? 'badge badge-rose' : 'badge badge-emerald'}>
                      P = {row.difficulty_index_p}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={row.discrimination_index_d >= 0.4 ? 'badge badge-emerald' : 'badge badge-amber'}>
                      D = {row.discrimination_index_d}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>{row.evaluation_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
