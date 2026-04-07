// ─── Amazon Ads Mock Data — Healthy Snack Bars on Amazon India ───────────────
// Brand: Protein & Energy Bars | Period: Aug 2024 – Jan 2025
// SKUs: Chocolate Protein Bar · Peanut Butter Energy Bar · Almond & Dates Bar
// Campaign Types: SP (Sponsored Products) · SB (Sponsored Brands) · SD (Sponsored Display)

export type CampaignType = 'SP' | 'SB' | 'SD';
export type MatchType = 'Exact' | 'Phrase' | 'Broad';

export const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'] as const;
export const MONTH_LABELS: Record<string, string> = {
  Aug: 'Aug 2024', Sep: 'Sep 2024', Oct: 'Oct 2024',
  Nov: 'Nov 2024', Dec: 'Dec 2024', Jan: 'Jan 2025',
};
const MONTH_IDX: Record<string, number> = { Aug: 0, Sep: 1, Oct: 2, Nov: 3, Dec: 4, Jan: 5 };

export const CAMPAIGN_TYPES: CampaignType[] = ['SP', 'SB', 'SD'];
export const ALL_CAMPAIGN_TYPES = ['All', 'SP', 'SB', 'SD'] as const;

export const SKUS = ['CPB-001', 'PBB-002', 'ADB-003'] as const;
export const ALL_SKUS = ['All', ...SKUS] as const;
export const SKU_NAMES: Record<string, string> = {
  'CPB-001': 'Chocolate Protein Bar',
  'PBB-002': 'Peanut Butter Energy Bar',
  'ADB-003': 'Almond & Dates Bar',
};

export interface FilterState {
  campaignType: string;
  sku: string;
  startMonth: number;
  endMonth: number;
}

export interface CampaignRecord {
  month: string;
  campaign: string;
  type: CampaignType;
  sku: string;
  spend: number;
  sales: number;
  impressions: number;
  clicks: number;
  orders: number;
}

export interface SearchTermRecord {
  term: string;
  matchType: MatchType;
  campaign: string;
  type: CampaignType;
  spend: number;
  sales: number;
  impressions: number;
  clicks: number;
  orders: number;
}

export interface SKURecord {
  sku: string;
  name: string;
  adSpend: number;
  adSales: number;
  organicSales: number;
  totalSales: number;
}

// ─── Derived metric helpers ───────────────────────────────────────────────────
export const r = { // shorthand helper functions
  roas: (spend: number, sales: number) => (spend > 0 ? sales / spend : 0),
  acos: (spend: number, sales: number) => (sales > 0 ? (spend / sales) * 100 : 0),
  ctr:  (clicks: number, imp: number)  => (imp   > 0 ? (clicks / imp) * 100 : 0),
  cpc:  (spend: number, clicks: number)=> (clicks > 0 ? spend / clicks : 0),
  cvr:  (orders: number, clicks: number)=>(clicks > 0 ? (orders / clicks) * 100 : 0),
};

export function fmtINR(v: number): string {
  if (v >= 100_000) return `₹${(v / 100_000).toFixed(1)}L`;
  if (v >= 1_000)   return `₹${(v / 1_000).toFixed(0)}K`;
  return `₹${v.toFixed(0)}`;
}

