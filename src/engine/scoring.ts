import type { Assessment, AnalysisResult, AxisScore, Axis, PainSignal, ROIOutput, RiskItem, BacklogItem } from '../types';
import { QUESTIONS } from '../data/questions';

const AXIS_LABELS: Record<Axis, { ar: string; en: string }> = {
  Process:      { ar: 'العمليات والإجراءات', en: 'Process & SOPs' },
  DailyOps:     { ar: 'العمليات اليومية', en: 'Daily Operations' },
  DataFlow:     { ar: 'تدفق البيانات', en: 'Data Flow' },
  Finance:      { ar: 'المالية', en: 'Finance' },
  Governance:   { ar: 'الحوكمة والامتثال', en: 'Governance & Compliance' },
  Decision:     { ar: 'القرارات والمخاطر', en: 'Decision & Risk' },
  Automation:   { ar: 'الأتمتة', en: 'Automation' },
  AIReadiness:  { ar: 'الاستعداد للذكاء الاصطناعي', en: 'AI Readiness' },
};

export { AXIS_LABELS };

function getNumeric(a: Assessment, key: string): number | null {
  for (const r of a.respondents) {
    for (const ans of r.answers) {
      const q = QUESTIONS.find(q => q.id === ans.questionId);
      if (q?.numericKey === key && typeof ans.value === 'number') {
        return ans.value;
      }
    }
  }
  return null;
}

function getScore(a: Assessment, questionId: string): number | null {
  for (const r of a.respondents) {
    for (const ans of r.answers) {
      if (ans.questionId === questionId && !ans.skipped) {
        const q = QUESTIONS.find(q => q.id === questionId);
        if (!q) continue;
        if (q.type === 'single') {
          const opt = q.options?.find(o => o.value === ans.value);
          return opt?.score ?? null;
        }
      }
    }
  }
  return null;
}

