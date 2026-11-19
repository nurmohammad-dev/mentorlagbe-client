"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Check,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  User,
  X,
} from "lucide-react";

import { toast } from "@/components/ui/toast";
import { authFetch } from "@/lib/auth-fetch";
import { cn } from "@/lib/utils";

interface ApplicantItem {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  preferredSchedule?: string;
  studentNote?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

export default function TutorApplicantsPage() {
  const [applications, setApplications] = useState<ApplicantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await authFetch("/api/applications/tutor");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setApplications(data);
        }
      } catch {
        toast.add({
          title: "Error",
          description: "Failed to load student applications.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const handleStatusUpdate = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    setUpdatingId(id);
    try {
      const res = await authFetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.add({
          title: "Action failed",
          description: data?.message || "Could not update status.",
          type: "error",
        });
        return;
      }

      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );

      toast.add({
        title: status === "accepted" ? "Application Accepted" : "Application Rejected",
        description: `Student application marked as ${status}.`,
        type: "success",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter);

  return (
    <div className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            Manage Student Applicants
          </h1>
          <p className="mt-1 text-[13px] text-[#5b6b64]">
            Review student enrollment requests and accept or decline applications.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#e3eae5] bg-white p-1">
          {(["all", "pending", "accepted", "rejected"] as const).map((tab) => (
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
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants List */}
      {loading ? (
        <div className="flex h-60 items-center justify-center rounded-2xl border border-[#e3eae5] bg-white">
          <Loader2 className="size-6 animate-spin text-[#0f7a5a]" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cfe0d7] bg-white p-12 text-center">
          <h3 className="text-[16px] font-semibold text-[#12211c]">
            No applications found
          </h3>
          <p className="mt-1 text-[13px] text-[#64748b]">
            {filter === "all"
              ? "Students who apply to your approved tuition batches will appear here."
              : `No ${filter} applications at the moment.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((app) => (
            <div
              key={app._id}
              className="flex flex-col justify-between gap-5 rounded-2xl border border-[#e3eae5] bg-white p-5 shadow-xs lg:flex-row lg:items-center"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#e8f3ee] px-2.5 py-0.5 text-[11px] font-semibold text-[#0f513f]">
                    {app.tuitionTitle}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                      app.status === "accepted" &&
                        "bg-emerald-100 text-emerald-800",
                      app.status === "rejected" && "bg-red-100 text-red-700",
                      app.status === "pending" && "bg-amber-100 text-amber-800"
                    )}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-[#12211c]">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <User className="size-4 text-[#0f7a5a]" />
                    {app.studentName}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#5b6b64]">
                    <Mail className="size-3.5 text-[#0f7a5a]" />
                    {app.studentEmail}
                  </span>
                  {app.studentPhone ? (
                    <span className="inline-flex items-center gap-1.5 text-[#5b6b64]">
                      <Phone className="size-3.5 text-[#0f7a5a]" />
                      {app.studentPhone}
                    </span>
                  ) : null}
                </div>

                {app.preferredSchedule ? (
                  <p className="inline-flex items-center gap-1.5 text-[12px] text-[#5b6b64]">
                    <Calendar className="size-3.5 text-[#0f7a5a]" />
                    <strong>Preferred Schedule:</strong> {app.preferredSchedule}
                  </p>
                ) : null}

                {app.studentNote ? (
                  <p className="flex items-start gap-1.5 rounded-xl bg-[#fbfaf7] p-3 text-[12px] text-[#475569]">
                    <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-[#0f7a5a]" />
                    <span>{app.studentNote}</span>
                  </p>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex shrink-0 items-center gap-2.5">
                <button
                  type="button"
                  disabled={
                    updatingId === app._id || app.status === "accepted"
                  }
                  onClick={() => handleStatusUpdate(app._id, "accepted")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#0f7a5a] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#0c654b] disabled:opacity-50"
                >
                  <Check className="size-3.5" />
                  Accept
                </button>
                <button
                  type="button"
                  disabled={
                    updatingId === app._id || app.status === "rejected"
                  }
                  onClick={() => handleStatusUpdate(app._id, "rejected")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 text-[12px] font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  <X className="size-3.5" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}