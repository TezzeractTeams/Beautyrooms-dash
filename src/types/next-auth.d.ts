import type { DefaultSession } from "next-auth";
import type { MetaTokenBundle, ProviderTokenBundle } from "@/lib/auth/provider-tokens";

declare module "next-auth" {
  interface Session {
    google?: ProviderTokenBundle;
    meta?: MetaTokenBundle;
    /** @deprecated Use session.google.accessToken */
    accessToken?: string;
    /** @deprecated Use session.google.error */
    error?: string;
    user: DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    google?: ProviderTokenBundle;
    meta?: MetaTokenBundle;
    /** @deprecated Use token.google */
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
