'use client';

import { ALL_CATEGORIES, ALL_CHANNELS, ALL_CITIES, MONTHS, MONTH_LABELS } from '@/lib/data';

interface FiltersProps {
  category: string;
  channel: string;
  city: string;
  startMonth: number;
  endMonth: number;
  onChange: (key: string, value: string | number) => void;
}

const selectClass =
  'text-sm bg-white border border-[#E8D8C3] rounded-xl px-3 py-2 text-[#3A2F2F] focus:outline-none focus:ring-2 focus:ring-[#A8C3A0]/50 hover:border-[#A8C3A0] transition-colors cursor-pointer';
const labelClass = 'text-[10px] font-semibold text-[#3A2F2F]/40 uppercase tracking-widest mb-1 block';

export default function Filters({ category, channel, city, startMonth, endMonth, onChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div>
        <label className={labelClass}>Category</label>
        <select className={selectClass} value={category} onChange={(e) => onChange('category', e.target.value)}>
          {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Channel</label>
        <select className={selectClass} value={channel} onChange={(e) => onChange('channel', e.target.value)}>
          {ALL_CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>City</label>
        <select className={selectClass} value={city} onChange={(e) => onChange('city', e.target.value)}>
          {ALL_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>From</label>
        <select
          className={selectClass}
          value={startMonth}
          onChange={(e) => onChange('startMonth', Number(e.target.value))}
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i} disabled={i > endMonth}>{MONTH_LABELS[m]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>To</label>
        <select
          className={selectClass}
          value={endMonth}
          onChange={(e) => onChange('endMonth', Number(e.target.value))}
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i} disabled={i < startMonth}>{MONTH_LABELS[m]}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
