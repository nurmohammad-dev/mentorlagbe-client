"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Crown,
  FileText,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/shared/StatsCard";

export default function StudentDashboardPage() {
  const { data: session } = authClient.useSession();
  const plan = (session?.user as { plan?: string })?.plan || "free";

  // Placeholder counts until backend API is connected
  const stats = {
    totalApplied: 0,
    accepted: 0,
    pending: 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#12211c]">
            Student Overview
          </h1>
          <p className="text-[13px] text-[#64748b]">
            Track your tuition applications and current subscription plan.
          </p>
        </div>

        <Link href="/tuitions">
          <Button className="rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]">
            Browse Tuitions
            <ArrowRight className="ml-1.5 size-4" />
          </Button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applied Tuitions"
          value={stats.totalApplied}
          subtitle="All submitted requests"
          icon={FileText}
        />
        <StatCard
          title="Accepted Applications"
          value={stats.accepted}
          subtitle="Approved by tutors"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Applications"
          value={stats.pending}
          subtitle="Awaiting tutor response"
          icon={Clock}
        />
        <StatCard
          title="Current Plan"
          value={plan.toUpperCase()}
          subtitle={
            plan === "pro" ? "Priority booking enabled" : "Upgrade for priority"
          }
          icon={Crown}
          highlight={plan === "pro"}
        />
      </div>

      {/* Shortcuts */}
      <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#12211c]">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/student/my-applications">
            <Button variant="outline" className="rounded-xl text-[13px]">
              My Applications
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="rounded-xl text-[13px]">
              Upgrade to Pro ($10)
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}