import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-[400px] border border-border bg-background p-8 sm:p-10">
        <div className="mb-8 text-center">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#888888]">
            Beauty Rooms Clinic
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-heading">
            Dashboard
          </h1>
          <p className="mt-2 font-sans text-sm font-light text-warm-brown/70">
            Sign in to continue
          </p>
        </div>

        <Suspense fallback={<p className="font-sans text-sm text-warm-brown/70">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
