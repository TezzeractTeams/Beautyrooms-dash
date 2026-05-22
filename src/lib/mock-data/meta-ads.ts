import type {
  DateRange,
  MetaAdRow,
  MetaAdSetRow,
  MetaCampaignRow,
  MetaChartPoint,
} from "@/types/dashboard";
import { dateRangeMultiplier, getChartDates } from "./utils";

export function getMetaChartData(
  _platform: "facebook" | "instagram" | "combined" = "combined",
  dateRange: DateRange = { preset: "30d" },
): MetaChartPoint[] {
  const mult = dateRangeMultiplier(dateRange);

  return getChartDates(dateRange).map((date, i) => ({
    date,
    cost: Math.round((280 + Math.sin(i / 3) * 60 + i * 8) * mult * 10) / 10,
    cpm: Math.round((6.8 + Math.cos(i / 4) * 1.2 + i * 0.05) * 100) / 100,
  }));
}

export function getMetaCampaigns(): MetaCampaignRow[] {
  return [
    {
      id: "mc-1",
      name: "Spring Facial Promo",
      status: "active",
      budget: "$1,500/wk",
      spend: "$4,820",
      impressions: 98200,
      clicks: 2410,
      ctr: "2.45%",
      cpc: "$2.00",
      conversions: 18,
      roas: "3.2x",
    },
    {
      id: "mc-2",
      name: "Botox Awareness",
      status: "active",
      budget: "$1,200/wk",
      spend: "$3,940",
      impressions: 76400,
      clicks: 1380,
      ctr: "1.81%",
      cpc: "$2.86",
      conversions: 11,
      roas: "2.4x",
    },
    {
      id: "mc-3",
      name: "Retargeting — Site Visitors",
      status: "active",
      budget: "$800/wk",
      spend: "$2,180",
      impressions: 42100,
      clicks: 1290,
      ctr: "3.06%",
      cpc: "$1.69",
      conversions: 14,
      roas: "4.1x",
    },
    {
      id: "mc-4",
      name: "Lash Extensions — Lookalike",
      status: "paused",
      budget: "$600/wk",
      spend: "$1,420",
      impressions: 31800,
      clicks: 620,
      ctr: "1.95%",
      cpc: "$2.29",
      conversions: 5,
      roas: "1.8x",
    },
    {
      id: "mc-5",
      name: "Head Spa Launch",
      status: "ended",
      budget: "$500/wk",
      spend: "$980",
      impressions: 22400,
      clicks: 410,
      ctr: "1.83%",
      cpc: "$2.39",
      conversions: 3,
      roas: "1.5x",
    },
  ];
}

export function getMetaAdSets(): MetaAdSetRow[] {
  const campaigns = getMetaCampaigns();
  const sets: MetaAdSetRow[] = [];
  const names = [
    "Lookalike — Clients 1%",
    "Interest — Skincare 25–54",
    "Broad — Local 15mi",
    "Retargeting 7-day",
    "Retargeting 30-day",
    "IG Stories Placements",
    "FB Feed Placements",
    "Women 28–55",
    "Engagement Custom Audience",
    "Video Viewers 50%",
  ];

  campaigns.forEach((c, ci) => {
    const count = ci < 2 ? 3 : ci < 4 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const idx = sets.length;
      sets.push({
        id: `mas-${idx + 1}`,
        campaignName: c.name,
        name: names[idx % names.length],
        status: c.status === "ended" ? "ended" : i === 0 ? "active" : "paused",
        budget: "$400/wk",
        spend: formatSpend(400 + idx * 120),
        impressions: 12000 + idx * 2500,
        clicks: 280 + idx * 40,
        ctr: `${(1.8 + (idx % 5) * 0.2).toFixed(2)}%`,
        cpc: `$${(1.6 + (idx % 4) * 0.3).toFixed(2)}`,
        conversions: 2 + (idx % 4),
        roas: `${(2 + (idx % 3) * 0.5).toFixed(1)}x`,
      });
    }
  });

  return sets.slice(0, 10);
}

export function getMetaAds(): MetaAdRow[] {
  const adSets = getMetaAdSets();
  const adNames = [
    "Video — Welcome Offer",
    "Carousel — Core Services",
    "Static — Book Now",
    "UGC Testimonial",
    "Before/After Gallery",
    "Stories — Promo Code",
    "Reels — Head Spa",
    "Collection — PMU",
  ];

  const ads: MetaAdRow[] = [];
  adSets.forEach((set, si) => {
    const count = si < 6 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const idx = ads.length;
      if (idx >= 20) return;
      ads.push({
        id: `mad-${idx + 1}`,
        campaignName: set.campaignName,
        adSetName: set.name,
        name: adNames[idx % adNames.length],
        status: set.status,
        budget: "$200/wk",
        spend: formatSpend(180 + idx * 45),
        impressions: 5000 + idx * 800,
        clicks: 110 + idx * 18,
        ctr: `${(2 + (idx % 4) * 0.25).toFixed(2)}%`,
        cpc: `$${(1.5 + (idx % 3) * 0.2).toFixed(2)}`,
        conversions: 1 + (idx % 3),
        roas: `${(2.2 + (idx % 2) * 0.4).toFixed(1)}x`,
      });
    }
  });

  return ads.slice(0, 20);
}

function formatSpend(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
