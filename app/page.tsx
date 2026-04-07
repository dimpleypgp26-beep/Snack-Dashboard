'use client';

import { useState, useMemo } from 'react';
import {
  FilterState,
  PLATFORMS,
  getKPIs,
  getLineChartData,
  getChannelChartData,
  getPlatformChartData,
  MONTHS,
} from '@/lib/data';
import Filters from '@/components/Filters';
import KPIBox from '@/components/KPIBox';
import LineChartAOV from '@/components/LineChartAOV';
import BarChartChannel from '@/components/BarChartChannel';
import BarChartPlatform from '@/components/BarChartPlatform';

function fmtRevenue(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    platform: 'All',
    region: 'All',
    startMonth: 0,
    endMonth: 11,
  });

  const handleChange = (key: string, value: string | number) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const kpis = useMemo(() => getKPIs(filters), [filters]);
  const lineData = useMemo(() => getLineChartData(filters), [filters]);
  const channelData = useMemo(() => getChannelChartData(filters), [filters]);
  const platformData = useMemo(() => getPlatformChartData(filters), [filters]);
  const activePlatforms = filters.platform === 'All' ? [...PLATFORMS] : [filters.platform];
  const monthCount = filters.endMonth - filters.startMonth + 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-20 border-b"
        style={{ backgroundColor: 'white', borderColor: '#E8D8C3' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold" style={{ color: '#3A2F2F' }}>
              Snack Analytics
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#3A2F2F', opacity: 0.4 }}>
              Healthy snack & protein brand &middot; FY 2024
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#A8C3A0' }}
            />
            <span className="text-xs" style={{ color: '#3A2F2F', opacity: 0.45 }}>
              {MONTHS[filters.startMonth]}–{MONTHS[filters.endMonth]} 2024
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Filters */}
        <section>
          <Filters
            platform={filters.platform}
            region={filters.region}
            startMonth={filters.startMonth}
            endMonth={filters.endMonth}
            onChange={handleChange}
          />
        </section>

        {/* KPI Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPIBox title="Total Revenue" value={fmtRevenue(kpis.revenue)} subtitle="All platforms & regions" trend={8.4} />
          <KPIBox title="Total Orders" value={kpis.orders.toLocaleString()} subtitle="Completed transactions" trend={5.2} />
          <KPIBox title="Avg Order Value" value={`$${kpis.aov.toFixed(2)}`} subtitle="Revenue per order" trend={2.1} />
          <KPIBox title="Conversion Rate" value={`${kpis.conversionRate}%`} subtitle="Visitor to buyer" trend={-0.3} />
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChartAOV data={lineData} activePlatforms={activePlatforms} />
          <BarChartChannel data={channelData} />
          <BarChartPlatform data={platformData} />

          {/* Summary panel */}
          <div
            className="rounded-2xl border p-6 flex flex-col justify-between"
            style={{ backgroundColor: '#F8F5F0', borderColor: '#E8D8C3' }}
          >
            <div>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: '#3A2F2F' }}>
                Period Summary
              </h3>
              <p className="text-xs mb-6" style={{ color: '#3A2F2F', opacity: 0.4 }}>
                {MONTHS[filters.startMonth]}–{MONTHS[filters.endMonth]} &middot;{' '}
                {filters.platform === 'All' ? 'All platforms' : filters.platform} &middot;{' '}
                {filters.region === 'All' ? 'All regions' : filters.region}
              </p>
            </div>

            <div className="space-y-0">
              {[
                {
                  label: 'Avg Monthly Revenue',
                  value: fmtRevenue(kpis.revenue / Math.max(1, monthCount)),
                },
                {
                  label: 'Avg Monthly Orders',
                  value: Math.round(kpis.orders / Math.max(1, monthCount)).toLocaleString(),
                },
                { label: 'Avg Order Value', value: `$${kpis.aov.toFixed(2)}` },
                { label: 'Avg Conversion Rate', value: `${kpis.conversionRate}%` },
                {
                  label: 'Total Revenue',
                  value: fmtRevenue(kpis.revenue),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                  style={{ borderColor: '#E8D8C3' }}
                >
                  <span className="text-xs" style={{ color: '#3A2F2F', opacity: 0.55 }}>
                    {label}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: '#3A2F2F' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-xs text-center" style={{ color: '#3A2F2F', opacity: 0.25 }}>
          Snack Analytics Dashboard &middot; Next.js + Recharts &middot; Illustrative data only
        </p>
      </footer>
    </div>
  );
}
