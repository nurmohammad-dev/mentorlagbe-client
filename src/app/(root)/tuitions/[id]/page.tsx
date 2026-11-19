"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Globe,
  GraduationCap,
  Info,
  Loader2,
  Mail,
  MapPin,
  Send,
  ShieldAlert,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { API_BASE_URL, authFetch } from "@/lib/auth-fetch";

interface TuitionDetails {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  daysPerWeek?: string;
  schedule?: string;
  monthlyFee: number;
  description?: string;
  bannerImage?: string;
  image?: string;
  tutorName: string;
  tutorEmail: string;
  isActive?: boolean;
  createdAt?: string;
}

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";

export default function TuitionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;
  const userRole = (user as { role?: string } | undefined)?.role || "student";

  const [tuition, setTuition] = useState<TuitionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Apply Modal States
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [studentPhone, setStudentPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [submittingApp, setSubmittingApp] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchTuitionDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/tuitions/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          setTuition(null);
          return;
        }
        const data = await res.json();
        setTuition(data);
      } catch {
        setTuition(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTuitionDetails();
  }, [id]);

  // Check if logged-in student has already applied to this tuition
  useEffect(() => {
    if (!user || userRole !== "student" || !id) return;

    const checkExistingApplication = async () => {
      try {
        const res = await authFetch("/api/applications/my-applications");
        if (!res.ok) return;
        const apps = await res.json();
        if (Array.isArray(apps)) {
          const exists = apps.some((a) => a.tuitionId === id);
          setAlreadyApplied(exists);
        }
      } catch {
        // Ignore silent check errors
      }
    };

    checkExistingApplication();
  }, [user, userRole, id]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tuition) return;

    if (!studentPhone.trim() || studentPhone.trim().length < 8) {
      toast.add({
        title: "Phone Number Required",
        description: "Please enter a valid contact phone number.",
        type: "error",
      });
      return;
    }

    if (!preferredSchedule.trim()) {
      toast.add({
        title: "Preferred Schedule Required",
        description: "Please mention your available days or time slot.",
        type: "error",
      });
      return;
    }

    setSubmittingApp(true);
    setLimitReached(false);

    try {
      const res = await authFetch("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          tuitionId: tuition._id,
          studentPhone: studentPhone.trim(),
          preferredSchedule: preferredSchedule.trim(),
          studentNote: studentNote.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setLimitReached(true);
        }
        toast.add({
          title: "Application Failed",
          description: data?.message || "Could not submit your application.",
          type: "error",
        });
        return;
      }

      setAlreadyApplied(true);
      setApplyModalOpen(false);
      toast.add({
        title: "Application Submitted!",
        description:
          "Your enrollment request has been sent to the tutor for review.",
        type: "success",
      });
    } catch {
      toast.add({
        title: "Network Error",
        description: "Unable to submit application right now.",
        type: "error",
      });
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-[#0f7a5a]" />
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-[#12211c]">
          Tuition Listing Not Found
        </h1>
        <p className="mt-2 text-[14px] text-[#5b6b64]">
          This tuition post may have been removed or is no longer available.
        </p>
        <Link
          href="/tuitions"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f7a5a] px-5 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
        >
          <ArrowLeft className="size-4" />
          Back to Browse Tuitions
        </Link>
      </div>
    );
  }

  const rawBanner = tuition.bannerImage || tuition.image || "";
  const banner = rawBanner.startsWith("https://") ? rawBanner : FALLBACK_BANNER;
  const isOnline = tuition.mode?.toLowerCase() === "online";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/tuitions"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5b6b64] transition-colors hover:text-[#12211c]"
      >
        <ArrowLeft className="size-4" />
        Back to Browse Tuitions
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        {/* Main Left Content */}
        <div className="space-y-6 lg:col-span-8">
          {/* Banner */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-[#e3eae5] bg-[#eef5f1]">
            <Image
              src={banner}
              alt={tuition.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </div>

          {/* Title & Badges */}
          <div className="rounded-3xl border border-[#e3eae5] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-[#e8f3ee] px-3 py-1 text-[12px] font-semibold text-[#0f513f]">
                {tuition.subject}
              </span>
              <span className="rounded-lg bg-[#f1f5f3] px-3 py-1 text-[12px] font-medium text-[#475569]">
                {tuition.classLevel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#12211c] px-3 py-1 text-[12px] font-medium text-white">
                {isOnline ? (
                  <Globe className="size-3.5 text-[#4ade80]" />
                ) : (
                  <MapPin className="size-3.5 text-[#4ade80]" />
                )}
                {tuition.mode}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-[#12211c] sm:text-3xl">
              {tuition.title}
            </h1>

            {/* Key Facts Grid */}
            <div className="mt-6 grid gap-4 rounded-2xl border border-[#eef2ef] bg-[#fbfaf7] p-4 sm:grid-cols-3">
              <div>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <MapPin className="size-3.5 text-[#0f7a5a]" />
                  Location / Platform
                </span>
                <p className="mt-1 text-[13px] font-semibold text-[#12211c]">
                  {tuition.location}
                </p>
              </div>

              <div>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <CalendarDays className="size-3.5 text-[#0f7a5a]" />
                  Weekly Schedule
                </span>
                <p className="mt-1 text-[13px] font-semibold text-[#12211c]">
                  {tuition.daysPerWeek || tuition.schedule || "3 days/week"}
                </p>
              </div>

              <div>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <BookOpen className="size-3.5 text-[#0f7a5a]" />
                  Academic Level
                </span>
                <p className="mt-1 text-[13px] font-semibold text-[#12211c]">
                  {tuition.classLevel}
                </p>
              </div>
            </div>

            {/* Course Description */}
            <div className="mt-7">
              <h2 className="text-[16px] font-semibold text-[#12211c]">
                About This Tuition Batch
              </h2>
              <p className="mt-2.5 whitespace-pre-line text-[14px] leading-relaxed text-[#475569]">
                {tuition.description ||
                  "Structured academic mentorship covering core syllabus concepts, regular problem-solving sessions, and exam preparation."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Sticky Booking & Tutor Sidebar */}
        <aside className="space-y-6 lg:col-span-4">
          <div className="sticky top-24 rounded-3xl border border-[#e3eae5] bg-white p-6 shadow-xs">
            <div className="border-b border-[#eef2ef] pb-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                Monthly Tuition Fee
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#12211c]">
                  ৳{Number(tuition.monthlyFee).toLocaleString()}
                </span>
                <span className="text-[13px] text-[#64748b]">/ month</span>
              </div>
            </div>

            {/* Tutor Summary */}
            <div className="py-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                Mentor Information
              </span>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0f7a5a] text-[14px] font-semibold text-white">
                  {tuition.tutorName?.charAt(0).toUpperCase() || "T"}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#12211c]">
                    {tuition.tutorName}
                  </p>
                  <p className="flex items-center gap-1 truncate text-[12px] text-[#64748b]">
                    <Mail className="size-3 shrink-0 text-[#0f7a5a]" />
                    {tuition.tutorEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Role-Restricted Application Action */}
            <div className="border-t border-[#eef2ef] pt-5">
              {sessionLoading ? (
                <div className="h-11 w-full animate-pulse rounded-xl bg-gray-100" />
              ) : !user ? (
                <div className="space-y-3">
                  <Link
                    href="/signin"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white transition-colors hover:bg-[#0c654b]"
                  >
                    Sign In as Student to Apply
                  </Link>
                  <p className="text-center text-[11px] text-[#64748b]">
                    Need an account?{" "}
                    <Link
                      href="/signup"
                      className="font-semibold text-[#0f7a5a] hover:underline"
                    >
                      Register free
                    </Link>
                  </p>
                </div>
              ) : userRole !== "student" ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled
                    className="h-11 w-full cursor-not-allowed rounded-xl bg-gray-100 text-[13px] font-semibold text-gray-400"
                  >
                    Apply Now (Students Only)
                  </button>
                  <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-900">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
                    <span>
                      You are signed in as{" "}
                      <strong className="capitalize">{userRole}</strong>. Only
                      Student accounts can apply for tuitions.
                    </span>
                  </div>
                </div>
              ) : alreadyApplied ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-[13px] font-semibold text-emerald-800">
                    <CheckCircle2 className="size-4" />
                    Application Submitted
                  </div>
                  <Link
                    href="/dashboard/student/my-applications"
                    className="block text-center text-[12px] font-semibold text-[#0f7a5a] hover:underline"
                  >
                    Track status in My Applications →
                  </Link>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => setApplyModalOpen(true)}
                  className="h-11 w-full rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]"
                >
                  <GraduationCap className="size-4" />
                  Apply for This Tuition
                </Button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Student Apply Modal */}
      {applyModalOpen && user && userRole === "student" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-7">
            <div className="flex items-center justify-between border-b border-[#eef2ef] pb-3.5">
              <div>
                <h2 className="text-[17px] font-semibold text-[#12211c]">
                  Apply for Tuition
                </h2>
                <p className="text-[12px] text-[#64748b]">{tuition.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="rounded-lg p-1.5 text-[#64748b] hover:bg-gray-100"
              >
                <X className="size-4" />
              </button>
            </div>

            {limitReached ? (
              <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-[12px] text-amber-900">
                <p className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="size-4 text-amber-600" />
                  Free Plan Limit Reached (5/5 Applications)
                </p>
                <p className="mt-1">
                  Upgrade to Student Pro ($10) for unlimited tuition
                  applications.
                </p>
                <Button
                  type="button"
                  onClick={() => router.push("/pricing")}
                  className="mt-3 h-9 rounded-xl bg-[#0f7a5a] px-4 text-[12px] font-semibold text-white"
                >
                  View Pro Plans
                </Button>
              </div>
            ) : null}

            <form onSubmit={handleApplySubmit} className="mt-4 space-y-4">
              {/* Read-only Student Info */}
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#fbfaf7] p-3 text-[12px]">
                <div>
                  <span className="text-[#64748b]">Applicant</span>
                  <p className="truncate font-semibold text-[#12211c]">
                    {user.name}
                  </p>
                </div>
                <div>
                  <span className="text-[#64748b]">Email</span>
                  <p className="truncate font-semibold text-[#12211c]">
                    {user.email}
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="apply-phone"
                  className="block text-[12px] font-semibold text-[#12211c]"
                >
                  Contact Phone Number *
                </label>
                <Input
                  id="apply-phone"
                  type="tel"
                  placeholder="e.g. +880 1712-345678"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl border-[#dce5df] bg-[#fbfaf7] text-[13px]"
                />
              </div>

              <div>
                <label
                  htmlFor="apply-schedule"
                  className="block text-[12px] font-semibold text-[#12211c]"
                >
                  Preferred Schedule *
                </label>
                <Input
                  id="apply-schedule"
                  placeholder="e.g. Sat, Mon, Wed (5:00 PM - 6:30 PM)"
                  value={preferredSchedule}
                  onChange={(e) => setPreferredSchedule(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl border-[#dce5df] bg-[#fbfaf7] text-[13px]"
                />
              </div>

              <div>
                <label
                  htmlFor="apply-note"
                  className="block text-[12px] font-semibold text-[#12211c]"
                >
                  Learning Goals / Note to Tutor
                </label>
                <textarea
                  id="apply-note"
                  rows={3}
                  placeholder="Share your current class, weak topics, or learning objectives..."
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#dce5df] bg-[#fbfaf7] p-3 text-[13px] outline-none focus:border-[#0f7a5a]"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                <Info className="size-3.5 shrink-0 text-[#0f7a5a]" />
                <span>
                  Your application will be sent to {tuition.tutorName} with
                  Pending status.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setApplyModalOpen(false)}
                  className="h-10 rounded-xl text-[13px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingApp}
                  className="h-10 rounded-xl bg-[#0f7a5a] px-5 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
                >
                  {submittingApp ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}