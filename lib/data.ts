export const PLATFORMS = ['Amazon', 'Shopify', 'D2C', 'Retail'] as const;
export const ALL_PLATFORMS = ['All', ...PLATFORMS] as const;
export const REGIONS = ['North', 'South', 'East', 'West'] as const;
export const ALL_REGIONS = ['All', ...REGIONS] as const;
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const PRODUCTS = ['Protein Bar', 'Energy Bites', 'Granola', 'Trail Mix', 'Nut Butter'] as const;
export const CHANNELS = ['Online', 'Retail', 'Wholesale', 'Marketplace'] as const;

export type Platform = (typeof PLATFORMS)[number];
export type Region = (typeof REGIONS)[number];
export type Product = (typeof PRODUCTS)[number];
export type Channel = (typeof CHANNELS)[number];

export interface FilterState {
  platform: string;
  region: string;
  startMonth: number;
  endMonth: number;
}

// ─── Deterministic pseudo-random ────────────────────────────────────────────
function dr(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// ─── Raw AOV dataset ─────────────────────────────────────────────────────────
interface RawAOV {
  month: string;
  monthIdx: number;
  platform: Platform;
  region: Region;
  aov: number;
  orders: number;
  revenue: number;
  conversionRate: number;
}

const platformAOVBase: Record<Platform, number> = { Amazon: 148, Shopify: 135, D2C: 162, Retail: 124 };
const regionMod: Record<Region, number> = { North: 8, South: -4, East: 12, West: 2 };
const platformOrderBase: Record<Platform, number> = { Amazon: 420, Shopify: 280, D2C: 190, Retail: 340 };
const platformCVR: Record<Platform, number> = { Amazon: 3.8, Shopify: 2.9, D2C: 4.2, Retail: 3.1 };

function generateRawAOV(): RawAOV[] {
  const data: RawAOV[] = [];
  PLATFORMS.forEach((platform, pi) => {
    REGIONS.forEach((region, ri) => {
      MONTHS.forEach((month, mi) => {
        const seed = pi * 1000 + ri * 100 + mi;
        const noise = (dr(seed) - 0.5) * 18;
        const seasonal = Math.sin((mi / 12) * Math.PI * 2 - 1) * 12;
        const aov = platformAOVBase[platform] + regionMod[region] + seasonal + noise;
        const orders = Math.max(50, Math.round(platformOrderBase[platform] + (dr(seed + 50) - 0.5) * 80));
        data.push({
          month,
          monthIdx: mi,
          platform,
          region,
          aov: Math.round(aov * 100) / 100,
          orders,
          revenue: Math.round(aov * orders),
          conversionRate: Math.round((platformCVR[platform] + (dr(seed + 80) - 0.5) * 0.8) * 10) / 10,
        });
      });
    });
  });
  return data;
}

const rawAOVData = generateRawAOV();

// ─── Raw Quantity dataset ────────────────────────────────────────────────────
interface RawQuantity {
  channel: Channel;
  platform: Platform;
  region: Region;
  product: Product;
  quantity: number;
}

const productQtyBase: Record<Product, number> = {
  'Protein Bar': 450, 'Energy Bites': 320, 'Granola': 280, 'Trail Mix': 210, 'Nut Butter': 180,
};
const channelMultiplier: Record<Channel, number> = {
  Online: 1.3, Retail: 1.0, Wholesale: 1.5, Marketplace: 0.8,
};

function generateRawQuantity(): RawQuantity[] {
  const data: RawQuantity[] = [];
  CHANNELS.forEach((channel, ci) => {
    PLATFORMS.forEach((platform, pi) => {
      REGIONS.forEach((region, ri) => {
        PRODUCTS.forEach((product, prodi) => {
          const seed = ci * 10000 + pi * 1000 + ri * 100 + prodi;
          const noise = (dr(seed) - 0.5) * 0.3;
          data.push({
            channel,
            platform,
            region,
            product,
            quantity: Math.max(50, Math.round(productQtyBase[product] * channelMultiplier[channel] * (1 + noise))),
          });
        });
      });
    });
  });
  return data;
}

const rawQuantityData = generateRawQuantity();

// ─── Aggregation utilities ───────────────────────────────────────────────────
function filterAOV(f: FilterState) {
  return rawAOVData.filter(
    (d) =>
      d.monthIdx >= f.startMonth &&
      d.monthIdx <= f.endMonth &&
      (f.platform === 'All' || d.platform === f.platform) &&
      (f.region === 'All' || d.region === f.region),
  );
}

function filterQty(f: FilterState) {
  return rawQuantityData.filter(
    (d) =>
      (f.platform === 'All' || d.platform === f.platform) &&
      (f.region === 'All' || d.region === f.region),
  );
}

export function getKPIs(f: FilterState) {
  const data = filterAOV(f);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);
  const avgAOV = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const avgCVR = data.length > 0 ? data.reduce((s, d) => s + d.conversionRate, 0) / data.length : 0;
  return {
    revenue: totalRevenue,
    orders: totalOrders,
    aov: Math.round(avgAOV * 100) / 100,
    conversionRate: Math.round(avgCVR * 10) / 10,
  };
}

export function getLineChartData(f: FilterState): Record<string, string | number>[] {
  const activePlatforms = f.platform === 'All' ? [...PLATFORMS] : [f.platform as Platform];
  return MONTHS.slice(f.startMonth, f.endMonth + 1).map((month, idx) => {
    const mi = f.startMonth + idx;
    const entry: Record<string, string | number> = { month };
    activePlatforms.forEach((platform) => {
      const subset = rawAOVData.filter(
        (d) => d.monthIdx === mi && d.platform === platform && (f.region === 'All' || d.region === f.region),
      );
      if (subset.length > 0) {
        const rev = subset.reduce((s, d) => s + d.revenue, 0);
        const ord = subset.reduce((s, d) => s + d.orders, 0);
        entry[platform] = ord > 0 ? Math.round((rev / ord) * 100) / 100 : 0;
      }
    });
    return entry;
  });
}

export function getChannelChartData(f: FilterState): Record<string, string | number>[] {
  const qty = filterQty(f);
  return CHANNELS.map((channel) => {
    const entry: Record<string, string | number> = { channel };
    PRODUCTS.forEach((product) => {
      entry[product] = qty
        .filter((d) => d.channel === channel && d.product === product)
        .reduce((s, d) => s + d.quantity, 0);
    });
    return entry;
  });
}

export function getPlatformChartData(f: FilterState): Record<string, string | number>[] {
  const activePlatforms = f.platform === 'All' ? [...PLATFORMS] : [f.platform as Platform];
  const qty = filterQty(f);
  return activePlatforms.map((platform) => {
    const entry: Record<string, string | number> = { platform };
    PRODUCTS.forEach((product) => {
      const subset = qty.filter((d) => d.platform === platform && d.product === product);
      entry[product] = subset.length > 0 ? Math.round(subset.reduce((s, d) => s + d.quantity, 0) / subset.length) : 0;
    });
    return entry;
  });
}

export const CHART_COLORS: Record<string, string> = {
  Amazon: '#F4B8A8',
  Shopify: '#A8C3A0',
  D2C: '#C4A882',
  Retail: '#B8CEDD',
  'Protein Bar': '#F4B8A8',
  'Energy Bites': '#A8C3A0',
  Granola: '#E8D8C3',
  'Trail Mix': '#C4A882',
  'Nut Butter': '#B8CEDD',
};
