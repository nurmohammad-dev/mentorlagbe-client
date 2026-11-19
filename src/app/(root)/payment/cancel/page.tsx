import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <div className="rounded-3xl border border-[#e3eae5] bg-white p-8 text-center shadow-xs">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <XCircle className="size-8" />
        </span>

        <h1 className="mt-4 text-2xl font-semibold text-[#12211c]">
          Payment Canceled
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-[#5b6b64]">
          Your Stripe checkout session was canceled and no charges were made.
          You can upgrade to MentorLagbe Pro anytime from the pricing page.
        </p>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f7a5a] px-6 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
          >
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[#dce5df] px-5 text-[13px] font-semibold text-[#12211c] hover:bg-[#fbfaf7]"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}