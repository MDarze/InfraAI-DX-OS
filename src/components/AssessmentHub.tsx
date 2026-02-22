import { useState } from 'react';
import type { Assessment, Role } from '../types';
import { QUESTIONS } from '../data/questions';
import { saveAssessment } from '../storage/assessments';
import { BarChart3, Users, Settings, Plus, Play, CheckCircle, Clock, ChevronRight, ArrowLeft, X } from 'lucide-react';

const ROLES: Role[] = ['Manager', 'Engineer', 'Finance', 'Operations'];
const ROLE_AR: Record<Role, string> = {
  Manager: 'المدير', Engineer: 'المهندس', Finance: 'المالي', Operations: 'العمليات'
};
const ROLE_COLORS: Record<Role, string> = {
  Manager: '#0B1F3A', Engineer: '#0D7377', Finance: '#7B3F8C', Operations: '#D4A843'
};

function completionForRole(a: Assessment, role: Role) {
  const respondent = a.respondents.find(r => r.role === role);
  if (!respondent) return { pct: 0, answered: 0, total: 0, exists: false };
  const roleQs = QUESTIONS.filter(q => q.roles.includes(role));
  const answered = respondent.answers.filter(ans => !ans.skipped && ans.value !== null).length;
  return { pct: Math.round((answered / roleQs.length) * 100), answered, total: roleQs.length, exists: true };
}

interface Props {
  assessment: Assessment;
  onStartSurvey: (role: Role) => void;
  onViewResults: () => void;
  onSettings: () => void;
  onNew: () => void;
  onRefresh: () => void;
}

export default function AssessmentHub({ assessment, onStartSurvey, onViewResults, onSettings, onNew, onRefresh }: Props) {
  const [addingRole, setAddingRole] = useState<Role | null>(null);
  const [respondentName, setRespondentName] = useState('');

  function confirmAddRespondent() {
    if (!addingRole || !respondentName.trim()) return;
    const existing = assessment.respondents.find(r => r.role === addingRole);
    if (existing) { setAddingRole(null); setRespondentName(''); return; }
    const updated = {
      ...assessment,
      respondents: [
        ...assessment.respondents,
        { id: crypto.randomUUID(), role: addingRole, name: respondentName.trim(), answers: [] }
      ],
    };
    saveAssessment(updated);
    setAddingRole(null);
    setRespondentName('');
    onRefresh();
  }

  const totalCompletion = ROLES.reduce((sum, r) => {
    return sum + completionForRole(assessment, r).pct;
  }, 0) / ROLES.length;

  const hasAnyData = assessment.respondents.some(r => r.answers.some(a => !a.skipped && a.value !== null));

  return (
    <div className="hub-screen">
      {/* Inline modal for adding respondent */}
      {addingRole && (
        <div className="modal-overlay" onClick={() => { setAddingRole(null); setRespondentName(''); }}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add {addingRole} Respondent</h3>
              <button className="icon-btn" onClick={() => { setAddingRole(null); setRespondentName(''); }}><X size={16}/></button>
            </div>
            <p className="modal-sub">اسم المستجيب لدور {ROLE_AR[addingRole]}</p>
            <input
              autoFocus
              value={respondentName}
              onChange={e => setRespondentName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') confirmAddRespondent(); }}
              placeholder="Respondent name / اسم المستجيب"
              className="modal-input"
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => { setAddingRole(null); setRespondentName(''); }}>Cancel</button>
              <button className="btn-confirm" disabled={!respondentName.trim()} onClick={confirmAddRespondent}
                style={{ background: ROLE_COLORS[addingRole] }}>
                <Plus size={14}/> Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="hub-header">
        <div className="hub-header-left">
          <button className="icon-btn" onClick={onNew} title="New assessment"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="hub-title">{assessment.clientName}</h1>
            {assessment.projectName && <p className="hub-sub">{assessment.projectName}</p>}
          </div>
        </div>
        <div className="hub-header-right">
          <button className="icon-btn" onClick={onSettings} title="Settings"><Settings size={18} /></button>
        </div>
      </div>

      {/* Progress ring */}
      <div className="hub-progress-card">
        <div className="progress-ring-wrap">
          <svg viewBox="0 0 100 100" className="progress-ring">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="8"/>
            <circle cx="50" cy="50" r="42" fill="none" stroke="#0D7377" strokeWidth="8"
              strokeDasharray={`${2.64 * totalCompletion} 264`}
              strokeLinecap="round" transform="rotate(-90 50 50)"/>
            <text x="50" y="47" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#0B1F3A">{Math.round(totalCompletion)}%</text>
            <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#64748B">Complete</text>
          </svg>
        </div>
        <div className="progress-info">
          <p className="prog-label">Overall Assessment Progress</p>
          <p className="prog-sub">{assessment.respondents.length} / {ROLES.length} roles covered</p>
          <p className="prog-meta">Assessor: {assessment.assessorName}</p>
          <p className="prog-meta">Size: {assessment.companySize} employees</p>
        </div>
      </div>

      {/* Role cards */}
      <div className="roles-section">
        <h2 className="section-title"><Users size={16}/> Interview Roles</h2>
        <div className="roles-grid">
          {ROLES.map(role => {
            const comp = completionForRole(assessment, role);
            const respondent = assessment.respondents.find(r => r.role === role);
            const color = ROLE_COLORS[role];
            return (
              <div key={role} className="role-card" style={{ borderLeftColor: color }}>
                <div className="role-card-top">
                  <div>
                    <span className="role-name" style={{ color }}>{role}</span>
                    <span className="role-ar">{ROLE_AR[role]}</span>
                  </div>
                  {comp.exists
                    ? <span className="role-badge done"><CheckCircle size={12}/> {comp.pct}%</span>
                    : <span className="role-badge pending"><Clock size={12}/> Pending</span>
                  }
                </div>
                {comp.exists && (
                  <div className="role-progress-bar">
                    <div className="role-progress-fill" style={{ width: comp.pct + '%', backgroundColor: color }}/>
                  </div>
                )}
                {respondent && (
                  <p className="respondent-name">👤 {respondent.name} — {comp.answered}/{comp.total} answered</p>
                )}
                <div className="role-actions">
                  {!comp.exists ? (
                    <button className="btn-add-role" onClick={() => { setAddingRole(role); setRespondentName(''); }} style={{ borderColor: color, color }}>
                      <Plus size={13}/> Add Respondent
                    </button>
                  ) : (
                    <button className="btn-start-role" onClick={() => onStartSurvey(role)} style={{ backgroundColor: color }}>
                      <Play size={13}/> {comp.pct === 100 ? 'Review' : 'Continue'} <ChevronRight size={13}/>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="hub-actions">
        {hasAnyData && (
          <button className="btn-results" onClick={onViewResults}>
            <BarChart3 size={18}/> View Results & Generate PDF
          </button>
        )}
      </div>
    </div>
  );
}
