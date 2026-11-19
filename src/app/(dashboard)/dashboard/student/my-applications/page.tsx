"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Loader2,
  Mail,
  Search,
  Trash2,
  User,
} from "lucide-react";

import { toast } from "@/components/ui/toast";
import { authFetch } from "@/lib/auth-fetch";
import { cn } from "@/lib/utils";

interface StudentApplication {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorName?: string;
  tutorEmail: string;
  preferredSchedule?: string;
  studentNote?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

export default function StudentMyApplicationsPage() {
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");

  useEffect(() => {
    const fetchMyApplications = async () => {
      setLoading(true);
      try {
        const res = await authFetch("/api/applications/my-applications");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setApplications(data);
        } else {
          toast.add({
            title: "Failed to load",
            description: data?.message || "Could not load your applications.",
            type: "error",
          });
        }
      } catch {
        toast.add({
          title: "Network Error",
          description: "Unable to connect to server.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, []);

  const handleCancelApplication = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this pending application?"
    );
    if (!confirmed) return;

    setCancelingId(id);
    try {
      const res = await authFetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.add({
          title: "Cancel failed",
          description: data?.message || "Could not cancel application.",
          type: "error",
        });
        return;
      }

      setApplications((prev) => prev.filter((item) => item._id !== id));
      toast.add({
        title: "Application Canceled",
        description: "Your pending application has been removed.",
        type: "success",
      });
    } finally {
      setCancelingId(null);
    }
  };

  const filteredApps =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter);

  return (
    <div className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            My Tuition Applications
          </h1>
          <p className="mt-1 text-[13px] text-[#5b6b64]">
            Track tutor responses or withdraw pending enrollment requests.
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

      {/* Applications List */}
      {loading ? (
        <div className="flex h-60 items-center justify-center rounded-2xl border border-[#e3eae5] bg-white">
          <Loader2 className="size-6 animate-spin text-[#0f7a5a]" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cfe0d7] bg-white p-12 text-center">
          <h3 className="text-[16px] font-semibold text-[#12211c]">
            No applications found
          </h3>
          <p className="mt-1 text-[13px] text-[#64748b]">
            Explore verified tuition batches and submit your first application.
          </p>
          <Link
            href="/tuitions"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f7a5a] px-5 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
          >
            <Search className="size-4" />
            Browse Tuitions
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e3eae5] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#eef2ef] bg-[#fbfaf7] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="px-5 py-3.5">Tuition Batch</th>
                  <th className="px-5 py-3.5">Tutor</th>
                  <th className="px-5 py-3.5">Monthly Fee</th>
                  <th className="px-5 py-3.5">Applied Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2ef]">
                {filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-[#fbfaf7]/70">
                    <td className="px-5 py-4">
                      <span className="inline-block rounded bg-[#e8f3ee] px-2 py-0.5 text-[10px] font-semibold text-[#0f513f]">
                        {app.subject}
                      </span>
                      <Link
                        href={`/tuitions/${app.tuitionId}`}
                        className="mt-1 flex items-center gap-1 font-semibold text-[#12211c] hover:text-[#0f7a5a]"
                      >
                        <span>{app.tuitionTitle}</span>
                        <ArrowUpRight className="size-3.5 shrink-0" />
                      </Link>
                      {app.preferredSchedule ? (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#64748b]">
                          <Calendar className="size-3 text-[#0f7a5a]" />
                          {app.preferredSchedule}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-5 py-4">
                      {app.tutorName ? (
                        <p className="flex items-center gap-1 font-medium text-[#12211c]">
                          <User className="size-3.5 text-[#0f7a5a]" />
                          {app.tutorName}
                        </p>
                      ) : null}
                      <p className="flex items-center gap-1 text-[12px] text-[#64748b]">
                        <Mail className="size-3 text-[#0f7a5a]" />
                        {app.tutorEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#12211c]">
                      ৳{Number(app.monthlyFee).toLocaleString()}/mo
                    </td>

                    <td className="px-5 py-4 text-[12px] text-[#64748b]">
                      {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                          app.status === "accepted" &&
                            "bg-emerald-100 text-emerald-800",
                          app.status === "rejected" &&
                            "bg-red-100 text-red-700",
                          app.status === "pending" &&
                            "bg-amber-100 text-amber-800"
                        )}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      {app.status === "pending" ? (
                        <button
                          type="button"
                          disabled={cancelingId === app._id}
                          onClick={() => handleCancelApplication(app._id)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 text-[11px] font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                        >
                          {cancelingId === app._id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                          Cancel
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#8a9a93]">
                          Locked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}