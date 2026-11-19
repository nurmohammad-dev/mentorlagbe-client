"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Database,
  Loader2,
  MapPin,
  User,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authFetch } from "@/lib/auth-fetch";
import { cn } from "@/lib/utils";

interface AdminTuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  daysPerWeek?: string;
  monthlyFee: number;
  tutorName: string;
  tutorEmail: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  status?: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt?: string;
}

export default function AdminManageTuitionsPage() {
  const [tuitions, setTuitions] = useState<AdminTuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const fetchAllTuitions = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/tuitions/admin/all");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setTuitions(data);
      } else {
        toast.add({
          title: "Failed to load",
          description: data?.message || "Could not fetch tuition listings.",
          type: "error",
        });
      }
    } catch {
      toast.add({
        title: "Network Error",
        description: "Unable to connect to backend server.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTuitions();
  }, []);

  const handleModeration = async (
    id: string,
    nextStatus: "approved" | "rejected"
  ) => {
    setUpdatingId(id);
    try {
      const res = await authFetch(`/api/tuitions/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.add({
          title: "Moderation failed",
          description: data?.message || "Could not update tuition status.",
          type: "error",
        });
        return;
      }

      setTuitions((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, approvalStatus: nextStatus } : item
        )
      );

      toast.add({
        title:
          nextStatus === "approved" ? "Tuition Approved" : "Tuition Rejected",
        description:
          nextStatus === "approved"
            ? "This listing is now live on Browse Tuitions."
            : "This listing has been rejected.",
        type: "success",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const res = await authFetch("/api/dashboard/seed", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.add({
          title: "Seed failed",
          description: data?.message || "Could not seed sample tuitions.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Sample Data Seeded!",
        description:
          data?.message || "12 approved tuitions added to the database.",
        type: "success",
      });
      await fetchAllTuitions();
    } finally {
      setSeeding(false);
    }
  };

  const getStatus = (item: AdminTuition) =>
    item.approvalStatus || item.status || "pending";

  const filteredTuitions =
    filter === "all"
      ? tuitions
      : tuitions.filter((item) => getStatus(item) === filter);

  return (
    <div className="space-y-6">
      {/* Header & Seed Button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            Manage & Approve Tuitions
          </h1>
          <p className="mt-1 text-[13px] text-[#5b6b64]">
            Review tutor submissions before they appear publicly on MentorLagbe.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSeedData}
          disabled={seeding}
          variant="outline"
          className="h-10 rounded-xl border-[#cfe0d7] bg-white px-4 text-[12px] font-semibold text-[#0f513f] hover:bg-[#eef7f2]"
        >
          {seeding ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Seeding Data...
            </>
          ) : (
            <>
              <Database className="size-4 text-[#0f7a5a]" />
              Seed 12 Sample Tuitions
            </>
          )}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#e3eae5] bg-white p-1">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => {
            const count =
              tab === "all"
                ? tuitions.length
                : tuitions.filter((t) => getStatus(t) === tab).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[12px] font-semibold capitalize transition-colors",
                  filter === tab
                    ? "bg-[#0f7a5a] text-white"
                    : "text-[#5b6b64] hover:text-[#12211c]"
                )}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-60 items-center justify-center rounded-2xl border border-[#e3eae5] bg-white">
          <Loader2 className="size-6 animate-spin text-[#0f7a5a]" />
        </div>
      ) : filteredTuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cfe0d7] bg-white p-12 text-center">
          <h3 className="text-[16px] font-semibold text-[#12211c]">
            No tuition listings found
          </h3>
          <p className="mt-1 text-[13px] text-[#64748b]">
            Click &ldquo;Seed 12 Sample Tuitions&rdquo; above to populate
            initial listings or wait for tutors to submit posts.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTuitions.map((item) => {
            const currentStatus = getStatus(item);

            return (
              <div
                key={item._id}
                className="flex flex-col justify-between gap-5 rounded-2xl border border-[#e3eae5] bg-white p-5 shadow-xs lg:flex-row lg:items-center"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#e8f3ee] px-2.5 py-0.5 text-[11px] font-semibold text-[#0f513f]">
                      {item.subject}
                    </span>
                    <span className="text-[12px] font-medium text-[#64748b]">
                      {item.classLevel}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                        currentStatus === "approved" &&
                          "bg-emerald-100 text-emerald-800",
                        currentStatus === "rejected" &&
                          "bg-red-100 text-red-700",
                        currentStatus === "pending" &&
                          "bg-amber-100 text-amber-800"
                      )}
                    >
                      {currentStatus}
                    </span>
                  </div>

                  <h3 className="text-[16px] font-semibold text-[#12211c]">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[#5b6b64]">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="size-3.5 text-[#0f7a5a]" />
                      {item.tutorName} ({item.tutorEmail})
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-[#0f7a5a]" />
                      {item.mode} • {item.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-[#0f7a5a]" />
                      {item.daysPerWeek || "3 days/week"}
                    </span>
                    <span className="font-semibold text-[#12211c]">
                      ৳{Number(item.monthlyFee).toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                {/* Approve / Reject Controls */}
                <div className="flex shrink-0 items-center gap-2.5">
                  <button
                    type="button"
                    disabled={
                      updatingId === item._id || currentStatus === "approved"
                    }
                    onClick={() => handleModeration(item._id, "approved")}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#0f7a5a] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#0c654b] disabled:opacity-50"
                  >
                    <CheckCircle2 className="size-3.5" />
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={
                      updatingId === item._id || currentStatus === "rejected"
                    }
                    onClick={() => handleModeration(item._id, "rejected")}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 text-[12px] font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    <XCircle className="size-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}