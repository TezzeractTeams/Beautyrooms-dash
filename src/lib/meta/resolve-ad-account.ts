import type { MetaTokenBundle } from "@/lib/auth/provider-tokens";

export function resolveMetaAdAccountId(
  meta: MetaTokenBundle | undefined,
  envFallback = process.env.META_AD_ACCOUNT_ID,
): string | null {
  if (meta?.adAccountId) return meta.adAccountId;
  if (!envFallback) return null;
  return envFallback.startsWith("act_") ? envFallback : `act_${envFallback}`;
}
