import type {
  DateRange,
  GoogleAdRow,
  GoogleAdUnitRow,
  GoogleCampaignRow,
  GoogleChartPoint,
} from "@/types/dashboard";
import { dateRangeMultiplier, getChartDates } from "./utils";

export function getGoogleChartData(
  dateRange: DateRange = { preset: "30d" },
): GoogleChartPoint[] {
  const mult = dateRangeMultiplier(dateRange);

  return getChartDates(dateRange).map((date, i) => ({
    date,
    cost: Math.round((190 + Math.sin(i / 2.5) * 35 + i * 5) * mult * 10) / 10,
    impressions: Math.round((8200 + Math.cos(i / 3) * 1200 + i * 180) * mult),
    clicks: Math.round((38 + Math.sin(i / 4) * 8 + i * 1.2) * mult),
  }));
}

export function getGoogleCampaigns(): GoogleCampaignRow[] {
  return [
    {
      id: "gc-1",
      name: "Brand — Beauty Rooms",
      status: "active",
      budget: "$120/day",
      impressions: 45200,
      clicks: 1890,
      ctr: "4.18%",
      avgCpc: "$1.42",
      conversions: 22,
      costPerConversion: "$121.55",
      impressionShare: "89%",
    },
    {
      id: "gc-2",
      name: "Non-brand — Facials",
      status: "active",
      budget: "$85/day",
      impressions: 38400,
      clicks: 1120,
      ctr: "2.92%",
      avgCpc: "$2.18",
      conversions: 14,
      costPerConversion: "$174.29",
      impressionShare: "62%",
    },
    {
      id: "gc-3",
      name: "Non-brand — Injectables",
      status: "active",
      budget: "$70/day",
      impressions: 29100,
      clicks: 780,
      ctr: "2.68%",
      avgCpc: "$2.54",
      conversions: 9,
      costPerConversion: "$219.78",
      impressionShare: "48%",
    },
    {
      id: "gc-4",
      name: "Remarketing — All Visitors",
      status: "paused",
      budget: "$45/day",
      impressions: 16800,
      clicks: 520,
      ctr: "3.10%",
      avgCpc: "$1.89",
      conversions: 8,
      costPerConversion: "$122.81",
      impressionShare: "71%",
    },
    {
      id: "gc-5",
      name: "Promo — Spring Package",
      status: "ended",
      budget: "$40/day",
      impressions: 12400,
      clicks: 310,
      ctr: "2.50%",
      avgCpc: "$2.71",
      conversions: 4,
      costPerConversion: "$210.25",
      impressionShare: "35%",
    },
  ];
}

export function getGoogleAds(): GoogleAdRow[] {
  const campaigns = getGoogleCampaigns();
  const ads: GoogleAdRow[] = [];
  const names = [
    "RSA — Core Services",
    "RSA — Promotions",
    "RSA — Location Extensions",
    "Display — Remarketing Banner",
    "Performance Max — Feed",
    "RSA — PMU Specialist",
    "RSA — Head Spa",
    "Call-only — Book Now",
    "RSA — Lash Menu",
    "RSA — Seasonal Offer",
  ];

  campaigns.forEach((c, ci) => {
    const count = ci < 3 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const idx = ads.length;
      if (idx >= 10) return;
      ads.push({
        id: `ga-${idx + 1}`,
        campaignName: c.name,
        name: names[idx],
        status: c.status,
        budget: "$50/day",
        impressions: 8000 + idx * 1200,
        clicks: 240 + idx * 35,
        ctr: `${(2.8 + (idx % 3) * 0.4).toFixed(2)}%`,
        avgCpc: `$${(1.6 + (idx % 4) * 0.25).toFixed(2)}`,
        conversions: 3 + (idx % 4),
        costPerConversion: `$${(140 + idx * 18).toFixed(2)}`,
        impressionShare: `${55 + (idx % 4) * 8}%`,
      });
    }
  });

  return ads;
}

export function getGoogleAdUnits(): GoogleAdUnitRow[] {
  const ads = getGoogleAds();
  const units: GoogleAdUnitRow[] = [];
  const headlines = [
    "Headline A — Book Today",
    "Headline B — Limited Offer",
    "Description — Expert Care",
    "Responsive — Service Menu",
    "Image — Treatment Room",
  ];

  ads.forEach((ad, ai) => {
    const count = ai < 4 ? 3 : 2;
    for (let i = 0; i < count; i++) {
      const idx = units.length;
      if (idx >= 20) return;
      units.push({
        id: `gau-${idx + 1}`,
        campaignName: ad.campaignName,
        adName: ad.name,
        name: `${ad.name} / ${headlines[i % headlines.length]}`,
        status: ad.status,
        budget: "—",
        impressions: 2000 + idx * 400,
        clicks: 60 + idx * 12,
        ctr: `${(2.5 + (idx % 3) * 0.3).toFixed(2)}%`,
        avgCpc: `$${(1.7 + (idx % 2) * 0.15).toFixed(2)}`,
        conversions: 1 + (idx % 2),
        costPerConversion: `$${(130 + idx * 10).toFixed(2)}`,
        impressionShare: `${50 + (idx % 5) * 6}%`,
      });
    }
  });

  return units.slice(0, 20);
}
