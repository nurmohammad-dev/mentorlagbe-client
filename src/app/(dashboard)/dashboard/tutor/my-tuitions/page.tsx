"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authFetch } from "@/lib/auth-fetch";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { cn } from "@/lib/utils";

interface TutorTuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  daysPerWeek?: string;
  monthlyFee: number;
  description?: string;
  bannerImage?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  status?: "pending" | "approved" | "rejected";
  isActive: boolean;
}

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState<TutorTuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit Modal State
  const [editingTuition, setEditingTuition] = useState<TutorTuition | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    title: "",
    subject: "",
    classLevel: "",
    mode: "Offline",
    location: "",
    daysPerWeek: "",
    monthlyFee: "",
    description: "",
  });
  const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadMyTuitions = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/tuitions/my-tuitions");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setTuitions(data);
      } else {
        toast.add({
          title: "Failed to load",
          description: data?.message || "Could not load your tuitions.",
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

  useEffect(() => {
    loadMyTuitions();
  }, []);

  const handleToggleActive = async (item: TutorTuition) => {
    setTogglingId(item._id);
    try {
      const res = await authFetch(`/api/tuitions/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !item.isActive }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.add({
          title: "Update failed",
          description: err?.message || "Could not toggle active status.",
          type: "error",
        });
        return;
      }

      setTuitions((prev) =>
        prev.map((t) =>
          t._id === item._id ? { ...t, isActive: !t.isActive } : t
        )
      );
      toast.add({
        title: !item.isActive ? "Tuition Activated" : "Tuition Closed",
        description: `Listing is now ${!item.isActive ? "visible" : "hidden"} to students.`,
        type: "success",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this tuition post?"
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await authFetch(`/api/tuitions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        toast.add({
          title: "Delete failed",
          description: err?.message || "Could not delete tuition.",
          type: "error",
        });
        return;
      }

      setTuitions((prev) => prev.filter((t) => t._id !== id));
      toast.add({
        title: "Deleted",
        description: "Tuition post has been removed.",
        type: "success",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (item: TutorTuition) => {
    setEditingTuition(item);
    setNewBannerFile(null);
    setEditForm({
      title: item.title,
      subject: item.subject,
      classLevel: item.classLevel,
      mode: item.mode || "Offline",
      location: item.location || "",
      daysPerWeek: item.daysPerWeek || "3 days/week",
      monthlyFee: String(item.monthlyFee),
      description: item.description || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTuition) return;

    setSavingEdit(true);
    try {
      let bannerImage = editingTuition.bannerImage;
      if (newBannerFile) {
        bannerImage = await uploadImageToImgBB(newBannerFile);
      }

      const res = await authFetch(`/api/tuitions/${editingTuition._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editForm.title.trim(),
          subject: editForm.subject.trim(),
          classLevel: editForm.classLevel.trim(),
          mode: editForm.mode,
          location: editForm.location.trim(),
          daysPerWeek: editForm.daysPerWeek.trim(),
          monthlyFee: Number(editForm.monthlyFee),
          description: editForm.description.trim(),
          bannerImage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.add({
          title: "Update failed",
          description: data?.message || "Could not update tuition.",
          type: "error",
        });
        return;
      }

      setTuitions((prev) =>
        prev.map((t) =>
          t._id === editingTuition._id
            ? {
                ...t,
                ...editForm,
                monthlyFee: Number(editForm.monthlyFee),
                bannerImage,
              }
            : t
        )
      );

      toast.add({
        title: "Tuition Updated",
        description: "Your changes have been saved.",
        type: "success",
      });
      setEditingTuition(null);
    } catch (err) {
      toast.add({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to save changes.",
        type: "error",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const getApprovalBadge = (item: TutorTuition) => {
    const status = item.approvalStatus || item.status || "pending";
    if (status === "approved") {
      return (
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-emerald-800">
          Approved
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-red-700">
          Rejected
        </span>
      );
    }
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-amber-800">
        Pending Approval
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            My Created Tuitions
          </h1>
          <p className="mt-1 text-[13px] text-[#5b6b64]">
            Manage your tuition batches, edit schedules, or toggle availability.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f7a5a] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#0c654b]"
        >
          <Plus className="size-4" />
          Post New Tuition
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-60 items-center justify-center rounded-2xl border border-[#e3eae5] bg-white">
          <Loader2 className="size-6 animate-spin text-[#0f7a5a]" />
        </div>
      ) : tuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cfe0d7] bg-white p-12 text-center">
          <h3 className="text-[16px] font-semibold text-[#12211c]">
            No tuition batches posted yet
          </h3>
          <p className="mt-1 text-[13px] text-[#64748b]">
            Publish your first tuition post to start receiving applications from
            students.
          </p>
          <Link
            href="/dashboard/tutor/post-tuition"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f7a5a] px-5 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
          >
            <Plus className="size-4" />
            Create First Tuition
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {tuitions.map((item) => (
            <div
              key={item._id}
              className="flex flex-col justify-between rounded-2xl border border-[#e3eae5] bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#e8f3ee] px-2.5 py-0.5 text-[11px] font-semibold text-[#0f513f]">
                      {item.subject}
                    </span>
                    <span className="text-[12px] font-medium text-[#64748b]">
                      {item.classLevel}
                    </span>
                  </div>
                  {getApprovalBadge(item)}
                </div>

                <h3 className="mt-3 text-[16px] font-semibold text-[#12211c]">
                  {item.title}
                </h3>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#64748b]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 text-[#0f7a5a]" />
                    {item.mode} • {item.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5 text-[#0f7a5a]" />
                    {item.daysPerWeek || "3 days/week"}
                  </span>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef2ef] pt-4">
                <div>
                  <span className="text-[16px] font-bold text-[#12211c]">
                    ৳{Number(item.monthlyFee).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#64748b]">/mo</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Active / Closed Toggle */}
                  <button
                    type="button"
                    disabled={togglingId === item._id}
                    onClick={() => handleToggleActive(item)}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                      item.isActive
                        ? "bg-[#e8f3ee] text-[#0f513f] hover:bg-[#d6ebe1]"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {togglingId === item._id
                      ? "..."
                      : item.isActive
                        ? "Active"
                        : "Closed"}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    aria-label="Edit tuition"
                    className="flex size-8 items-center justify-center rounded-lg border border-[#dce5df] text-[#475569] hover:border-[#0f7a5a] hover:text-[#0f7a5a]"
                  >
                    <Edit3 className="size-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    disabled={deletingId === item._id}
                    onClick={() => handleDelete(item._id)}
                    aria-label="Delete tuition"
                    className="flex size-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {deletingId === item._id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Tuition Modal */}
      {editingTuition ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eef2ef] pb-3">
              <h2 className="text-[17px] font-semibold text-[#12211c]">
                Edit Tuition Post
              </h2>
              <button
                type="button"
                onClick={() => setEditingTuition(null)}
                className="rounded-lg p-1 text-[#64748b] hover:bg-gray-100"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
              <div>
                <label className="text-[12px] font-semibold text-[#12211c]">
                  Title
                </label>
                <Input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="mt-1 h-10 rounded-xl text-[13px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-[#12211c]">
                    Subject
                  </label>
                  <Input
                    value={editForm.subject}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subject: e.target.value })
                    }
                    className="mt-1 h-10 rounded-xl text-[13px]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#12211c]">
                    Class Level
                  </label>
                  <Input
                    value={editForm.classLevel}
                    onChange={(e) =>
                      setEditForm({ ...editForm, classLevel: e.target.value })
                    }
                    className="mt-1 h-10 rounded-xl text-[13px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-[#12211c]">
                    Mode
                  </label>
                  <select
                    value={editForm.mode}
                    onChange={(e) =>
                      setEditForm({ ...editForm, mode: e.target.value })
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-[#dce5df] px-3 text-[13px]"
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#12211c]">
                    Location
                  </label>
                  <Input
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="mt-1 h-10 rounded-xl text-[13px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-[#12211c]">
                    Monthly Fee (৳)
                  </label>
                  <Input
                    type="number"
                    value={editForm.monthlyFee}
                    onChange={(e) =>
                      setEditForm({ ...editForm, monthlyFee: e.target.value })
                    }
                    className="mt-1 h-10 rounded-xl text-[13px]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#12211c]">
                    Days / Week
                  </label>
                  <Input
                    value={editForm.daysPerWeek}
                    onChange={(e) =>
                      setEditForm({ ...editForm, daysPerWeek: e.target.value })
                    }
                    className="mt-1 h-10 rounded-xl text-[13px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#12211c]">
                  Replace Banner Image (Optional)
                </label>
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) =>
                    setNewBannerFile(e.target.files?.[0] || null)
                  }
                  className="mt-1 h-10 rounded-xl text-[12px]"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#12211c]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#dce5df] p-3 text-[13px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingTuition(null)}
                  className="h-10 rounded-xl text-[13px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingEdit}
                  className="h-10 rounded-xl bg-[#0f7a5a] px-5 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}