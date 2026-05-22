import type { TLDRBullet, TLDRContent } from "@/types/dashboard";

const SUMMARY_POOL: Omit<TLDRBullet, "id">[] = [
  {
    text: "Meta CPM rose 18% this week — Instagram placements are driving most of the increase.",
    sentiment: "negative",
  },
  {
    text: "Google brand campaigns hold 89% impression share with the lowest CP conversion in the account.",
    sentiment: "positive",
  },
  {
    text: "Lead volume is up 12% vs last period; SQL-to-Booked drop-off improved slightly.",
    sentiment: "positive",
  },
  {
    text: "Retargeting campaigns deliver the highest ROAS (4.1x) but account for only 17% of spend.",
    sentiment: "neutral",
  },
  {
    text: "Daily cost is pacing 3% above the 30-day average — monitor Meta ad set frequency.",
    sentiment: "neutral",
  },
  {
    text: "Non-brand facial keywords gained impression share (+6 pts) without a CPC increase.",
    sentiment: "positive",
  },
  {
    text: "Head Spa launch campaign ended; remaining budget reallocated to Spring Facial Promo.",
    sentiment: "neutral",
  },
  {
    text: "Web clicks from Google grew 6.8% while Meta click volume stayed flat week over week.",
    sentiment: "neutral",
  },
  {
    text: "Boulevard shows 47 booked appointments with an 82% show rate from paid-sourced leads.",
    sentiment: "positive",
  },
  {
    text: "Paused Lash Lookalike ad set still consumed $420 — review auto-rules before reactivation.",
    sentiment: "negative",
  },
  {
    text: "Combined CPC improved 4.2% despite higher CPM on Meta — Google efficiency offset the mix.",
    sentiment: "positive",
  },
  {
    text: "Three ad sets hit frequency above 3.2 on Facebook feed — creative refresh recommended.",
    sentiment: "negative",
  },
];

const PREDICTION_POOL: Omit<TLDRBullet, "id">[] = [
  {
    text: "At current pacing, leads will exceed target by ~12% this month if SQL rate holds.",
    sentiment: "positive",
  },
  {
    text: "Meta spend is projected to hit the weekly cap by Friday without bid adjustments.",
    sentiment: "negative",
  },
  {
    text: "Google non-brand facials likely to gain another 4–5 pts impression share next week.",
    sentiment: "positive",
  },
  {
    text: "Booked appointments may reach 55+ if retargeting ROAS stays above 3.5x.",
    sentiment: "positive",
  },
  {
    text: "CPM may soften 5–8% if Instagram Story placements are reduced in the mix.",
    sentiment: "neutral",
  },
  {
    text: "Blended CP conversion could rise if Botox Awareness spend increases without creative tests.",
    sentiment: "negative",
  },
  {
    text: "Expect a mid-month dip in web clicks during the promo transition window.",
    sentiment: "neutral",
  },
  {
    text: "MQL-to-SQL conversion is on track to beat last period by ~3 percentage points.",
    sentiment: "positive",
  },
  {
    text: "Remarketing pool size may limit scale unless traffic grows 10%+ week over week.",
    sentiment: "negative",
  },
];

function pickRandom<T>(pool: T[], count: number, seed: number): T[] {
  const copy = [...pool];
  const picked: T[] = [];
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = (seed + i * 7) % copy.length;
    picked.push(copy.splice(idx, 1)[0]);
  }
  return picked;
}

export function getTLDRContent(seed = Date.now()): TLDRContent {
  const summary = pickRandom(SUMMARY_POOL, 5, seed).map((b, i) => ({
    ...b,
    id: `sum-${seed}-${i}`,
  }));

  const predictions = pickRandom(PREDICTION_POOL, 4, seed + 1).map((b, i) => ({
    ...b,
    id: `pred-${seed}-${i}`,
  }));

  return { summary, predictions };
}

export function refreshTLDRContent(): TLDRContent {
  return getTLDRContent(Date.now());
}

/** Expose pools for tests / Storybook */
export const TLDR_SUMMARY_POOL_SIZE = SUMMARY_POOL.length;
export const TLDR_PREDICTION_POOL_SIZE = PREDICTION_POOL.length;
