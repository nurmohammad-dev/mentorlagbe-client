import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  ShieldCheck,
  Users,
} from "lucide-react";

const PILLARS = [
  {
    title: "Admin-Verified Listings",
    description:
      "Every tuition post submitted by a tutor is reviewed by platform administrators before becoming visible to students.",
    icon: ShieldCheck,
  },
  {
    title: "Structured Role Workflows",
    description:
      "Dedicated dashboards empower students to track applications, tutors to manage batches, and admins to oversee quality.",
    icon: Users,
  },
  {
    title: "Transparent Fees & Schedules",
    description:
      "Clear monthly tuition rates, days per week, and online/offline mode filters eliminate guesswork.",
    icon: BookOpenCheck,
  },
  {
    title: "Scalable Pro Membership",
    description:
      "Free starter tiers make learning accessible to everyone, while Stripe-powered Pro plans support high-volume mentors.",
    icon: Award,
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center rounded-full bg-[#e8f3ee] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f513f]">
          About MentorLagbe
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#12211c] sm:text-4xl">
          Bridging Dedicated Mentors & Ambitious Learners
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[#5b6b64]">
          MentorLagbe is a smart tuition and mentorship platform designed to
          help students across Bangladesh discover verified subject tutors for
          1-on-1 guidance and structured academic batches.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {PILLARS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[#e3eae5] bg-white p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#0f7a5a]">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-[17px] font-semibold text-[#12211c]">
                {item.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#5b6b64]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#10201b] p-8 text-center text-white sm:px-12 lg:flex-row lg:text-left">
        <div>
          <h2 className="text-2xl font-semibold">
            Explore Verified Tuitions Today
          </h2>
          <p className="mt-1.5 text-[13px] text-[#a7bbb4]">
            Browse active batches across Mathematics, Physics, English, IELTS,
            and Programming.
          </p>
        </div>
        <Link
          href="/tuitions"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#0f7a5a] px-6 text-[13px] font-semibold text-white hover:bg-[#13916b]"
        >
          Browse Tuitions
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}