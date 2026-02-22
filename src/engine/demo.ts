import type { Assessment, Role } from '../types';
import { QUESTIONS } from '../data/questions';
import { saveAssessment, setActiveId } from '../storage/assessments';

const DEMO_ANSWERS: Record<string, string | number> = {
  p01: 'b', p02: 'b', p03: 'b', p04: 'a', p05: 8,
  do01: 'a', do02: 2.5, do03: 4, do04: 'c', do05: 7,
  do06: 'b', do07: 'b', do08: 6,
  df01: 'b', df02: 'a', df03: 'b', df04: 'b', df05: 'a', df06: 'a',
  fi01: 12, fi02: 'b', fi03: 'b', fi04: 24, fi05: 'b', fi06: 'a', fi07: 'a',
  gc01: 'a', gc02: 'a', gc03: 'a', gc04: 'b', gc05: 8, gc06: 'a', gc07: 'a',
  dr01: 'b', dr02: 3, dr03: 'a', dr04: 'a', dr05: 12, dr06: 'a',
  au01: 'a', au02: 'a', au03: 'a', au04: 'a', au05: 'a',
  ai01: 'b', ai02: 'b', ai03: 'c', ai04: 'b', ai05: 'b', ai06: 'تقليل التقارير وتتبع المواد',
  ai07: 'b', p06: 60, p07: 'a',
};

export function loadDemoAssessment(): Assessment {
  const roles: Role[] = ['Manager', 'Engineer', 'Finance', 'Operations'];
  const names = ['محمد العبدالله', 'أحمد الحربي', 'سارة الموسى', 'خالد الرشيد'];

  const respondents = roles.map((role, i) => {
    const roleQuestions = QUESTIONS.filter(q => q.roles.includes(role));
    const answers = roleQuestions.map(q => {
      const val = DEMO_ANSWERS[q.id];
      return {
        questionId: q.id,
        value: val ?? null,
        skipped: val === undefined,
      };
    });
    return {
      id: crypto.randomUUID(),
      role,
      name: names[i],
      answers,
      completedAt: new Date().toISOString(),
    };
  });

  const demo: Assessment = {
    id: 'demo-' + Date.now(),
    clientName: 'شركة البناء العربية المتحدة',
    projectName: 'تقييم التحول الرقمي 2025',
    assessorName: 'أحمد المحمد - InfraAI',
    companySize: '50-200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    respondents,
    roiSettings: {
      engineersCount: 8,
      workingDaysPerWeek: 5,
      savingRate: 0.35,
      hourlyCost: 85,
      overheadMultiplier: 1.3,
      currency: 'SAR',
    },
    status: 'completed',
  };

  saveAssessment(demo);
  setActiveId(demo.id);
  return demo;
}
