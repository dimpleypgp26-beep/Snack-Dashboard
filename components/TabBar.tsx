'use client';

const TABS = [
  { id: 'overview',    label: 'Performance Overview' },
  { id: 'search',      label: 'Search Term Insights' },
  { id: 'sku',         label: 'SKU Performance' },
  { id: 'campaign',    label: 'Campaign Analysis' },
  { id: 'efficiency',  label: 'Budget Efficiency' },
];

interface TabBarProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 overflow-x-auto" style={{ borderBottom: '1px solid #E8D8C3' }}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all"
          style={{
            color: activeTab === tab.id ? '#3A2F2F' : '#3A2F2F',
            opacity: activeTab === tab.id ? 1 : 0.4,
            borderBottom: activeTab === tab.id ? '2px solid #F4B8A8' : '2px solid transparent',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
