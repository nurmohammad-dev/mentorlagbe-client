"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Crown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/shared/StatsCard";

export default function StudentDashboardPage() {
  // Replace with real API stats from your backend
  const stats = {
    totalApplied: 6,
    accepted: 2,
    pending: 4,
    plan: "Free",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            Student Overview
          </h1>
          <p className="text-[13px] text-[#64748b]">
            Track your tuition applications and current subscription status.
          </p>
        </div>

        <Link href="/tuitions">
          <Button className="h-10 rounded-xl bg-[#0f7a5a] px-4 text-[13px] font-semibold text-white hover:bg-[#0c654b]">
            Browse Tuitions
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Applied Tuitions"
          value={stats.totalApplied}
          subtitle="All submitted requests"
          icon={BookOpenCheck}
        />
        <StatsCard
          title="Accepted Applications"
          value={stats.accepted}
          subtitle="Approved by tutors"
          icon={CheckCircle2}
        />
        <StatsCard
          title="Pending Applications"
          value={stats.pending}
          subtitle="Awaiting tutor response"
          icon={Clock}
        />
        <StatsCard
          title="Current Plan"
          value={stats.plan}
          subtitle="Upgrade for priority booking"
          icon={Crown}
          highlight
        />
      </div>

      {/* Quick Actions */}
      <Card className="rounded-2xl border border-[#e4ece7] bg-white py-0 shadow-xs">
        <CardHeader className="border-b border-[#e4ece7] px-6 py-4">
          <CardTitle className="text-[16px] font-semibold text-[#12211c]">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 p-6">
          <Link href="/dashboard/student/my-applications">
            <Button variant="outline" className="rounded-xl text-[13px]">
              View My Applications
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="rounded-xl text-[13px]">
              Upgrade to Pro ($10)
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="rounded-xl text-[13px]">
              Update Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}