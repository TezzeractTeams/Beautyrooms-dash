"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin:
    "Could not start sign-in. Check your OAuth client settings for Google or Meta.",
  OAuthCallback:
    "Sign-in callback failed. Confirm redirect URIs are configured in Google Cloud and Meta Developer settings.",
  OAuthAccountNotLinked: "This account is already linked to another user.",
  AccessDenied: "Access was denied. Approve the requested permissions to connect.",
  Configuration:
    "Auth is misconfigured. Check GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, and AUTH_SECRET in .env.",
  Default: "Sign-in failed. Try again.",
  disconnect: "Could not disconnect. Try again.",
};

export function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("error");
    if (!code) return;

    setError(ERROR_MESSAGES[code] ?? ERROR_MESSAGES.Default);

    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    router.replace(url.pathname + url.search, { scroll: false });
  }, [searchParams, router]);

  if (!error) return null;

  return (
    <div className="border border-status-negative/30 bg-status-negative/5 px-4 py-3 font-sans text-sm text-status-negative">
      {error}
    </div>
  );
}
