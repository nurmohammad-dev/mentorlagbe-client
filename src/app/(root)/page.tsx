import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Compass,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
} from "lucide-react";

import Hero from "@/components/shared/Hero";
import TuitionCard, { TuitionItem } from "@/components/shared/TuitionCard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getFeaturedTuitions(): Promise<TuitionItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tuitions?limit=6`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.tuitions) ? data.tuitions : [];
  } catch {
    return [];
  }
}

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Create Your Role Account",
    description:
      "Sign up as a Student seeking mentorship or as a Tutor ready to teach structured batches.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Filter Verified Listings",
    description:
      "Browse admin-approved tuitions filtered by subject, class level, schedule, and online or offline mode.",
    icon: Compass,
  },
  {
    step: "03",
    title: "Apply & Confirm Schedule",
    description:
      "Students submit learning goals in one click while tutors review and accept applications from their dashboard.",
    icon: BookOpenCheck,
  },
  {
    step: "04",
    title: "Learn With Confidence",
    description:
      "Start structured sessions with transparent monthly fees and optional Pro upgrades for unlimited reach.",
    icon: ShieldCheck,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Finding an HSC Physics mentor in Dhanmondi used to take weeks. On MentorLagbe I compared schedules and got accepted within a day.",
    name: "Nafis Rahman",
    role: "HSC Science Candidate",
    initials: "NR",
  },
  {
    quote:
      "The tutor dashboard keeps all my batch postings and student requests organized in one place without messy phone calls.",
    name: "Sadia Afrin",
    role: "Mathematics & ICT Tutor",
    initials: "SA",
  },
  {
    quote:
      "I joined an online IELTS writing batch through MentorLagbe and improved my band score from 6.0 to 7.5 in six weeks.",
    name: "Tahmid Hasan",
    role: "University Applicant",
    initials: "TH",
  },
];

export default async function HomePage() {
  const featuredTuitions = await getFeaturedTuitions();

  return (
    <div>
      {/* 1. Hero / Banner Section */}
      <Hero />

      {/* 2. Dynamic Featured Tuitions Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ee] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f513f]">
              Verified Opportunities
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#12211c] sm:text-3xl">
              Featured Approved Tuitions
            </h2>
            <p className="mt-2 max-w-xl text-[14px] text-[#5b6b64]">
              Explore recently approved home and online tuition batches curated
              for focused academic progress.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0f7a5a] transition-colors hover:text-[#0c654b]"
          >
            Explore All Tuitions
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {featuredTuitions.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTuitions.map((tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-[#cfe0d7] bg-white p-12 text-center">
            <p className="text-[15px] font-medium text-[#12211c]">
              No approved tuitions available right now.
            </p>
            <p className="mt-1 text-[13px] text-[#64748b]">
              Start your backend server or seed sample tuitions from the Admin
              dashboard to see live listings here.
            </p>
            <Link
              href="/tuitions"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-[#0f7a5a] px-5 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
            >
              Go to Browse Tuitions
              <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </section>

      {/* 3. How MentorLagbe Works Section */}
      <section className="border-y border-[#e7ece8] bg-white py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ee] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f513f]">
              Simple Workflow
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#12211c] sm:text-3xl">
              How MentorLagbe Works
            </h2>
            <p className="mt-2.5 text-[14px] text-[#5b6b64]">
              A transparent four-step process built for both learners and
              educators.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="flex h-full flex-col rounded-2xl border border-[#e6ece8] bg-[#fbfaf7] p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#0f7a5a] text-white">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-mono text-[13px] font-semibold text-[#8a9a93]">
                      STEP {item.step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[16px] font-semibold text-[#12211c]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#5b6b64]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Pricing / Subscription Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ee] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f513f]">
            Flexible Membership
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#12211c] sm:text-3xl">
            Start Free, Upgrade When You Grow
          </h2>
          <p className="mt-2.5 text-[14px] text-[#5b6b64]">
            Transparent plans powered by Stripe for dedicated students and
            full-time mentors.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Starter Free Plan */}
          <div className="flex h-full flex-col rounded-2xl border border-[#e3eae5] bg-white p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#12211c]">
                Starter Plan
              </h3>
              <span className="rounded-full bg-[#f1f5f3] px-3 py-1 text-[11px] font-semibold text-[#475569]">
                Free Forever
              </span>
            </div>
            <p className="mt-2 text-[13px] text-[#64748b]">
              Ideal for getting started with tuition discovery and initial
              batches.
            </p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#12211c]">$0</span>
              <span className="text-[13px] text-[#64748b]">/ forever</span>
            </div>

            <ul className="mt-6 space-y-3 text-[13px] text-[#475569]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-[#0f7a5a]" />
                Up to 2 active tuition posts for Tutors
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-[#0f7a5a]" />
                Up to 5 tuition applications for Students
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-[#0f7a5a]" />
                Full search, subject filters & dashboard tracking
              </li>
            </ul>

            <Link
              href="/signup"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#cfd9d3] bg-white text-[13px] font-semibold text-[#12211c] transition-colors hover:bg-[#f4f8f6]"
            >
              Get Started Free
            </Link>
          </div>

          {/* MentorLagbe Pro Plan */}
          <div className="relative flex h-full flex-col rounded-2xl border-2 border-[#0f7a5a] bg-[#10201b] p-7 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-semibold">MentorLagbe Pro</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0f7a5a] px-3 py-1 text-[11px] font-semibold text-white">
                <Sparkles className="size-3" />
                Pro Access
              </span>
            </div>
            <p className="mt-2 text-[13px] text-[#a7bbb4]">
              Unlock unlimited tuition posts, priority applications, and
              verified Pro status.
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <div>
                <span className="text-3xl font-bold">$10</span>
                <span className="text-[12px] text-[#a7bbb4]"> / Student</span>
              </div>
              <span className="text-[#4a635b]">•</span>
              <div>
                <span className="text-3xl font-bold">$15</span>
                <span className="text-[12px] text-[#a7bbb4]"> / Tutor</span>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-[13px] text-[#d5e0dc]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-[#34b38a]" />
                Unlimited tuition posts & student applications
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-[#34b38a]" />
                Verified Pro badge across profile & listings
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-[#34b38a]" />
                Instant activation via secure Stripe Checkout
              </li>
            </ul>

            <Link
              href="/pricing"
              className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white transition-colors hover:bg-[#13916b]"
            >
              Subscribe with Stripe
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Testimonials & Final CTA Section */}
      <section className="border-t border-[#e7ece8] bg-white py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ee] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f513f]">
              Community Stories
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#12211c] sm:text-3xl">
              Trusted by Students & Mentors
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.name}
                className="flex h-full flex-col justify-between rounded-2xl border border-[#e6ece8] bg-[#fbfaf7] p-6"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-[#475569]">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-[#e8edea] pt-4">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#0f7a5a] text-[11px] font-semibold text-white">
                    {item.initials}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#12211c]">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#64748b]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#eef7f2] px-6 py-12 text-center sm:px-12 lg:flex-row lg:text-left">
            <div className="max-w-xl">
              <h3 className="text-2xl font-semibold tracking-tight text-[#12211c]">
                Ready to start learning or teaching?
              </h3>
              <p className="mt-2 text-[14px] text-[#5b6b64]">
                Join MentorLagbe today to connect with verified tutors or publish
                your own academic batch.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0f7a5a] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#0c654b]"
              >
                Create Free Account
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/tuitions"
                className="inline-flex h-11 items-center rounded-full border border-[#c7dad0] bg-white px-6 text-[13px] font-semibold text-[#12211c] transition-colors hover:bg-[#f8fbf9]"
              >
                Browse Tuitions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}