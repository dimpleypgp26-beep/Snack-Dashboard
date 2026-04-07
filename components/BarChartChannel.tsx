'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PRODUCTS, CHART_COLORS } from '@/lib/data';
import ChartContainer from './ChartContainer';

interface Props {
  data: Record<string, string | number>[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8D8C3] rounded-xl p-3 shadow-md text-xs">
      <p className="font-semibold text-[#3A2F2F] mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.fill }} />
          <span className="text-[#3A2F2F]/50">{entry.name}</span>
          <span className="font-semibold text-[#3A2F2F] ml-auto pl-4">{entry.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function BarChartChannel({ data }: Props) {
  return (
    <ChartContainer title="Product Quantity by Channel" subtitle="Units sold per sales channel">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.7} vertical={false} />
          <XAxis
            dataKey="channel"
            tick={{ fill: '#3A2F2F', fontSize: 11, opacity: 0.45 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#3A2F2F', fontSize: 11, opacity: 0.45 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#E8D8C3', opacity: 0.25 }} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: '11px', color: '#3A2F2F', paddingTop: '14px', opacity: 0.65 }}
          />
          {PRODUCTS.map((product, i) => (
            <Bar
              key={product}
              dataKey={product}
              stackId="stack"
              fill={CHART_COLORS[product] ?? '#E8D8C3'}
              radius={i === PRODUCTS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
