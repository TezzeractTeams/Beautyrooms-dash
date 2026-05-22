import type {
  DateRange,
  GoogleAdRow,
  GoogleCampaignRow,
  MetaCampaignRow,
  Platform,
  TLDRBullet,
  TLDRContent,
  TLDRSentiment,
} from "@/types/dashboard";
import {
  getGoogleAccountTotals,
  getGoogleAds,
  getGoogleCampaigns,
  GOOGLE_REPORT_PERIOD,
} from "./google-ads";
import {
  getMetaAccountTotals,
  getMetaCampaigns,
  META_REPORT_PERIOD,
} from "./meta-ads";
import { formatCurrency, formatCurrencyDecimal, formatNumber } from "./utils";
import { getOverallStats } from "./overall-stats";

function parseMoney(s: string): number {
  return Number(s.replace(/[$,]/g, "")) || 0;
}

function formatPeriod(start: string, end: string): string {
  const s = new Date(`${start}T12:00:00`);
  const e = new Date(`${end}T12:00:00`);
  const monthDay: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = s.toLocaleDateString("en-US", monthDay);
  const endStr = e.toLocaleDateString("en-US", {
    ...monthDay,
    year: "numeric",
  });
  return `${startStr}–${endStr}`;
}

function bullet(
  id: string,
  text: string,
  sentiment: TLDRSentiment = "neutral",
): TLDRBullet {
  return { id, text, sentiment };
}

function googleAdSpend(ad: GoogleAdRow): number {
  return ad.clicks * parseMoney(ad.avgCpc);
}

function topGoogleCampaignBySpend(
  campaigns: GoogleCampaignRow[],
  ads: GoogleAdRow[],
): GoogleCampaignRow | null {
  const spendByCampaign = new Map<string, number>();
  for (const ad of ads) {
    const spend = googleAdSpend(ad);
    if (spend <= 0) continue;
    spendByCampaign.set(
      ad.campaignName,
      (spendByCampaign.get(ad.campaignName) ?? 0) + spend,
    );
  }

  let top: GoogleCampaignRow | null = null;
  let maxSpend = 0;
  for (const c of campaigns) {
    const spend = spendByCampaign.get(c.name) ?? 0;
    if (spend > maxSpend) {
      maxSpend = spend;
      top = c;
    }
  }
  return top;
}

function topMetaCampaignBySpend(
  campaigns: MetaCampaignRow[],
): MetaCampaignRow | null {
  return (
    [...campaigns]
      .filter((c) => parseMoney(c.spend) > 0)
      .sort((a, b) => parseMoney(b.spend) - parseMoney(a.spend))[0] ?? null
  );
}

function buildGoogleBullets(): TLDRBullet[] {
  const totals = getGoogleAccountTotals();
  const campaigns = getGoogleCampaigns();
  const ads = getGoogleAds();
  const period = formatPeriod(GOOGLE_REPORT_PERIOD.start, GOOGLE_REPORT_PERIOD.end);
  const bullets: TLDRBullet[] = [];

  bullets.push(
    bullet(
      "google-overview",
      `Google Ads: ${formatCurrency(totals.cost)} spend, ${formatNumber(totals.impressions)} impressions, ${formatNumber(totals.clicks)} clicks (${totals.ctr} CTR) — ${period}.`,
      "neutral",
    ),
  );

  if (totals.conversions > 0) {
    bullets.push(
      bullet(
        "google-conversions",
        `${formatNumber(totals.conversions)} conversions at ${totals.costPerConversion} cost per conversion (avg. CPC ${totals.avgCpc}).`,
        totals.conversions >= 3 ? "positive" : "neutral",
      ),
    );
  }

  const top = topGoogleCampaignBySpend(campaigns, ads);
  if (top) {
    const topSpend = ads
      .filter((a) => a.campaignName === top.name)
      .reduce((sum, a) => sum + googleAdSpend(a), 0);
    bullets.push(
      bullet(
        `google-top-${top.id}`,
        `Top Google spend: “${top.name}” (${formatCurrencyDecimal(topSpend)}) — ${top.status === "active" ? "active" : top.status}.`,
        top.status === "active" ? "positive" : "neutral",
      ),
    );
  }

  const active = campaigns.filter((c) => c.status === "active");
  const paused = campaigns.filter((c) => c.status === "paused");
  if (active.length > 0) {
    const names = active.map((c) => c.name).join(", ");
    bullets.push(
      bullet(
        "google-active",
        `${active.length} active Google campaign${active.length === 1 ? "" : "s"}: ${names}.`,
        "positive",
      ),
    );
  }
  if (paused.length > 0 && active.length < campaigns.length) {
    bullets.push(
      bullet(
        "google-paused",
        `${paused.length} Google campaign${paused.length === 1 ? "" : "s"} paused or not serving.`,
        "neutral",
      ),
    );
  }

  return bullets;
}

