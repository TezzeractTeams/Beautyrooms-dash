# Dashboard architecture

## Layout (matches whiteboard)

```
┌─────────────────────────────────────────────────────────────┐
│ Top KPI row (5 columns)                                     │
├──────────────────────────┬──────────────────────────────────┤
│ Leads KPI (Hub)          │ Conv. (Boulevard)                │
│ Net & Cost CPM (Meta)    │ G.A. / Imp Cycle (Google)        │
│ Tabbed lists (Meta)      │ Tabbed lists (Google)            │
└──────────────────────────┴──────────────────────────────────┘
```

## Data sources (future)

| Region | Provider | Mock module |
|--------|----------|-------------|
| Leads / MQL·SQL | HubSpot | `src/data/mocks/hubspot-leads.ts` |
| Net & Cost CPM, left tabs | Meta Ads | `src/data/mocks/meta-ads.ts` |
| G.A. / Imp cycle, right tabs | Google Ads | `src/data/mocks/google-ads.ts` |
| Conversions | Boulevard | `src/data/mocks/boulevard.ts` |
| Top summary | Aggregated | `src/data/mocks/summary.ts` |

## Next.js conventions

- **Route group** `(dashboard)` — shell layout without changing URL (`/`).
- **Server Components** — page fetches data; only `TabbedListPanel` is client (tabs).
- **Single aggregator** — `getDashboardData()` in `src/data/mocks/index.ts`. Replace with:

  ```ts
  // src/data/dashboard.ts (later)
  export async function getDashboardData(): Promise<DashboardData> {
    const [hub, meta, google, blvd] = await Promise.all([
      fetchHubSpotLeads(),
      fetchMetaAds(),
      fetchGoogleAds(),
      fetchBoulevardConversions(),
    ]);
    return mergeDashboardData({ hub, meta, google, blvd });
  }
  ```

- **API routes** (optional) — `src/app/api/dashboard/route.ts` for client refresh or external consumers.
- **Env secrets** — `HUBSPOT_*`, `META_*`, `GOOGLE_ADS_*`, `BOULEVARD_*` in `.env.local` (not committed).

## Folder structure

```
src/
  app/(dashboard)/     # pages + shell layout
  components/dashboard/
  data/mocks/          # temporary — mirror per-provider modules
  types/dashboard.ts   # shared contracts
  lib/utils.ts
```

## Design

Visual tokens follow `DASHBOARD.md` (cream/plum/brown, Barlow, square corners on surfaces).
