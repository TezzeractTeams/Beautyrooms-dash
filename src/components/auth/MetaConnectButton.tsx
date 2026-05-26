"use client";

import { Link2, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { isProviderConnected } from "@/lib/auth/provider-tokens";
import { cn } from "@/lib/utils";

function MetaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-3.5 shrink-0">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-5.5H8.5V9.5h2.5V7.5c0-1.1.9-2 2-2h2v2.5h-1.5c-.28 0-.5.22-.5.5v1.5H15v2.5h-1.5v5.5H11z"
        fill="#1877F2"
      />
    </svg>
  );
}

interface MetaConnectButtonProps {
  className?: string;
  showLabel?: boolean;
  callbackUrl?: string;
}

export function MetaConnectButton({
  className,
  showLabel = true,
  callbackUrl = "/settings",
}: MetaConnectButtonProps) {
  const { data: session, status } = useSession();
  const isConnected =
    status === "authenticated" && isProviderConnected(session?.meta);

  if (!isConnected) {
    return (
      <Button
        asChild
        variant="default"
        size="sm"
        className={cn("gap-2 normal-case tracking-normal", className)}
      >
        <a
          href={`/api/auth/connect/facebook?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        >
          <MetaIcon />
          Connect Meta
        </a>
      </Button>
    );
  }

  const displayName = session?.user?.name ?? "Meta connected";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {showLabel ? (
        <div className="flex items-center gap-1.5">
          <Link2 className="size-3.5 text-status-positive" strokeWidth={1.5} />
          <span className="max-w-[180px] truncate font-sans text-xs text-warm-brown">
            {displayName}
          </span>
        </div>
      ) : null}
      <Button asChild variant="secondary" size="sm" className="gap-2">
        <a
          href={`/api/auth/disconnect/meta?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        >
          <LogOut className="size-3.5" strokeWidth={1.5} />
          Disconnect
        </a>
      </Button>
    </div>
  );
}
