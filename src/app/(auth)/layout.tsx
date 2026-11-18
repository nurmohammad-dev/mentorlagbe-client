import Link from "next/link";
import type { ReactNode } from "react";
import { Check, GraduationCap } from "lucide-react";

const POINTS = [
  "Verified tutors, reviewed before they appear on the platform",
  "Online or in person, anywhere across Bangladesh",
  "Browse for free — pay only for the sessions you book",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#fbfaf7]">
      <aside className="relative hidden w-[44%] max-w-xl flex-col justify-between overflow-hidden bg-[#0f513f] p-10 text-white lg:flex xl:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-white/5"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 size-96 rounded-full bg-white/5"
        />

        <Link
          href="/"
          className="relative flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-white text-[#0f513f]">
            <GraduationCap className="size-5" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="text-[16px] font-semibold tracking-tight">MentorLagbe</span>
        </Link>

        <div className="relative">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">
            Mentorship that fits
          </p>
          <h2 className="mt-3 max-w-sm text-3xl leading-tight font-semibold tracking-tight xl:text-4xl">
            A better way to find your next tutor.
          </h2>

          <ul className="mt-8 space-y-3.5">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[13px] text-white/80">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[12px] text-white/50">
          © {new Date().getFullYear()} MentorLagbe
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-6 flex justify-center lg:hidden">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-[#0f7a5a]/40 focus-visible:outline-none"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-[#0f7a5a] text-white">
                <GraduationCap className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-[#12211c]">
                MentorLagbe
              </span>
            </Link>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
