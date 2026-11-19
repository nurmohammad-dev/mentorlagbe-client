import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const HIGHLIGHTS = [
  "Verified subject mentors across HSC, SSC, IELTS & Programming",
  "Dedicated role-based dashboards for Students, Tutors & Admins",
  "Transparent free starter access with instant Stripe Pro upgrades",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-12 bg-[#fbfaf7] text-[#12211c]">
      {/* Left Brand & Trust Panel (Desktop) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#10201b] p-10 text-white lg:col-span-5 lg:flex xl:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#0f7a5a]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-[#0f7a5a]/20 blur-3xl"
        />

        {/* Brand Logo (Same style & size as Navbar) */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7a5a]"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-[#0f7a5a] text-white">
              <GraduationCap className="size-[18px]" strokeWidth={2.2} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              MentorLagbe
            </span>
          </Link>
        </div>

        {/* Center Editorial Copy */}
        <div className="relative z-10 my-auto py-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6ee7b7]">
            <ShieldCheck className="size-3.5" />
            Smart Mentorship Ecosystem
          </span>

          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Structured learning built around your academic goals.
          </h2>

          <p className="mt-4 text-[14px] leading-relaxed text-[#a7bbb4]">
            Connect directly with verified educators or publish your own
            subject batches with real-time application tracking.
          </p>

          <ul className="mt-8 space-y-3.5 text-[13px] text-[#d5e0dc]">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#34b38a]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Stats Footer */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
          <div>
            <p className="text-xl font-bold text-white">2,500+</p>
            <p className="text-[11px] text-[#9cb0a9]">Verified Tutors</p>
          </div>
          <div>
            <p className="text-xl font-bold text-white">15,000+</p>
            <p className="text-[11px] text-[#9cb0a9]">Active Learners</p>
          </div>
          <div>
            <p className="text-xl font-bold text-white">98%</p>
            <p className="text-[11px] text-[#9cb0a9]">Match Success</p>
          </div>
        </div>
      </aside>

      {/* Right Form Container */}
      <div className="flex flex-col justify-between px-4 py-6 sm:px-8 lg:col-span-7 lg:py-10">
        {/* Top Bar */}
        <div className="mx-auto flex w-full max-w-md items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5b6b64] transition-colors hover:text-[#12211c]"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>

          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#0f7a5a] text-white">
              <GraduationCap className="size-[18px]" strokeWidth={2.2} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[#12211c]">
              MentorLagbe
            </span>
          </Link>
        </div>

        {/* Page Content */}
        <div className="mx-auto my-auto w-full max-w-md py-8">{children}</div>

        {/* Subtle Copyright */}
        <p className="text-center text-[11px] text-[#8a9a93]">
          © {new Date().getFullYear()} MentorLagbe. Protected with BetterAuth &
          JWT.
        </p>
      </div>
    </div>
  );
}