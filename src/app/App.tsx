import { useState, useEffect } from 'react';
import StartScreen from '../components/StartScreen';
import AssessmentHub from '../components/AssessmentHub';
import SurveyScreen from '../components/SurveyScreen';
import ResultsScreen from '../components/ResultsScreen';
import SettingsScreen from '../components/SettingsScreen';
import { getActiveId, getAssessment } from '../storage/assessments';
import type { Assessment, Role } from '../types';

export type Screen = 'start' | 'hub' | 'survey' | 'results' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [activeRole, setActiveRole] = useState<Role>('Manager');

  useEffect(() => {
    const id = getActiveId();
    if (id) {
      const a = getAssessment(id);
      if (a) { setAssessment(a); setScreen('hub'); }
    }
  }, []);

  function refresh() {
    if (assessment) {
      const a = getAssessment(assessment.id);
      if (a) setAssessment(a);
    }
  }

  return (
    <div className="app-shell">
      {screen === 'start' && <StartScreen onCreated={a => { setAssessment(a); setScreen('hub'); }} />}
      {screen === 'hub' && assessment && (
        <AssessmentHub
          assessment={assessment}
          onStartSurvey={(role) => { setActiveRole(role); setScreen('survey'); }}
          onViewResults={() => setScreen('results')}
          onSettings={() => setScreen('settings')}
          onNew={() => setScreen('start')}
          onRefresh={refresh}
        />
      )}
      {screen === 'survey' && assessment && (
        <SurveyScreen assessment={assessment} role={activeRole}
          onDone={() => { refresh(); setScreen('hub'); }} onBack={() => setScreen('hub')} />
      )}
      {screen === 'results' && assessment && (
        <ResultsScreen assessment={assessment} onBack={() => setScreen('hub')} onRefresh={refresh} />
      )}
      {screen === 'settings' && assessment && (
        <SettingsScreen assessment={assessment}
          onSave={(a) => { setAssessment(a); setScreen('hub'); }} onBack={() => setScreen('hub')} />
      )}
    </div>
  );
}
