import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Calculator,
  GraduationCap,
  Languages,
  Search,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUBJECTS = [
  {
    label: "Mathematics",
    tutors: "410 tutors",
    href: "/tuitions?q=mathematics",
    icon: Calculator,
  },
  {
    label: "Physics",
    tutors: "235 tutors",
    href: "/tuitions?q=physics",
    icon: Atom,
  },
  {
    label: "English",
    tutors: "320 tutors",
    href: "/tuitions?q=english",
    icon: Languages,
  },
  {
    label: "IELTS",
    tutors: "180 tutors",
    href: "/tuitions?q=ielts",
    icon: GraduationCap,
  },
];

const POPULAR = ["Class 9–10 Math", "HSC Physics", "IELTS Writing", "Spoken English"];

const STATS = [
  { value: "2,500+", label: "Verified tutors" },
  { value: "15,000+", label: "Active students" },
  { value: "98%", label: "Satisfaction rate" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#e9e4d9] bg-[#fbfaf7]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#d9efe5_0%,_transparent_55%)] opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,#e7e2d6_1px,transparent_1px),linear-gradient(to_bottom,#e7e2d6_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe6db] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f513f]">
          <Sparkles className="size-3.5" aria-hidden="true" />
          One-on-one mentorship
        </span>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-[#12211c] sm:text-5xl lg:text-6xl">
          Find a tutor who{" "}
          <span className=" text-[#0f7a5a]">
            makes it click
          </span>
          .
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-[#5b6b64] sm:text-base">
          Personalised lessons in Mathematics, Physics, English, and IELTS from
          verified tutors across Bangladesh — online or in person, on a schedule
          that fits your life.
        </p>

        <form action="/tuitions" className="mx-auto mt-8 w-full max-w-xl">
          <div className="flex items-center gap-2 rounded-2xl border border-[#e2e8e3] bg-white p-2 shadow-[0_24px_48px_-32px_rgba(15,122,90,0.55)]">
            <Search className="ml-2 size-4 shrink-0 text-[#8a9a93]" aria-hidden="true" />
            <label htmlFor="hero-search" className="sr-only">
              Search for a subject, class, or exam
            </label>
            <Input
              id="hero-search"
              name="q"
              type="search"
              placeholder="Subject, class, or exam…"
              className="h-10 flex-1 border-0 bg-transparent px-0 text-[14px] shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              className="h-10 shrink-0 rounded-xl bg-[#0f7a5a] px-4 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
            >
              Search
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[12px]">
            <span className="text-[#8a9a93]">Popular:</span>
            {POPULAR.map((term) => (
              <Link
                key={term}
                href={`/tuitions?q=${encodeURIComponent(term)}`}
                className="rounded-full bg-white/70 px-2.5 py-1 text-[#475569] transition-colors hover:bg-white hover:text-[#0f7a5a]"
              >
                {term}
              </Link>
            ))}
          </div>
        </form>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 text-left sm:grid-cols-4">
          {SUBJECTS.map((subject) => {
            const Icon = subject.icon;

            return (
              <Link
                key={subject.label}
                href={subject.href}
                className="group flex items-center gap-3 rounded-2xl border border-[#e6ebe6] bg-white/80 p-4 transition-all hover:-translate-y-0.5 hover:border-[#0f7a5a]/40 hover:bg-white hover:shadow-sm"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef7f2] text-[#0f7a5a]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold text-[#12211c]">
                    {subject.label}
                  </span>
                  <span className="block text-[11px] text-[#8a9a93]">{subject.tutors}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <dl className="mx-auto mt-12 flex max-w-2xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-0 sm:divide-x sm:divide-[#e2e8e3]">
          {STATS.map((stat) => (
            <div key={stat.label} className="w-full px-8 text-center sm:w-auto">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-2xl font-semibold tracking-tight text-[#12211c]">
                  {stat.value}
                </span>
                <span className="mt-0.5 block text-[12px] text-[#7b8b84]">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
