"use client";

import { useEffect, useState } from "react";
import { CreditCard, DollarSign, Loader2 } from "lucide-react";

import { toast } from "@/components/ui/toast";
import { authFetch } from "@/lib/auth-fetch";

interface PaymentRecord {
  _id: string;
  userName: string;
  userEmail: string;
  userRole: string;
  planName: string;
  amount: number;
  currency?: string;
  transactionId: string;
  paymentStatus: string;
  paidAt: string;
}

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await authFetch("/api/payments");
        const data = await res.json();

        if (res.ok) {
          setPayments(Array.isArray(data.payments) ? data.payments : []);
          setTotalRevenue(Number(data.totalRevenue) || 0);
        } else {
          toast.add({
            title: "Failed to load transactions",
            description: data?.message || "Could not fetch Stripe records.",
            type: "error",
          });
        }
      } catch {
        toast.add({
          title: "Network Error",
          description: "Unable to connect to server.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header & Revenue Summary Card */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            Stripe Transactions
          </h1>
          <p className="mt-1 text-[13px] text-[#5b6b64]">
            Complete log of Pro plan subscription payments across Tutors and
            Students.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#cfe0d7] bg-[#eef7f2] px-5 py-3.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#0f7a5a] text-white">
            <DollarSign className="size-5" />
          </span>
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#0f513f]">
              Total Revenue
            </span>
            <span className="text-xl font-bold text-[#12211c]">
              ${totalRevenue.toLocaleString()} USD
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="flex h-60 items-center justify-center rounded-2xl border border-[#e3eae5] bg-white">
          <Loader2 className="size-6 animate-spin text-[#0f7a5a]" />
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cfe0d7] bg-white p-12 text-center">
          <CreditCard className="mx-auto size-8 text-[#8a9a93]" />
          <h3 className="mt-3 text-[16px] font-semibold text-[#12211c]">
            No transactions recorded yet
          </h3>
          <p className="mt-1 text-[13px] text-[#64748b]">
            Completed Stripe Pro subscription checkouts will appear here
            automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e3eae5] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#eef2ef] bg-[#fbfaf7] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Plan</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Transaction ID</th>
                  <th className="px-5 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2ef]">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-[#fbfaf7]/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#12211c]">
                        {payment.userName}
                      </p>
                      <p className="text-[12px] text-[#64748b]">
                        {payment.userEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#e8f3ee] px-2.5 py-0.5 text-[11px] font-semibold capitalize text-[#0f513f]">
                        {payment.userRole}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-medium text-[#12211c]">
                      {payment.planName}
                    </td>

                    <td className="px-5 py-4 font-bold text-[#0f7a5a]">
                      ${Number(payment.amount).toFixed(2)}{" "}
                      <span className="text-[11px] font-normal text-[#64748b]">
                        {payment.currency || "USD"}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-mono text-[11px] text-[#475569]">
                      {payment.transactionId}
                    </td>

                    <td className="px-5 py-4 text-[12px] text-[#64748b]">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}