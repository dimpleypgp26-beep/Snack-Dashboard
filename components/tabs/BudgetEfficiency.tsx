'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { fmtINR, ROAS_TARGET } from '@/lib/data';

interface CampaignRow {
  campaign: string; type: string;
  spend: number; sales: number; roas: number; acos: number; orders: number;
}
interface Props { campaigns: CampaignRow[]; }

const statusColor = (roas: number) =>
  roas >= ROAS_TARGET + 0.5 ? '#4A7A42' : roas >= ROAS_TARGET ? '#B07A30' : '#B05040';
const statusBg = (roas: number) =>
  roas >= ROAS_TARGET + 0.5 ? '#A8C3A0' : roas >= ROAS_TARGET ? '#F4D8A8' : '#F4B8A8';
const statusLabel = (roas: number) =>
  roas >= ROAS_TARGET + 0.5 ? 'Scale' : roas >= ROAS_TARGET ? 'On Track' : 'Reduce';

const RECOMMENDATIONS: { icon: string; title: string; detail: string; action: string }[] = [
  { icon: '↑', title: 'Scale SP_Chocolate_Branded', detail: 'ROAS 4.2x — well above 3.0x target. Increase daily budget by 20%.', action: 'Scale' },
  { icon: '↑', title: 'Add exact-match negatives to Broad campaigns', detail: '"protein ladoo" and "chocolate bar" are wasting ₹21,800 with ROAS < 2x.', action: 'Optimise' },
  { icon: '↑', title: 'Launch SP campaign for Almond & Dates exact terms', detail: '"dates and almond bar" shows 3.9x ROAS — move to dedicated branded campaign.', action: 'Expand' },
  { icon: '↓', title: 'Reduce SD_Competitor_Targeting budget', detail: 'ROAS 1.80x — lowest efficiency. Cut budget 30% and reallocate to SP.', action: 'Reduce' },
  { icon: '↑', title: 'Increase bids on "chocolate protein bar" (Exact)', detail: 'Highest CVR (14.9%) and orders (72). Impression share likely low — raise bid 15%.', action: 'Scale' },
];

export default function BudgetEfficiency({ campaigns }: Props) {
  const totalSpend   = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalSales   = campaigns.reduce((s, c) => s + c.sales, 0);
  const overallROAS  = totalSpend > 0 ? totalSales / totalSpend : 0;
  const overallACoS  = totalSales > 0 ? (totalSpend / totalSales) * 100 : 0;
  const wastedSpend  = campaigns.filter((c) => c.roas < ROAS_TARGET).reduce((s, c) => s + c.spend, 0);
  const wastePercent = totalSpend > 0 ? (wastedSpend / totalSpend) * 100 : 0;
  const scaleCandidates = campaigns.filter((c) => c.roas >= ROAS_TARGET + 0.5).length;

  const sortedByROAS = [...campaigns].sort((a, b) => b.roas - a.roas);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-4">
          <p className="text-[10px] font-semibold text-[#3A2F2F]/40 uppercase tracking-widest mb-2">Overall ROAS</p>
          <p className="text-2xl font-semibold text-[#3A2F2F]">{overallROAS.toFixed(2)}x</p>
          <p className="text-xs mt-1" style={{ color: overallROAS >= ROAS_TARGET ? '#4A7A42' : '#B05040' }}>
            Target: {ROAS_TARGET}x · {overallROAS >= ROAS_TARGET ? '✓ Achieved' : '✗ Below target'}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-4">
          <p className="text-[10px] font-semibold text-[#3A2F2F]/40 uppercase tracking-widest mb-2">Overall ACoS</p>
          <p className="text-2xl font-semibold text-[#3A2F2F]">{overallACoS.toFixed(1)}%</p>
          <p className="text-xs mt-1 text-[#3A2F2F]/40">Target ACoS: {(100 / ROAS_TARGET).toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-4">
          <p className="text-[10px] font-semibold text-[#3A2F2F]/40 uppercase tracking-widest mb-2">Wasted Spend</p>
          <p className="text-2xl font-semibold text-[#3A2F2F]">{fmtINR(wastedSpend)}</p>
          <p className="text-xs mt-1" style={{ color: wastePercent > 20 ? '#B05040' : '#B07A30' }}>
            {wastePercent.toFixed(0)}% of total budget
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-4">
          <p className="text-[10px] font-semibold text-[#3A2F2F]/40 uppercase tracking-widest mb-2">Scale Candidates</p>
          <p className="text-2xl font-semibold text-[#3A2F2F]">{scaleCandidates}</p>
          <p className="text-xs mt-1 text-[#4A7A42]">Campaigns with ROAS &gt; {ROAS_TARGET + 0.5}x</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROAS per campaign vs target */}
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">Campaign ROAS vs Target</h3>
          <p className="text-xs text-[#3A2F2F]/40 mb-4">Dashed line = {ROAS_TARGET}x target</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sortedByROAS} layout="vertical" margin={{ top:0, right:50, left:8, bottom:0 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.6} horizontal={false} />
              <XAxis type="number" tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v}x`} domain={[0, 5]} />
              <YAxis type="category" dataKey="campaign" width={160}
                tick={{ fill:'#3A2F2F', fontSize:9, opacity:0.65 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(2)}x`, 'ROAS']}
                contentStyle={{ background:'white', border:'1px solid #E8D8C3', borderRadius:'12px', fontSize:'12px' }} />
              <ReferenceLine x={ROAS_TARGET} stroke="#3A2F2F" strokeDasharray="4 2" strokeOpacity={0.3} />
              <Bar dataKey="roas" radius={[0, 4, 4, 0]}>
                {sortedByROAS.map((c, i) => (
                  <Cell key={i} fill={statusBg(c.roas)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spend efficiency matrix */}
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">Budget Allocation & Efficiency</h3>
          <p className="text-xs text-[#3A2F2F]/40 mb-4">Spend amount · ROAS status per campaign</p>
          <div className="space-y-2.5 mt-2">
            {sortedByROAS.map((c) => {
              const barWidth = totalSpend > 0 ? (c.spend / totalSpend) * 100 : 0;
              return (
                <div key={c.campaign}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-[#3A2F2F]/70 font-medium truncate max-w-[160px]">{c.campaign}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#3A2F2F]/50">{fmtINR(c.spend)}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: statusBg(c.roas), color: statusColor(c.roas) }}>
                        {statusLabel(c.roas)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background:'#F8F5F0' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width:`${barWidth}%`, backgroundColor: statusBg(c.roas) }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
        <h3 className="text-sm font-semibold text-[#3A2F2F] mb-4">Action Recommendations</h3>
        <div className="space-y-3">
          {RECOMMENDATIONS.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background:'#FAF7F2' }}>
              <span className="text-sm font-bold mt-0.5 flex-shrink-0"
                style={{ color: rec.action === 'Reduce' ? '#B05040' : '#4A7A42' }}>{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#3A2F2F] mb-0.5">{rec.title}</p>
                <p className="text-[11px] text-[#3A2F2F]/55 leading-relaxed">{rec.detail}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 mt-0.5"
                style={{
                  background: rec.action === 'Reduce' ? '#F4B8A8' : rec.action === 'Scale' ? '#A8C3A0' : '#E8D8C3',
                  color: '#3A2F2F',
                }}>{rec.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
