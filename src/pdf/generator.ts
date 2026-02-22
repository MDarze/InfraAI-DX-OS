import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Assessment, AnalysisResult } from '../types';
import { AXIS_LABELS } from '../engine/scoring';

const C = {
  navy: [11, 31, 58] as [number, number, number],
  teal: [13, 115, 119] as [number, number, number],
  gold: [212, 168, 67] as [number, number, number],
  red:  [196, 70, 45] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  lightGray: [245, 247, 251] as [number, number, number],
  gray: [100, 116, 139] as [number, number, number],
  darkTxt: [30, 41, 59] as [number, number, number],
};

function scoreColor(score: number): [number, number, number] {
  if (score >= 4) return [26, 122, 74];
  if (score >= 3) return [201, 138, 14];
  return [196, 70, 45];
}

function riskColor(level: string): [number, number, number] {
  if (level === 'High') return C.red;
  if (level === 'Med') return [201, 138, 14];
  return [26, 122, 74];
}

export function generatePDF(assessment: Assessment, analysis: AnalysisResult): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210;
  const PH = 297;
  const ML = 15;
  const MR = 15;
  const CW = PW - ML - MR;
  let y = 0;

  function newPage() {
    doc.addPage();
    y = 15;
    // Header bar
    doc.setFillColor(...C.navy);
    doc.rect(0, 0, PW, 10, 'F');
    doc.setFillColor(...C.teal);
    doc.rect(0, 10, PW, 2, 'F');
    doc.setTextColor(...C.white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('InfraAI DX-OS | Confidential', ML, 7);
    doc.text(assessment.clientName, PW - MR, 7, { align: 'right' });
    y = 20;
  }

  function sectionTitle(title: string, titleAR?: string) {
    if (y > PH - 40) newPage();
    doc.setFillColor(...C.teal);
    doc.rect(ML, y, CW, 8, 'F');
    doc.setFillColor(...C.gold);
    doc.rect(ML, y, 3, 8, 'F');
    doc.setTextColor(...C.white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, ML + 6, y + 5.5);
    if (titleAR) {
      doc.setFontSize(9);
      doc.text(titleAR, PW - MR, y + 5.5, { align: 'right' });
    }
    y += 13;
  }

  function bodyText(text: string, indent = 0, opts: { bold?: boolean; color?: [number, number, number]; size?: number } = {}) {
    if (y > PH - 20) newPage();
    doc.setTextColor(...(opts.color ?? C.darkTxt));
    doc.setFontSize(opts.size ?? 9);
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, CW - indent);
    doc.text(lines, ML + indent, y);
    y += lines.length * 5 + 1;
  }

  function kpiBox(label: string, value: string, unit: string, color: [number, number, number], x: number, bw: number) {
    doc.setFillColor(...color);
    doc.roundedRect(x, y, bw, 22, 2, 2, 'F');
    doc.setTextColor(...C.white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x + bw / 2, y + 6, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x + bw / 2, y + 15, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(unit, x + bw / 2, y + 20, { align: 'center' });
  }

  // ─── COVER PAGE ────────────────────────────────────────────────────────────
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, PW, PH, 'F');

  doc.setFillColor(...C.teal);
  doc.rect(0, PH * 0.55, PW, PH * 0.45, 'F');

  doc.setFillColor(...C.gold);
  doc.rect(PW - 8, 0, 8, PH, 'F');

  // Logo area
  doc.setTextColor(...C.white);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('InfraAI', ML, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('DX-OS | Field Assessment Platform', ML, 62);

  doc.setFillColor(...C.gold);
  doc.rect(ML, 70, 80, 1, 'F');

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.gold);
  doc.text('Digital Transformation', ML, 90);
  doc.text('Assessment Report', ML, 102);

  doc.setTextColor(...C.white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('تقرير تقييم التحول الرقمي', ML, 116);

  // Client info box
  doc.setFillColor(255, 255, 255, 0.1);
  doc.setFillColor(15, 45, 80);
  doc.roundedRect(ML, 130, CW, 55, 3, 3, 'F');

  const infoRows = [
    ['Client', assessment.clientName],
    ['Project', assessment.projectName || '—'],
    ['Assessor', assessment.assessorName],
    ['Company Size', assessment.companySize + ' employees'],
    ['Date', new Date(assessment.createdAt).toLocaleDateString('en-GB')],
    ['Report Status', 'CONFIDENTIAL'],
  ];
  doc.setFontSize(9);
  infoRows.forEach((row, i) => {
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text(row[0] + ':', ML + 5, 141 + i * 8);
    doc.setTextColor(...C.white);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], ML + 45, 141 + i * 8);
  });

  // Aggregate score badge
  const aScore = analysis.aggregateScore;
  const scoreCol = scoreColor(aScore);
  doc.setFillColor(...scoreCol);
  doc.circle(PW / 2, 220, 22, 'F');
  doc.setTextColor(...C.white);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(aScore.toFixed(1), PW / 2, 224, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('/ 5.0', PW / 2, 231, { align: 'center' });
  doc.text('Overall Score', PW / 2, 248, { align: 'center' });

  doc.setFillColor(...C.gold);
  doc.rect(0, PH - 15, PW, 15, 'F');
  doc.setTextColor(...C.navy);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIDENTIAL — For InfraAI Client Use Only', PW / 2, PH - 6, { align: 'center' });

  // ─── PAGE 2: EXECUTIVE SUMMARY ─────────────────────────────────────────────
  newPage();
  sectionTitle('Executive Summary', 'الملخص التنفيذي');

  // DNA boxes
  const dnaEntries = [
    { label: 'Decision DNA', value: analysis.dna.decision },
    { label: 'Data DNA', value: analysis.dna.data },
    { label: 'Financial DNA', value: analysis.dna.financial },
    { label: 'Governance DNA', value: analysis.dna.governance },
  ];
  const bw = (CW - 9) / 4;
  dnaEntries.forEach((d, i) => {
    const col: [number, number, number] = d.value.includes('Reactive') || d.value.includes('Fragmented') || d.value.includes('Low') || d.value.includes('High Risk')
      ? C.red : d.value === 'Data-Driven' || d.value === 'Unified' || d.value === 'High Visibility' || d.value === 'Controlled'
      ? [26, 122, 74] : [201, 138, 14];
    const bx = ML + i * (bw + 3);
    doc.setFillColor(...col);
    doc.roundedRect(bx, y, bw, 18, 2, 2, 'F');
    doc.setTextColor(...C.white);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(d.label, bx + bw / 2, y + 6, { align: 'center' });
    doc.setFontSize(8);
    doc.text(d.value, bx + bw / 2, y + 14, { align: 'center' });
  });
  y += 25;

  bodyText(
    `This assessment was conducted for ${assessment.clientName} with ${assessment.respondents.length} respondents across ${assessment.respondents.map(r => r.role).join(', ')} roles. The organization scored ${aScore.toFixed(1)}/5.0 overall, indicating ${aScore < 2.5 ? 'significant' : aScore < 3.5 ? 'moderate' : 'good'} digitization gaps with clear opportunities for operational improvement.`,
    0, { size: 10 }
  );
  y += 3;

  bodyText('Key Findings:', 0, { bold: true, size: 10 });
  const findings = [
    `Reporting efficiency: ${analysis.roi.weeklyHoursLost.toFixed(0)} hours/week lost to manual processes`,
    `Estimated weekly cost of inefficiency: SAR ${analysis.roi.weeklyCostLost.toLocaleString()}`,
    `Projected annual savings with InfraAI: SAR ${analysis.roi.yearlySavings.toLocaleString()}`,
    `Top risk: ${analysis.risks[0]?.titleEN ?? 'Data fragmentation'}`,
    `Quick wins identified: ${analysis.quickWins.length} immediately actionable items`,
  ];
  findings.forEach(f => {
    if (y > PH - 15) newPage();
    doc.setFillColor(...C.lightGray);
    doc.rect(ML, y - 1, CW, 7, 'F');
    doc.setFillColor(...C.teal);
    doc.rect(ML, y - 1, 2, 7, 'F');
    doc.setTextColor(...C.darkTxt);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('• ' + f, ML + 5, y + 4);
    y += 9;
  });

  y += 5;
  // Arabic summary
  sectionTitle('الملخص التنفيذي — عربي');
  bodyText(`تم إجراء هذا التقييم لشركة ${assessment.clientName} بمشاركة ${assessment.respondents.length} مستجيبين. حصلت الشركة على درجة ${aScore.toFixed(1)}/5.0 مما يشير إلى ${aScore < 2.5 ? 'فجوات كبيرة' : 'فرص واضحة'} في التحول الرقمي.`, 0, { size: 10 });
  y += 3;
  bodyText('الفرصة: تقدّر InfraAI وفورات سنوية بـ ' + analysis.roi.yearlySavings.toLocaleString() + ' ريال سعودي من خلال أتمتة التقارير وتوحيد البيانات وتحسين الامتثال.', 0, { color: C.teal, bold: true });

  // ─── ROI SECTION ───────────────────────────────────────────────────────────
  newPage();
  sectionTitle('ROI Analysis — Financial Impact', 'تحليل العائد على الاستثمار');

  const roiKPIs = [
    { label: 'Weekly\nSavings', value: analysis.roi.weeklySavings.toLocaleString(), unit: 'SAR/wk', color: C.teal },
    { label: 'Monthly\nSavings', value: analysis.roi.monthlySavings.toLocaleString(), unit: 'SAR/mo', color: C.navy },
    { label: 'Yearly\nSavings', value: analysis.roi.yearlySavings.toLocaleString(), unit: 'SAR/yr', color: scoreColor(4) as [number, number, number] },
    { label: 'Hours Lost\n/week', value: analysis.roi.weeklyHoursLost.toFixed(0), unit: 'hrs', color: C.red },
  ];
  const kbw = (CW - 9) / 4;
  roiKPIs.forEach((k, i) => {
    kpiBox(k.label, k.value, k.unit, k.color, ML + i * (kbw + 3), kbw);
  });
  y += 28;

  bodyText('Assumptions & Formulas:', 0, { bold: true });
  analysis.roi.assumptions.forEach(a => { bodyText('• ' + a, 4); });

  y += 5;
  sectionTitle('Pain Signals with Formulas', 'إشارات الألم الموثقة');
  const psTableData = analysis.painSignals.map(p => [
    p.labelEN,
    p.value.toLocaleString() + ' ' + p.unit,
    p.formula,
    p.severity.toUpperCase(),
  ]);
  (doc as any).autoTable({
    startY: y,
    head: [['Signal', 'Value', 'Formula', 'Severity']],
    body: psTableData,
    margin: { left: ML, right: MR },
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: C.navy, textColor: C.white, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: C.lightGray },
    columnStyles: {
      3: { halign: 'center' },
    },
    didParseCell: (data: any) => {
      if (data.column.index === 3 && data.section === 'body') {
        const v = data.cell.raw;
        data.cell.styles.textColor = v === 'HIGH' ? C.red : v === 'MEDIUM' ? [201,138,14] : [26,122,74];
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ─── AXIS SCORES ────────────────────────────────────────────────────────────
  newPage();
  sectionTitle('Axis Scores — Maturity Radar', 'نتائج المحاور');

  const validAxes = analysis.axisScores.filter(a => a.answeredCount > 0);
  const aTableData = validAxes.map(a => {
    const lbl = AXIS_LABELS[a.axis];
    const bars = '■'.repeat(Math.round(a.score)) + '□'.repeat(5 - Math.round(a.score));
    return [lbl.en, lbl.ar, a.score.toFixed(1), bars, a.answeredCount.toString()];
  });
  (doc as any).autoTable({
    startY: y,
    head: [['Axis (EN)', 'المحور (AR)', 'Score', 'Level', 'Q Answered']],
    body: aTableData,
    margin: { left: ML, right: MR },
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: C.lightGray },
    columnStyles: { 2: { halign: 'center' }, 4: { halign: 'center' } },
    didParseCell: (data: any) => {
      if (data.column.index === 2 && data.section === 'body') {
        const sc = parseFloat(data.cell.raw);
        data.cell.styles.textColor = scoreColor(sc);
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Score bar chart (manual)
  bodyText('Score Distribution:', 0, { bold: true });
  y += 2;
  validAxes.forEach(ax => {
    if (y > PH - 20) newPage();
    const label = AXIS_LABELS[ax.axis].en;
    doc.setTextColor(...C.darkTxt);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(label, ML, y + 4);
    const barX = ML + 55;
    const barW = CW - 60;
    doc.setFillColor(...C.lightGray);
    doc.roundedRect(barX, y, barW, 7, 1, 1, 'F');
    doc.setFillColor(...scoreColor(ax.score));
    doc.roundedRect(barX, y, barW * (ax.score / 5), 7, 1, 1, 'F');
    doc.setTextColor(...C.white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    if (ax.score > 0.5) doc.text(ax.score.toFixed(1), barX + barW * (ax.score / 5) - 6, y + 5);
    y += 10;
  });

  // ─── RISKS ──────────────────────────────────────────────────────────────────
  newPage();
  sectionTitle('Risk Register', 'سجل المخاطر');
  const rTableData = analysis.risks.map(r => [
    r.titleEN, r.titleAR, r.probability, r.impact, r.mitigationAR
  ]);
  (doc as any).autoTable({
    startY: y,
    head: [['Risk', 'المخاطرة', 'Prob', 'Impact', 'Mitigation (AR)']],
    body: rTableData,
    margin: { left: ML, right: MR },
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: C.navy, textColor: C.white, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: C.lightGray },
    columnStyles: { 2: { halign: 'center' }, 3: { halign: 'center' } },
    didParseCell: (data: any) => {
      if ((data.column.index === 2 || data.column.index === 3) && data.section === 'body') {
        const v = data.cell.raw;
        data.cell.styles.textColor = riskColor(v);
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ─── QUICK WINS ─────────────────────────────────────────────────────────────
  sectionTitle('60-Day Quick Wins', 'الإنجازات السريعة — 60 يوماً');
  analysis.quickWins.forEach((qw, i) => {
    if (y > PH - 15) newPage();
    const qwAR = analysis.quickWinsAR[i] ?? '';
    doc.setFillColor(...C.teal);
    doc.circle(ML + 3, y + 3, 2.5, 'F');
    doc.setTextColor(...C.white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text((i + 1).toString(), ML + 3, y + 4.2, { align: 'center' });
    doc.setTextColor(...C.darkTxt);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(qw, ML + 8, y + 4);
    y += 7;
    if (qwAR) {
      doc.setTextColor(...C.gray);
      doc.setFontSize(8);
      doc.text(qwAR, ML + 8, y);
      y += 6;
    }
    y += 1;
  });

  // ─── AI OPPORTUNITIES ────────────────────────────────────────────────────────
  y += 5;
  if (y > PH - 60) newPage();
  sectionTitle('AI Integration Opportunities', 'فرص الذكاء الاصطناعي');
  analysis.aiOpportunities.forEach((op, i) => {
    if (y > PH - 15) newPage();
    doc.setFillColor(...C.gold);
    doc.roundedRect(ML, y, CW, 8, 1, 1, 'F');
    doc.setTextColor(...C.navy);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('AI ' + (i + 1) + ': ' + op, ML + 3, y + 5.5);
    y += 10;
    if (analysis.aiOpportunitiesAR[i]) {
      doc.setTextColor(...C.gray);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(analysis.aiOpportunitiesAR[i], ML + 3, y);
      y += 7;
    }
    y += 2;
  });

  // ─── BACKLOG ────────────────────────────────────────────────────────────────
  newPage();
  sectionTitle('Implementation Backlog', 'خلفية التنفيذ');
  const blData = analysis.backlog.map(b => [
    b.epicAR, b.initiativeAR, b.owner, b.complexity, b.timelineWeeks + 'w', b.kpiAR
  ]);
  (doc as any).autoTable({
    startY: y,
    head: [['Epic', 'Initiative', 'Owner', 'Size', 'Timeline', 'KPI']],
    body: blData,
    margin: { left: ML, right: MR },
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: C.navy, textColor: C.white, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: C.lightGray },
    columnStyles: {
      2: { halign: 'center' },
      3: { halign: 'center', fontStyle: 'bold' },
      4: { halign: 'center' },
    },
    didParseCell: (data: any) => {
      if (data.column.index === 3 && data.section === 'body') {
        const v = data.cell.raw;
        data.cell.styles.textColor = v === 'L' ? C.red : v === 'M' ? [201,138,14] : [26,122,74];
      }
    },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ─── FOOTER PAGE ─────────────────────────────────────────────────────────────
  newPage();
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, PW, PH, 'F');
  doc.setFillColor(...C.teal);
  doc.rect(0, PH * 0.6, PW, PH * 0.4, 'F');

  doc.setTextColor(...C.white);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Ready to Transform?', PW / 2, 80, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('هل أنتم مستعدون للتحول؟', PW / 2, 95, { align: 'center' });

  doc.setFillColor(...C.gold);
  doc.rect(ML, 105, CW, 1, 'F');

  doc.setFontSize(10);
  doc.setTextColor(...C.gold);
  doc.text('InfraAI Digital Solutions', PW / 2, 120, { align: 'center' });
  doc.setTextColor(...C.white);
  doc.setFontSize(9);
  doc.text('GovTech × InfraTech × AI', PW / 2, 130, { align: 'center' });
  doc.text('هندسة البيانات.. لقيادة الإنشاءات', PW / 2, 142, { align: 'center' });

  doc.setFontSize(8);
  doc.text(`Report generated: ${new Date().toLocaleString('en-GB')}`, PW / 2, PH - 20, { align: 'center' });
  doc.text('CONFIDENTIAL — Not for distribution', PW / 2, PH - 13, { align: 'center' });

  // ─── PAGE NUMBERS ─────────────────────────────────────────────────────────
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(...C.lightGray);
    doc.rect(0, PH - 8, PW, 8, 'F');
    doc.setTextColor(...C.gray);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${totalPages}`, PW / 2, PH - 3, { align: 'center' });
  }

  // Download — try multiple methods for sandboxed environments
  const date = new Date().toISOString().split('T')[0];
  const filename = `infraai-report-${assessment.clientName.replace(/\s+/g, '-')}-${date}.pdf`;
  
  try {
    // Method 1: Standard save
    doc.save(filename);
  } catch {
    try {
      // Method 2: Open in new window as data URI
      const pdfDataUri = doc.output('datauristring');
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<html><head><title>${filename}</title></head><body style="margin:0">` +
          `<iframe src="${pdfDataUri}" style="border:none;width:100%;height:100vh"></iframe>` +
          `</body></html>`
        );
      } else {
        // Method 3: Direct data URI navigation
        window.location.href = doc.output('datauristring');
      }
    } catch {
      // Method 4: Blob URL
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}
