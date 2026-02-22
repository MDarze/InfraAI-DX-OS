export type Role = 'Manager' | 'Engineer' | 'Finance' | 'Operations';
export type QuestionType = 'single' | 'multi' | 'number' | 'text';
export type Axis =
  | 'Process'
  | 'DailyOps'
  | 'DataFlow'
  | 'Finance'
  | 'Governance'
  | 'Decision'
  | 'Automation'
  | 'AIReadiness';

export interface QuestionOption {
  value: string;
  labelAR: string;
  labelEN: string;
  score: number;
}

export interface Question {
  id: string;
  roles: Role[];
  axis: Axis;
  type: QuestionType;
  textAR: string;
  textEN: string;
  options?: QuestionOption[];
  weight: number;
  tags: string[];
  isNumeric?: boolean;
  numericKey?: string;
  unit?: string;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number | null;
  evidenceNote?: string;
  evidenceRef?: string;
  skipped?: boolean;
}

export interface Respondent {
  id: string;
  role: Role;
  name: string;
  answers: Answer[];
  completedAt?: string;
}

export interface Assessment {
  id: string;
  clientName: string;
  projectName?: string;
  assessorName: string;
  companySize: '<50' | '50-200' | '200+';
  createdAt: string;
  updatedAt: string;
  respondents: Respondent[];
  roiSettings: ROISettings;
  status: 'draft' | 'completed';
}

export interface ROISettings {
  engineersCount: number;
  workingDaysPerWeek: number;
  savingRate: number;
  hourlyCost: number;
  overheadMultiplier: number;
  currency: 'SAR';
}

export interface AxisScore {
  axis: Axis;
  score: number;
  answeredCount: number;
  totalWeight: number;
}

export interface PainSignal {
  id: string;
  labelAR: string;
  labelEN: string;
  value: number;
  unit: string;
  formula: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ROIOutput {
  weeklyHoursLost: number;
  weeklyCostLost: number;
  weeklySavings: number;
  monthlySavings: number;
  yearlySavings: number;
  assumptions: string[];
}

export interface RiskItem {
  id: string;
  titleAR: string;
  titleEN: string;
  probability: 'Low' | 'Med' | 'High';
  impact: 'Low' | 'Med' | 'High';
  mitigation: string;
  mitigationAR: string;
}

export interface BacklogItem {
  id: string;
  epic: string;
  epicAR: string;
  initiative: string;
  initiativeAR: string;
  task: string;
  taskAR: string;
  owner: Role;
  complexity: 'S' | 'M' | 'L';
  prerequisites: string;
  kpi: string;
  kpiAR: string;
  timelineWeeks: number;
}

export interface AnalysisResult {
  axisScores: AxisScore[];
  aggregateScore: number;
  painSignals: PainSignal[];
  roi: ROIOutput;
  risks: RiskItem[];
  backlog: BacklogItem[];
  quickWins: string[];
  quickWinsAR: string[];
  aiOpportunities: string[];
  aiOpportunitiesAR: string[];
  dna: {
    decision: string;
    data: string;
    financial: string;
    governance: string;
  };
}
