import { NextResponse } from "next/server";
import { getBoulevardCredentials } from "@/lib/boulevard/auth";
import { fetchBoulevardBusiness } from "@/lib/boulevard/business";

export async function GET() {
  const credentials = getBoulevardCredentials();

  if (!credentials) {
    return NextResponse.json(
      { error: "Boulevard is not configured" },
      { status: 500 },
    );
  }

  try {
    const business = await fetchBoulevardBusiness();

    return NextResponse.json({ business });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch Boulevard business";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
