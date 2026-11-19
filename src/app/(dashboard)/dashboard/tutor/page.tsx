"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Crown,
  PlusCircle,
  Users,
} from "lucide-react";

import StatsCard from "@/components/dashboard/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TutorDashboardPage() {
  // Replace with real API stats from your backend
  const stats = {
    totalPosted: 2,
    activeApproved: 2,
    totalApplicants: 9,
    plan: "Free",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            Tutor Overview
          </h1>
          <p className="text-[13px] text-[#64748b]">
            Manage your tuition batches, student enrollments, and plan limits.
          </p>
        </div>

        <Link href="/dashboard/tutor/post-tuition">
          <Button className="h-10 rounded-xl bg-[#0f7a5a] px-4 text-[13px] font-semibold text-white hover:bg-[#0c654b]">
            <PlusCircle className="mr-2 size-4" />
            Post a Tuition
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Tuitions Posted"
          value={stats.totalPosted}
          subtitle="Free plan limit: 2 posts"
          icon={BookOpen}
        />
        <StatsCard
          title="Active / Approved"
          value={stats.activeApproved}
          subtitle="Live on Browse Tuitions"
          icon={CheckCircle2}
        />
        <StatsCard
          title="Total Applicants Received"
          value={stats.totalApplicants}
          subtitle="Students interested in batches"
          icon={Users}
        />
        <StatsCard
          title="Current Plan"
          value={stats.plan}
          subtitle="Pro unlocks unlimited posts"
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
          <Link href="/dashboard/tutor/my-tuitions">
            <Button variant="outline" className="rounded-xl text-[13px]">
              Manage My Tuitions
            </Button>
          </Link>
          <Link href="/dashboard/tutor/applicants">
            <Button variant="outline" className="rounded-xl text-[13px]">
              Review Applicants
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="rounded-xl text-[13px]">
              Upgrade to Pro ($15)
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}