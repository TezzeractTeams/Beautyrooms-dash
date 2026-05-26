"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="gap-2"
      disabled={loading}
      onClick={() => void handleSignOut()}
    >
      <LogOut className="size-3.5" strokeWidth={1.5} />
      {loading ? "Signing out…" : "Sign out"}
    </Button>
  );
}