function buildMetaBullets(): TLDRBullet[] {
  const totals = getMetaAccountTotals();
  const campaigns = getMetaCampaigns();
  const period = formatPeriod(META_REPORT_PERIOD.start, META_REPORT_PERIOD.end);
  const bullets: TLDRBullet[] = [];

  if (totals.spend > 0) {
    bullets.push(
      bullet(
        "meta-overview",
        `Meta: ${formatCurrencyDecimal(totals.spend)} spend, ${formatNumber(totals.impressions)} impressions, ${formatNumber(totals.clicks)} link clicks (CPM ${formatCurrencyDecimal(totals.cpm)}) — ${period}.`,
        "positive",
      ),
    );
  } else {
    bullets.push(
      bullet(
        "meta-no-spend",
        `Meta: $0 spend across ${totals.totalCampaigns} campaigns — ${period}.`,
        "neutral",
      ),
    );
  }

  const top = topMetaCampaignBySpend(campaigns);
  if (top) {
    bullets.push(
      bullet(
        `meta-top-${top.id}`,
        `Leading Meta campaign: “${top.name}” — ${top.spend} spend, ${formatNumber(top.impressions)} impressions, ${top.ctr} CTR, ${top.cpc} CPC.`,
        top.status === "active" ? "positive" : "neutral",
      ),
    );
  }

  const inactive = campaigns.filter((c) => c.status !== "active");
  if (inactive.length > 0) {
    const names = inactive
      .slice(0, 3)
      .map((c) => c.name)
      .join(", ");
    const suffix = inactive.length > 3 ? ` and ${inactive.length - 3} more` : "";
    bullets.push(
      bullet(
        "meta-inactive",
        `${inactive.length} Meta campaign${inactive.length === 1 ? "" : "s"} inactive (${names}${suffix}).`,
        inactive.length > totals.activeCampaigns ? "negative" : "neutral",
      ),
    );
  }

  return bullets;
}

function buildCombinedBullets(): TLDRBullet[] {
  const stats = getOverallStats("all");
  const totalCost = stats.find((s) => s.id === "total-cost");
  const impressions = stats.find((s) => s.id === "impressions");
  const clicks = stats.find((s) => s.id === "web-clicks");
  const googleTotals = getGoogleAccountTotals();
  const metaTotals = getMetaAccountTotals();
  const period = formatPeriod(
    GOOGLE_REPORT_PERIOD.start,
    META_REPORT_PERIOD.end,
  );

  const bullets: TLDRBullet[] = [
    bullet(
      "combined-overview",
      `Combined spend ${totalCost?.value ?? formatCurrency(googleTotals.cost + metaTotals.spend)}: Google ${formatCurrency(googleTotals.cost)} + Meta ${formatCurrencyDecimal(metaTotals.spend)} (${period}).`,
      "neutral",
    ),
    bullet(
      "combined-reach",
      `${impressions?.value ?? formatNumber(googleTotals.impressions + metaTotals.impressions)} total impressions and ${clicks?.value ?? formatNumber(googleTotals.clicks + metaTotals.clicks)} clicks across both platforms.`,
      "neutral",
    ),
  ];

  return bullets;
}

/** Generate TLDR from current dashboard report data */
export function getTLDRContent(
  platform: Platform = "all",
  dateRange: DateRange = { preset: "30d" },
): TLDRContent {
  void dateRange;

  let summary: TLDRBullet[] = [];

  switch (platform) {
    case "google":
      summary = buildGoogleBullets();
      break;
    case "meta":
      summary = buildMetaBullets();
      break;
    case "boulevard":
      summary = [
        bullet(
          "boulevard-empty",
          "No Boulevard data in the current reports. Connect the integration to see clinic metrics here.",
          "neutral",
        ),
      ];
      break;
    case "all":
    default:
      summary = [
        ...buildCombinedBullets(),
        ...buildGoogleBullets().slice(0, 3),
        ...buildMetaBullets().slice(0, 2),
      ];
      break;
  }

  return { summary, predictions: [] };
}

export function refreshTLDRContent(
  platform: Platform = "all",
  dateRange: DateRange = { preset: "30d" },
): TLDRContent {
  return getTLDRContent(platform, dateRange);
}
