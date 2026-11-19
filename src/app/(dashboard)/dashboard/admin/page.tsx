"use client";

import Link from "next/link";
import {
  BookCheck,
  DollarSign,
  GraduationCap,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/shared/StatsCard";

export default function AdminDashboardPage() {
  // Placeholder metrics until backend API is connected
  const stats = {
    totalUsers: 0,
    totalTutors: 0,
    pendingTuitions: 0,
    approvedTuitions: 0,
    totalRevenue: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#12211c]">
          Admin Overview
        </h1>
        <p className="text-[13px] text-[#64748b]">
          Monitor users, tuition approvals, and Stripe subscription revenue.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Students, tutors & admins"
          icon={Users}
        />
        <StatCard
          title="Total Tutors"
          value={stats.totalTutors}
          subtitle="Registered tutors"
          icon={GraduationCap}
        />
        <StatCard
          title="Pending vs Approved"
          value={`${stats.pendingTuitions} / ${stats.approvedTuitions}`}
          subtitle="Tuition approval status"
          icon={BookCheck}
        />
        <StatCard
          title="Total Stripe Revenue"
          value={`$${stats.totalRevenue}`}
          subtitle="Pro plan subscriptions"
          icon={DollarSign}
          highlight
        />
      </div>

      {/* Moderation Shortcuts */}
      <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#12211c]">
            Platform Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/admin/tuitions">
            <Button className="rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]">
              Approve / Reject Tuitions
            </Button>
          </Link>
          <Link href="/dashboard/admin/users">
            <Button variant="outline" className="rounded-xl text-[13px]">
              Manage Users
            </Button>
          </Link>
          <Link href="/dashboard/admin/transactions">
            <Button variant="outline" className="rounded-xl text-[13px]">
              View Transactions
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}