// ─── Raw Campaign Data (42 records: 7 campaigns × 6 months) ──────────────────
export const RAW_CAMPAIGN_DATA: CampaignRecord[] = [
  // SP_Chocolate_Branded — CPB-001 — High ROAS branded terms
  { month:'Aug', campaign:'SP_Chocolate_Branded',    type:'SP', sku:'CPB-001', spend:20200, sales:84840,  impressions:48200,  clicks:265, orders:32 },
  { month:'Sep', campaign:'SP_Chocolate_Branded',    type:'SP', sku:'CPB-001', spend:18600, sales:78120,  impressions:44300,  clicks:243, orders:29 },
  { month:'Oct', campaign:'SP_Chocolate_Branded',    type:'SP', sku:'CPB-001', spend:23100, sales:97020,  impressions:55400,  clicks:305, orders:37 },
  { month:'Nov', campaign:'SP_Chocolate_Branded',    type:'SP', sku:'CPB-001', spend:25800, sales:108360, impressions:61900,  clicks:340, orders:41 },
  { month:'Dec', campaign:'SP_Chocolate_Branded',    type:'SP', sku:'CPB-001', spend:19100, sales:80220,  impressions:45800,  clicks:252, orders:30 },
  { month:'Jan', campaign:'SP_Chocolate_Branded',    type:'SP', sku:'CPB-001', spend:22000, sales:92400,  impressions:52800,  clicks:290, orders:35 },

  // SP_PeanutButter_Generic — PBB-002 — Generic health terms
  { month:'Aug', campaign:'SP_PeanutButter_Generic', type:'SP', sku:'PBB-002', spend:17100, sales:64980,  impressions:52000,  clicks:250, orders:25 },
  { month:'Sep', campaign:'SP_PeanutButter_Generic', type:'SP', sku:'PBB-002', spend:15700, sales:59660,  impressions:47800,  clicks:230, orders:23 },
  { month:'Oct', campaign:'SP_PeanutButter_Generic', type:'SP', sku:'PBB-002', spend:19600, sales:74480,  impressions:59800,  clicks:287, orders:29 },
  { month:'Nov', campaign:'SP_PeanutButter_Generic', type:'SP', sku:'PBB-002', spend:21800, sales:82840,  impressions:66700,  clicks:320, orders:32 },
  { month:'Dec', campaign:'SP_PeanutButter_Generic', type:'SP', sku:'PBB-002', spend:16200, sales:61560,  impressions:49300,  clicks:237, orders:24 },
  { month:'Jan', campaign:'SP_PeanutButter_Generic', type:'SP', sku:'PBB-002', spend:18700, sales:71060,  impressions:57000,  clicks:274, orders:27 },

  // SP_Almond_Competitor — ADB-003 — Competitor conquesting
  { month:'Aug', campaign:'SP_Almond_Competitor',    type:'SP', sku:'ADB-003', spend:21100, sales:67520,  impressions:58000,  clicks:244, orders:22 },
  { month:'Sep', campaign:'SP_Almond_Competitor',    type:'SP', sku:'ADB-003', spend:19400, sales:62080,  impressions:53400,  clicks:224, orders:20 },
  { month:'Oct', campaign:'SP_Almond_Competitor',    type:'SP', sku:'ADB-003', spend:24200, sales:77440,  impressions:66700,  clicks:280, orders:25 },
  { month:'Nov', campaign:'SP_Almond_Competitor',    type:'SP', sku:'ADB-003', spend:27000, sales:86400,  impressions:74500,  clicks:313, orders:28 },
  { month:'Dec', campaign:'SP_Almond_Competitor',    type:'SP', sku:'ADB-003', spend:20000, sales:64000,  impressions:55100,  clicks:231, orders:21 },
  { month:'Jan', campaign:'SP_Almond_Competitor',    type:'SP', sku:'ADB-003', spend:23100, sales:73920,  impressions:63600,  clicks:267, orders:24 },

  // SB_Brand_Portfolio — All SKUs — Brand awareness
  { month:'Aug', campaign:'SB_Brand_Portfolio',      type:'SB', sku:'All', spend:14100, sales:42300,  impressions:95000,  clicks:333, orders:33 },
  { month:'Sep', campaign:'SB_Brand_Portfolio',      type:'SB', sku:'All', spend:12900, sales:38700,  impressions:87400,  clicks:306, orders:31 },
  { month:'Oct', campaign:'SB_Brand_Portfolio',      type:'SB', sku:'All', spend:16100, sales:48300,  impressions:109200, clicks:382, orders:38 },
  { month:'Nov', campaign:'SB_Brand_Portfolio',      type:'SB', sku:'All', spend:17900, sales:53700,  impressions:121600, clicks:426, orders:43 },
  { month:'Dec', campaign:'SB_Brand_Portfolio',      type:'SB', sku:'All', spend:13300, sales:39900,  impressions:90400,  clicks:316, orders:32 },
  { month:'Jan', campaign:'SB_Brand_Portfolio',      type:'SB', sku:'All', spend:15400, sales:46200,  impressions:104600, clicks:366, orders:37 },

  // SB_Almond_Launch — ADB-003 — New product launch push
  { month:'Aug', campaign:'SB_Almond_Launch',        type:'SB', sku:'ADB-003', spend:11100, sales:28860,  impressions:78000,  clicks:234, orders:21 },
  { month:'Sep', campaign:'SB_Almond_Launch',        type:'SB', sku:'ADB-003', spend:10200, sales:26520,  impressions:71800,  clicks:215, orders:19 },
  { month:'Oct', campaign:'SB_Almond_Launch',        type:'SB', sku:'ADB-003', spend:12600, sales:32760,  impressions:89700,  clicks:269, orders:24 },
  { month:'Nov', campaign:'SB_Almond_Launch',        type:'SB', sku:'ADB-003', spend:14000, sales:36400,  impressions:99900,  clicks:300, orders:27 },
  { month:'Dec', campaign:'SB_Almond_Launch',        type:'SB', sku:'ADB-003', spend:10500, sales:27300,  impressions:74700,  clicks:224, orders:20 },
  { month:'Jan', campaign:'SB_Almond_Launch',        type:'SB', sku:'ADB-003', spend:12100, sales:31460,  impressions:86500,  clicks:259, orders:23 },

  // SD_Remarketing — All SKUs — Retarget cart abandoners
  { month:'Aug', campaign:'SD_Remarketing',          type:'SD', sku:'All', spend:8050, sales:16100,  impressions:145000, clicks:261, orders:18 },
  { month:'Sep', campaign:'SD_Remarketing',          type:'SD', sku:'All', spend:7400, sales:14800,  impressions:133400, clicks:240, orders:17 },
  { month:'Oct', campaign:'SD_Remarketing',          type:'SD', sku:'All', spend:9200, sales:18400,  impressions:166700, clicks:300, orders:21 },
  { month:'Nov', campaign:'SD_Remarketing',          type:'SD', sku:'All', spend:10300,sales:20600,  impressions:185600, clicks:334, orders:23 },
  { month:'Dec', campaign:'SD_Remarketing',          type:'SD', sku:'All', spend:7600, sales:15200,  impressions:138200, clicks:249, orders:17 },
  { month:'Jan', campaign:'SD_Remarketing',          type:'SD', sku:'All', spend:8800, sales:17600,  impressions:159800, clicks:288, orders:20 },

  // SD_Competitor_Targeting — All SKUs — Appear on competitor PDPs
  { month:'Aug', campaign:'SD_Competitor_Targeting', type:'SD', sku:'All', spend:7050, sales:12690,  impressions:130000, clicks:195, orders:12 },
  { month:'Sep', campaign:'SD_Competitor_Targeting', type:'SD', sku:'All', spend:6500, sales:11700,  impressions:119600, clicks:179, orders:11 },
  { month:'Oct', campaign:'SD_Competitor_Targeting', type:'SD', sku:'All', spend:8050, sales:14490,  impressions:149500, clicks:224, orders:13 },
  { month:'Nov', campaign:'SD_Competitor_Targeting', type:'SD', sku:'All', spend:9000, sales:16200,  impressions:167000, clicks:251, orders:15 },
  { month:'Dec', campaign:'SD_Competitor_Targeting', type:'SD', sku:'All', spend:6650, sales:11970,  impressions:122800, clicks:184, orders:11 },
  { month:'Jan', campaign:'SD_Competitor_Targeting', type:'SD', sku:'All', spend:7700, sales:13860,  impressions:142500, clicks:214, orders:13 },
];

