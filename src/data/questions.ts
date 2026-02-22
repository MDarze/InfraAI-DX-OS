import type { Question } from '../types';

export const QUESTIONS: Question[] = [
  // ─── PROCESS ───────────────────────────────────────────────────────────────
  {
    id: 'p01', roles: ['Manager','Engineer','Operations'], axis: 'Process',
    type: 'single', weight: 1.5,
    textAR: 'كيف يتم استلام مستندات المشروع عند البدء (العقد، الرسومات، الجدول الزمني)؟',
    textEN: 'How are project kick-off documents received (contract, drawings, schedule)?',
    options: [
      { value: 'a', labelAR: 'ورقياً فقط', labelEN: 'Paper only', score: 1 },
      { value: 'b', labelAR: 'واتساب أو بريد إلكتروني', labelEN: 'WhatsApp or email', score: 2 },
      { value: 'c', labelAR: 'مجلد مشترك (Drive/SharePoint)', labelEN: 'Shared folder', score: 3 },
      { value: 'd', labelAR: 'نظام إدارة وثائق مخصص', labelEN: 'Dedicated DMS', score: 5 },
    ],
    tags: ['kickoff','docs']
  },
  {
    id: 'p02', roles: ['Manager','Operations'], axis: 'Process',
    type: 'single', weight: 1.2,
    textAR: 'هل يوجد إجراء موثق لكل نشاط تشغيلي رئيسي؟',
    textEN: 'Are documented SOPs in place for each core operational activity?',
    options: [
      { value: 'a', labelAR: 'لا يوجد توثيق', labelEN: 'No documentation', score: 1 },
      { value: 'b', labelAR: 'بعض الإجراءات موثقة غير رسمية', labelEN: 'Some informal docs', score: 2 },
      { value: 'c', labelAR: 'إجراءات موثقة لكن غير محدثة', labelEN: 'Documented but outdated', score: 3 },
      { value: 'd', labelAR: 'إجراءات موثقة ومحدثة بانتظام', labelEN: 'Documented and regularly updated', score: 5 },
    ],
    tags: ['sop','process']
  },
  {
    id: 'p03', roles: ['Manager','Engineer'], axis: 'Process',
    type: 'single', weight: 1,
    textAR: 'كيف يتم تسليم المشروع النهائي للعميل؟',
    textEN: 'How is the final project handover handled?',
    options: [
      { value: 'a', labelAR: 'شفهياً بدون وثائق', labelEN: 'Verbal, no documentation', score: 1 },
      { value: 'b', labelAR: 'محاضر اجتماعات فقط', labelEN: 'Meeting minutes only', score: 2 },
      { value: 'c', labelAR: 'حزمة وثائق تسليم مكتوبة', labelEN: 'Written handover package', score: 3 },
      { value: 'd', labelAR: 'إجراء تسليم رقمي موحد مع توقيعات إلكترونية', labelEN: 'Digital handover with e-signatures', score: 5 },
    ],
    tags: ['handover','delivery']
  },
  {
    id: 'p04', roles: ['Engineer','Operations'], axis: 'Process',
    type: 'single', weight: 1,
    textAR: 'كيف تتم إدارة طلبات التغيير (Variation Orders)؟',
    textEN: 'How are variation orders managed?',
    options: [
      { value: 'a', labelAR: 'شفهياً أو عبر واتساب', labelEN: 'Verbally or via WhatsApp', score: 1 },
      { value: 'b', labelAR: 'بريد إلكتروني بدون قالب محدد', labelEN: 'Email without template', score: 2 },
      { value: 'c', labelAR: 'نموذج موحد ورقي أو Excel', labelEN: 'Standard form (paper/Excel)', score: 3 },
      { value: 'd', labelAR: 'نظام رقمي مع تتبع وموافقة إلكترونية', labelEN: 'Digital system with approval tracking', score: 5 },
    ],
    tags: ['variation','change-management']
  },
  {
    id: 'p05', roles: ['Manager'], axis: 'Process',
    type: 'number', weight: 1.5,
    textAR: 'كم يوماً في المتوسط يستغرق إغلاق طلب تغيير (VO) من البداية للموافقة؟',
    textEN: 'How many days on average to close a variation order from submission to approval?',
    isNumeric: true, numericKey: 'daysToCloseVO', unit: 'days',
    tags: ['variation','cycle-time']
  },

  // ─── DAILY OPS ────────────────────────────────────────────────────────────
  {
    id: 'do01', roles: ['Engineer','Operations'], axis: 'DailyOps',
    type: 'single', weight: 1.5,
    textAR: 'كيف تتواصل الفرق الميدانية مع المكتب يومياً؟',
    textEN: 'How do field teams communicate with the office daily?',
    options: [
      { value: 'a', labelAR: 'واتساب فقط', labelEN: 'WhatsApp only', score: 1 },
      { value: 'b', labelAR: 'واتساب + مكالمات هاتفية', labelEN: 'WhatsApp + phone calls', score: 2 },
      { value: 'c', labelAR: 'تقارير يومية بالبريد الإلكتروني', labelEN: 'Daily email reports', score: 3 },
      { value: 'd', labelAR: 'تطبيق ميداني مخصص', labelEN: 'Dedicated field app', score: 5 },
    ],
    tags: ['field','communication']
  },
  {
    id: 'do02', roles: ['Engineer','Operations'], axis: 'DailyOps',
    type: 'number', weight: 2,
    textAR: 'كم ساعة يستغرق المهندس يومياً في إعداد تقارير التقدم؟',
    textEN: 'How many hours/day does an engineer spend preparing progress reports?',
    isNumeric: true, numericKey: 'reportingHoursPerDay', unit: 'hours',
    tags: ['reporting','daily-ops']
  },
  {
    id: 'do03', roles: ['Engineer','Operations'], axis: 'DailyOps',
    type: 'number', weight: 1.5,
    textAR: 'كم مرة يتم إدخال نفس البيانات في أنظمة أو ملفات مختلفة يومياً؟',
    textEN: 'How many duplicate data entries occur daily across different systems/files?',
    isNumeric: true, numericKey: 'duplicateEntriesPerDay', unit: 'times',
    tags: ['duplicate','data-entry']
  },
  {
    id: 'do04', roles: ['Manager','Engineer'], axis: 'DailyOps',
    type: 'single', weight: 1,
    textAR: 'كيف يتم تتبع التقدم الفعلي للمشروع مقابل الخطة؟',
    textEN: 'How is actual project progress tracked vs. the plan?',
    options: [
      { value: 'a', labelAR: 'لا يوجد تتبع منتظم', labelEN: 'No regular tracking', score: 1 },
      { value: 'b', labelAR: 'اجتماعات أسبوعية شفهية', labelEN: 'Weekly verbal meetings', score: 2 },
      { value: 'c', labelAR: 'Excel أو PowerPoint يدوي', labelEN: 'Manual Excel/PowerPoint', score: 3 },
      { value: 'd', labelAR: 'لوحة تحكم رقمية لحظية', labelEN: 'Real-time digital dashboard', score: 5 },
    ],
    tags: ['progress','tracking']
  },
  {
    id: 'do05', roles: ['Operations'], axis: 'DailyOps',
    type: 'number', weight: 1,
    textAR: 'كم عدد المشاريع النشطة التي يديرها الفريق حالياً؟',
    textEN: 'How many active projects is the team currently managing?',
    isNumeric: true, numericKey: 'activeProjectsCount', unit: 'projects',
    tags: ['capacity']
  },
  {
    id: 'do06', roles: ['Engineer','Operations'], axis: 'DailyOps',
    type: 'single', weight: 1.2,
    textAR: 'كيف يتم تسجيل العمل اليومي للعمال (حضور + إنجاز)؟',
    textEN: 'How is daily labor tracking recorded (attendance + productivity)?',
    options: [
      { value: 'a', labelAR: 'ورقياً فقط', labelEN: 'Paper only', score: 1 },
      { value: 'b', labelAR: 'واتساب أو مكالمة هاتفية', labelEN: 'WhatsApp/phone', score: 2 },
      { value: 'c', labelAR: 'Excel يتم تحديثه يدوياً', labelEN: 'Manual Excel update', score: 3 },
      { value: 'd', labelAR: 'نظام رقمي متكامل مع GPS', labelEN: 'Digital system with GPS', score: 5 },
    ],
    tags: ['labor','attendance']
  },

  // ─── DATA FLOW ────────────────────────────────────────────────────────────
  {
    id: 'df01', roles: ['Manager','Engineer','Finance'], axis: 'DataFlow',
    type: 'single', weight: 1.5,
    textAR: 'كيف يتم مشاركة البيانات بين الأقسام المختلفة؟',
    textEN: 'How is data shared between departments?',
    options: [
      { value: 'a', labelAR: 'واتساب ورسائل مباشرة', labelEN: 'WhatsApp/direct messages', score: 1 },
      { value: 'b', labelAR: 'بريد إلكتروني بدون قالب', labelEN: 'Email without template', score: 2 },
      { value: 'c', labelAR: 'مجلدات مشتركة (Drive)', labelEN: 'Shared folders', score: 3 },
      { value: 'd', labelAR: 'نظام مركزي متكامل', labelEN: 'Integrated central system', score: 5 },
    ],
    tags: ['data-sharing','integration']
  },
  {
    id: 'df02', roles: ['Manager','Operations'], axis: 'DataFlow',
    type: 'single', weight: 1.2,
    textAR: 'ما هو عدد الأدوات والأنظمة المستخدمة بشكل متوازٍ في العمل؟',
    textEN: 'How many tools/systems are used in parallel for operations?',
    options: [
      { value: 'a', labelAR: '6 أدوات أو أكثر', labelEN: '6+ tools', score: 1 },
      { value: 'b', labelAR: '4-5 أدوات', labelEN: '4-5 tools', score: 2 },
      { value: 'c', labelAR: '2-3 أدوات', labelEN: '2-3 tools', score: 3 },
      { value: 'd', labelAR: 'نظام واحد متكامل', labelEN: 'Single integrated system', score: 5 },
    ],
    tags: ['fragmentation','tools']
  },
  {
    id: 'df03', roles: ['Engineer','Operations'], axis: 'DataFlow',
    type: 'single', weight: 1,
    textAR: 'أين يتم تخزين البيانات الميدانية؟',
    textEN: 'Where is field data stored?',
    options: [
      { value: 'a', labelAR: 'في الهواتف الشخصية للمهندسين', labelEN: 'On personal phones', score: 1 },
      { value: 'b', labelAR: 'مجلدات واتساب وذاكرة الهاتف', labelEN: 'WhatsApp folders & phone memory', score: 1 },
      { value: 'c', labelAR: 'Google Drive مشترك', labelEN: 'Shared Google Drive', score: 3 },
      { value: 'd', labelAR: 'قاعدة بيانات مركزية مؤمنة', labelEN: 'Secure central database', score: 5 },
    ],
    tags: ['storage','field-data']
  },
  {
    id: 'df04', roles: ['Manager','Finance'], axis: 'DataFlow',
    type: 'single', weight: 1.3,
    textAR: 'كم من الوقت يستغرق الحصول على تقرير شامل لوضع مشروع معين؟',
    textEN: 'How long does it take to get a comprehensive status report for a project?',
    options: [
      { value: 'a', labelAR: 'أكثر من يومين', labelEN: 'More than 2 days', score: 1 },
      { value: 'b', labelAR: 'يوم كامل', labelEN: 'A full day', score: 2 },
      { value: 'c', labelAR: 'ساعات قليلة', labelEN: 'A few hours', score: 3 },
      { value: 'd', labelAR: 'لحظياً أو خلال دقائق', labelEN: 'Instantly / within minutes', score: 5 },
    ],
    tags: ['reporting','latency']
  },

  // ─── FINANCE ──────────────────────────────────────────────────────────────
  {
    id: 'fi01', roles: ['Finance','Manager'], axis: 'Finance',
    type: 'number', weight: 2,
    textAR: 'كم ساعة تستغرق عملية إعداد وتقديم فاتورة المستخلص للعميل؟',
    textEN: 'How many hours does it take to prepare and submit a progress invoice/claim?',
    isNumeric: true, numericKey: 'hoursToPrepareClaim', unit: 'hours',
    tags: ['invoicing','claims']
  },
  {
    id: 'fi02', roles: ['Finance'], axis: 'Finance',
    type: 'single', weight: 1.5,
    textAR: 'كيف يتم متابعة التدفق النقدي للمشروع؟',
    textEN: 'How is project cash flow monitored?',
    options: [
      { value: 'a', labelAR: 'لا يوجد متابعة منتظمة', labelEN: 'No regular monitoring', score: 1 },
      { value: 'b', labelAR: 'جداول Excel يدوية', labelEN: 'Manual Excel sheets', score: 2 },
      { value: 'c', labelAR: 'تقارير شهرية معتمدة', labelEN: 'Monthly approved reports', score: 3 },
      { value: 'd', labelAR: 'لوحة تحكم مالية لحظية', labelEN: 'Real-time financial dashboard', score: 5 },
    ],
    tags: ['cashflow','finance']
  },
  {
    id: 'fi03', roles: ['Finance','Manager'], axis: 'Finance',
    type: 'single', weight: 1.2,
    textAR: 'ما مدى دقة الميزانية التقديرية للمشروع مقارنة بالفعلي عند الإغلاق؟',
    textEN: 'How accurate is the project budget estimate vs. actual at completion?',
    options: [
      { value: 'a', labelAR: 'انحراف أكثر من 30%', labelEN: '>30% deviation', score: 1 },
      { value: 'b', labelAR: 'انحراف 15-30%', labelEN: '15-30% deviation', score: 2 },
      { value: 'c', labelAR: 'انحراف 5-15%', labelEN: '5-15% deviation', score: 3 },
      { value: 'd', labelAR: 'انحراف أقل من 5%', labelEN: '<5% deviation', score: 5 },
    ],
    tags: ['budget','accuracy']
  },
  {
    id: 'fi04', roles: ['Finance'], axis: 'Finance',
    type: 'number', weight: 1.5,
    textAR: 'كم ساعة تستغرق إعداد مستندات الامتثال الضريبي والزكاة شهرياً؟',
    textEN: 'How many hours/month are spent preparing Zakat/tax compliance documents?',
    isNumeric: true, numericKey: 'hoursComplianceMonthly', unit: 'hours/month',
    tags: ['zakat','compliance','finance']
  },
  {
    id: 'fi05', roles: ['Finance','Manager'], axis: 'Finance',
    type: 'single', weight: 1,
    textAR: 'هل يوجد نظام لتتبع تكاليف كل مشروع بشكل منفصل؟',
    textEN: 'Is there a system to track costs per project separately?',
    options: [
      { value: 'a', labelAR: 'لا يوجد', labelEN: 'No', score: 1 },
      { value: 'b', labelAR: 'Excel منفصل لكل مشروع', labelEN: 'Separate Excel per project', score: 2 },
      { value: 'c', labelAR: 'محاسبة يدوية مع فصل جزئي', labelEN: 'Manual accounting with partial separation', score: 3 },
      { value: 'd', labelAR: 'نظام ERP أو محاسبي متكامل', labelEN: 'Integrated ERP/accounting system', score: 5 },
    ],
    tags: ['cost-control','project-accounting']
  },
  {
    id: 'fi06', roles: ['Finance'], axis: 'Finance',
    type: 'single', weight: 1.2,
    textAR: 'كيف تتم إدارة مطالبات المقاولين من الباطن والدفع لهم؟',
    textEN: 'How are subcontractor claims and payments managed?',
    options: [
      { value: 'a', labelAR: 'شفهياً أو واتساب', labelEN: 'Verbally or WhatsApp', score: 1 },
      { value: 'b', labelAR: 'Excel يدوي', labelEN: 'Manual Excel', score: 2 },
      { value: 'c', labelAR: 'نظام محاسبي مع موافقة', labelEN: 'Accounting system with approval', score: 4 },
      { value: 'd', labelAR: 'بوابة متكاملة مع المقاولين', labelEN: 'Integrated subcontractor portal', score: 5 },
    ],
    tags: ['subcontractor','payments']
  },

  // ─── GOVERNANCE & COMPLIANCE ──────────────────────────────────────────────
  {
    id: 'gc01', roles: ['Manager','Finance'], axis: 'Governance',
    type: 'single', weight: 1.5,
    textAR: 'ما مستوى الاستعداد للتدقيق الحكومي أو الزكاة؟',
    textEN: 'What is the readiness level for government audit or Zakat inspection?',
    options: [
      { value: 'a', labelAR: 'لا تتوفر وثائق منظمة', labelEN: 'No organized documents', score: 1 },
      { value: 'b', labelAR: 'وثائق جزئية تحتاج تجميع', labelEN: 'Partial docs needing consolidation', score: 2 },
      { value: 'c', labelAR: 'وثائق كاملة لكن تجميعها يستغرق وقتاً', labelEN: 'Complete docs but takes time to gather', score: 3 },
      { value: 'd', labelAR: 'جاهز للتدقيق في أي وقت', labelEN: 'Audit-ready at any time', score: 5 },
    ],
    tags: ['audit','zakat','compliance']
  },
  {
    id: 'gc02', roles: ['Manager'], axis: 'Governance',
    type: 'single', weight: 1.2,
    textAR: 'هل توجد صلاحيات وتوقيعات إلكترونية معتمدة للمستندات الداخلية؟',
    textEN: 'Are there approved digital signatures and authorization levels for internal docs?',
    options: [
      { value: 'a', labelAR: 'لا يوجد', labelEN: 'No', score: 1 },
      { value: 'b', labelAR: 'بعض الوثائق فقط', labelEN: 'Some documents only', score: 2 },
      { value: 'c', labelAR: 'أغلب الوثائق الرسمية', labelEN: 'Most official documents', score: 4 },
      { value: 'd', labelAR: 'نظام متكامل بصلاحيات محددة', labelEN: 'Integrated system with defined roles', score: 5 },
    ],
    tags: ['authorization','digital-signature']
  },
  {
    id: 'gc03', roles: ['Manager','Operations'], axis: 'Governance',
    type: 'single', weight: 1,
    textAR: 'هل يوجد سجل Audit Trail لتتبع من غيّر ماذا في المستندات؟',
    textEN: 'Is there an Audit Trail to track who changed what in documents?',
    options: [
      { value: 'a', labelAR: 'لا يوجد', labelEN: 'No', score: 1 },
      { value: 'b', labelAR: 'جزئي في بعض الأنظمة', labelEN: 'Partial in some systems', score: 3 },
      { value: 'c', labelAR: 'موجود ولكن يدوي', labelEN: 'Exists but manual', score: 3 },
      { value: 'd', labelAR: 'تلقائي في كل الأنظمة', labelEN: 'Automatic across all systems', score: 5 },
    ],
    tags: ['audit-trail','governance']
  },
  {
    id: 'gc04', roles: ['Finance','Manager'], axis: 'Governance',
    type: 'single', weight: 1.3,
    textAR: 'ما مدى التزام الشركة بمتطلبات نظام الفوترة الإلكترونية (ZATCA فيمكن)؟',
    textEN: 'How compliant is the company with ZATCA e-invoicing requirements?',
    options: [
      { value: 'a', labelAR: 'لا نعرف المتطلبات', labelEN: 'Not aware of requirements', score: 1 },
      { value: 'b', labelAR: 'نعرف لكن لم ننفذ', labelEN: 'Aware but not implemented', score: 2 },
      { value: 'c', labelAR: 'تنفيذ جزئي', labelEN: 'Partially implemented', score: 3 },
      { value: 'd', labelAR: 'متوافقون بالكامل', labelEN: 'Fully compliant', score: 5 },
    ],
    tags: ['zatca','einvoicing','compliance']
  },
  {
    id: 'gc05', roles: ['Manager'], axis: 'Governance',
    type: 'number', weight: 1.5,
    textAR: 'كم ساعة أسبوعياً تُصرف في تقارير الامتثال الداخلية والخارجية؟',
    textEN: 'How many hours/week are spent on internal & external compliance reports?',
    isNumeric: true, numericKey: 'complianceReportingHrsWeek', unit: 'hours/week',
    tags: ['compliance','reporting']
  },

  // ─── DECISION & RISK ──────────────────────────────────────────────────────
  {
    id: 'dr01', roles: ['Manager'], axis: 'Decision',
    type: 'single', weight: 1.5,
    textAR: 'كيف تتم عملية اتخاذ القرارات الكبيرة في المشروع؟',
    textEN: 'How are major project decisions made?',
    options: [
      { value: 'a', labelAR: 'حسب الخبرة الشخصية فقط', labelEN: 'Based on personal experience only', score: 1 },
      { value: 'b', labelAR: 'اجتماعات مع رأي الفريق', labelEN: 'Meetings with team input', score: 2 },
      { value: 'c', labelAR: 'بناءً على تقارير ومؤشرات', labelEN: 'Based on reports and KPIs', score: 4 },
      { value: 'd', labelAR: 'لوحة تحكم + تحليل بيانات + رأي الفريق', labelEN: 'Dashboard + data analysis + team', score: 5 },
    ],
    tags: ['decision','leadership']
  },
  {
    id: 'dr02', roles: ['Manager','Engineer'], axis: 'Decision',
    type: 'number', weight: 1.5,
    textAR: 'كم يوماً يمر في المتوسط بين ظهور مشكلة ميدانية والقرار بشأنها؟',
    textEN: 'How many days on average between a field issue appearing and a decision being made?',
    isNumeric: true, numericKey: 'decisionLatencyDays', unit: 'days',
    tags: ['decision','latency']
  },
  {
    id: 'dr03', roles: ['Manager'], axis: 'Decision',
    type: 'single', weight: 1.2,
    textAR: 'هل يوجد نظام مبكر للإنذار بالمخاطر التشغيلية؟',
    textEN: 'Is there an early warning system for operational risks?',
    options: [
      { value: 'a', labelAR: 'لا يوجد', labelEN: 'No', score: 1 },
      { value: 'b', labelAR: 'تحذيرات غير رسمية شفهية', labelEN: 'Informal verbal warnings', score: 2 },
      { value: 'c', labelAR: 'تقارير أسبوعية تتضمن مخاطر', labelEN: 'Weekly reports including risks', score: 3 },
      { value: 'd', labelAR: 'نظام تنبيه تلقائي بالمخاطر', labelEN: 'Automated risk alert system', score: 5 },
    ],
    tags: ['risk','early-warning']
  },
  {
    id: 'dr04', roles: ['Manager','Finance'], axis: 'Decision',
    type: 'single', weight: 1,
    textAR: 'هل يتوفر لديكم سجل رسمي للمخاطر (Risk Register) للمشاريع؟',
    textEN: 'Do you have a formal Risk Register for projects?',
    options: [
      { value: 'a', labelAR: 'لا يوجد', labelEN: 'No', score: 1 },
      { value: 'b', labelAR: 'غير رسمي (ملاحظات فردية)', labelEN: 'Informal (individual notes)', score: 2 },
      { value: 'c', labelAR: 'Excel أو مستند مشترك', labelEN: 'Excel or shared doc', score: 3 },
      { value: 'd', labelAR: 'نظام رسمي مع مراجعة دورية', labelEN: 'Formal system with periodic review', score: 5 },
    ],
    tags: ['risk-register','governance']
  },
  {
    id: 'dr05', roles: ['Engineer','Operations'], axis: 'Decision',
    type: 'number', weight: 1.2,
    textAR: 'ما نسبة إعادة العمل (Rework) التقريبية في مشاريعكم؟ (%)',
    textEN: 'Approximate rework percentage in your projects? (%)',
    isNumeric: true, numericKey: 'reworkPct', unit: '%',
    tags: ['rework','quality']
  },

  // ─── AUTOMATION ───────────────────────────────────────────────────────────
  {
    id: 'au01', roles: ['Manager','Operations'], axis: 'Automation',
    type: 'single', weight: 1.5,
    textAR: 'ما حجم المهام المتكررة التي يتم أتمتتها حالياً؟',
    textEN: 'What portion of repetitive tasks are currently automated?',
    options: [
      { value: 'a', labelAR: 'لا شيء مؤتمت', labelEN: 'Nothing automated', score: 1 },
      { value: 'b', labelAR: 'أقل من 20%', labelEN: 'Less than 20%', score: 2 },
      { value: 'c', labelAR: '20-50%', labelEN: '20-50%', score: 3 },
      { value: 'd', labelAR: 'أكثر من 50%', labelEN: 'More than 50%', score: 5 },
    ],
    tags: ['automation','efficiency']
  },
  {
    id: 'au02', roles: ['Operations','Finance'], axis: 'Automation',
    type: 'single', weight: 1.2,
    textAR: 'هل يتم إرسال التقارير للإدارة تلقائياً أم يدوياً؟',
    textEN: 'Are management reports sent automatically or manually?',
    options: [
      { value: 'a', labelAR: 'يدوياً بالكامل', labelEN: 'Fully manual', score: 1 },
      { value: 'b', labelAR: 'يدوي مع قوالب', labelEN: 'Manual with templates', score: 2 },
      { value: 'c', labelAR: 'شبه آلي (Excel Macro)', labelEN: 'Semi-automated (Excel Macro)', score: 3 },
      { value: 'd', labelAR: 'تلقائي بالكامل', labelEN: 'Fully automated', score: 5 },
    ],
    tags: ['reporting','automation']
  },
  {
    id: 'au03', roles: ['Finance'], axis: 'Automation',
    type: 'single', weight: 1,
    textAR: 'هل يتم إنشاء الفواتير تلقائياً من بيانات التقدم؟',
    textEN: 'Are invoices auto-generated from progress data?',
    options: [
      { value: 'a', labelAR: 'لا، كل شيء يدوي', labelEN: 'No, all manual', score: 1 },
      { value: 'b', labelAR: 'جزء يدوي وجزء آلي', labelEN: 'Partially automated', score: 3 },
      { value: 'c', labelAR: 'نعم، تلقائي بالكامل', labelEN: 'Yes, fully automated', score: 5 },
    ],
    tags: ['invoicing','automation']
  },
  {
    id: 'au04', roles: ['Engineer','Operations'], axis: 'Automation',
    type: 'single', weight: 1,
    textAR: 'هل يتم جدولة الأنشطة الميدانية آلياً بناءً على تقدم المشروع؟',
    textEN: 'Is field activity scheduling automated based on project progress?',
    options: [
      { value: 'a', labelAR: 'لا، يدوي بالكامل', labelEN: 'No, fully manual', score: 1 },
      { value: 'b', labelAR: 'Excel يدوي', labelEN: 'Manual Excel', score: 2 },
      { value: 'c', labelAR: 'برنامج جدولة (MS Project)', labelEN: 'Scheduling software (MS Project)', score: 3 },
      { value: 'd', labelAR: 'جدولة آلية ذكية', labelEN: 'Smart automated scheduling', score: 5 },
    ],
    tags: ['scheduling','automation']
  },

  // ─── AI READINESS ─────────────────────────────────────────────────────────
  {
    id: 'ai01', roles: ['Manager'], axis: 'AIReadiness',
    type: 'single', weight: 1.5,
    textAR: 'ما مستوى اهتمام الإدارة العليا بالذكاء الاصطناعي؟',
    textEN: 'What is senior management\'s interest level in AI?',
    options: [
      { value: 'a', labelAR: 'لا اهتمام', labelEN: 'No interest', score: 1 },
      { value: 'b', labelAR: 'فضول فقط', labelEN: 'Curious only', score: 2 },
      { value: 'c', labelAR: 'نريد تجربته', labelEN: 'Want to try it', score: 3 },
      { value: 'd', labelAR: 'أولوية استراتيجية', labelEN: 'Strategic priority', score: 5 },
    ],
    tags: ['ai','leadership']
  },
  {
    id: 'ai02', roles: ['Manager','Engineer'], axis: 'AIReadiness',
    type: 'single', weight: 1.2,
    textAR: 'هل يوجد بيانات تاريخية منظمة يمكن استخدامها لتدريب نماذج الذكاء الاصطناعي؟',
    textEN: 'Is there organized historical data available to train AI models?',
    options: [
      { value: 'a', labelAR: 'لا يوجد بيانات منظمة', labelEN: 'No organized data', score: 1 },
      { value: 'b', labelAR: 'بيانات مبعثرة في ملفات', labelEN: 'Scattered in files', score: 2 },
      { value: 'c', labelAR: 'بيانات جزئية منظمة', labelEN: 'Partially organized data', score: 3 },
      { value: 'd', labelAR: 'قاعدة بيانات منظمة وكاملة', labelEN: 'Complete organized database', score: 5 },
    ],
    tags: ['ai','data-quality']
  },
  {
    id: 'ai03', roles: ['Manager','Engineer'], axis: 'AIReadiness',
    type: 'single', weight: 1,
    textAR: 'هل الفريق على استعداد لتعلم واستخدام أدوات الذكاء الاصطناعي؟',
    textEN: 'Is the team ready to learn and use AI tools?',
    options: [
      { value: 'a', labelAR: 'مقاومة شديدة', labelEN: 'Strong resistance', score: 1 },
      { value: 'b', labelAR: 'تردد وشكوك', labelEN: 'Hesitant and skeptical', score: 2 },
      { value: 'c', labelAR: 'استعداد مشروط', labelEN: 'Conditionally ready', score: 3 },
      { value: 'd', labelAR: 'متحمسون ومستعدون', labelEN: 'Enthusiastic and ready', score: 5 },
    ],
    tags: ['ai','change-management']
  },
  {
    id: 'ai04', roles: ['Manager','Finance'], axis: 'AIReadiness',
    type: 'single', weight: 1.2,
    textAR: 'هل يوجد ميزانية مخصصة للتحول الرقمي والذكاء الاصطناعي؟',
    textEN: 'Is there a dedicated budget for digital transformation and AI?',
    options: [
      { value: 'a', labelAR: 'لا يوجد ميزانية', labelEN: 'No budget', score: 1 },
      { value: 'b', labelAR: 'ميزانية عند الحاجة', labelEN: 'Budget on demand', score: 2 },
      { value: 'c', labelAR: 'ميزانية سنوية محدودة', labelEN: 'Limited annual budget', score: 3 },
      { value: 'd', labelAR: 'ميزانية مخصصة وواضحة', labelEN: 'Clear dedicated budget', score: 5 },
    ],
    tags: ['ai','budget']
  },
  {
    id: 'ai05', roles: ['Engineer','Operations'], axis: 'AIReadiness',
    type: 'single', weight: 1,
    textAR: 'هل تستخدم الشركة حالياً أي أداة ذكاء اصطناعي (ChatGPT, Copilot, إلخ)؟',
    textEN: 'Does the company currently use any AI tool (ChatGPT, Copilot, etc.)?',
    options: [
      { value: 'a', labelAR: 'لا', labelEN: 'No', score: 1 },
      { value: 'b', labelAR: 'نعم، بشكل غير رسمي أحياناً', labelEN: 'Yes, informally sometimes', score: 3 },
      { value: 'c', labelAR: 'نعم، في بعض الأقسام', labelEN: 'Yes, in some departments', score: 4 },
      { value: 'd', labelAR: 'نعم، ضمن إجراءات العمل', labelEN: 'Yes, embedded in workflows', score: 5 },
    ],
    tags: ['ai','current-state']
  },

  // ─── ADDITIONAL DEEP QUESTIONS ────────────────────────────────────────────
  {
    id: 'p06', roles: ['Manager','Engineer'], axis: 'Process',
    type: 'number', weight: 1.2,
    textAR: 'ما نسبة المهام التي تنجز في موعدها المحدد؟ (%)',
    textEN: 'What percentage of tasks are completed on time? (%)',
    isNumeric: true, numericKey: 'onTimeDeliveryPct', unit: '%',
    tags: ['delivery','schedule']
  },
  {
    id: 'do07', roles: ['Engineer'], axis: 'DailyOps',
    type: 'single', weight: 1,
    textAR: 'كيف يتم رفع تقارير السلامة (HSE) الميدانية؟',
    textEN: 'How are HSE field safety reports submitted?',
    options: [
      { value: 'a', labelAR: 'لا توجد تقارير منتظمة', labelEN: 'No regular reports', score: 1 },
      { value: 'b', labelAR: 'ورقياً', labelEN: 'Paper-based', score: 2 },
      { value: 'c', labelAR: 'بريد إلكتروني أو واتساب', labelEN: 'Email or WhatsApp', score: 3 },
      { value: 'd', labelAR: 'نظام HSE رقمي', labelEN: 'Digital HSE system', score: 5 },
    ],
    tags: ['hse','safety']
  },
  {
    id: 'df05', roles: ['Manager','Operations'], axis: 'DataFlow',
    type: 'single', weight: 1,
    textAR: 'هل يمكنك معرفة نسبة إنجاز كل مشروع في أي لحظة بدون اجتماع؟',
    textEN: 'Can you know any project completion % at any moment without a meeting?',
    options: [
      { value: 'a', labelAR: 'لا، يحتاج اجتماع دائماً', labelEN: 'No, always needs a meeting', score: 1 },
      { value: 'b', labelAR: 'أحياناً إذا سألت أحداً', labelEN: 'Sometimes if I ask someone', score: 2 },
      { value: 'c', labelAR: 'نعم، من آخر تقرير', labelEN: 'Yes, from latest report', score: 3 },
      { value: 'd', labelAR: 'نعم، لحظياً من لوحة التحكم', labelEN: 'Yes, real-time from dashboard', score: 5 },
    ],
    tags: ['visibility','real-time']
  },
  {
    id: 'gc06', roles: ['Manager','Finance'], axis: 'Governance',
    type: 'single', weight: 1.3,
    textAR: 'ما مستوى الشفافية في الصرف بين الأقسام؟',
    textEN: 'What is the spending transparency level across departments?',
    options: [
      { value: 'a', labelAR: 'لا شفافية - كل قسم مستقل', labelEN: 'No transparency - each dept independent', score: 1 },
      { value: 'b', labelAR: 'تقارير شهرية فقط', labelEN: 'Monthly reports only', score: 2 },
      { value: 'c', labelAR: 'أسبوعية مع المدير المالي', labelEN: 'Weekly with CFO', score: 4 },
      { value: 'd', labelAR: 'لوحة تحكم مالية مشتركة', labelEN: 'Shared financial dashboard', score: 5 },
    ],
    tags: ['transparency','finance']
  },
  {
    id: 'au05', roles: ['Manager','Operations'], axis: 'Automation',
    type: 'single', weight: 1,
    textAR: 'هل يتم استخدام أدوات BIM في تصميم أو تنفيذ المشاريع؟',
    textEN: 'Are BIM tools used in project design or execution?',
    options: [
      { value: 'a', labelAR: 'لا', labelEN: 'No', score: 1 },
      { value: 'b', labelAR: 'نستخدم 2D CAD فقط', labelEN: 'We use 2D CAD only', score: 2 },
      { value: 'c', labelAR: 'نستخدم BIM جزئياً', labelEN: 'We use BIM partially', score: 3 },
      { value: 'd', labelAR: 'BIM مدمج في كل المشاريع', labelEN: 'BIM integrated in all projects', score: 5 },
    ],
    tags: ['bim','design','automation']
  },
  {
    id: 'ai06', roles: ['Manager','Engineer'], axis: 'AIReadiness',
    type: 'text', weight: 1,
    textAR: 'ما هي أكبر تحديات المشاريع التي تتمنى أن يحلها الذكاء الاصطناعي؟',
    textEN: 'What are the biggest project challenges you wish AI could solve?',
    tags: ['ai','challenges']
  },
  {
    id: 'dr06', roles: ['Manager'], axis: 'Decision',
    type: 'single', weight: 1,
    textAR: 'كيف تتعامل الشركة مع التأخيرات غير المتوقعة في التسليم؟',
    textEN: 'How does the company handle unexpected delivery delays?',
    options: [
      { value: 'a', labelAR: 'تفاعل بعد حدوث المشكلة', labelEN: 'React after the problem occurs', score: 1 },
      { value: 'b', labelAR: 'اجتماعات طارئة', labelEN: 'Emergency meetings', score: 2 },
      { value: 'c', labelAR: 'خطة بديلة جاهزة', labelEN: 'Ready contingency plan', score: 4 },
      { value: 'd', labelAR: 'نظام تنبيه مبكر + خطة تدخل', labelEN: 'Early alert + intervention plan', score: 5 },
    ],
    tags: ['risk','delays']
  },
  {
    id: 'fi07', roles: ['Finance','Manager'], axis: 'Finance',
    type: 'single', weight: 1.2,
    textAR: 'هل يوجد نظام لتوقع التدفق النقدي للأشهر القادمة؟',
    textEN: 'Is there a system to forecast cash flow for upcoming months?',
    options: [
      { value: 'a', labelAR: 'لا يوجد', labelEN: 'No', score: 1 },
      { value: 'b', labelAR: 'تخمين تقريبي', labelEN: 'Rough estimation', score: 2 },
      { value: 'c', labelAR: 'نموذج Excel', labelEN: 'Excel model', score: 3 },
      { value: 'd', labelAR: 'نظام توقع متكامل', labelEN: 'Integrated forecasting system', score: 5 },
    ],
    tags: ['cashflow','forecasting']
  },
  {
    id: 'p07', roles: ['Operations'], axis: 'Process',
    type: 'single', weight: 1,
    textAR: 'كيف يتم تسجيل ومتابعة شكاوى العملاء بعد التسليم؟',
    textEN: 'How are post-delivery client complaints recorded and followed up?',
    options: [
      { value: 'a', labelAR: 'لا يوجد نظام', labelEN: 'No system', score: 1 },
      { value: 'b', labelAR: 'واتساب أو مكالمات', labelEN: 'WhatsApp or calls', score: 2 },
      { value: 'c', labelAR: 'سجل Excel', labelEN: 'Excel log', score: 3 },
      { value: 'd', labelAR: 'CRM أو نظام شكاوى رسمي', labelEN: 'CRM or formal complaints system', score: 5 },
    ],
    tags: ['post-delivery','client','crm']
  },
  {
    id: 'do08', roles: ['Engineer','Operations'], axis: 'DailyOps',
    type: 'number', weight: 1.5,
    textAR: 'ما متوسط الوقت للرد على طلب مواد ميداني عاجل (ساعات)؟',
    textEN: 'Average time to respond to an urgent field material request (hours)?',
    isNumeric: true, numericKey: 'materialRequestResponseHrs', unit: 'hours',
    tags: ['procurement','field']
  },
  {
    id: 'gc07', roles: ['Manager','Finance'], axis: 'Governance',
    type: 'single', weight: 1,
    textAR: 'هل يوجد سياسة واضحة لحفظ وتدمير الوثائق السرية؟',
    textEN: 'Is there a clear policy for storing and destroying confidential documents?',
    options: [
      { value: 'a', labelAR: 'لا يوجد سياسة', labelEN: 'No policy', score: 1 },
      { value: 'b', labelAR: 'سياسة غير رسمية', labelEN: 'Informal policy', score: 2 },
      { value: 'c', labelAR: 'سياسة موثقة غير مطبقة', labelEN: 'Documented but not enforced', score: 3 },
      { value: 'd', labelAR: 'سياسة موثقة ومطبقة', labelEN: 'Documented and enforced', score: 5 },
    ],
    tags: ['data-security','governance']
  },
  {
    id: 'ai07', roles: ['Manager','Engineer'], axis: 'AIReadiness',
    type: 'single', weight: 1.2,
    textAR: 'هل تمتلك الشركة أي نماذج تاريخية للتنبؤ بتكاليف مشاريع مستقبلية؟',
    textEN: 'Does the company have historical models to forecast future project costs?',
    options: [
      { value: 'a', labelAR: 'لا', labelEN: 'No', score: 1 },
      { value: 'b', labelAR: 'نعتمد على التجربة الشخصية', labelEN: 'Rely on personal experience', score: 2 },
      { value: 'c', labelAR: 'جداول تاريخية في Excel', labelEN: 'Historical tables in Excel', score: 3 },
      { value: 'd', labelAR: 'نماذج تحليلية أو BI', labelEN: 'Analytical models or BI', score: 5 },
    ],
    tags: ['ai','cost-prediction']
  },
  {
    id: 'df06', roles: ['Finance','Operations'], axis: 'DataFlow',
    type: 'single', weight: 1.2,
    textAR: 'هل بيانات المشاريع من الميدان تصل للمحاسبة بشكل تلقائي؟',
    textEN: 'Does field project data reach accounting automatically?',
    options: [
      { value: 'a', labelAR: 'لا، يدوي بالكامل', labelEN: 'No, fully manual', score: 1 },
      { value: 'b', labelAR: 'يدوي مع بعض النسخ', labelEN: 'Manual with some copying', score: 2 },
      { value: 'c', labelAR: 'شبه تلقائي', labelEN: 'Semi-automatic', score: 3 },
      { value: 'd', labelAR: 'تلقائي بالكامل', labelEN: 'Fully automatic', score: 5 },
    ],
    tags: ['integration','finance','field']
  },
];
