'use client';

import { useState, useMemo } from 'react';
import {
  FilterState, fmtINR, MONTHS, MONTH_LABELS, MONTHLY_SKU_SALES, SKU_DATA,
  filterCampaigns, getKPIs, getMonthlyTrend, getCampaignTypeBreakdown,
  getCampaignBreakdown, getEnrichedSearchTerms, RAW_CAMPAIGN_DATA,
} from '@/lib/data';
import Filters from '@/components/Filters';
import TabBar from '@/components/TabBar';
import PerformanceOverview from '@/components/tabs/PerformanceOverview';
import SearchTermInsights from '@/components/tabs/SearchTermInsights';
import SKUPerformance from '@/components/tabs/SKUPerformance';
import CampaignAnalysis from '@/components/tabs/CampaignAnalysis';
import BudgetEfficiency from '@/components/tabs/BudgetEfficiency';

// Monthly spend by campaign type (for CampaignAnalysis stacked bar)
function getMonthlyByType(startMonth: number, endMonth: number) {
  return MONTHS.slice(startMonth, endMonth + 1).map((month) => {
    const rows = RAW_CAMPAIGN_DATA.filter((d) => d.month === month);
    return {
      month,
      SP: rows.filter((d) => d.type === 'SP').reduce((s, d) => s + d.spend, 0),
      SB: rows.filter((d) => d.type === 'SB').reduce((s, d) => s + d.spend, 0),
      SD: rows.filter((d) => d.type === 'SD').reduce((s, d) => s + d.spend, 0),
    };
  });
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<FilterState>({
    campaignType: 'All', sku: 'All', startMonth: 0, endMonth: 5,
  });

  const handleChange = (key: string, value: string | number) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const campaignData    = useMemo(() => filterCampaigns(filters), [filters]);
  const kpis            = useMemo(() => getKPIs(campaignData), [campaignData]);
  const monthlyTrend    = useMemo(() => getMonthlyTrend(campaignData, filters.startMonth, filters.endMonth), [campaignData, filters]);
  const typeBreakdown   = useMemo(() => getCampaignTypeBreakdown(campaignData), [campaignData]);
  const campaignBreak   = useMemo(() => getCampaignBreakdown(campaignData), [campaignData]);
  const searchTerms     = useMemo(() => getEnrichedSearchTerms(filters), [filters]);
  const monthlyByType   = useMemo(() => getMonthlyByType(filters.startMonth, filters.endMonth), [filters]);
  const skuMonthly      = useMemo(() => MONTHLY_SKU_SALES.slice(filters.startMonth, filters.endMonth + 1), [filters]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b" style={{ backgroundColor: 'white', borderColor: '#E8D8C3' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-4 flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold" style={{ color: '#3A2F2F' }}>
                Amazon Ads Insights
              </h1>
              <p className="text-xs mt-0.5" style={{ color: '#3A2F2F', opacity: 0.4 }}>
                Healthy Snack Bars · Sponsored Products / Brands / Display · Aug 2024 – Jan 2025
              </p>
            </div>
            {/* Quick KPIs in header */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { label: 'Spend',  value: fmtINR(kpis.spend) },
                { label: 'Sales',  value: fmtINR(kpis.sales) },
                { label: 'ROAS',   value: `${kpis.roas.toFixed(2)}x` },
                { label: 'ACoS',   value: `${kpis.acos.toFixed(1)}%` },
              ].map(({ label, value }) => (
                <div key={label} className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color:'#3A2F2F', opacity:0.35 }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color:'#3A2F2F' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
          <TabBar activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Filters */}
        <Filters
          campaignType={filters.campaignType}
          sku={filters.sku}
          startMonth={filters.startMonth}
          endMonth={filters.endMonth}
          onChange={handleChange}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <PerformanceOverview kpis={kpis} monthlyTrend={monthlyTrend} typeBreakdown={typeBreakdown} />
        )}
        {activeTab === 'search' && (
          <SearchTermInsights terms={searchTerms} />
        )}
        {activeTab === 'sku' && (
          <SKUPerformance skus={SKU_DATA} monthlyTrend={skuMonthly} />
        )}
        {activeTab === 'campaign' && (
          <CampaignAnalysis
            campaigns={campaignBreak}
            typeBreakdown={typeBreakdown}
            monthlyTrend={monthlyByType}
          />
        )}
        {activeTab === 'efficiency' && (
          <BudgetEfficiency campaigns={campaignBreak} />
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-6">
        <p className="text-xs text-center" style={{ color:'#3A2F2F', opacity:0.25 }}>
          Amazon Ads Insights Dashboard · Healthy Snack Bars · AI-generated mock data · Aug 2024 – Jan 2025
        </p>
      </footer>
    </div>
  );
}
