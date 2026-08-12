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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
              <BookOpen size={22} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                GradeWise
              </h1>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Academic Evaluation Engine
              </span>
            </div>
          </div>

          <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

          <div className="badge badge-indigo">
            <Sparkles size={12} />
            <span>CSE2003 — Computer Architecture</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'upload' ? '#1e293b' : 'transparent',
              color: activeTab === 'upload' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <FileCheck size={16} />
            <span>1. Upload Batch</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'studio' ? '#1e293b' : 'transparent',
              color: activeTab === 'studio' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={16} />
            <span>2. Grading Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'analytics' ? '#1e293b' : 'transparent',
              color: activeTab === 'analytics' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <BarChart3 size={16} />
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
              padding: '6px 14px',
              fontSize: '0.82rem',
              background: 'linear-gradient(135deg, #10b981, #6366f1)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Zap size={14} color="#ffffff" />
            <span>⚡ 1-Click Recruiter Demo</span>
          </button>

          <div className="badge badge-emerald">
            <span className="pulse-dot" />
            <span>Gemini 2.5 Flash</span>
          </div>

          <button
            onClick={onOpenBYOK}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
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
