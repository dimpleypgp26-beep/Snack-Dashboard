// ─── Real data extracted from Dimple_Yadav_Analytics-SessionXIIIWorkingExcel.xlsx ───

export const MONTHS = ['Nov', 'Dec', 'Jan'] as const;
export const MONTH_LABELS: Record<string, string> = { Nov: 'Nov 2025', Dec: 'Dec 2025', Jan: 'Jan 2026' };

export const CATEGORIES = ['Beauty', 'Fragrance', 'Haircare', 'Skincare', 'Wellness'] as const;
export const ALL_CATEGORIES = ['All', ...CATEGORIES] as const;

export const CHANNELS = ['App', 'Retail', 'Website'] as const;
export const ALL_CHANNELS = ['All', ...CHANNELS] as const;

export const CITIES = ['Delhi', 'Gurgaon', 'Hyderabad', 'Mumbai', 'Noida'] as const;
export const ALL_CITIES = ['All', ...CITIES] as const;

export type Category = (typeof CATEGORIES)[number];
export type Channel = (typeof CHANNELS)[number];
export type City = (typeof CITIES)[number];

export interface FilterState {
  category: string;
  channel: string;
  city: string;
  startMonth: number; // 0 = Nov, 1 = Dec, 2 = Jan
  endMonth: number;
}

// ─── Exact data from Retention sheet ─────────────────────────────────────────
const MONTHLY_KPIS = [
  { month: 'Nov', orders: 666, revenue: 1_787_033, aov: 2683.23, uniqueCustomers: 365 },
  { month: 'Dec', orders: 666, revenue: 1_729_046, aov: 2596.17, uniqueCustomers: 376 },
  { month: 'Jan', orders: 668, revenue: 1_814_041, aov: 2715.63, uniqueCustomers: 380 },
];

// ─── Exact Monthly AOV by Category from AOV sheet ────────────────────────────
const MONTHLY_AOV_BY_CAT: Record<string, Record<string, number>> = {
  Nov: { Beauty: 2722.98, Fragrance: 2525.37, Haircare: 3120.66, Skincare: 2898.01, Wellness: 2767.94 },
  Dec: { Beauty: 2633.39, Fragrance: 2715.74, Haircare: 2818.70, Skincare: 2696.22, Wellness: 2751.10 },
  Jan: { Beauty: 2728.82, Fragrance: 2686.37, Haircare: 2860.01, Skincare: 2748.45, Wellness: 2863.09 },
};

// ─── Exact breakdowns from AOV & Retention sheets ────────────────────────────
const CATEGORY_AOV: Record<string, number> = {
  Beauty: 2695.38, Fragrance: 2645.93, Haircare: 2927.53, Skincare: 2780.73, Wellness: 2797.19,
};
const CHANNEL_AOV: Record<string, number> = { App: 2895, Retail: 2684, Website: 2720 };
const CITY_AOV: Record<string, number> = { Delhi: 2838, Gurgaon: 2809, Hyderabad: 2736, Mumbai: 2824, Noida: 2626 };

// Order counts from AOV sheet (total = 2000)
const CATEGORY_ORDERS: Record<string, number> = {
  Wellness: 562, Fragrance: 409, Skincare: 350, Beauty: 342, Haircare: 337,
};
// Order counts from Retention sheet (total = 2000)
const CHANNEL_ORDERS: Record<string, number> = { App: 668, Retail: 687, Website: 645 };
const CITY_ORDERS: Record<string, number> = { Delhi: 420, Gurgaon: 378, Hyderabad: 402, Mumbai: 391, Noida: 409 };

// Category orders distributed by channel (proportional from real weights)
const CAT_BY_CHANNEL: Record<string, Record<string, number>> = {
  App:     { Wellness: 192, Fragrance: 140, Skincare: 120, Beauty: 117, Haircare: 115 },
  Retail:  { Wellness: 187, Fragrance: 136, Skincare: 116, Beauty: 114, Haircare: 112 },
  Website: { Wellness: 183, Fragrance: 133, Skincare: 114, Beauty: 111, Haircare: 110 },
};

