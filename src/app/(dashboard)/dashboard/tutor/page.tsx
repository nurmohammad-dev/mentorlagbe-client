"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Loader2,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

import { authFetch } from "@/lib/auth-fetch";

interface TutorStatsResponse {
  plan: "free" | "pro";
  stats: {
    totalTuitions: number;
    approvedTuitions: number;
    pendingTuitions: number;
    totalApplications: number;
    acceptedApplications: number;
    pendingApplications: number;
  };
}

export default function TutorOverviewPage() {
  const [data, setData] = useState<TutorStatsResponse | null>(null);
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
    totalTuitions: 0,
    approvedTuitions: 0,
    pendingTuitions: 0,
    totalApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
  };
  const plan = data?.plan || "free";

  const cards = [
    {
      label: "Total Tuitions Posted",
      value: stats.totalTuitions,
      icon: BookOpen,
      accent: "bg-[#e8f3ee] text-[#0f7a5a]",
    },
    {
      label: "Active / Approved Tuitions",
      value: stats.approvedTuitions,
      icon: CheckCircle2,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Total Applicants Received",
      value: stats.totalApplications,
      icon: Users,
      accent: "bg-sky-100 text-sky-700",
    },
    {
      label: "Current Plan",
      value: plan === "pro" ? "Tutor Pro" : "Free (Max 2)",
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
            Tutor Dashboard Overview
          </h1>
          <p className="mt-1 text-[13px] text-[#5b6b64]">
            Monitor your published batches, approval status, and incoming
            student requests.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f7a5a] px-4 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
        >
          <Plus className="size-4" />
          Post New Tuition
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

      {/* Quick Action Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-[#e3eae5] bg-white p-6">
          <div>
            <h2 className="text-[16px] font-semibold text-[#12211c]">
              Review Incoming Student Requests ({stats.pendingApplications}{" "}
              Pending)
            </h2>
            <p className="mt-1.5 text-[13px] text-[#5b6b64]">
              Check student schedules, contact numbers, and accept qualified
              learners into your batch.
            </p>
          </div>
          <Link
            href="/dashboard/tutor/applicants"
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0f7a5a] hover:underline"
          >
            Manage Applicants
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[#cfe0d7] bg-[#eef7f2] p-6">
          <div>
            <h2 className="text-[16px] font-semibold text-[#12211c]">
              {plan === "pro"
                ? "Tutor Pro Plan Active"
                : "Publish Unlimited Tuition Batches"}
            </h2>
            <p className="mt-1.5 text-[13px] text-[#0f513f]">
              {plan === "pro"
                ? "You can post unlimited tuitions with verified Pro badge status."
                : "Free accounts are capped at 2 tuition posts. Upgrade to Tutor Pro ($15) for unlimited listings."}
            </p>
          </div>
          {plan !== "pro" ? (
            <Link
              href="/pricing"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0f7a5a] hover:underline"
            >
              Upgrade to Tutor Pro ($15)
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}