// ─── Search Term Data (20 terms, aggregate over 6 months) ────────────────────
export const RAW_SEARCH_TERM_DATA: SearchTermRecord[] = [
  { term:'chocolate protein bar',      matchType:'Exact', campaign:'SP_Chocolate_Branded',    type:'SP', spend:38500, sales:184800, impressions:48200,  clicks:482, orders:72 },
  { term:'peanut butter protein bar',  matchType:'Exact', campaign:'SP_PeanutButter_Generic', type:'SP', spend:31200, sales:137280, impressions:39000,  clicks:390, orders:55 },
  { term:'almond energy bar',          matchType:'Exact', campaign:'SP_Almond_Competitor',    type:'SP', spend:28900, sales:115600, impressions:36100,  clicks:361, orders:43 },
  { term:'dates and almond bar',       matchType:'Exact', campaign:'SP_Almond_Competitor',    type:'SP', spend:22400, sales:87360,  impressions:28000,  clicks:280, orders:34 },
  { term:'protein snack bar',          matchType:'Phrase',campaign:'SP_Chocolate_Branded',    type:'SP', spend:24600, sales:96954,  impressions:54700,  clicks:383, orders:46 },
  { term:'high protein snack',         matchType:'Phrase',campaign:'SB_Brand_Portfolio',      type:'SB', spend:18900, sales:70686,  impressions:62100,  clicks:373, orders:37 },
  { term:'energy bar',                 matchType:'Phrase',campaign:'SP_Almond_Competitor',    type:'SP', spend:21300, sales:72420,  impressions:72800,  clicks:437, orders:38 },
  { term:'energy snack',               matchType:'Phrase',campaign:'SB_Almond_Launch',        type:'SB', spend:16800, sales:56280,  impressions:58300,  clicks:350, orders:30 },
  { term:'healthy bar',                matchType:'Phrase',campaign:'SB_Brand_Portfolio',      type:'SB', spend:14200, sales:47586,  impressions:49600,  clicks:298, orders:26 },
  { term:'whey protein bar',           matchType:'Phrase',campaign:'SP_Chocolate_Branded',    type:'SP', spend:12800, sales:42624,  impressions:44800,  clicks:269, orders:22 },
  { term:'protein bar',                matchType:'Broad', campaign:'SP_PeanutButter_Generic', type:'SP', spend:35700, sales:114240, impressions:285600, clicks:857, orders:77 },
  { term:'healthy snack bar',          matchType:'Broad', campaign:'SP_PeanutButter_Generic', type:'SP', spend:19400, sales:58200,  impressions:155200, clicks:466, orders:37 },
  { term:'low calorie protein bar',    matchType:'Broad', campaign:'SP_Almond_Competitor',    type:'SP', spend:14600, sales:43800,  impressions:116800, clicks:350, orders:28 },
  { term:'gym snack bar',              matchType:'Broad', campaign:'SP_PeanutButter_Generic', type:'SP', spend:12900, sales:38700,  impressions:103200, clicks:310, orders:22 },
  { term:'snack bar',                  matchType:'Broad', campaign:'SP_PeanutButter_Generic', type:'SP', spend:18200, sales:49140,  impressions:145600, clicks:437, orders:32 },
  { term:'rite bite protein bar',      matchType:'Broad', campaign:'SD_Competitor_Targeting', type:'SD', spend:11200, sales:26880,  impressions:89600,  clicks:269, orders:18 },
  { term:'quest bar india',            matchType:'Broad', campaign:'SP_Chocolate_Branded',    type:'SP', spend:9800,  sales:22540,  impressions:78400,  clicks:235, orders:14 },
  { term:'chocolate bar',              matchType:'Broad', campaign:'SD_Remarketing',          type:'SD', spend:15600, sales:28080,  impressions:249600, clicks:499, orders:14 },
  { term:'energy snack india',         matchType:'Broad', campaign:'SB_Almond_Launch',        type:'SB', spend:8400,  sales:14280,  impressions:134400, clicks:269, orders:8  },
  { term:'protein ladoo',              matchType:'Broad', campaign:'SD_Competitor_Targeting', type:'SD', spend:6200,  sales:9300,   impressions:99200,  clicks:199, orders:5  },
];

