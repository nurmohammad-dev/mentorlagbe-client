"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbfaf7] px-4 py-16 text-center text-[#12211c]">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <AlertTriangle className="size-7" />
      </span>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
        Something went wrong
      </h1>

      <p className="mt-2.5 max-w-md text-[13px] leading-relaxed text-[#5b6b64]">
        An unexpected error occurred while loading this view. You can retry the
        action or return to the homepage.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0f7a5a] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#0c654b]"
        >
          <RotateCcw className="size-4" />
          Try Again
        </button>

        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#cfd9d3] bg-white px-6 text-[13px] font-semibold text-[#12211c] transition-colors hover:bg-[#eef5f1]"
        >
          <Home className="size-4 text-[#0f7a5a]" />
          Go Home
        </Link>
      </div>
    </div>
  );
}