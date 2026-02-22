import { useState, useEffect } from 'react';
import type { Assessment, Role, Answer, Question } from '../types';
import { QUESTIONS } from '../data/questions';
import { saveAssessment } from '../storage/assessments';
import { ChevronLeft, ChevronRight, X, Info } from 'lucide-react';

function getAnswerValue(answers: Answer[], qid: string) {
  return answers.find(a => a.questionId === qid)?.value ?? null;
}

interface Props {
  assessment: Assessment;
  role: Role;
  onDone: () => void;
  onBack: () => void;
}

export default function SurveyScreen({ assessment, role, onDone, onBack }: Props) {
  const roleQs = QUESTIONS.filter(q => q.roles.includes(role));
  const respondent = assessment.respondents.find(r => r.role === role)!;

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(respondent.answers || []);
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidenceRef, setEvidenceRef] = useState('');

  const q: Question = roleQs[idx];
  const current = answers.find(a => a.questionId === q?.id);
  const progress = ((idx + 1) / roleQs.length) * 100;

  useEffect(() => {
    const ev = answers.find(a => a.questionId === q?.id);
    setEvidenceNote(ev?.evidenceNote ?? '');
    setEvidenceRef(ev?.evidenceRef ?? '');
    setShowEvidence(false);
  }, [idx]);

  function setAnswer(value: Answer['value'], skip = false) {
    setAnswers(prev => {
      const next = prev.filter(a => a.questionId !== q.id);
      return [...next, { questionId: q.id, value: skip ? null : value, skipped: skip, evidenceNote, evidenceRef }];
    });
  }

  function saveAndGo(dir: 1 | -1) {
    // save evidence
    setAnswers(prev => prev.map(a =>
      a.questionId === q.id ? { ...a, evidenceNote, evidenceRef } : a
    ));
    const next = idx + dir;
    if (next < 0) { persist(); onBack(); return; }
    if (next >= roleQs.length) { persist(); onDone(); return; }
    setIdx(next);
  }

  function persist() {
    const updated = assessment.respondents.map(r =>
      r.role === role ? { ...r, answers, completedAt: new Date().toISOString() } : r
    );
    saveAssessment({ ...assessment, respondents: updated });
  }

  function handleMulti(val: string) {
    const current = (getAnswerValue(answers, q.id) as string[] | null) ?? [];
    const next = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
    setAnswer(next);
  }

  if (!q) return null;

  return (
    <div className="survey-screen">
      {/* Top bar */}
      <div className="survey-header">
        <button className="icon-btn" onClick={() => { persist(); onBack(); }}>
          <X size={18}/>
        </button>
        <div className="survey-role-badge" style={{ background: role === 'Manager' ? '#0B1F3A' : role === 'Engineer' ? '#0D7377' : role === 'Finance' ? '#7B3F8C' : '#D4A843' }}>
          {role}
        </div>
        <span className="survey-counter">{idx + 1} / {roleQs.length}</span>
      </div>

      {/* Progress bar */}
      <div className="survey-progress-track">
        <div className="survey-progress-fill" style={{ width: progress + '%' }}/>
      </div>

      {/* Axis chip */}
      <div className="survey-body">
        <span className="axis-chip">{q.axis}</span>

        {/* Question */}
        <div className="question-card">
          <p className="q-text-ar">{q.textAR}</p>
          <p className="q-text-en">{q.textEN}</p>
        </div>

        {/* Answers */}
        <div className="answer-area">
          {q.type === 'single' && q.options && q.options.map(opt => (
            <button key={opt.value}
              className={`option-btn ${getAnswerValue(answers, q.id) === opt.value ? 'selected' : ''}`}
              onClick={() => setAnswer(opt.value)}>
              <span className="opt-ar">{opt.labelAR}</span>
              <span className="opt-en">{opt.labelEN}</span>
            </button>
          ))}

          {q.type === 'multi' && q.options && q.options.map(opt => {
            const selected = ((getAnswerValue(answers, q.id) as string[]) ?? []).includes(opt.value);
            return (
              <button key={opt.value}
                className={`option-btn ${selected ? 'selected' : ''}`}
                onClick={() => handleMulti(opt.value)}>
                <span className="opt-ar">{opt.labelAR}</span>
                <span className="opt-en">{opt.labelEN}</span>
              </button>
            );
          })}

          {q.type === 'number' && (
            <div className="number-input-wrap">
              <input
                type="number"
                className="number-input"
                value={(getAnswerValue(answers, q.id) as number | null) ?? ''}
                onChange={e => setAnswer(e.target.value === '' ? null : parseFloat(e.target.value))}
                placeholder="Enter number..."
                min={0}
              />
              {q.unit && <span className="unit-label">{q.unit}</span>}
            </div>
          )}

          {q.type === 'text' && (
            <textarea
              className="text-input"
              value={(getAnswerValue(answers, q.id) as string | null) ?? ''}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              rows={4}
            />
          )}
        </div>

        {/* N/A + Evidence */}
        <div className="survey-meta-row">
          <button className={`na-btn ${current?.skipped ? 'active' : ''}`}
            onClick={() => setAnswer(null, !current?.skipped)}>
            Not Applicable / لا ينطبق
          </button>
          <button className="evidence-btn" onClick={() => setShowEvidence(!showEvidence)}>
            <Info size={14}/> Evidence
          </button>
        </div>

        {showEvidence && (
          <div className="evidence-panel">
            <label>Note / ملاحظة</label>
            <textarea rows={2} value={evidenceNote} onChange={e => setEvidenceNote(e.target.value)}
              placeholder="Observation, context..." className="text-input small"/>
            <label>Reference / مرجع</label>
            <input type="text" value={evidenceRef} onChange={e => setEvidenceRef(e.target.value)}
              placeholder="photo_01.jpg, whatsapp_screenshot, drive link..."
              className="number-input"/>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="survey-nav">
        <button className="nav-btn prev" onClick={() => saveAndGo(-1)} disabled={idx === 0}>
          <ChevronLeft size={18}/> Prev
        </button>
        <button className="nav-btn next" onClick={() => saveAndGo(1)}>
          {idx === roleQs.length - 1 ? 'Finish ✓' : 'Next'} <ChevronRight size={18}/>
        </button>
      </div>
    </div>
  );
}
