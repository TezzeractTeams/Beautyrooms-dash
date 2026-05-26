"use client";

import { useEffect, useState } from "react";
import type { DashboardSnapshot } from "@/lib/db/snapshot-types";

interface UseSnapshotResult {
  snapshot: DashboardSnapshot | null;
  loading: boolean;
  error: string | null;
}

export function useSnapshot(): UseSnapshotResult {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/dashboard/snapshot");
        const json = (await res.json()) as {
          snapshot?: DashboardSnapshot;
          error?: string;
        };

        if (!cancelled) {
          setSnapshot(json.snapshot ?? null);
          if (json.error) setError(json.error);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load cached data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  return { snapshot, loading, error };
}
