import type { NextConfig } from "next";

function getAllowedDevOrigins(): string[] {
  const origins = new Set<string>(["localhost", "127.0.0.1"]);

  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (authUrl) {
    try {
      origins.add(new URL(authUrl).hostname);
    } catch {
      // ignore invalid URL
    }
  }

  const extra = process.env.ALLOWED_DEV_ORIGINS;
  if (extra) {
    for (const host of extra.split(",")) {
      const trimmed = host.trim();
      if (trimmed) origins.add(trimmed);
    }
  }

  // ngrok tunnels change subdomains; wildcard is supported by Next.js dev origin checks
  origins.add("*.ngrok-free.dev");

  return [...origins];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getAllowedDevOrigins(),
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