// Channel orders distributed by city (proportional from real weights)
const CHANNEL_BY_CITY: Record<string, Record<string, number>> = {
  Delhi:    { App: 140, Retail: 145, Website: 135 },
  Gurgaon:  { App: 126, Retail: 130, Website: 122 },
  Hyderabad:{ App: 134, Retail: 138, Website: 130 },
  Mumbai:   { App: 131, Retail: 135, Website: 126 },
  Noida:    { App: 137, Retail: 141, Website: 132 },
};

// ─── Filter & aggregation utilities ──────────────────────────────────────────

export function getKPIs(f: FilterState) {
  const slice = MONTHLY_KPIS.slice(f.startMonth, f.endMonth + 1);
  let orders = slice.reduce((s, d) => s + d.orders, 0);
  let revenue = slice.reduce((s, d) => s + d.revenue, 0);
  let customers = slice.reduce((s, d) => s + d.uniqueCustomers, 0);
  let aov = orders > 0 ? revenue / orders : 0;

  if (f.category !== 'All') {
    const share = CATEGORY_ORDERS[f.category] / 2000;
    orders = Math.round(orders * share);
    aov = CATEGORY_AOV[f.category];
    revenue = Math.round(orders * aov);
    customers = Math.round(customers * share);
  }
  if (f.channel !== 'All') {
    const share = CHANNEL_ORDERS[f.channel] / 2000;
    orders = Math.round(orders * share);
    aov = CHANNEL_AOV[f.channel];
    revenue = Math.round(orders * aov);
    customers = Math.round(customers * share);
  }
  if (f.city !== 'All') {
    const share = CITY_ORDERS[f.city] / 2000;
    orders = Math.round(orders * share);
    aov = CITY_AOV[f.city];
    revenue = Math.round(orders * aov);
    customers = Math.round(customers * share);
  }

  return { revenue, orders, aov: Math.round(aov * 100) / 100, uniqueCustomers: customers };
}

// Line chart: monthly AOV by category
export function getLineChartData(f: FilterState): Record<string, string | number>[] {
  const activeCategories = f.category === 'All' ? [...CATEGORIES] : [f.category as Category];
  return MONTHS.slice(f.startMonth, f.endMonth + 1).map((month) => {
    const entry: Record<string, string | number> = { month };
    activeCategories.forEach((cat) => { entry[cat] = MONTHLY_AOV_BY_CAT[month][cat]; });
    return entry;
  });
}

// Stacked bar: category orders by channel
export function getChannelChartData(f: FilterState): Record<string, string | number>[] {
  const activeChannels = f.channel === 'All' ? [...CHANNELS] : [f.channel as Channel];
  const activeCats = f.category === 'All' ? [...CATEGORIES] : [f.category as Category];
  const mFactor = (f.endMonth - f.startMonth + 1) / 3;
  return activeChannels.map((ch) => {
    const entry: Record<string, string | number> = { channel: ch };
    activeCats.forEach((cat) => { entry[cat] = Math.round(CAT_BY_CHANNEL[ch][cat] * mFactor); });
    return entry;
  });
}

// Stacked bar: channel orders by city
export function getCityChartData(f: FilterState): Record<string, string | number>[] {
  const activeCities = f.city === 'All' ? [...CITIES] : [f.city as City];
  const activeChs = f.channel === 'All' ? [...CHANNELS] : [f.channel as Channel];
  const mFactor = (f.endMonth - f.startMonth + 1) / 3;
  return activeCities.map((city) => {
    const entry: Record<string, string | number> = { city };
    activeChs.forEach((ch) => { entry[ch] = Math.round(CHANNEL_BY_CITY[city][ch] * mFactor); });
    return entry;
  });
}

export const CHART_COLORS: Record<string, string> = {
  // Categories
  Beauty:    '#F4B8A8',
  Fragrance: '#A8C3A0',
  Haircare:  '#E8D8C3',
  Skincare:  '#C4A882',
  Wellness:  '#B8CEDD',
  // Channels
  App:     '#F4B8A8',
  Retail:  '#A8C3A0',
  Website: '#C4A882',
};
