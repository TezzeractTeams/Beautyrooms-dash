"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { isProviderConnected } from "@/lib/auth/provider-tokens";
import { cn } from "@/lib/utils";

interface MetaAdAccountOption {
  id: string;
  accountId: string;
  name: string;
  currency?: string;
}

interface AdAccountsResponse {
  accounts: MetaAdAccountOption[];
  selectedAdAccountId: string | null;
  error?: string;
}

export function MetaAdAccountSelect({ className }: { className?: string }) {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [accounts, setAccounts] = useState<MetaAdAccountOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected =
    status === "authenticated" && isProviderConnected(session?.meta);
  const selectedId = session?.meta?.adAccountId ?? "";

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/meta/ad-accounts", {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = (await response.json()) as AdAccountsResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load ad accounts");
      }

      setAccounts(data.accounts);

      if (!data.selectedAdAccountId && data.accounts.length === 1) {
        await fetch("/api/meta/ad-accounts/select", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            adAccountId: data.accounts[0].id,
            adAccountName: data.accounts[0].name,
          }),
        });
        await update();
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ad accounts");
    } finally {
      setLoading(false);
    }
  }, [router, update]);

  useEffect(() => {
    if (!isConnected) {
      setAccounts([]);
      setError(null);
      return;
    }
    void loadAccounts();
  }, [isConnected, loadAccounts]);

  if (status === "loading" || !isConnected) return null;

  async function handleChange(adAccountId: string) {
    const account = accounts.find((a) => a.id === adAccountId);
    if (!account) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/meta/ad-accounts/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          adAccountId: account.id,
          adAccountName: account.name,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save ad account");
      }

      await update();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save selection");
    } finally {
      setSaving(false);
    }
  }

  if (loading && accounts.length === 0) {
    return (
      <span className={cn("font-sans text-xs text-warm-brown/70", className)}>
        Loading ad accounts…
      </span>
    );
  }

  if (accounts.length === 0) {
    return (
      <span className={cn("font-sans text-xs text-status-negative", className)}>
        {error ?? "No ad accounts found for this Facebook user."}
      </span>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#888888]">
        Meta ad account
      </label>
      <select
        value={selectedId}
        disabled={saving}
        onChange={(e) => void handleChange(e.target.value)}
        className={cn(
          "h-9 max-w-[240px] border border-border bg-background px-3 font-sans text-xs text-warm-brown",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {!selectedId ? (
          <option value="" disabled>
            Select ad account…
          </option>
        ) : null}
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name} ({account.accountId}
            {account.currency ? ` · ${account.currency}` : ""})
          </option>
        ))}
      </select>
      {error ? (
        <span className="font-sans text-[10px] text-status-negative">{error}</span>
      ) : null}
    </div>
  );
}
