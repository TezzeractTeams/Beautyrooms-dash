import type { TLDRContent } from "@/types/dashboard";

/** Insights derived from Ad report + BeautyRooms Clinic campaigns (May 15–22, 2026) */
const REPORT_TLDR: TLDRContent = {
  summary: [
    {
      id: "sum-google-spend",
      text: "Google Ads spent $22.47 across 205 impressions and 7 clicks (3.41% CTR) for May 15–21.",
      sentiment: "neutral",
    },
    {
      id: "sum-google-conv",
      text: "Google recorded 4 conversions at $5.62 cost per conversion — Mothers Day Traffic drove most spend ($20.19).",
      sentiment: "positive",
    },
    {
      id: "sum-head-spa-google",
      text: "Head Spa Traffic is the only enabled Google campaign; 1 click at $2.28 with 1.5 conversions.",
      sentiment: "positive",
    },
    {
      id: "sum-meta-active",
      text: "Meta: only “Head Spa Detox $135” is active — $28.06 spent, 1,944 impressions, 44 link clicks at $0.34 CPC.",
      sentiment: "positive",
    },
    {
      id: "sum-meta-paused",
      text: "Five other Meta campaigns are inactive with $0 spend this period (BRC Traffic, FP HeadSpa, Nano Brows, Mothers Day copies).",
      sentiment: "neutral",
    },
  ],
  predictions: [],
};

export function getTLDRContent(): TLDRContent {
  return REPORT_TLDR;
}

export function refreshTLDRContent(): TLDRContent {
  return REPORT_TLDR;
}
