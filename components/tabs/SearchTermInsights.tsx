'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fmtINR, ROAS_TARGET } from '@/lib/data';

interface Term {
  term: string; matchType: string; campaign: string; type: string;
  spend: number; sales: number; clicks: number; orders: number;
  roas: number; acos: number; ctr: number; cpc: number; cvr: number;
}
interface Props { terms: Term[]; }

const MATCH_COLORS: Record<string, string> = { Exact: '#A8C3A0', Phrase: '#F4B8A8', Broad: '#C4A882' };
const roasColor = (roas: number) => roas >= ROAS_TARGET ? '#4A7A42' : roas >= 2 ? '#B07A30' : '#B05040';
const roasBg    = (roas: number) => roas >= ROAS_TARGET ? '#A8C3A0' : roas >= 2 ? '#F4D8A8' : '#F4B8A8';

export default function SearchTermInsights({ terms }: Props) {
  const [matchFilter, setMatchFilter] = useState('All');
  const [sort, setSort] = useState<'spend' | 'roas' | 'orders'>('spend');

  const filtered = terms
    .filter((t) => matchFilter === 'All' || t.matchType === matchFilter)
    .sort((a, b) => b[sort] - a[sort]);

  const top10Spend  = [...terms].sort((a, b) => b.spend - a.spend).slice(0, 10);
  const top10Orders = [...terms].sort((a, b) => b.orders - a.orders).slice(0, 10);

  const totalSpend  = filtered.reduce((s, t) => s + t.spend, 0);
  const totalSales  = filtered.reduce((s, t) => s + t.sales, 0);
  const totalOrders = filtered.reduce((s, t) => s + t.orders, 0);
  const overallROAS = totalSpend > 0 ? totalSales / totalSpend : 0;
  const wastedTerms = filtered.filter((t) => t.roas < 2).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Search Terms', value: filtered.length.toString() },
          { label:'Total Spend',  value: fmtINR(totalSpend) },
          { label:'Blended ROAS', value: `${overallROAS.toFixed(2)}x` },
          { label:'Low-ROAS Terms (< 2x)', value: wastedTerms.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-4">
            <p className="text-[10px] font-semibold text-[#3A2F2F]/40 uppercase tracking-widest mb-2">{label}</p>
            <p className="text-2xl font-semibold text-[#3A2F2F]">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">Top 10 Terms by Spend</h3>
          <p className="text-xs text-[#3A2F2F]/40 mb-4">Coloured by match type</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top10Spend} layout="vertical" margin={{ top:0, right:40, left:4, bottom:0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.6} horizontal={false} />
              <XAxis type="number" tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => fmtINR(v)} />
              <YAxis type="category" dataKey="term" width={130}
                tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.65 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [fmtINR(v), 'Spend']}
                contentStyle={{ background:'white', border:'1px solid #E8D8C3', borderRadius:'12px', fontSize:'12px' }} />
              <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
                {top10Spend.map((t, i) => (
                  <Cell key={i} fill={MATCH_COLORS[t.matchType] ?? '#E8D8C3'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">Top 10 Terms by Orders</h3>
          <p className="text-xs text-[#3A2F2F]/40 mb-4">Coloured by match type</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top10Orders} layout="vertical" margin={{ top:0, right:40, left:4, bottom:0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.6} horizontal={false} />
              <XAxis type="number" tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="term" width={130}
                tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.65 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [v, 'Orders']}
                contentStyle={{ background:'white', border:'1px solid #E8D8C3', borderRadius:'12px', fontSize:'12px' }} />
              <Bar dataKey="orders" radius={[0, 4, 4, 0]}>
                {top10Orders.map((t, i) => (
                  <Cell key={i} fill={MATCH_COLORS[t.matchType] ?? '#E8D8C3'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-3 justify-end">
            {Object.entries(MATCH_COLORS).map(([k, c]) => (
              <span key={k} className="flex items-center gap-1 text-[10px] text-[#3A2F2F]/50">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />{k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filter + Table */}
      <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F]">All Search Terms</h3>
          <div className="flex gap-2">
            {['All', 'Exact', 'Phrase', 'Broad'].map((m) => (
              <button key={m} onClick={() => setMatchFilter(m)}
                className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background: matchFilter === m ? '#3A2F2F' : '#F8F5F0',
                  color: matchFilter === m ? 'white' : '#3A2F2F',
                }}>{m}</button>
            ))}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'spend' | 'roas' | 'orders')}
              className="text-[10px] border border-[#E8D8C3] rounded-xl px-2 py-1.5 text-[#3A2F2F] bg-white cursor-pointer"
            >
              <option value="spend">Sort: Spend</option>
              <option value="roas">Sort: ROAS</option>
              <option value="orders">Sort: Orders</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #E8D8C3' }}>
                {['Search Term', 'Match', 'Type', 'Spend', 'Sales', 'ROAS', 'ACoS', 'CTR', 'CPC', 'CVR', 'Orders'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold text-[#3A2F2F]/40 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.term} style={{ borderBottom: '1px solid #F8F5F0' }}
                  className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-2.5 px-2 font-medium text-[#3A2F2F] max-w-[160px] truncate">{t.term}</td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: MATCH_COLORS[t.matchType] + '40', color: '#3A2F2F' }}>{t.matchType}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: '#E8D8C3', color: '#3A2F2F' }}>{t.type}</span>
                  </td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">{fmtINR(t.spend)}</td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">{fmtINR(t.sales)}</td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: roasBg(t.roas), color: roasColor(t.roas) }}>{t.roas.toFixed(2)}x</span>
                  </td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">{t.acos.toFixed(1)}%</td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">{t.ctr.toFixed(2)}%</td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">₹{t.cpc.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">{t.cvr.toFixed(1)}%</td>
                  <td className="py-2.5 px-2 font-semibold text-[#3A2F2F]">{t.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
