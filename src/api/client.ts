import { API_BASE_URL } from '../config/api';
import type { Assessment } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `API error ${res.status}`);
  }
  return json.data as T;
}

// ─── localStorage key for backend assessment ID mapping ───────────────────────
const LS_KEY = 'infraai_backend_ids';

function getBackendId(localId: string): string | null {
  try {
    const map = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
    return map[localId] ?? null;
  } catch { return null; }
}

function saveBackendId(localId: string, backendAssessmentId: string) {
  try {
    const map = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
    map[localId] = backendAssessmentId;
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch { /* sandboxed – ignore */ }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Register a new company + blank assessment on the backend.
 * Called from StartScreen when a new assessment is created locally.
 * Uses the local assessment ID as a fallback slug for lookup.
 */
export async function registerAssessment(
  assessment: Assessment,
): Promise<{ companyId: string; assessmentId: string }> {
  // Build a deterministic placeholder email so the backend's unique constraint
  // doesn't collide if the same client is registered twice during demo/testing.
  const slug = assessment.clientName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 40);

  const result = await post<{ companyId: string; assessmentId: string }>('/client/register', {
    name: assessment.clientName,
    companySize: assessment.companySize,
    city: 'Riyadh',          // default — editable by admin later
    industry: 'Construction', // default — editable by admin later
    emirateRegistration: `FE-${assessment.id.slice(0, 8).toUpperCase()}`,
    contactName: assessment.assessorName,
    contactEmail: `${slug}-${assessment.id.slice(0, 6)}@placeholder.infraai`,
    contactPhone: '+966500000000',
  });

  saveBackendId(assessment.id, result.assessmentId);
  return result;
}

/**
 * Submit a completed assessment to the backend.
 * Triggers the scoring engine server-side and persists the report.
 * Called automatically when ResultsScreen is opened.
 */
export async function submitAssessmentToBackend(assessment: Assessment): Promise<void> {
  const backendId = getBackendId(assessment.id);
  if (!backendId) {
    // Assessment was created before backend integration — skip silently.
    console.warn('[InfraAI] No backend assessment ID found for', assessment.id);
    return;
  }

  await post(`/client/assessment/${backendId}/submit`, {
    respondents: assessment.respondents.map(r => ({
      role: r.role,
      name: r.name,
      completedAt: r.completedAt,
      answers: r.answers.map(a => ({
        questionId: a.questionId,
        value: a.value,
        evidenceNote: a.evidenceNote,
        evidenceRef: a.evidenceRef,
        skipped: a.skipped,
      })),
    })),
    roiSettings: assessment.roiSettings,
  });
}
