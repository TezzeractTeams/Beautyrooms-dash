const GRAPH_API = "https://graph.facebook.com/v21.0";

interface GraphError {
  error?: { message?: string };
}

interface AdAccountsResponse extends GraphError {
  data?: Array<{
    id: string;
    name: string;
    account_id: string;
    account_status?: number;
    currency?: string;
  }>;
  paging?: { next?: string };
}

export interface MetaAdAccount {
  id: string;
  accountId: string;
  name: string;
  accountStatus?: number;
  currency?: string;
}

function mapAccount(row: NonNullable<AdAccountsResponse["data"]>[number]): MetaAdAccount {
  return {
    id: row.id,
    accountId: row.account_id,
    name: row.name,
    accountStatus: row.account_status,
    currency: row.currency,
  };
}

export async function fetchMetaAdAccounts(accessToken: string): Promise<MetaAdAccount[]> {
  const accounts: MetaAdAccount[] = [];
  let url: string | null =
    `${GRAPH_API}/me/adaccounts?${new URLSearchParams({
      fields: "id,name,account_id,account_status,currency",
      limit: "100",
      access_token: accessToken,
    })}`;

  while (url) {
    const response = await fetch(url);
    const data = (await response.json()) as AdAccountsResponse;

    if (!response.ok) {
      throw new Error(data.error?.message ?? "Failed to fetch Meta ad accounts");
    }

    for (const row of data.data ?? []) {
      accounts.push(mapAccount(row));
    }

    url = data.paging?.next ?? null;
  }

  return accounts.sort((a, b) => a.name.localeCompare(b.name));
}

export function pickDefaultMetaAdAccount(
  accounts: MetaAdAccount[],
  preferredId?: string | null,
): MetaAdAccount | null {
  if (accounts.length === 0) return null;

  if (preferredId) {
    const normalized = preferredId.startsWith("act_")
      ? preferredId
      : `act_${preferredId}`;
    const match = accounts.find(
      (a) => a.id === normalized || a.accountId === preferredId.replace(/^act_/, ""),
    );
    if (match) return match;
  }

  if (accounts.length === 1) return accounts[0];
  return null;
}
