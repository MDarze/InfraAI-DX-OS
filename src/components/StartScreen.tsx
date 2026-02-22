import { useState } from 'react';
import { createAssessment } from '../storage/assessments';
import { loadDemoAssessment } from '../engine/demo';
import type { Assessment } from '../types';
import { Building2, Zap, ChevronRight } from 'lucide-react';

export default function StartScreen({ onCreated }: { onCreated: (a: Assessment) => void }) {
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [assessorName, setAssessorName] = useState('');
  const [size, setSize] = useState<'<50' | '50-200' | '200+'>('50-200');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const e: Record<string, string> = {};
    if (!clientName.trim()) e.clientName = 'Client name required';
    if (!assessorName.trim()) e.assessorName = 'Assessor name required';
    if (Object.keys(e).length) { setErrors(e); return; }
    const a = createAssessment(clientName.trim(), assessorName.trim(), size, projectName.trim() || undefined);
    onCreated(a);
  }

  function loadDemo() {
    onCreated(loadDemoAssessment());
  }

  return (
    <div className="start-screen">
      <div className="start-hero">
        <div className="start-logo">
          <Building2 size={36} />
          <div>
            <span className="logo-main">InfraAI</span>
            <span className="logo-sub">DX-OS Field Assessment</span>
          </div>
        </div>
        <p className="start-tagline">هندسة البيانات.. لقيادة الإنشاءات</p>
        <p className="start-sub">Mobile-first diagnostic tool for construction digital transformation</p>
      </div>

      <div className="start-form-card">
        <h2>New Assessment</h2>
        <p className="form-note">تقييم جديد — Fill in client details to begin</p>

        <div className="field-group">
          <label>Client Name <span className="req">*</span></label>
          <input
            value={clientName} onChange={e => setClientName(e.target.value)}
            placeholder="e.g. شركة البناء العربية"
            className={errors.clientName ? 'error' : ''}
          />
          {errors.clientName && <span className="err-msg">{errors.clientName}</span>}
        </div>

        <div className="field-group">
          <label>Project Name <span className="opt">(optional)</span></label>
          <input
            value={projectName} onChange={e => setProjectName(e.target.value)}
            placeholder="e.g. تقييم التحول الرقمي Q1 2025"
          />
        </div>

        <div className="field-group">
          <label>Assessor Name <span className="req">*</span></label>
          <input
            value={assessorName} onChange={e => setAssessorName(e.target.value)}
            placeholder="Your name"
            className={errors.assessorName ? 'error' : ''}
          />
          {errors.assessorName && <span className="err-msg">{errors.assessorName}</span>}
        </div>

        <div className="field-group">
          <label>Company Size</label>
          <div className="size-buttons">
            {(['<50', '50-200', '200+'] as const).map(s => (
              <button key={s} className={`size-btn ${size === s ? 'active' : ''}`}
                onClick={() => setSize(s)}>
                {s} <span className="size-emp">employees</span>
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary" onClick={submit}>
          Create Assessment <ChevronRight size={16} />
        </button>

        <div className="divider"><span>OR</span></div>

        <button className="btn-demo" onClick={loadDemo}>
          <Zap size={16} /> Load Demo Assessment (Sales Mode)
        </button>
      </div>
    </div>
  );
}
