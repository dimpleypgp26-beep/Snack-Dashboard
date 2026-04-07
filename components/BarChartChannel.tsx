'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/lib/data';
import ChartContainer from './ChartContainer';

interface Props {
  data: Record<string, string | number>[];
  stackKeys: string[];   // e.g. CATEGORIES or CHANNELS
  xKey: string;          // e.g. 'channel' or 'city'
  title: string;
  subtitle?: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, e) => s + (e.value ?? 0), 0);
  return (
    <div className="bg-white border border-[#E8D8C3] rounded-xl p-3 shadow-md text-xs">
      <p className="font-semibold text-[#3A2F2F] mb-2">{label}</p>
      {payload.map((e) => (
        <div key={e.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.fill }} />
          <span className="text-[#3A2F2F]/50">{e.name}</span>
          <span className="font-semibold text-[#3A2F2F] ml-auto pl-4">{e.value?.toLocaleString()}</span>
        </div>
      ))}
      <div className="border-t border-[#E8D8C3] mt-2 pt-2 flex justify-between">
        <span className="text-[#3A2F2F]/50">Total</span>
        <span className="font-semibold text-[#3A2F2F]">{total.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function BarChartComponent({ data, stackKeys, xKey, title, subtitle }: Props) {
  return (
    <ChartContainer title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.7} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: '#3A2F2F', fontSize: 11, opacity: 0.45 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#3A2F2F', fontSize: 11, opacity: 0.45 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#E8D8C3', opacity: 0.25 }} />
          <Legend iconType="circle" iconSize={7}
            wrapperStyle={{ fontSize: '11px', color: '#3A2F2F', paddingTop: '14px', opacity: 0.65 }} />
          {stackKeys.map((key, i) => (
            <Bar key={key} dataKey={key} stackId="stack"
              fill={CHART_COLORS[key] ?? '#E8D8C3'}
              radius={i === stackKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
