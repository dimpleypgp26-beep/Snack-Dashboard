'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/lib/data';
import ChartContainer from './ChartContainer';

interface Props {
  data: Record<string, string | number>[];
  activePlatforms: string[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8D8C3] rounded-xl p-3 shadow-md text-xs">
      <p className="font-semibold text-[#3A2F2F] mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-[#3A2F2F]/50">{entry.name}</span>
          <span className="font-semibold text-[#3A2F2F] ml-auto pl-4">${entry.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export default function LineChartAOV({ data, activePlatforms }: Props) {
  return (
    <ChartContainer title="Monthly AOV by Platform" subtitle="Average order value across selected filters">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.7} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#3A2F2F', fontSize: 11, opacity: 0.45 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#3A2F2F', fontSize: 11, opacity: 0.45 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: '11px', color: '#3A2F2F', paddingTop: '14px', opacity: 0.65 }}
          />
          {activePlatforms.map((platform) => (
            <Line
              key={platform}
              type="monotone"
              dataKey={platform}
              stroke={CHART_COLORS[platform] ?? '#E8D8C3'}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
