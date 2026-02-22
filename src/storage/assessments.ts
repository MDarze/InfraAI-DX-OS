import type { Assessment, ROISettings } from '../types';

export const defaultROI: ROISettings = {
  engineersCount: 5,
  workingDaysPerWeek: 5,
  savingRate: 0.35,
  hourlyCost: 75,
  overheadMultiplier: 1.3,
  currency: 'SAR',
};

// ─── In-memory store (localStorage may be blocked in sandboxed iframes) ───
let _assessments: Assessment[] = [];
let _activeId: string | null = null;

// Try localStorage, fall back to memory
function _tryLS(op: () => void) {
  try { op(); } catch { /* sandboxed – ignore */ }
}

function _loadFromLS() {
  try {
    const raw = localStorage.getItem('infraai_assessments');
    if (raw) _assessments = JSON.parse(raw);
    _activeId = localStorage.getItem('infraai_active');
  } catch { /* sandboxed – use memory only */ }
}
_loadFromLS();

function _persist() {
  _tryLS(() => localStorage.setItem('infraai_assessments', JSON.stringify(_assessments)));
  if (_activeId) _tryLS(() => localStorage.setItem('infraai_active', _activeId!));
}

export function listAssessments(): Assessment[] {
  return _assessments;
}

export function saveAssessment(a: Assessment): void {
  _assessments = [{ ...a, updatedAt: new Date().toISOString() }, ..._assessments.filter(x => x.id !== a.id)];
  _persist();
}

export function getAssessment(id: string): Assessment | null {
  return _assessments.find(a => a.id === id) ?? null;
}

export function deleteAssessment(id: string): void {
  _assessments = _assessments.filter(a => a.id !== id);
  _persist();
}

export function setActiveId(id: string): void {
  _activeId = id;
  _tryLS(() => localStorage.setItem('infraai_active', id));
}

export function getActiveId(): string | null {
  return _activeId;
}

export function createAssessment(
  clientName: string,
  assessorName: string,
  companySize: Assessment['companySize'],
  projectName?: string
): Assessment {
  const a: Assessment = {
    id: crypto.randomUUID(),
    clientName,
    projectName,
    assessorName,
    companySize,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    respondents: [],
    roiSettings: { ...defaultROI },
    status: 'draft',
  };
  saveAssessment(a);
  setActiveId(a.id);
  return a;
}
