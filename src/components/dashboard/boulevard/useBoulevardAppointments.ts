"use client";

import { useEffect, useRef, useState } from "react";
import { dateRangeToSinceUntil } from "@/lib/meta/date-range";
import type {
  BoulevardAppointmentRow,
  BoulevardKpis,
  DateRange,
} from "@/types/dashboard";

interface UseBoulevardAppointmentsResult {
  rows: BoulevardAppointmentRow[];
  kpis: BoulevardKpis | null;
  loading: boolean;
  error: string | null;
}

interface AppointmentsApiResponse {
  rows: BoulevardAppointmentRow[];
  kpis: BoulevardKpis;
  error?: string;
}

export function useBoulevardAppointments(
  dateRange: DateRange,
): UseBoulevardAppointmentsResult {
  const [rows, setRows] = useState<BoulevardAppointmentRow[]>([]);
  const [kpis, setKpis] = useState<BoulevardKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      setLoading(true);
      setError(null);

      const { since, until } = dateRangeToSinceUntil(dateRange);
      const url = `/api/boulevard/appointments?${new URLSearchParams({ since, until })}`;

      try {
        const res = await fetch(url, { signal: controller.signal });
        const json = (await res.json()) as AppointmentsApiResponse;

        if (!res.ok || json.error) {
          throw new Error(json.error ?? "Failed to load Boulevard data");
        }

        setRows(json.rows ?? []);
        setKpis(json.kpis ?? null);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Failed to load Boulevard data",
        );
        setRows([]);
        setKpis(null);
      } finally {
        setLoading(false);
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [dateRange.preset, dateRange.start, dateRange.end]);

  return { rows, kpis, loading, error };
}
