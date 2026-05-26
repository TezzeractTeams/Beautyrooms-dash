"use client";

export type AuthProviderId = "google" | "facebook";

/** Navigate to server disconnect — works with chunked session cookies */
export function disconnectProvider(provider: "google" | "meta") {
  window.location.assign(`/api/auth/disconnect/${provider}`);
}
