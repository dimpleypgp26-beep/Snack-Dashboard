'use client';

import { ALL_CAMPAIGN_TYPES, ALL_SKUS, SKU_NAMES, MONTHS, MONTH_LABELS } from '@/lib/data';

interface FiltersProps {
  campaignType: string;
  sku: string;
  startMonth: number;
  endMonth: number;
  onChange: (key: string, value: string | number) => void;
}

const sel = 'text-xs bg-white border border-[#E8D8C3] rounded-xl px-3 py-2 text-[#3A2F2F] focus:outline-none focus:ring-2 focus:ring-[#A8C3A0]/40 hover:border-[#A8C3A0] transition-colors cursor-pointer';
const lbl = 'text-[10px] font-semibold text-[#3A2F2F]/40 uppercase tracking-widest mb-1 block';

export default function Filters({ campaignType, sku, startMonth, endMonth, onChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div>
        <label className={lbl}>Campaign Type</label>
        <select className={sel} value={campaignType} onChange={(e) => onChange('campaignType', e.target.value)}>
          {ALL_CAMPAIGN_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl}>SKU</label>
        <select className={sel} value={sku} onChange={(e) => onChange('sku', e.target.value)}>
          {ALL_SKUS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All SKUs' : SKU_NAMES[s]}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl}>From</label>
        <select className={sel} value={startMonth} onChange={(e) => onChange('startMonth', Number(e.target.value))}>
          {MONTHS.map((m, i) => <option key={m} value={i} disabled={i > endMonth}>{MONTH_LABELS[m]}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl}>To</label>
        <select className={sel} value={endMonth} onChange={(e) => onChange('endMonth', Number(e.target.value))}>
          {MONTHS.map((m, i) => <option key={m} value={i} disabled={i < startMonth}>{MONTH_LABELS[m]}</option>)}
        </select>
      </div>
    </div>
  );
}
