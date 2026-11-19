"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/auth-fetch";

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userRole = (user as { role?: string } | undefined)?.role || "student";

  const [currentPlan, setCurrentPlan] = useState<"free" | "pro">("free");
  const [checkingPlan, setCheckingPlan] = useState(false);
  const [redirectingStripe, setRedirectingStripe] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadUserPlan = async () => {
      setCheckingPlan(true);
      try {
        const res = await authFetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentPlan(data?.plan === "pro" ? "pro" : "free");
        }
      } finally {
        setCheckingPlan(false);
      }
    };
    loadUserPlan();
  }, [user]);

  const handleStripeUpgrade = async () => {
    if (!user) {
      toast.add({
        title: "Sign in required",
        description: "Please sign in as a Student or Tutor to upgrade.",
        type: "error",
      });
      router.push("/signin");
      return;
    }

    if (userRole === "admin") {
      toast.add({
        title: "Admin Account",
        description: "Admin accounts already have full platform privileges.",
        type: "info",
      });
      return;
    }

    setRedirectingStripe(true);
    try {
      const res = await authFetch("/api/payments/create-checkout-session", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data?.url) {
        toast.add({
          title: "Checkout Error",
          description:
            data?.message || "Unable to initiate Stripe checkout session.",
          type: "error",
        });
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.add({
        title: "Network Error",
        description: "Could not connect to payment server.",
        type: "error",
      });
    } finally {
      setRedirectingStripe(false);
    }
  };

  const isTutor = userRole === "tutor";
  const proPrice = isTutor ? "$15" : "$10";
  const proLabel = isTutor ? "Tutor Pro Plan" : "Student Pro Plan";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ee] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f513f]">
          <Sparkles className="size-3.5" />
          Transparent Pricing
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#12211c] sm:text-4xl">
          Upgrade Your MentorLagbe Experience
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[#5b6b64]">
          Start for free and upgrade anytime with a one-time Stripe checkout for
          unlimited tuition posts, unlimited applications, and Pro verification.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto mt-12 grid max-w-4xl gap-7 md:grid-cols-2">
        {/* Free Plan */}
        <div className="flex h-full flex-col rounded-3xl border border-[#e3eae5] bg-white p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#12211c]">
              Starter Plan
            </h2>
            <span className="rounded-full bg-[#f1f5f3] px-3 py-1 text-[11px] font-semibold text-[#475569]">
              Free Forever
            </span>
          </div>

          <p className="mt-2 text-[13px] text-[#64748b]">
            Everything you need to explore verified mentors or publish your
            first two batches.
          </p>

          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-[#12211c]">$0</span>
            <span className="text-[13px] text-[#64748b]">/ lifetime</span>
          </div>

          <ul className="mt-7 space-y-3.5 text-[13px] text-[#475569]">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-[#0f7a5a]" />
              Up to 2 active tuition posts for Tutors
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-[#0f7a5a]" />
              Up to 5 tuition applications for Students
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-[#0f7a5a]" />
              Full search, subject filtering & application tracking
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-[#0f7a5a]" />
              Role-based personal dashboard
            </li>
          </ul>

          <div className="mt-8 pt-2">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#cfd9d3] bg-[#fbfaf7] text-[13px] font-semibold text-[#12211c] transition-colors hover:bg-[#eef5f1]"
              >
                {currentPlan === "free"
                  ? "Current Active Plan"
                  : "Go to Dashboard"}
              </Link>
            ) : (
              <Link
                href="/signup"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#cfd9d3] bg-white text-[13px] font-semibold text-[#12211c] transition-colors hover:bg-[#eef5f1]"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>

        {/* Pro Plan */}
        <div className="flex h-full flex-col rounded-3xl border-2 border-[#0f7a5a] bg-[#10201b] p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {user ? proLabel : "MentorLagbe Pro"}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0f7a5a] px-3 py-1 text-[11px] font-semibold text-white">
              <Sparkles className="size-3" />
              Recommended
            </span>
          </div>

          <p className="mt-2 text-[13px] text-[#a7bbb4]">
            Remove all posting and application caps with instant Stripe
            verification.
          </p>

          {user ? (
            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold">{proPrice}</span>
              <span className="text-[13px] text-[#a7bbb4]">
                USD ({isTutor ? "Tutor" : "Student"} Pro)
              </span>
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <div>
                <span className="text-3xl font-bold">$10</span>
                <span className="text-[12px] text-[#a7bbb4]"> / Student</span>
              </div>
              <span className="text-[#4a635b]">•</span>
              <div>
                <span className="text-3xl font-bold">$15</span>
                <span className="text-[12px] text-[#a7bbb4]"> / Tutor</span>
              </div>
            </div>
          )}

          <ul className="mt-7 space-y-3.5 text-[13px] text-[#d5e0dc]">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-[#34b38a]" />
              Unlimited tuition batch posts for Tutors
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-[#34b38a]" />
              Unlimited tuition enrollment applications for Students
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-[#34b38a]" />
              Verified Pro Member status badge on your account
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-[#34b38a]" />
              Secure checkout & automatic receipt logging via Stripe
            </li>
          </ul>

          <div className="mt-8 pt-2">
            {checkingPlan ? (
              <div className="flex h-11 items-center justify-center rounded-xl bg-white/10">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : currentPlan === "pro" ? (
              <div className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500/20 text-[13px] font-semibold text-[#6ee7b7]">
                <ShieldCheck className="size-4" />
                You Are Already a Pro Member
              </div>
            ) : (
              <Button
                type="button"
                disabled={redirectingStripe}
                onClick={handleStripeUpgrade}
                className="h-11 w-full rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#13916b]"
              >
                {redirectingStripe ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    Subscribe with Stripe
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}