// ─── SKU-Level Data ───────────────────────────────────────────────────────────
export const SKU_DATA: SKURecord[] = [
  { sku:'CPB-001', name:'Chocolate Protein Bar',     adSpend:190000, adSales:541000, organicSales:309000, totalSales:850000 },
  { sku:'PBB-002', name:'Peanut Butter Energy Bar',  adSpend:170000, adSales:474580, organicSales:245420, totalSales:720000 },
  { sku:'ADB-003', name:'Almond & Dates Bar',        adSpend:220000, adSales:427900, organicSales:212100, totalSales:640000 },
];

// Monthly sales trend per SKU (ad + organic combined)
export const MONTHLY_SKU_SALES = [
  { month:'Aug', 'Choc Protein': 145000, 'PB Energy': 122000, 'Almond & Dates': 108000 },
  { month:'Sep', 'Choc Protein': 133000, 'PB Energy': 112000, 'Almond & Dates':  99000 },
  { month:'Oct', 'Choc Protein': 166000, 'PB Energy': 140000, 'Almond & Dates': 124000 },
  { month:'Nov', 'Choc Protein': 185000, 'PB Energy': 156000, 'Almond & Dates': 138000 },
  { month:'Dec', 'Choc Protein': 138000, 'PB Energy': 116000, 'Almond & Dates': 103000 },
  { month:'Jan', 'Choc Protein': 160000, 'PB Energy': 134000, 'Almond & Dates': 119000 },
];