export function analyzeAssessment(a: Assessment): AnalysisResult {
  const roi = a.roiSettings;

  // ─── AXIS SCORES ───────────────────────────────────────────────────────────
  const axisTotals: Record<Axis, { weightedSum: number; totalWeight: number; count: number }> = {} as any;
  for (const ax of Object.keys(AXIS_LABELS) as Axis[]) {
    axisTotals[ax] = { weightedSum: 0, totalWeight: 0, count: 0 };
  }

  for (const respondent of a.respondents) {
    for (const ans of respondent.answers) {
      if (ans.skipped) continue;
      const q = QUESTIONS.find(q => q.id === ans.questionId);
      if (!q || q.type === 'text' || q.type === 'number') continue;
      if (q.type === 'single') {
        const opt = q.options?.find(o => o.value === ans.value);
        if (opt) {
          axisTotals[q.axis].weightedSum += opt.score * q.weight;
          axisTotals[q.axis].totalWeight += q.weight;
          axisTotals[q.axis].count++;
        }
      }
    }
  }

  const axisScores: AxisScore[] = (Object.keys(AXIS_LABELS) as Axis[]).map(ax => {
    const t = axisTotals[ax];
    return {
      axis: ax,
      score: t.totalWeight > 0 ? t.weightedSum / t.totalWeight : 0,
      answeredCount: t.count,
      totalWeight: t.totalWeight,
    };
  });

  const validScores = axisScores.filter(a => a.answeredCount > 0);
  const aggregateScore = validScores.length > 0
    ? validScores.reduce((s, a) => s + a.score, 0) / validScores.length
    : 0;

  // ─── NUMERIC PAIN SIGNALS ──────────────────────────────────────────────────
  const reportingHrs = getNumeric(a, 'reportingHoursPerDay') ?? 2;
  const duplicates   = getNumeric(a, 'duplicateEntriesPerDay') ?? 3;
  const reworkPct    = getNumeric(a, 'reworkPct') ?? 10;
  const hoursForClaim = getNumeric(a, 'hoursToPrepareClaim') ?? 8;
  const complianceHrs = getNumeric(a, 'hoursComplianceMonthly') ?? 20;

  const engCount = roi.engineersCount;
  const days = roi.workingDaysPerWeek;
  const hourCost = roi.hourlyCost;

  const weeklyHoursLost = reportingHrs * days * engCount;
  const weeklyCostLost = weeklyHoursLost * hourCost;
  const weeklyDupCost = duplicates * days * hourCost * 0.25; // 15min per entry
  const weeklyReworkCost = (reworkPct / 100) * (hourCost * days * 8 * engCount);

  const painSignals: PainSignal[] = [
    {
      id: 'ps1',
      labelAR: 'ساعات التقارير الضائعة أسبوعياً',
      labelEN: 'Weekly Reporting Hours Lost',
      value: Math.round(weeklyHoursLost * 10) / 10,
      unit: 'hrs/week',
      formula: `${reportingHrs}h/day × ${days} days × ${engCount} engineers`,
      severity: weeklyHoursLost > 30 ? 'high' : weeklyHoursLost > 15 ? 'medium' : 'low',
    },
    {
      id: 'ps2',
      labelAR: 'تكلفة التقارير اليدوية أسبوعياً',
      labelEN: 'Weekly Manual Reporting Cost',
      value: Math.round(weeklyCostLost),
      unit: 'SAR/week',
      formula: `${weeklyHoursLost} hrs × ${hourCost} SAR/hr`,
      severity: weeklyCostLost > 5000 ? 'high' : weeklyCostLost > 2000 ? 'medium' : 'low',
    },
    {
      id: 'ps3',
      labelAR: 'تكلفة تكرار إدخال البيانات أسبوعياً',
      labelEN: 'Weekly Duplicate Entry Cost',
      value: Math.round(weeklyDupCost),
      unit: 'SAR/week',
      formula: `${duplicates} entries × ${days} days × 0.25h × ${hourCost} SAR`,
      severity: weeklyDupCost > 2000 ? 'high' : weeklyDupCost > 500 ? 'medium' : 'low',
    },
    {
      id: 'ps4',
      labelAR: 'تكلفة إعادة العمل أسبوعياً',
      labelEN: 'Weekly Rework Cost',
      value: Math.round(weeklyReworkCost),
      unit: 'SAR/week',
      formula: `${reworkPct}% rework × ${engCount} engineers × ${days} days × 8h × ${hourCost} SAR`,
      severity: weeklyReworkCost > 5000 ? 'high' : weeklyReworkCost > 2000 ? 'medium' : 'low',
    },
    {
      id: 'ps5',
      labelAR: 'ساعات الامتثال الشهرية',
      labelEN: 'Monthly Compliance Hours',
      value: complianceHrs,
      unit: 'hrs/month',
      formula: `Reported directly by Finance`,
      severity: complianceHrs > 40 ? 'high' : complianceHrs > 20 ? 'medium' : 'low',
    },
  ];

  // ─── ROI ──────────────────────────────────────────────────────────────────
  const totalWeeklyLoss = weeklyCostLost + weeklyDupCost + weeklyReworkCost;
  const weeklySavings = totalWeeklyLoss * roi.savingRate * roi.overheadMultiplier;
  const roiOutput: ROIOutput = {
    weeklyHoursLost,
    weeklyCostLost: totalWeeklyLoss,
    weeklySavings: Math.round(weeklySavings),
    monthlySavings: Math.round(weeklySavings * 4.33),
    yearlySavings: Math.round(weeklySavings * 52),
    assumptions: [
      `${engCount} engineers at ${hourCost} SAR/hr`,
      `${days} working days/week`,
      `${roi.savingRate * 100}% efficiency saving rate`,
      `${roi.overheadMultiplier}x overhead multiplier`,
      `Reporting: ${reportingHrs} hrs/day, Rework: ${reworkPct}%, Duplicates: ${duplicates}/day`,
      'These are estimates — actual results may vary ±30%',
    ],
  };

  // ─── DNA LABELS ────────────────────────────────────────────────────────────
  const decScore = axisScores.find(a => a.axis === 'Decision')?.score ?? 2.5;
  const dataScore = axisScores.find(a => a.axis === 'DataFlow')?.score ?? 2.5;
  const finScore = axisScores.find(a => a.axis === 'Finance')?.score ?? 2.5;
  const govScore = axisScores.find(a => a.axis === 'Governance')?.score ?? 2.5;

  const dna = {
    decision:   decScore >= 4 ? 'Data-Driven' : decScore >= 3 ? 'Emerging' : 'Reactive',
    data:       dataScore >= 4 ? 'Unified' : dataScore >= 3 ? 'Partial' : 'Fragmented',
    financial:  finScore >= 4 ? 'High Visibility' : finScore >= 3 ? 'Moderate' : 'Low Visibility',
    governance: govScore >= 4 ? 'Controlled' : govScore >= 3 ? 'Developing' : 'High Risk',
  };

  // ─── RISKS ─────────────────────────────────────────────────────────────────
  const risks: RiskItem[] = [];

  if (govScore < 3) risks.push({
    id: 'r1', probability: 'High', impact: 'High',
    titleEN: 'ZATCA / Zakat Non-Compliance',
    titleAR: 'عدم الامتثال لمتطلبات هيئة الزكاة والضرائب',
    mitigation: 'Implement document hub + compliance checklist + digital archive',
    mitigationAR: 'تطبيق مستودع وثائق رقمي + قوائم تحقق للامتثال',
  });

  if (dataScore < 3) risks.push({
    id: 'r2', probability: 'High', impact: 'High',
    titleEN: 'Data Loss & Fragmentation',
    titleAR: 'ضياع البيانات وتشتتها',
    mitigation: 'Centralize data to single source of truth with backup',
    mitigationAR: 'مركزة البيانات في مصدر واحد مع نسخ احتياطية يومية',
  });

  if (decScore < 3) risks.push({
    id: 'r3', probability: 'Med', impact: 'High',
    titleEN: 'Slow Decision-Making',
    titleAR: 'بطء اتخاذ القرارات التشغيلية',
    mitigation: 'Deploy weekly KPI board + escalation rules',
    mitigationAR: 'لوحة مؤشرات أسبوعية + قواعد تصعيد المشكلات',
  });

  if (reworkPct > 10) risks.push({
    id: 'r4', probability: 'Med', impact: 'Med',
    titleEN: `High Rework Rate (${reworkPct}%)`,
    titleAR: `نسبة إعادة عمل مرتفعة (${reworkPct}%)`,
    mitigation: 'Implement QC checklists + digital daily inspection forms',
    mitigationAR: 'قوائم تحقق جودة + نماذج فحص يومي رقمية',
  });

  if (finScore < 3) risks.push({
    id: 'r5', probability: 'Med', impact: 'High',
    titleEN: 'Cash Flow Blind Spots',
    titleAR: 'نقاط عمياء في التدفق النقدي',
    mitigation: 'Build cost vs. progress dashboard + claims tracker',
    mitigationAR: 'لوحة تكلفة مقابل تقدم + متابعة المستخلصات',
  });

  risks.push({
    id: 'r6', probability: 'Low', impact: 'Med',
    titleEN: 'Key-Person Dependency',
    titleAR: 'الاعتماد على أشخاص بعينهم',
    mitigation: 'Document SOPs + cross-train team members',
    mitigationAR: 'توثيق الإجراءات + تدريب متقاطع للفريق',
  });

  // ─── QUICK WINS ─────────────────────────────────────────────────────────────
  const qw: string[] = [];
  const qwAR: string[] = [];

  if (reportingHrs > 1.5) {
    qw.push('Standardize daily report template (WhatsApp → Google Form)');
    qwAR.push('توحيد نموذج التقرير اليومي (واتساب → Google Form)');
  }
  if (duplicates > 2) {
    qw.push('Create central project log — eliminate parallel entry');
    qwAR.push('إنشاء سجل مشروع مركزي لإزالة إدخال البيانات المتكرر');
  }
  if (govScore < 3) {
    qw.push('Build compliance checklist for ZATCA readiness');
    qwAR.push('بناء قائمة تحقق للاستعداد لمتطلبات الزكاة والضرائب');
  }
  if (dataScore < 3) {
    qw.push('Set up shared Drive with folder structure for all projects');
    qwAR.push('إنشاء مجلد مشترك منظم في Drive لكل المشاريع');
  }
  if (finScore < 3) {
    qw.push('Build weekly cash position sheet — 30 min per week');
    qwAR.push('جدول وضع نقدي أسبوعي — 30 دقيقة أسبوعياً');
  }
  qw.push('Hold weekly 30-min team sync with standard agenda');
  qwAR.push('اجتماع فريق أسبوعي 30 دقيقة بأجندة موحدة');

  // ─── AI OPPORTUNITIES ──────────────────────────────────────────────────────
  const aiScore = axisScores.find(a => a.axis === 'AIReadiness')?.score ?? 2;
  const aiOps: string[] = [];
  const aiOpsAR: string[] = [];

  if (reportingHrs > 1) {
    aiOps.push('AI report summarization — reduce reporting from hours to minutes');
    aiOpsAR.push('تلخيص التقارير بالذكاء الاصطناعي — تقليل وقت التقارير من ساعات لدقائق');
  }
  if (dataScore < 3 || aiScore >= 2) {
    aiOps.push('Anomaly detection — auto-flag cost/schedule deviations');
    aiOpsAR.push('كشف الشذوذ — تنبيه تلقائي عند انحراف التكلفة أو الجدول');
  }
  if (reworkPct > 8) {
    aiOps.push('Computer vision for site inspection — reduce rework');
    aiOpsAR.push('رؤية حاسوبية لفحص المواقع — تقليل إعادة العمل');
  }
  aiOps.push('AI-powered cost estimation from historical project data');
  aiOpsAR.push('تقدير التكاليف بالذكاء الاصطناعي من بيانات المشاريع السابقة');
  aiOps.push('Predictive delay alerts based on field data patterns');
  aiOpsAR.push('تنبيهات تأخير تنبؤية بناءً على أنماط البيانات الميدانية');

  // ─── BACKLOG ──────────────────────────────────────────────────────────────
  const backlog: BacklogItem[] = [
    {
      id: 'bl1',
      epic: 'Data Foundation', epicAR: 'أساس البيانات',
      initiative: 'Central Document Hub', initiativeAR: 'مستودع وثائق مركزي',
      task: 'Setup Drive structure + naming convention', taskAR: 'هيكل Drive + اتفاقية تسمية',
      owner: 'Operations', complexity: 'S',
      prerequisites: 'None',
      kpi: 'All projects accessible in < 30 sec', kpiAR: 'الوصول لأي مشروع < 30 ثانية',
      timelineWeeks: 1,
    },
    {
      id: 'bl2',
      epic: 'Daily Operations', epicAR: 'العمليات اليومية',
      initiative: 'Daily Report Template', initiativeAR: 'نموذج التقرير اليومي',
      task: 'Design + deploy Google Form daily report', taskAR: 'تصميم + نشر نموذج Google للتقرير اليومي',
      owner: 'Engineer', complexity: 'S',
      prerequisites: 'bl1',
      kpi: 'Reporting time < 20 min/day', kpiAR: 'وقت التقرير < 20 دقيقة يومياً',
      timelineWeeks: 2,
    },
    {
      id: 'bl3',
      epic: 'Finance Visibility', epicAR: 'الرؤية المالية',
      initiative: 'Cost vs Progress Dashboard', initiativeAR: 'لوحة التكلفة مقابل التقدم',
      task: 'Build Power BI / Google Sheets dashboard', taskAR: 'بناء داشبورد Power BI / Google Sheets',
      owner: 'Finance', complexity: 'M',
      prerequisites: 'bl1',
      kpi: 'Cash position report in < 10 min', kpiAR: 'تقرير الوضع النقدي < 10 دقائق',
      timelineWeeks: 4,
    },
    {
      id: 'bl4',
      epic: 'Governance', epicAR: 'الحوكمة',
      initiative: 'ZATCA Readiness', initiativeAR: 'الاستعداد لمتطلبات الزكاة',
      task: 'Document archive + compliance checklist', taskAR: 'أرشيف وثائق + قائمة تحقق امتثال',
      owner: 'Finance', complexity: 'M',
      prerequisites: 'bl1',
      kpi: 'Audit-ready in < 1 hour', kpiAR: 'جاهز للتدقيق في < ساعة',
      timelineWeeks: 3,
    },
    {
      id: 'bl5',
      epic: 'Process Automation', epicAR: 'أتمتة العمليات',
      initiative: 'Variation Order Tracker', initiativeAR: 'متتبع طلبات التغيير',
      task: 'Digital VO form + approval workflow', taskAR: 'نموذج VO رقمي + سير موافقات',
      owner: 'Manager', complexity: 'M',
      prerequisites: 'bl2',
      kpi: 'VO cycle time < 5 days', kpiAR: 'دورة VO < 5 أيام',
      timelineWeeks: 5,
    },
    {
      id: 'bl6',
      epic: 'AI Integration', epicAR: 'تكامل الذكاء الاصطناعي',
      initiative: 'AI Report Summarizer', initiativeAR: 'ملخص تقارير بالذكاء الاصطناعي',
      task: 'Pilot GPT-4 summary on daily field reports', taskAR: 'تجربة تلخيص التقارير الميدانية بـ GPT-4',
      owner: 'Operations', complexity: 'S',
      prerequisites: 'bl2',
      kpi: '70% reduction in report prep time', kpiAR: 'تقليل 70% في وقت التقرير',
      timelineWeeks: 6,
    },
    {
      id: 'bl7',
      epic: 'Decision Intelligence', epicAR: 'ذكاء القرار',
      initiative: 'KPI Weekly Board', initiativeAR: 'لوحة مؤشرات أسبوعية',
      task: 'Deploy 5-metric weekly dashboard + alert rules', taskAR: 'داشبورد 5 مؤشرات أسبوعية + قواعد تنبيه',
      owner: 'Manager', complexity: 'M',
      prerequisites: 'bl3',
      kpi: 'Decision latency < 24 hours', kpiAR: 'تأخر القرار < 24 ساعة',
      timelineWeeks: 8,
    },
    {
      id: 'bl8',
      epic: 'Field Digitization', epicAR: 'رقمنة الميدان',
      initiative: 'Mobile Field App', initiativeAR: 'تطبيق ميداني',
      task: 'Deploy offline-capable field reporting app', taskAR: 'نشر تطبيق ميداني يعمل بدون إنترنت',
      owner: 'Engineer', complexity: 'L',
      prerequisites: 'bl1,bl2',
      kpi: '100% field reports digital', kpiAR: '100% تقارير ميدانية رقمية',
      timelineWeeks: 12,
    },
  ];

  return {
    axisScores,
    aggregateScore: Math.round(aggregateScore * 10) / 10,
    painSignals,
    roi: roiOutput,
    risks,
    backlog,
    quickWins: qw,
    quickWinsAR: qwAR,
    aiOpportunities: aiOps,
    aiOpportunitiesAR: aiOpsAR,
    dna,
  };
}
