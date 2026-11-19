import Link from "next/link";
import { ArrowLeft, Compass, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbfaf7] px-4 py-16 text-center text-[#12211c]">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0f513f]">
        <Compass className="size-3.5" />
        404 • Page Not Found
      </span>

      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
        We couldn&apos;t find that page.
      </h1>

      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[#5b6b64]">
        The tuition listing or route you are looking for may have been moved,
        removed, or never existed.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0f7a5a] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#0c654b]"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <Link
          href="/tuitions"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#cfd9d3] bg-white px-6 text-[13px] font-semibold text-[#12211c] transition-colors hover:bg-[#eef5f1]"
        >
          <Search className="size-4 text-[#0f7a5a]" />
          Browse Tuitions
        </Link>
      </div>
    </div>
  );
}