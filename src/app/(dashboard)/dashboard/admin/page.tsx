"use client";

import Link from "next/link";
import {
  BookCheck,
  DollarSign,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

import StatsCard from "@/components/dashboard/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  // Replace with real API stats from your backend
  const stats = {
    totalUsers: 48,
    totalTutors: 19,
    tuitionsSummary: "3 Pending / 14 Approved",
    totalRevenue: "$325",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            Admin Overview
          </h1>
          <p className="text-[13px] text-[#64748b]">
            Monitor platform users, tuition approvals, and Stripe revenue.
          </p>
        </div>

        <Link href="/dashboard/admin/tuitions">
          <Button className="h-10 rounded-xl bg-[#0f7a5a] px-4 text-[13px] font-semibold text-white hover:bg-[#0c654b]">
            <ShieldCheck className="mr-2 size-4" />
            Moderate Tuitions
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Students, Tutors & Admins"
          icon={Users}
        />
        <StatsCard
          title="Total Tutors"
          value={stats.totalTutors}
          subtitle="Registered educators"
          icon={GraduationCap}
        />
        <StatsCard
          title="Pending vs Approved"
          value={stats.tuitionsSummary}
          subtitle="Tuition moderation queue"
          icon={BookCheck}
        />
        <StatsCard
          title="Total Stripe Revenue"
          value={stats.totalRevenue}
          subtitle="Pro plan subscriptions"
          icon={DollarSign}
          highlight
        />
      </div>

      {/* Quick Actions */}
      <Card className="rounded-2xl border border-[#e4ece7] bg-white py-0 shadow-xs">
        <CardHeader className="border-b border-[#e4ece7] px-6 py-4">
          <CardTitle className="text-[16px] font-semibold text-[#12211c]">
            Platform Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 p-6">
          <Link href="/dashboard/admin/users">
            <Button variant="outline" className="rounded-xl text-[13px]">
              Manage User Roles
            </Button>
          </Link>
          <Link href="/dashboard/admin/tuitions">
            <Button variant="outline" className="rounded-xl text-[13px]">
              Approve / Reject Tuitions
            </Button>
          </Link>
          <Link href="/dashboard/admin/transactions">
            <Button variant="outline" className="rounded-xl text-[13px]">
              View Stripe Transactions
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}