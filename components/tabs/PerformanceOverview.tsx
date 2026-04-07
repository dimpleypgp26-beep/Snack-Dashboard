'use client';

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, BarChart,
} from 'recharts';
import { fmtINR } from '@/lib/data';

interface KPI {
  spend: number; sales: number; roas: number; acos: number;
  orders: number; clicks: number; impressions: number; ctr: number; cpc: number; cvr: number;
}
interface MonthRow { month: string; spend: number; sales: number; roas: number; orders: number; }
interface TypeRow  { type: string; spend: number; sales: number; roas: number; orders: number; }

interface Props { kpis: KPI; monthlyTrend: MonthRow[]; typeBreakdown: TypeRow[]; }

const TYPE_COLORS: Record<string, string> = { SP: '#F4B8A8', SB: '#A8C3A0', SD: '#C4A882' };

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-4 hover:shadow-md transition-shadow">
      <p className="text-[10px] font-semibold text-[#3A2F2F]/40 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-semibold text-[#3A2F2F]">{value}</p>
      {sub && <p className="text-xs text-[#3A2F2F]/40 mt-1">{sub}</p>}
    </div>
  );
}

function TTip({ active, payload, label }: { active?: boolean; payload?: {name:string;value:number;color:string}[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8D8C3] rounded-xl p-3 shadow-md text-xs">
      <p className="font-semibold text-[#3A2F2F] mb-2">{label} 2024/25</p>
      {payload.map((e) => (
        <div key={e.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
          <span className="text-[#3A2F2F]/50">{e.name}</span>
          <span className="font-semibold text-[#3A2F2F] ml-auto pl-3">
            {e.name === 'ROAS' ? `${e.value}x` : e.name === 'Orders' ? e.value : fmtINR(e.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PerformanceOverview({ kpis, monthlyTrend, typeBreakdown }: Props) {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Metric label="Total Ad Spend"  value={fmtINR(kpis.spend)}              sub="6-month total" />
        <Metric label="Total Ad Sales"  value={fmtINR(kpis.sales)}              sub="Ad-attributed revenue" />
        <Metric label="Overall ROAS"    value={`${kpis.roas.toFixed(2)}x`}      sub={`ACoS ${kpis.acos.toFixed(1)}%`} />
        <Metric label="Total Orders"    value={kpis.orders.toLocaleString()}     sub="Ad-attributed" />
        <Metric label="Total Clicks"    value={kpis.clicks.toLocaleString()}     sub={`CTR ${kpis.ctr.toFixed(2)}%`} />
        <Metric label="Avg CPC"         value={`₹${kpis.cpc.toFixed(2)}`}       sub="Cost per click" />
        <Metric label="Conv. Rate"      value={`${kpis.cvr.toFixed(1)}%`}       sub="Clicks → Orders" />
        <Metric label="Total Impressions" value={`${(kpis.impressions/1000).toFixed(0)}K`} sub="Ad impressions" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend vs Sales */}
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">Monthly Spend vs Sales</h3>
          <p className="text-xs text-[#3A2F2F]/40 mb-4">Ad spend (bars) vs ad-attributed sales (line)</p>
          <ResponsiveContainer width="100%" height={230}>
            <ComposedChart data={monthlyTrend} margin={{ top:4, right:8, left:-8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.7} vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'#3A2F2F', fontSize:11, opacity:0.45 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => fmtINR(v)} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }}
                axisLine={false} tickLine={false} tickFormatter={(v) => fmtINR(v)} />
              <Tooltip content={<TTip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:'11px', opacity:0.6, paddingTop:'10px' }} />
              <Bar   yAxisId="left"  dataKey="spend" name="Spend" fill="#E8D8C3" radius={[4,4,0,0]} barSize={28} />
              <Line  yAxisId="right" dataKey="sales" name="Sales" stroke="#A8C3A0" strokeWidth={2.5} dot={{ r:4, strokeWidth:0, fill:'#A8C3A0' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ROAS by Campaign Type */}
        <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
          <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">ROAS by Campaign Type</h3>
          <p className="text-xs text-[#3A2F2F]/40 mb-4">Return on ad spend — target: 3.0x</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={typeBreakdown} margin={{ top:4, right:8, left:-8, bottom:0 }} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.7} vertical={false} />
              <XAxis dataKey="type" tick={{ fill:'#3A2F2F', fontSize:11, opacity:0.45 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v}x`} domain={[0, 5]} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(2)}x`, 'ROAS']}
                contentStyle={{ background:'white', border:'1px solid #E8D8C3', borderRadius:'12px', fontSize:'12px' }} />
              {/* Target line at 3.0x */}
              <Bar dataKey="roas" name="ROAS" radius={[6,6,0,0]}
                fill="#F4B8A8"
              >
                {typeBreakdown.map((entry) => (
                  <rect key={entry.type} fill={TYPE_COLORS[entry.type] ?? '#E8D8C3'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-[#3A2F2F]/30 mt-2 text-center">SP target exceeded · SB on track · SD needs review</p>
        </div>
      </div>

      {/* Monthly orders trend */}
      <div className="bg-white rounded-2xl border border-[#E8D8C3]/60 p-5">
        <h3 className="text-sm font-semibold text-[#3A2F2F] mb-1">Monthly Orders Trend</h3>
        <p className="text-xs text-[#3A2F2F]/40 mb-4">Ad-attributed orders per month</p>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={monthlyTrend} margin={{ top:4, right:8, left:-8, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8D8C3" strokeOpacity={0.7} vertical={false} />
            <XAxis dataKey="month" tick={{ fill:'#3A2F2F', fontSize:11, opacity:0.45 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#3A2F2F', fontSize:10, opacity:0.45 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => [v, 'Orders']}
              contentStyle={{ background:'white', border:'1px solid #E8D8C3', borderRadius:'12px', fontSize:'12px' }} />
            <Bar dataKey="orders" name="Orders" fill="#A8C3A0" radius={[4,4,0,0]} barSize={32} />
            <Line dataKey="roas" name="ROAS" stroke="#F4B8A8" strokeWidth={2} dot={false} yAxisId="roas" />
            <YAxis yAxisId="roas" orientation="right" hide />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