// ─── Filter & Aggregation Functions ──────────────────────────────────────────
export function filterCampaigns(f: FilterState): CampaignRecord[] {
  return RAW_CAMPAIGN_DATA.filter(
    (d) =>
      MONTH_IDX[d.month] >= f.startMonth &&
      MONTH_IDX[d.month] <= f.endMonth &&
      (f.campaignType === 'All' || d.type === f.campaignType),
  );
}

export function getKPIs(data: CampaignRecord[]) {
  const spend  = data.reduce((s, d) => s + d.spend, 0);
  const sales  = data.reduce((s, d) => s + d.sales, 0);
  const clicks = data.reduce((s, d) => s + d.clicks, 0);
  const imp    = data.reduce((s, d) => s + d.impressions, 0);
  const orders = data.reduce((s, d) => s + d.orders, 0);
  return {
    spend, sales, orders, clicks, impressions: imp,
    roas: r.roas(spend, sales),
    acos: r.acos(spend, sales),
    ctr:  r.ctr(clicks, imp),
    cpc:  r.cpc(spend, clicks),
    cvr:  r.cvr(orders, clicks),
  };
}

export function getMonthlyTrend(data: CampaignRecord[], startMonth: number, endMonth: number) {
  return MONTHS.slice(startMonth, endMonth + 1).map((month) => {
    const rows = data.filter((d) => d.month === month);
    const spend  = rows.reduce((s, d) => s + d.spend, 0);
    const sales  = rows.reduce((s, d) => s + d.sales, 0);
    const orders = rows.reduce((s, d) => s + d.orders, 0);
    return { month, spend, sales, orders, roas: Math.round(r.roas(spend, sales) * 100) / 100 };
  });
}

export function getCampaignTypeBreakdown(data: CampaignRecord[]) {
  return CAMPAIGN_TYPES.map((type) => {
    const rows = data.filter((d) => d.type === type);
    const spend  = rows.reduce((s, d) => s + d.spend, 0);
    const sales  = rows.reduce((s, d) => s + d.sales, 0);
    const orders = rows.reduce((s, d) => s + d.orders, 0);
    const clicks = rows.reduce((s, d) => s + d.clicks, 0);
    return { type, spend, sales, orders, clicks, roas: Math.round(r.roas(spend, sales) * 100) / 100 };
  });
}

export function getCampaignBreakdown(data: CampaignRecord[]) {
  const campaigns = Array.from(new Set(data.map((d) => d.campaign)));
  return campaigns.map((campaign) => {
    const rows   = data.filter((d) => d.campaign === campaign);
    const spend  = rows.reduce((s, d) => s + d.spend, 0);
    const sales  = rows.reduce((s, d) => s + d.sales, 0);
    const clicks = rows.reduce((s, d) => s + d.clicks, 0);
    const imp    = rows.reduce((s, d) => s + d.impressions, 0);
    const orders = rows.reduce((s, d) => s + d.orders, 0);
    return {
      campaign, type: rows[0].type, sku: rows[0].sku,
      spend, sales, clicks, impressions: imp, orders,
      roas: r.roas(spend, sales),
      acos: r.acos(spend, sales),
      ctr:  r.ctr(clicks, imp),
      cpc:  r.cpc(spend, clicks),
      cvr:  r.cvr(orders, clicks),
    };
  });
}

export function getEnrichedSearchTerms(f: FilterState) {
  return RAW_SEARCH_TERM_DATA
    .filter((d) => f.campaignType === 'All' || d.type === f.campaignType)
    .map((d) => ({
      ...d,
      roas: r.roas(d.spend, d.sales),
      acos: r.acos(d.spend, d.sales),
      ctr:  r.ctr(d.clicks, d.impressions),
      cpc:  r.cpc(d.spend, d.clicks),
      cvr:  r.cvr(d.orders, d.clicks),
    }));
}

export const ROAS_TARGET = 3.0;

export const CHART_COLORS: Record<string, string> = {
  SP: '#F4B8A8',
  SB: '#A8C3A0',
  SD: '#C4A882',
  spend:   '#E8D8C3',
  sales:   '#A8C3A0',
  roas:    '#F4B8A8',
  'Choc Protein':   '#F4B8A8',
  'PB Energy':      '#A8C3A0',
  'Almond & Dates': '#C4A882',
};
