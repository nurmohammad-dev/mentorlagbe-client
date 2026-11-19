"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  Info,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authFetch } from "@/lib/auth-fetch";
import { uploadImageToImgBB } from "@/lib/imgbb";

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "IELTS",
  "ICT",
  "Programming",
  "Accounting",
  "General Science",
];

const CLASS_LEVEL_OPTIONS = [
  "Class 6–8",
  "SSC",
  "HSC",
  "O-Level",
  "A-Level",
  "University",
  "All Levels",
];

export default function PostTuitionPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [classLevel, setClassLevel] = useState("HSC");
  const [mode, setMode] = useState<"Offline" | "Online">("Offline");
  const [location, setLocation] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("3 days/week");
  const [monthlyFee, setMonthlyFee] = useState("");
  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLimitReached(false);

    if (!title.trim() || title.trim().length < 5) {
      toast.add({
        title: "Invalid Title",
        description: "Please enter a descriptive tuition title (min 5 chars).",
        type: "error",
      });
      return;
    }

    if (!location.trim()) {
      toast.add({
        title: "Location Required",
        description:
          mode === "Online"
            ? "Specify online platform (e.g. Zoom / Google Meet)."
            : "Please enter the area or city (e.g. Dhanmondi, Dhaka).",
        type: "error",
      });
      return;
    }

    if (!monthlyFee || Number(monthlyFee) <= 0) {
      toast.add({
        title: "Invalid Monthly Fee",
        description: "Please enter a valid monthly fee amount.",
        type: "error",
      });
      return;
    }

    if (!description.trim() || description.trim().length < 15) {
      toast.add({
        title: "Description Too Short",
        description: "Please provide at least 15 characters describing the batch.",
        type: "error",
      });
      return;
    }

    if (!imageFile) {
      toast.add({
        title: "Banner Image Required",
        description: "Please upload a tuition banner image.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload banner directly to ImgBB
      setUploadingImage(true);
      const bannerImageUrl = await uploadImageToImgBB(imageFile);
      setUploadingImage(false);

      // 2. Submit tuition post to Express backend
      const response = await authFetch("/api/tuitions", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          subject,
          classLevel,
          mode,
          location: location.trim(),
          daysPerWeek: daysPerWeek.trim(),
          monthlyFee: Number(monthlyFee),
          description: description.trim(),
          bannerImage: bannerImageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setLimitReached(true);
        }
        toast.add({
          title: "Could not publish tuition",
          description: data?.message || "Failed to create tuition listing.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Tuition Submitted!",
        description:
          "Your tuition is now pending admin approval before appearing publicly.",
        type: "success",
      });

      router.push("/dashboard/tutor/my-tuitions");
    } catch (err) {
      setUploadingImage(false);
      toast.add({
        title: "Submission Error",
        description:
          err instanceof Error ? err.message : "Something went wrong.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/dashboard/tutor/my-tuitions"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#5b6b64] hover:text-[#12211c]"
          >
            <ArrowLeft className="size-3.5" />
            Back to My Tuitions
          </Link>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#12211c]">
            Post a New Tuition Batch
          </h1>
          <p className="mt-1 text-[13px] text-[#5b6b64]">
            Fill in your batch schedule, subject details, and banner image for
            admin review.
          </p>
        </div>
      </div>

      {/* Free Plan Limit Alert */}
      {limitReached ? (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div>
              <h3 className="text-[14px] font-semibold text-amber-950">
                Free Plan Limit Reached (2/2 Posts)
              </h3>
              <p className="mt-0.5 text-[12px] text-amber-800">
                Upgrade to MentorLagbe Pro ($15) to publish unlimited tuition
                batches and earn a verified Pro badge.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-[#0f7a5a] px-4 text-[12px] font-semibold text-white hover:bg-[#0c654b]"
          >
            Upgrade to Pro
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#d7e6de] bg-[#eef7f2] px-4 py-3 text-[12px] text-[#0f513f]">
          <Info className="size-4 shrink-0 text-[#0f7a5a]" />
          <span>
            Free Tutor accounts can post up to <strong>2 tuitions</strong>. All
            new posts start with <strong>Pending</strong> status until approved
            by an Admin.
          </span>
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-[#e3eae5] bg-white p-6 shadow-xs sm:p-8"
      >
        {/* Tuition Title */}
        <div>
          <label
            htmlFor="tuition-title"
            className="block text-[12px] font-semibold text-[#12211c]"
          >
            Tuition Title *
          </label>
          <Input
            id="tuition-title"
            placeholder="e.g. HSC Physics & Higher Math Intensive Batch"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 h-11 rounded-xl border-[#dce5df] bg-[#fbfaf7] text-[13px] focus-visible:border-[#0f7a5a] focus-visible:bg-white"
          />
        </div>

        {/* Subject & Class Level */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="tuition-subject"
              className="block text-[12px] font-semibold text-[#12211c]"
            >
              Subject *
            </label>
            <select
              id="tuition-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#dce5df] bg-[#fbfaf7] px-3 text-[13px] text-[#12211c] outline-none focus:border-[#0f7a5a] focus:bg-white"
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tuition-class"
              className="block text-[12px] font-semibold text-[#12211c]"
            >
              Class Level *
            </label>
            <select
              id="tuition-class"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#dce5df] bg-[#fbfaf7] px-3 text-[13px] text-[#12211c] outline-none focus:border-[#0f7a5a] focus:bg-white"
            >
              {CLASS_LEVEL_OPTIONS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mode & Location */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="tuition-mode"
              className="block text-[12px] font-semibold text-[#12211c]"
            >
              Teaching Mode *
            </label>
            <select
              id="tuition-mode"
              value={mode}
              onChange={(e) => {
                const nextMode = e.target.value as "Offline" | "Online";
                setMode(nextMode);
                if (nextMode === "Online" && !location) {
                  setLocation("Online (Zoom)");
                }
              }}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#dce5df] bg-[#fbfaf7] px-3 text-[13px] text-[#12211c] outline-none focus:border-[#0f7a5a] focus:bg-white"
            >
              <option value="Offline">Offline (In-Person)</option>
              <option value="Online">Online (Live Session)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="tuition-location"
              className="block text-[12px] font-semibold text-[#12211c]"
            >
              {mode === "Online" ? "Online Platform *" : "Location / Area *"}
            </label>
            <Input
              id="tuition-location"
              placeholder={
                mode === "Online"
                  ? "e.g. Online (Zoom / Google Meet)"
                  : "e.g. Dhanmondi, Dhaka"
              }
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1.5 h-11 rounded-xl border-[#dce5df] bg-[#fbfaf7] text-[13px] focus-visible:border-[#0f7a5a] focus-visible:bg-white"
            />
          </div>
        </div>

        {/* Monthly Fee & Days/Week */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="tuition-fee"
              className="block text-[12px] font-semibold text-[#12211c]"
            >
              Monthly Fee (BDT ৳) *
            </label>
            <Input
              id="tuition-fee"
              type="number"
              min={100}
              placeholder="e.g. 5000"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              className="mt-1.5 h-11 rounded-xl border-[#dce5df] bg-[#fbfaf7] text-[13px] focus-visible:border-[#0f7a5a] focus-visible:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="tuition-days"
              className="block text-[12px] font-semibold text-[#12211c]"
            >
              Days / Week *
            </label>
            <Input
              id="tuition-days"
              placeholder="e.g. 3 days/week"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              className="mt-1.5 h-11 rounded-xl border-[#dce5df] bg-[#fbfaf7] text-[13px] focus-visible:border-[#0f7a5a] focus-visible:bg-white"
            />
          </div>
        </div>

        {/* Banner Image File Upload (ImgBB) */}
        <div>
          <span className="block text-[12px] font-semibold text-[#12211c]">
            Banner Image (Direct Upload via ImgBB) *
          </span>

          {imagePreview ? (
            <div className="relative mt-2 overflow-hidden rounded-2xl border border-[#dce5df] bg-[#fbfaf7]">
              <img
                src={imagePreview}
                alt="Selected banner preview"
                className="h-52 w-full object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                aria-label="Remove selected image"
                className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X className="size-4" />
              </button>
              <div className="flex items-center justify-between bg-white px-4 py-2 text-[12px] text-[#5b6b64]">
                <span className="truncate font-medium">{imageFile?.name}</span>
                <span className="inline-flex items-center gap-1 text-[#0f7a5a]">
                  <CheckCircle2 className="size-3.5" />
                  Ready to upload
                </span>
              </div>
            </div>
          ) : (
            <label
              htmlFor="tuition-banner-file"
              className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cfe0d7] bg-[#fbfaf7] px-6 py-8 text-center transition-colors hover:border-[#0f7a5a] hover:bg-[#eef7f2]/50"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-[#e8f3ee] text-[#0f7a5a]">
                <ImagePlus className="size-5" />
              </span>
              <span className="mt-3 text-[13px] font-semibold text-[#12211c]">
                Click to select a banner image
              </span>
              <span className="mt-1 text-[11px] text-[#64748b]">
                PNG, JPG, or WEBP up to 5MB (16:10 landscape recommended)
              </span>
              <input
                id="tuition-banner-file"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="tuition-desc"
            className="block text-[12px] font-semibold text-[#12211c]"
          >
            Course & Batch Description *
          </label>
          <textarea
            id="tuition-desc"
            rows={4}
            placeholder="Describe your teaching methodology, syllabus coverage, weekly tests, and target students..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#dce5df] bg-[#fbfaf7] p-3.5 text-[13px] text-[#12211c] outline-none focus:border-[#0f7a5a] focus:bg-white"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/tutor/my-tuitions"
            className="inline-flex h-11 items-center rounded-xl border border-[#dce5df] px-5 text-[13px] font-medium text-[#475569] hover:bg-[#f8faf9]"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-xl bg-[#0f7a5a] px-6 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {uploadingImage ? "Uploading Banner..." : "Publishing..."}
              </>
            ) : (
              "Publish Tuition Post"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}