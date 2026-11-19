import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing & Plans", href: "/pricing" },
  { label: "About MentorLagbe", href: "/about" },
];

const SUBJECT_LINKS = [
  { label: "Mathematics", href: "/tuitions?q=Mathematics" },
  { label: "Physics & Chemistry", href: "/tuitions?q=Physics" },
  { label: "English & IELTS", href: "/tuitions?q=IELTS" },
  { label: "Programming & ICT", href: "/tuitions?q=ICT" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#e4ece7] bg-[#10201b] text-[#d5e0dc]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column (same logo style & size as Navbar) */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7a5a]"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-[#0f7a5a] text-white">
                <GraduationCap
                  className="size-[18px]"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                MentorLagbe
              </span>
            </Link>

            <p className="text-[13px] leading-relaxed text-[#9cb0a9]">
              Connecting students across Bangladesh with verified subject
              mentors for structured 1-on-1 and small-batch learning.
            </p>

            {/* Social Links with new X logo */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow MentorLagbe on X"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#d5e0dc] transition-colors hover:border-[#0f7a5a] hover:bg-[#0f7a5a] hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow MentorLagbe on Facebook"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#d5e0dc] transition-colors hover:border-[#0f7a5a] hover:bg-[#0f7a5a] hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow MentorLagbe on LinkedIn"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#d5e0dc] transition-colors hover:border-[#0f7a5a] hover:bg-[#0f7a5a] hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#9cb0a9]">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tracks */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
              Popular Subjects
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#9cb0a9]">
              {SUBJECT_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
              Contact Info
            </h3>
            <ul className="mt-4 space-y-3 text-[13px] text-[#9cb0a9]">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#34b38a]" />
                <span>support@mentorlagbe.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-[#34b38a]" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#34b38a]" />
                <span>Dhanmondi, Dhaka 1209, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[12px] text-[#839991] sm:flex-row">
          <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white">
              About
            </Link>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/tuitions" className="hover:text-white">
              Browse Tuitions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}