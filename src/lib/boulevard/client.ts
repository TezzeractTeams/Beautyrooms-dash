import { createBlvdAuthorizationHeader } from "@/lib/boulevard/auth";

const BLVD_ADMIN_URL = "https://dashboard.boulevard.io/api/2020-01/admin";

interface GraphqlError {
  message: string;
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: GraphqlError[];
}

export async function boulevardGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(BLVD_ADMIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: createBlvdAuthorizationHeader(),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Boulevard API request failed (${response.status}): ${body || response.statusText}`,
    );
  }

  const payload = (await response.json()) as GraphqlResponse<T>;

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? "Boulevard GraphQL error");
  }

  if (!payload.data) {
    throw new Error("Boulevard API returned no data");
  }

  return payload.data;
}
