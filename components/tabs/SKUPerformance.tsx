'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fmtINR, SKURecord, r } from '@/lib/data';

interface Props {
  skus: SKURecord[];
  monthlyTrend: Record<string, string | number>[];
}

const SKU_COLORS = ['#F4B8A8', '#A8C3A0', '#C4A882'];
const SKU_SHORT  = ['Choc Protein', 'PB Energy', 'Almond & Dates'];

export default function SKUPerformance({ skus, monthlyTrend }: Props) {
  const barData = skus.map((s) => ({
    name: s.name.replace(' Bar', '').replace(' Energy', '').split(' ').slice(0, 2).join(' '),
    'Ad Sales':      s.adSales,
    'Organic Sales': s.organicSales,
  }));

  return (
    <div className="space-y-6">
      {/* SKU cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skus.map((s, i) => {
          const roasVal  = r.roas(s.adSpend, s.adSales);
          const acosVal  = r.acos(s.adSpend, s.adSales);
          const adShare  = s.totalSales > 0 ? (s.adSales / s.totalSales) * 100 : 0;
          return (
            <div key={s.sku} className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: SKU_COLORS[i] }} />
                <div>
                  <p className="text-xs font-semibold text-[#3A2F2F]">{s.name}</p>
                  <p className="text-[10px] text-[#3A2F2F]/40">{s.sku}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:'Total Sales',   value: fmtINR(s.totalSales) },
                  { label:'Ad Sales',      value: fmtINR(s.adSales) },
                  { label:'Organic Sales', value: fmtINR(s.organicSales) },
                  { label:'Ad Spend',      value: fmtINR(s.adSpend) },
                  { label:'ROAS',          value: `${roasVal.toFixed(2)}x` },
                  { label:'ACoS',          value: `${acosVal.toFixed(1)}%` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-[#3A2F2F]/40 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-[#3A2F2F]">{value}</p>
                  </div>
                ))}
              </div>
              {/* Ad dependency bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-[#3A2F2F]/40 mb-1">
                  <span>Ad dependency</span><span>{adShare.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#F8F5F0' }}>
                  <div className="h-full rounded-full" style={{ width:`${adShare}%`, backgroundColor: SKU_COLORS[i] }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">Ad Sales vs Organic Sales</h3>
          <p className="text-xs text-[#3A2F2F]/40 mb-4">6-month totals per SKU</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top:4, right:8, left:-8, bottom:0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.7} vertical={false} />
              <XAxis dataKey="name" tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => fmtINR(v)} />
              <Tooltip formatter={(v: number, name: string) => [fmtINR(v), name]}
                contentStyle={{ background:'white', border:'1px solid #E8D8C3', borderRadius:'12px', fontSize:'12px' }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:'11px', opacity:0.6, paddingTop:'10px' }} />
              <Bar dataKey="Ad Sales"      stackId="a" fill="#F4B8A8" />
              <Bar dataKey="Organic Sales" stackId="a" fill="#A8C3A0" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">Monthly Sales Trend per SKU</h3>
          <p className="text-xs text-[#3A2F2F]/40 mb-4">Total revenue (ad + organic) over time</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyTrend} margin={{ top:4, right:8, left:-8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.7} vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'#3A2F2F', fontSize:11, opacity:0.45 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => fmtINR(v)} />
              <Tooltip formatter={(v: number, name: string) => [fmtINR(v), name]}
                contentStyle={{ background:'white', border:'1px solid #E8D8C3', borderRadius:'12px', fontSize:'12px' }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:'11px', opacity:0.6, paddingTop:'10px' }} />
              {SKU_SHORT.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={SKU_COLORS[i]} strokeWidth={2.5}
                  dot={{ r:3, strokeWidth:0, fill: SKU_COLORS[i] }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
