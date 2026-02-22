import { useState } from 'react';
import type { Assessment, ROISettings } from '../types';
import { saveAssessment } from '../storage/assessments';
import { ArrowLeft, Save } from 'lucide-react';

export default function SettingsScreen({ assessment, onSave, onBack }: {
  assessment: Assessment; onSave: (a: Assessment) => void; onBack: () => void;
}) {
  const [roi, setRoi] = useState<ROISettings>({ ...assessment.roiSettings });

  function save() {
    const updated = { ...assessment, roiSettings: roi };
    saveAssessment(updated);
    onSave(updated);
  }

  function field(label: string, labelAR: string, key: keyof ROISettings, type: 'number' | 'percent' = 'number') {
    const val = roi[key] as number;
    const displayVal = type === 'percent' ? (val * 100) : val;
    return (
      <div className="settings-field">
        <label>{label} <span className="settings-ar">{labelAR}</span></label>
        <div className="settings-input-wrap">
          <input
            type="number"
            value={displayVal}
            onChange={e => {
              const n = parseFloat(e.target.value);
              setRoi(r => ({ ...r, [key]: type === 'percent' ? n / 100 : n }));
            }}
            min={0}
            step={type === 'percent' ? 5 : 1}
          />
          {type === 'percent' && <span className="input-unit">%</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <button className="icon-btn" onClick={onBack}><ArrowLeft size={18}/></button>
        <h1>ROI Settings <span>إعدادات العائد</span></h1>
      </div>

      <div className="settings-body">
        <div className="settings-card">
          <h3>Team & Hours</h3>
          {field('Number of Engineers', 'عدد المهندسين', 'engineersCount')}
          {field('Working Days / Week', 'أيام العمل / أسبوع', 'workingDaysPerWeek')}
          {field('Average Hourly Cost (SAR)', 'تكلفة الساعة (ريال)', 'hourlyCost')}
        </div>

        <div className="settings-card">
          <h3>ROI Parameters</h3>
          {field('Efficiency Saving Rate', 'نسبة التوفير المتوقع', 'savingRate', 'percent')}
          {field('Overhead Multiplier', 'معامل التكاليف غير المباشرة', 'overheadMultiplier')}
        </div>

        <div className="settings-preview">
          <h3>Preview</h3>
          <p>Engineers: <strong>{roi.engineersCount}</strong></p>
          <p>Days/week: <strong>{roi.workingDaysPerWeek}</strong></p>
          <p>Hourly rate: <strong>SAR {roi.hourlyCost}</strong></p>
          <p>Saving rate: <strong>{(roi.savingRate * 100).toFixed(0)}%</strong></p>
          <p>Overhead: <strong>{roi.overheadMultiplier}x</strong></p>
        </div>

        <button className="btn-save-settings" onClick={save}>
          <Save size={16}/> Save Settings
        </button>
      </div>
    </div>
  );
}
