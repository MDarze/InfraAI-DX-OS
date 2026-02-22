import { useMemo } from 'react';
import type { Assessment } from '../types';
import { analyzeAssessment, AXIS_LABELS } from '../engine/scoring';
import { generatePDF } from '../pdf/generator';
import { ArrowLeft, Download, FileJson, TrendingUp, AlertTriangle, Zap, List, Shield } from 'lucide-react';

function ScoreBar({ score, max = 5 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const col = score >= 4 ? '#1A7A4A' : score >= 3 ? '#C98A0E' : '#C4462D';
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: pct + '%', backgroundColor: col }}/>
      </div>
      <span className="score-val" style={{ color: col }}>{score.toFixed(1)}</span>
    </div>
  );
}

const SEV_COLOR: Record<string, string> = { high: '#C4462D', medium: '#C98A0E', low: '#1A7A4A' };
const PROB_COLOR: Record<string, string> = { High: '#C4462D', Med: '#C98A0E', Low: '#1A7A4A' };

export default function ResultsScreen({ assessment, onBack, onRefresh }: {
  assessment: Assessment; onBack: () => void; onRefresh: () => void;
}) {
  const analysis = useMemo(() => analyzeAssessment(assessment), [assessment]);

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ assessment, analysis }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `infraai-${assessment.clientName}-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="results-screen">
      {/* Header */}
      <div className="results-header">
        <button className="icon-btn" onClick={onBack}><ArrowLeft size={18}/></button>
        <div>
          <h1>Assessment Results</h1>
          <p>{assessment.clientName}</p>
        </div>
        <div className="results-header-actions">
          <button className="btn-export json" onClick={exportJSON}><FileJson size={14}/> JSON</button>
          <button className="btn-export pdf" onClick={() => generatePDF(assessment, analysis)}><Download size={14}/> PDF</button>
        </div>
      </div>

      <div className="results-body">
        {/* Overall Score */}
        <div className="results-score-card">
          <div className="big-score" style={{ color: analysis.aggregateScore >= 4 ? '#1A7A4A' : analysis.aggregateScore >= 3 ? '#C98A0E' : '#C4462D' }}>
            {analysis.aggregateScore.toFixed(1)}
            <span className="big-score-max">/5.0</span>
          </div>
          <p className="big-score-label">Overall Maturity Score</p>
          <div className="dna-chips">
            {Object.entries(analysis.dna).map(([k, v]) => (
              <span key={k} className="dna-chip">
                <strong>{k.charAt(0).toUpperCase() + k.slice(1)}</strong>: {v}
              </span>
            ))}
          </div>
        </div>

        {/* Axis Scores */}
        <div className="results-section">
          <h2><TrendingUp size={16}/> Axis Scores</h2>
          {analysis.axisScores.filter(a => a.answeredCount > 0).map(a => (
            <div key={a.axis} className="axis-row">
              <div className="axis-label">
                <span className="axis-en">{AXIS_LABELS[a.axis].en}</span>
                <span className="axis-ar">{AXIS_LABELS[a.axis].ar}</span>
              </div>
              <ScoreBar score={a.score}/>
              <span className="axis-count">{a.answeredCount}Q</span>
            </div>
          ))}
        </div>

        {/* ROI */}
        <div className="results-section">
          <h2><TrendingUp size={16}/> ROI Projection</h2>
          <div className="roi-grid">
            <div className="roi-card weekly">
              <span className="roi-label">Weekly Savings</span>
              <span className="roi-value">SAR {analysis.roi.weeklySavings.toLocaleString()}</span>
            </div>
            <div className="roi-card monthly">
              <span className="roi-label">Monthly Savings</span>
              <span className="roi-value">SAR {analysis.roi.monthlySavings.toLocaleString()}</span>
            </div>
            <div className="roi-card yearly">
              <span className="roi-label">Yearly Savings</span>
              <span className="roi-value">SAR {analysis.roi.yearlySavings.toLocaleString()}</span>
            </div>
            <div className="roi-card lost">
              <span className="roi-label">Hours Lost/Week</span>
              <span className="roi-value">{analysis.roi.weeklyHoursLost.toFixed(0)} hrs</span>
            </div>
          </div>
          <div className="assumptions-box">
            <p className="assumptions-title">Assumptions:</p>
            {analysis.roi.assumptions.map((a, i) => <p key={i} className="assumption">• {a}</p>)}
          </div>
        </div>

        {/* Pain Signals */}
        <div className="results-section">
          <h2><AlertTriangle size={16}/> Pain Signals</h2>
          {analysis.painSignals.map(p => (
            <div key={p.id} className="pain-card" style={{ borderLeftColor: SEV_COLOR[p.severity] }}>
              <div className="pain-top">
                <span className="pain-label-ar">{p.labelAR}</span>
                <span className="pain-sev" style={{ background: SEV_COLOR[p.severity] }}>{p.severity.toUpperCase()}</span>
              </div>
              <span className="pain-val">{p.value.toLocaleString()} <span className="pain-unit">{p.unit}</span></span>
              <span className="pain-formula">{p.formula}</span>
            </div>
          ))}
        </div>

        {/* Quick Wins */}
        <div className="results-section">
          <h2><Zap size={16}/> 60-Day Quick Wins</h2>
          {analysis.quickWins.map((qw, i) => (
            <div key={i} className="quick-win-item">
              <div className="qw-num">{i + 1}</div>
              <div>
                <p className="qw-en">{qw}</p>
                <p className="qw-ar">{analysis.quickWinsAR[i]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Opportunities */}
        <div className="results-section ai-section">
          <h2><Zap size={16}/> AI Integration Opportunities</h2>
          {analysis.aiOpportunities.map((op, i) => (
            <div key={i} className="ai-item">
              <span className="ai-num">AI {i + 1}</span>
              <div>
                <p className="ai-en">{op}</p>
                <p className="ai-ar">{analysis.aiOpportunitiesAR[i]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Risks */}
        <div className="results-section">
          <h2><Shield size={16}/> Risk Register</h2>
          {analysis.risks.map(r => (
            <div key={r.id} className="risk-item">
              <div className="risk-header">
                <span className="risk-title">{r.titleEN}</span>
                <div className="risk-badges">
                  <span className="risk-badge" style={{ background: PROB_COLOR[r.probability] }}>P: {r.probability}</span>
                  <span className="risk-badge" style={{ background: PROB_COLOR[r.impact] }}>I: {r.impact}</span>
                </div>
              </div>
              <p className="risk-title-ar">{r.titleAR}</p>
              <p className="risk-mit">{r.mitigation}</p>
              <p className="risk-mit-ar">{r.mitigationAR}</p>
            </div>
          ))}
        </div>

        {/* Backlog */}
        <div className="results-section">
          <h2><List size={16}/> Implementation Backlog</h2>
          <div className="backlog-table-wrap">
            <table className="backlog-table">
              <thead>
                <tr>
                  <th>Epic</th><th>Initiative</th><th>Owner</th><th>Size</th><th>Weeks</th><th>KPI</th>
                </tr>
              </thead>
              <tbody>
                {analysis.backlog.map(b => (
                  <tr key={b.id}>
                    <td><p>{b.epicAR}</p><p className="light">{b.epic}</p></td>
                    <td><p>{b.initiativeAR}</p><p className="light">{b.initiative}</p></td>
                    <td><span className="owner-chip">{b.owner}</span></td>
                    <td><span className={`complexity-chip ${b.complexity}`}>{b.complexity}</span></td>
                    <td className="center">{b.timelineWeeks}w</td>
                    <td><p>{b.kpiAR}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export CTA */}
        <div className="export-cta">
          <button className="btn-pdf-big" onClick={() => generatePDF(assessment, analysis)}>
            <Download size={20}/> Generate & Download Full PDF Report
            <span className="btn-sub">Consulting-quality report in English + Arabic</span>
          </button>
        </div>
      </div>
    </div>
  );
}
