"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children only in the browser after hydration. Server and the first
 * client paint both use `fallback`, so extension-injected DOM attrs cannot
 * cause hydration mismatches.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return isClient ? children : fallback;
}
