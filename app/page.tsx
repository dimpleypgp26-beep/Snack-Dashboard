'use client';

import { useState, useMemo } from 'react';
import {
  FilterState, CATEGORIES, CHANNELS, MONTHS, MONTH_LABELS,
  getKPIs, getLineChartData, getChannelChartData, getCityChartData,
} from '@/lib/data';
import Filters from '@/components/Filters';
import KPIBox from '@/components/KPIBox';
import LineChartAOV from '@/components/LineChartAOV';
import BarChartComponent from '@/components/BarChartChannel';

function fmtRupee(v: number) {
  if (v >= 10_00_000) return `₹${(v / 10_00_000).toFixed(2)}L`;
  if (v >= 1_000) return `₹${(v / 1_000).toFixed(0)}K`;
  return `₹${v.toFixed(0)}`;
}

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    channel: 'All',
    city: 'All',
    startMonth: 0,
    endMonth: 2,
  });

  const handleChange = (key: string, value: string | number) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const kpis       = useMemo(() => getKPIs(filters), [filters]);
  const lineData   = useMemo(() => getLineChartData(filters), [filters]);
  const chData     = useMemo(() => getChannelChartData(filters), [filters]);
  const cityData   = useMemo(() => getCityChartData(filters), [filters]);

  const activeCategories = filters.category === 'All' ? [...CATEGORIES] : [filters.category];
  const activeChannels   = filters.channel  === 'All' ? [...CHANNELS]   : [filters.channel];
  const monthCount       = filters.endMonth - filters.startMonth + 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b" style={{ backgroundColor: 'white', borderColor: '#E8D8C3' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold" style={{ color: '#3A2F2F' }}>Brand Analytics</h1>
            <p className="text-xs mt-0.5" style={{ color: '#3A2F2F', opacity: 0.4 }}>
              Beauty & Wellness · Nov 2025 – Jan 2026 · 2,000 orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A8C3A0' }} />
            <span className="text-xs" style={{ color: '#3A2F2F', opacity: 0.45 }}>
              {MONTH_LABELS[MONTHS[filters.startMonth]]} – {MONTH_LABELS[MONTHS[filters.endMonth]]}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Filters */}
        <Filters
          category={filters.category}
          channel={filters.channel}
          city={filters.city}
          startMonth={filters.startMonth}
          endMonth={filters.endMonth}
          onChange={handleChange}
        />

        {/* KPI Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPIBox title="Total Revenue"      value={fmtRupee(kpis.revenue)}              subtitle="Across all channels"    trend={4.6}  />
          <KPIBox title="Total Orders"       value={kpis.orders.toLocaleString()}          subtitle="Completed transactions" trend={0.3}  />
          <KPIBox title="Avg Order Value"    value={`₹${kpis.aov.toFixed(0)}`}            subtitle="Revenue per order"      trend={1.2}  />
          <KPIBox title="Unique Customers"   value={kpis.uniqueCustomers.toLocaleString()} subtitle="Active buyers"          trend={3.8}  />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line: Monthly AOV by Category */}
          <LineChartAOV data={lineData} activeLines={activeCategories} />

          {/* Stacked Bar: Orders by Category per Channel */}
          <BarChartComponent
            data={chData}
            stackKeys={activeCategories}
            xKey="channel"
            title="Orders by Category & Channel"
            subtitle="Order count distribution across sales channels"
          />

          {/* Stacked Bar: Orders by Channel per City */}
          <BarChartComponent
            data={cityData}
            stackKeys={activeChannels}
            xKey="city"
            title="Orders by City & Channel"
            subtitle="Order count distribution across cities"
          />

          {/* Summary panel */}
          <div className="rounded-2xl border p-6 flex flex-col justify-between"
            style={{ backgroundColor: '#F8F5F0', borderColor: '#E8D8C3' }}>
            <div>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: '#3A2F2F' }}>Period Summary</h3>
              <p className="text-xs mb-6" style={{ color: '#3A2F2F', opacity: 0.4 }}>
                {MONTH_LABELS[MONTHS[filters.startMonth]]} – {MONTH_LABELS[MONTHS[filters.endMonth]]} ·{' '}
                {filters.category === 'All' ? 'All categories' : filters.category} ·{' '}
                {filters.channel  === 'All' ? 'All channels'   : filters.channel} ·{' '}
                {filters.city     === 'All' ? 'All cities'     : filters.city}
              </p>
            </div>
            <div className="space-y-0">
              {[
                { label: 'Avg Monthly Revenue', value: fmtRupee(kpis.revenue / Math.max(1, monthCount)) },
                { label: 'Avg Monthly Orders',  value: Math.round(kpis.orders / Math.max(1, monthCount)).toLocaleString() },
                { label: 'Avg Order Value',      value: `₹${kpis.aov.toFixed(0)}` },
                { label: 'Unique Customers',     value: kpis.uniqueCustomers.toLocaleString() },
                { label: 'Total Revenue',        value: fmtRupee(kpis.revenue) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b last:border-0"
                  style={{ borderColor: '#E8D8C3' }}>
                  <span className="text-xs" style={{ color: '#3A2F2F', opacity: 0.55 }}>{label}</span>
                  <span className="text-sm font-semibold" style={{ color: '#3A2F2F' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-xs text-center" style={{ color: '#3A2F2F', opacity: 0.25 }}>
          Brand Analytics Dashboard · Data sourced from Dimple_Yadav_Analytics-SessionXIIIWorkingExcel.xlsx
        </p>
      </footer>
    </div>
  );
}
