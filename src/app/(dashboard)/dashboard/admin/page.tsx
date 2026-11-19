"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  DollarSign,
  GraduationCap,
  Loader2,
  Users,
} from "lucide-react";

import { authFetch } from "@/lib/auth-fetch";

interface AdminStatsResponse {
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalTutors: number;
    totalTuitions: number;
    pendingTuitions: number;
    approvedTuitions: number;
    totalApplications: number;
    totalRevenue: number;
  };
  chartData: { subject: string; count: number }[];
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminStatsResponse | null>(null);
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
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    totalTuitions: 0,
    pendingTuitions: 0,
    approvedTuitions: 0,
    totalApplications: 0,
    totalRevenue: 0,
  };

  const chartData = data?.chartData || [];
  const maxSubjectCount = Math.max(
    1,
    ...chartData.map((item) => item.count || 0)
  );

  const cards = [
    {
      label: "Total Registered Users",
      value: stats.totalUsers,
      sub: `${stats.totalStudents} Students • ${stats.totalTutors} Tutors`,
      icon: Users,
      accent: "bg-[#e8f3ee] text-[#0f7a5a]",
    },
    {
      label: "Total Verified Tutors",
      value: stats.totalTutors,
      sub: "Active educators on platform",
      icon: GraduationCap,
      accent: "bg-sky-100 text-sky-700",
    },
    {
      label: "Pending vs Approved Tuitions",
      value: `${stats.pendingTuitions} / ${stats.approvedTuitions}`,
      sub: `${stats.totalTuitions} total submissions`,
      icon: BookOpenCheck,
      accent: "bg-amber-100 text-amber-700",
    },
    {
      label: "Total Stripe Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      sub: "From Pro plan subscriptions",
      icon: DollarSign,
      accent: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
          Admin Platform Overview
        </h1>
        <p className="mt-1 text-[13px] text-[#5b6b64]">
          Monitor platform users, tuition approval queue, and Stripe revenue.
        </p>
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
              <p className="mt-1 text-[11px] text-[#64748b]">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Subject Distribution & Quick Admin Links */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-[#e3eae5] bg-white p-6 lg:col-span-7">
          <h2 className="text-[16px] font-semibold text-[#12211c]">
            Tuitions by Subject
          </h2>
          <p className="mt-0.5 text-[12px] text-[#64748b]">
            Distribution of listed tuition batches across academic categories.
          </p>

          {chartData.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-[#64748b]">
              No tuition subject data available yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3.5">
              {chartData.map((item) => {
                const widthPercent = Math.round(
                  (item.count / maxSubjectCount) * 100
                );
                return (
                  <div key={item.subject} className="space-y-1">
                    <div className="flex justify-between text-[12px]">
                      <span className="font-medium text-[#12211c]">
                        {item.subject}
                      </span>
                      <span className="font-semibold text-[#0f7a5a]">
                        {item.count} {item.count === 1 ? "post" : "posts"}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#eef5f1]">
                      <div
                        className="h-full rounded-full bg-[#0f7a5a] transition-all duration-300"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-[#e3eae5] bg-white p-6">
            <h3 className="text-[15px] font-semibold text-[#12211c]">
              Tuition Approval Queue ({stats.pendingTuitions} Pending)
            </h3>
            <p className="mt-1 text-[12px] text-[#5b6b64]">
              Review newly submitted tutor posts or seed sample listings.
            </p>
            <Link
              href="/dashboard/admin/tuitions"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0f7a5a] hover:underline"
            >
              Open Tuition Moderation
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-[#e3eae5] bg-white p-6">
            <h3 className="text-[15px] font-semibold text-[#12211c]">
              Role & Revenue Controls
            </h3>
            <p className="mt-1 text-[12px] text-[#5b6b64]">
              Promote users to Admin/Tutor or inspect Stripe Pro receipts.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href="/dashboard/admin/users"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f7a5a] hover:underline"
              >
                Manage Users
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/dashboard/admin/transactions"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f7a5a] hover:underline"
              >
                View Transactions
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}