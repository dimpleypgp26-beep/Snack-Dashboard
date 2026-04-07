'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { fmtINR } from '@/lib/data';

interface CampaignRow {
  campaign: string; type: string; sku: string;
  spend: number; sales: number; clicks: number; impressions: number; orders: number;
  roas: number; acos: number; ctr: number; cpc: number; cvr: number;
}
interface TypeRow { type: string; spend: number; sales: number; roas: number; orders: number; }
interface MonthRow { month: string; SP: number; SB: number; SD: number; }

interface Props {
  campaigns: CampaignRow[];
  typeBreakdown: TypeRow[];
  monthlyTrend: MonthRow[];
}

const TYPE_COLORS: Record<string, string> = { SP: '#F4B8A8', SB: '#A8C3A0', SD: '#C4A882' };
const roasBg = (v: number) => v >= 3 ? '#A8C3A0' : v >= 2 ? '#F4D8A8' : '#F4B8A8';
const roasFg = (v: number) => v >= 3 ? '#4A7A42' : v >= 2 ? '#B07A30' : '#B05040';

export default function CampaignAnalysis({ campaigns, typeBreakdown, monthlyTrend }: Props) {
  const roasData = [...campaigns].sort((a, b) => b.roas - a.roas);

  return (
    <div className="space-y-6">
      {/* Campaign type KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {typeBreakdown.map((t) => (
          <div key={t.type} className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{ background: TYPE_COLORS[t.type] + '40', color: '#3A2F2F' }}>{t.type}</span>
              <span className="text-xs text-[#3A2F2F]/40 font-medium">
                {t.type === 'SP' ? 'Sponsored Products' : t.type === 'SB' ? 'Sponsored Brands' : 'Sponsored Display'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:'Spend',  value: fmtINR(t.spend) },
                { label:'Sales',  value: fmtINR(t.sales) },
                { label:'ROAS',   value: `${t.roas.toFixed(2)}x` },
                { label:'Orders', value: t.orders.toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-[#3A2F2F]/40 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#3A2F2F]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">ROAS by Campaign</h3>
          <p className="text-xs text-[#3A2F2F]/40 mb-4">Target: 3.0x · Red = below target</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={roasData} layout="vertical" margin={{ top:0, right:50, left:8, bottom:0 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.6} horizontal={false} />
              <XAxis type="number" tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v}x`} domain={[0, 5]} />
              <YAxis type="category" dataKey="campaign" width={160}
                tick={{ fill:'#3A2F2F', fontSize:9, opacity:0.65 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(2)}x`, 'ROAS']}
                contentStyle={{ background:'white', border:'1px solid #E8D8C3', borderRadius:'12px', fontSize:'12px' }} />
              <Bar dataKey="roas" radius={[0, 4, 4, 0]}>
                {roasData.map((c, i) => (
                  <Cell key={i} fill={c.roas >= 3 ? '#A8C3A0' : c.roas >= 2 ? '#F4D8A8' : '#F4B8A8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">Monthly Spend by Type</h3>
          <p className="text-xs text-[#3A2F2F]/40 mb-4">Stacked spend allocation per month</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyTrend} margin={{ top:4, right:8, left:-8, bottom:0 }} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.7} vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'#3A2F2F', fontSize:11, opacity:0.45 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => fmtINR(v)} />
              <Tooltip formatter={(v: number, name: string) => [fmtINR(v), name]}
                contentStyle={{ background:'white', border:'1px solid #E8D8C3', borderRadius:'12px', fontSize:'12px' }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:'11px', opacity:0.6, paddingTop:'10px' }} />
              <Bar dataKey="SP" stackId="a" fill="#F4B8A8" />
              <Bar dataKey="SB" stackId="a" fill="#A8C3A0" />
              <Bar dataKey="SD" stackId="a" fill="#C4A882" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign table */}
      <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
        <h3 className="text-sm font-semibold text-[#3A2F2F] mb-4">Campaign Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #E8D8C3' }}>
                {['Campaign', 'Type', 'SKU', 'Spend', 'Sales', 'ROAS', 'ACoS', 'CTR', 'CPC', 'CVR', 'Orders'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold text-[#3A2F2F]/40 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.campaign} style={{ borderBottom:'1px solid #F8F5F0' }} className="hover:bg-[#FAF7F2]">
                  <td className="py-2.5 px-2 font-medium text-[#3A2F2F] text-[11px]">{c.campaign}</td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: TYPE_COLORS[c.type] + '40', color:'#3A2F2F' }}>{c.type}</span>
                  </td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/50 text-[11px]">{c.sku}</td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">{fmtINR(c.spend)}</td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">{fmtINR(c.sales)}</td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: roasBg(c.roas), color: roasFg(c.roas) }}>{c.roas.toFixed(2)}x</span>
                  </td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">{c.acos.toFixed(1)}%</td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">{c.ctr.toFixed(2)}%</td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">₹{c.cpc.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-[#3A2F2F]/70">{c.cvr.toFixed(1)}%</td>
                  <td className="py-2.5 px-2 font-semibold text-[#3A2F2F]">{c.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
