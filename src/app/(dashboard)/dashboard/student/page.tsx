"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

import { authFetch } from "@/lib/auth-fetch";

interface StudentStatsResponse {
  plan: "free" | "pro";
  stats: {
    totalApplications: number;
    acceptedApplications: number;
    pendingApplications: number;
    rejectedApplications: number;
  };
}

export default function StudentOverviewPage() {
  const [data, setData] = useState<StudentStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const res = await authFetch("/api/dashboard/stats");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-[#e3eae5] bg-white">
        <Loader2 className="size-6 animate-spin text-[#0f7a5a]" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
  };
  const plan = data?.plan || "free";

  const cards = [
    {
      label: "Total Applied Tuitions",
      value: stats.totalApplications,
      icon: FileText,
      accent: "bg-[#e8f3ee] text-[#0f7a5a]",
    },
    {
      label: "Accepted Applications",
      value: stats.acceptedApplications,
      icon: CheckCircle2,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Pending Applications",
      value: stats.pendingApplications,
      icon: Clock,
      accent: "bg-amber-100 text-amber-700",
    },
    {
      label: "Current Plan",
      value: plan === "pro" ? "Pro Member" : "Free Starter",
      icon: Sparkles,
      accent:
        plan === "pro"
          ? "bg-amber-100 text-amber-800"
          : "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            Student Dashboard Overview
          </h1>
          <p className="mt-1 text-[13px] text-[#5b6b64]">
            Track your tuition applications and manage your learning plan.
          </p>
        </div>

        <Link
          href="/tuitions"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f7a5a] px-4 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
        >
          <Search className="size-4" />
          Browse Tuitions
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-[#e3eae5] bg-white p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#64748b]">
                  {card.label}
                </span>
                <span
                  className={`flex size-9 items-center justify-center rounded-xl ${card.accent}`}
                >
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-[#12211c]">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Banner */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-[#e3eae5] bg-white p-6">
          <div>
            <h2 className="text-[16px] font-semibold text-[#12211c]">
              Application Status Tracker
            </h2>
            <p className="mt-1.5 text-[13px] text-[#5b6b64]">
              View tutor decisions on your applied batches or cancel any request
              that is still pending.
            </p>
          </div>
          <Link
            href="/dashboard/student/my-applications"
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0f7a5a] hover:underline"
          >
            Go to My Applications
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[#cfe0d7] bg-[#eef7f2] p-6">
          <div>
            <h2 className="text-[16px] font-semibold text-[#12211c]">
              {plan === "pro"
                ? "Unlimited Applications Active"
                : "Need More Than 5 Applications?"}
            </h2>
            <p className="mt-1.5 text-[13px] text-[#0f513f]">
              {plan === "pro"
                ? "You have unlimited tuition applications unlocked with your Student Pro plan."
                : "Upgrade to Student Pro for $10 via Stripe to apply to unlimited tuition batches."}
            </p>
          </div>
          {plan !== "pro" ? (
            <Link
              href="/pricing"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0f7a5a] hover:underline"
            >
              Upgrade to Student Pro ($10)
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}