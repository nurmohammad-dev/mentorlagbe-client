"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Upload } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

const FREE_PLAN_LIMIT = 2;

export default function PostTuitionPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    | { name?: string; email?: string; plan?: string }
    | undefined;
  const plan = user?.plan || "free";

  // Replace with real count from backend API
  const currentPostCount = 0;
  const reachedFreeLimit =
    plan === "free" && currentPostCount >= FREE_PLAN_LIMIT;

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    classLevel: "",
    mode: "Online",
    location: "",
    monthlyFee: "",
    daysPerWeek: "3",
    bannerImage: "",
    description: "",
  });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.add({
        title: "ImgBB key missing",
        description: "Set NEXT_PUBLIC_IMGBB_API_KEY in .env.local",
        type: "error",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const body = new FormData();
      body.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body,
      });
      const result = await res.json();

      if (result.success && result.data?.url) {
        setForm((prev) => ({ ...prev, bannerImage: result.data.url }));
        toast.add({
          title: "Banner uploaded",
          description: "Image uploaded via ImgBB.",
          type: "success",
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      toast.add({
        title: "Upload failed",
        description: "Could not upload banner image.",
        type: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (reachedFreeLimit) {
      toast.add({
        title: "Limit reached",
        description: "Free tutors can post up to 2 tuitions. Upgrade to Pro.",
        type: "error",
      });
      return;
    }

    if (!form.title.trim() || !form.subject.trim() || !form.monthlyFee) {
      toast.add({
        title: "Missing fields",
        description: "Please fill in title, subject, and monthly fee.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Payload matching assignment tuitions collection structure
      const payload = {
        ...form,
        monthlyFee: Number(form.monthlyFee),
        daysPerWeek: Number(form.daysPerWeek) || 3,
        tutorName: user?.name || "",
        tutorEmail: user?.email || "",
        approvalStatus: "pending",
        isActive: true,
      };

      // Connect POST /api/tuitions here
      void payload;

      toast.add({
        title: "Tuition submitted",
        description: "Saved as pending for admin approval.",
        type: "success",
      });

      setForm({
        title: "",
        subject: "",
        classLevel: "",
        mode: "Online",
        location: "",
        monthlyFee: "",
        daysPerWeek: "3",
        bannerImage: "",
        description: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#12211c]">
          Post a Tuition
        </h1>
        <p className="text-[13px] text-[#64748b]">
          Create a tuition batch or 1-on-1 mentorship listing. New posts start as
          pending approval.
        </p>
      </div>

      {reachedFreeLimit && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900">
          You have reached the Free Plan limit of {FREE_PLAN_LIMIT} tuition
          posts. Upgrade to Pro for unlimited posts.
        </div>
      )}

      <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#12211c]">
            Tuition Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="HSC Higher Math Batch"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="Mathematics"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="classLevel">Class Level</Label>
                <Input
                  id="classLevel"
                  value={form.classLevel}
                  onChange={(e) =>
                    setForm({ ...form, classLevel: e.target.value })
                  }
                  placeholder="Class 11-12 / O-Level"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mode">Mode</Label>
                <select
                  id="mode"
                  value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Dhanmondi or Online"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="monthlyFee">Monthly Fee ($)</Label>
                  <Input
                    id="monthlyFee"
                    type="number"
                    min="1"
                    value={form.monthlyFee}
                    onChange={(e) =>
                      setForm({ ...form, monthlyFee: e.target.value })
                    }
                    placeholder="80"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="daysPerWeek">Days / Week</Label>
                  <Input
                    id="daysPerWeek"
                    type="number"
                    min="1"
                    max="7"
                    value={form.daysPerWeek}
                    onChange={(e) =>
                      setForm({ ...form, daysPerWeek: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Banner Image Upload via ImgBB */}
            <div className="space-y-1.5">
              <Label htmlFor="bannerFile">Banner Image (ImgBB)</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  id="bannerFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="max-w-xs"
                />
                {uploadingImage && (
                  <span className="inline-flex items-center gap-1 text-[12px] text-[#0f7a5a]">
                    <Upload className="size-3.5" /> Uploading...
                  </span>
                )}
              </div>
              {form.bannerImage && (
                <p className="truncate text-[12px] text-[#0f7a5a]">
                  Uploaded: {form.bannerImage}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Syllabus coverage, schedule details, and teaching approach..."
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || uploadingImage || reachedFreeLimit}
              className="rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]"
            >
              {submitting ? "Submitting..." : "Publish Tuition"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}