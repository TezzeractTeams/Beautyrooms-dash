import { createHmac } from "crypto";

const BLVD_AUTH_PREFIX = "blvd-admin-v1";

export function getBoulevardCredentials() {
  const apiKey = process.env.BLVD_API_KEY;
  const secretKey = process.env.BLVD_SECRET_KEY;
  const businessId = process.env.BLVD_BUSINESS_ID;

  if (!apiKey || !secretKey || !businessId) {
    return null;
  }

  return { apiKey, secretKey, businessId };
}

export function createBlvdAuthorizationHeader(): string {
  const credentials = getBoulevardCredentials();

  if (!credentials) {
    throw new Error("Boulevard credentials are not configured");
  }

  const { apiKey, secretKey, businessId } = credentials;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const tokenPayload = `${BLVD_AUTH_PREFIX}${businessId}${timestamp}`;
  const rawKey = Buffer.from(secretKey, "base64");
  const signature = createHmac("sha256", rawKey)
    .update(tokenPayload, "utf8")
    .digest("base64");
  const token = `${signature}${tokenPayload}`;
  const httpBasicPayload = `${apiKey}:${token}`;
  const httpBasicCredentials = Buffer.from(httpBasicPayload, "utf8").toString(
    "base64",
  );

  return `Basic ${httpBasicCredentials}`;
}
