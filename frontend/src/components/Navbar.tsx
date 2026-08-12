import React from 'react';
import { BookOpen, Sparkles, Key, FileCheck, BarChart3, ShieldCheck, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: 'upload' | 'studio' | 'analytics';
  setActiveTab: (tab: 'upload' | 'studio' | 'analytics') => void;
  onOpenBYOK: () => void;
  byokActive: boolean;
  onTriggerRecruiterDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBYOK,
  byokActive,
  onTriggerRecruiterDemo,
}) => {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '12px 28px', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Brand & Course Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', padding: '10px', borderRadius: '12px', display: 'flex', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)' }}>
              <BookOpen size={22} color="#ffffff" />
            </div>
            <div>
              <h1 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                GradeWise
              </h1>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                AI Academic Evaluation Engine
              </span>
            </div>
          </div>

          <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

          <div className="badge badge-indigo">
            <Sparkles size={12} />
            <span style={{ fontFamily: 'var(--font-mono)' }}>CSE2003 — Computer Architecture</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'upload' ? 'linear-gradient(135deg, #1e293b, #334155)' : 'transparent',
              color: activeTab === 'upload' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'upload' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <FileCheck size={16} color={activeTab === 'upload' ? '#10b981' : '#94a3b8'} />
            <span>1. Upload Batch</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'studio' ? 'linear-gradient(135deg, #1e293b, #334155)' : 'transparent',
              color: activeTab === 'studio' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'studio' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <Sparkles size={16} color={activeTab === 'studio' ? '#6366f1' : '#94a3b8'} />
            <span>2. Grading Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'analytics' ? 'linear-gradient(135deg, #1e293b, #334155)' : 'transparent',
              color: activeTab === 'analytics' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'analytics' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <BarChart3 size={16} color={activeTab === 'analytics' ? '#f59e0b' : '#94a3b8'} />
            <span>3. Analytics & Curve</span>
          </button>
        </nav>

        {/* Right Controls: Recruiter Demo Button, Model Status & BYOK Key */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* ⚡ 1-Click Recruiter Demo Button */}
          <button
            onClick={onTriggerRecruiterDemo}
            className="btn-primary"
            style={{
              padding: '7px 16px',
              fontSize: '0.82rem',
              background: 'linear-gradient(135deg, #10b981, #6366f1)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Zap size={15} color="#ffffff" />
            <span style={{ fontWeight: 700 }}>⚡ 1-Click Recruiter Demo</span>
          </button>

          <div className="badge badge-emerald">
            <span className="pulse-dot" />
            <span style={{ fontFamily: 'var(--font-mono)' }}>Gemini 2.5 Flash</span>
          </div>

          <button
            onClick={onOpenBYOK}
            className="btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.8rem' }}
          >
            <Key size={14} color={byokActive ? '#10b981' : '#94a3b8'} />
            <span>{byokActive ? 'BYOK Active' : 'Bring Your Key'}</span>
            {byokActive && <ShieldCheck size={14} color="#10b981" />}
          </button>
        </div>

      </div>
    </header>
  );
};
