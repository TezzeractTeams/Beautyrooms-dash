export interface ProviderTokenBundle {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
}

export interface MetaTokenBundle extends ProviderTokenBundle {
  /** act_XXXXXXXXX */
  adAccountId?: string;
  adAccountName?: string;
}

export function isProviderConnected(bundle: ProviderTokenBundle | undefined) {
  return Boolean(bundle?.accessToken && bundle.error !== "RefreshAccessTokenError");
}
