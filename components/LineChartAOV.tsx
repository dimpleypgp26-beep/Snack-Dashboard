'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/lib/data';
import ChartContainer from './ChartContainer';

interface Props {
  data: Record<string, string | number>[];
  activeLines: string[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8D8C3] rounded-xl p-3 shadow-md text-xs">
      <p className="font-semibold text-[#3A2F2F] mb-2">{label} 2025/26</p>
      {payload.map((e) => (
        <div key={e.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
          <span className="text-[#3A2F2F]/50">{e.name}</span>
          <span className="font-semibold text-[#3A2F2F] ml-auto pl-4">₹{e.value?.toFixed(0)}</span>
        </div>
      ))}
    </div>
  );
}

export default function LineChartAOV({ data, activeLines }: Props) {
  return (
    <ChartContainer title="Monthly AOV by Category" subtitle="Average order value (₹) · Nov 2025 – Jan 2026">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.7} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#3A2F2F', fontSize: 11, opacity: 0.45 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#3A2F2F', fontSize: 11, opacity: 0.45 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} domain={[2400, 3200]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={7}
            wrapperStyle={{ fontSize: '11px', color: '#3A2F2F', paddingTop: '14px', opacity: 0.65 }} />
          {activeLines.map((key) => (
            <Line key={key} type="monotone" dataKey={key}
              stroke={CHART_COLORS[key] ?? '#E8D8C3'} strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 0, fill: CHART_COLORS[key] ?? '#E8D8C3' }}
              activeDot={{ r: 5, strokeWidth: 0 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
