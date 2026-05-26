"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(payload?.error ?? "Invalid username or password.");
      setLoading(false);
      return;
    }

    window.location.href = callbackUrl.startsWith("/") ? callbackUrl : "/";
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="username"
          className="font-sans text-[10px] tracking-[0.12em] uppercase text-[#888888]"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={cn(
            "h-11 border border-border bg-background px-4 font-sans text-sm font-light text-charcoal",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="font-sans text-[10px] tracking-[0.12em] uppercase text-[#888888]"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={cn(
            "h-11 border border-border bg-background px-4 font-sans text-sm font-light text-charcoal",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        />
      </div>

      {error ? (
        <p className="font-sans text-sm text-status-negative" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
