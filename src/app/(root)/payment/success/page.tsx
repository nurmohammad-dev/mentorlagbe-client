"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";

import { authFetch } from "@/lib/auth-fetch";

interface VerifiedPayment {
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState(
    "Confirming your Stripe payment session..."
  );
  const [payment, setPayment] = useState<VerifiedPayment | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("Missing Stripe checkout session ID.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await authFetch("/api/payments/confirm-session", {
          method: "POST",
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data?.message || "Payment verification failed.");
          return;
        }

        setPayment(data.payment || null);
        setStatus("success");
        setMessage("Your MentorLagbe Pro subscription is now active!");
      } catch {
        setStatus("error");
        setMessage("Unable to verify payment with server.");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <div className="rounded-3xl border border-[#e3eae5] bg-white p-8 text-center shadow-xs">
        {status === "verifying" ? (
          <div className="py-6">
            <Loader2 className="mx-auto size-10 animate-spin text-[#0f7a5a]" />
            <h1 className="mt-4 text-xl font-semibold text-[#12211c]">
              Verifying Payment
            </h1>
            <p className="mt-2 text-[13px] text-[#5b6b64]">{message}</p>
          </div>
        ) : status === "success" ? (
          <div>
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e8f3ee] text-[#0f7a5a]">
              <CheckCircle2 className="size-8" />
            </span>

            <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-800">
              <Sparkles className="size-3" />
              Pro Membership Unlocked
            </span>

            <h1 className="mt-3 text-2xl font-semibold text-[#12211c]">
              Payment Successful!
            </h1>
            <p className="mt-2 text-[13px] text-[#5b6b64]">{message}</p>

            {payment ? (
              <div className="mt-6 space-y-2 rounded-2xl border border-[#eef2ef] bg-[#fbfaf7] p-4 text-left text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Plan</span>
                  <span className="font-semibold text-[#12211c]">
                    {payment.planName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Amount Paid</span>
                  <span className="font-semibold text-[#0f7a5a]">
                    ${Number(payment.amount).toFixed(2)}{" "}
                    {payment.currency || "USD"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 text-[#64748b]">
                    Transaction ID
                  </span>
                  <span className="truncate font-mono text-[11px] text-[#12211c]">
                    {payment.transactionId}
                  </span>
                </div>
              </div>
            ) : null}

            <Link
              href="/dashboard"
              className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]"
            >
              Go to My Dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div>
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <XCircle className="size-8" />
            </span>
            <h1 className="mt-4 text-xl font-semibold text-[#12211c]">
              Verification Issue
            </h1>
            <p className="mt-2 text-[13px] text-[#5b6b64]">{message}</p>
            <Link
              href="/pricing"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-[#0f7a5a] px-5 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
            >
              Return to Pricing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-[14px] text-[#5b6b64]">
          Loading payment confirmation...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}