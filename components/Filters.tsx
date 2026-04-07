'use client';

import { ALL_PLATFORMS, ALL_REGIONS, MONTHS } from '@/lib/data';

interface FiltersProps {
  platform: string;
  region: string;
  startMonth: number;
  endMonth: number;
  onChange: (key: string, value: string | number) => void;
}

const selectClass =
  'text-sm bg-white border border-[#E8D8C3] rounded-xl px-3 py-2 text-[#3A2F2F] focus:outline-none focus:ring-2 focus:ring-[#A8C3A0]/50 hover:border-[#A8C3A0] transition-colors cursor-pointer';

const labelClass = 'text-[10px] font-semibold text-[#3A2F2F]/40 uppercase tracking-widest mb-1 block';

export default function Filters({ platform, region, startMonth, endMonth, onChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div>
        <label className={labelClass}>Platform</label>
        <select className={selectClass} value={platform} onChange={(e) => onChange('platform', e.target.value)}>
          {ALL_PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Region</label>
        <select className={selectClass} value={region} onChange={(e) => onChange('region', e.target.value)}>
          {ALL_REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
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
            <option key={m} value={i} disabled={i > endMonth}>{m}</option>
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
            <option key={m} value={i} disabled={i < startMonth}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
