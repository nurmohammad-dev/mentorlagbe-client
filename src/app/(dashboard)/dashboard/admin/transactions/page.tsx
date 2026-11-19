"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TransactionRow = {
  _id: string;
  userName: string;
  userEmail: string;
  userRole: "student" | "tutor" | "admin";
  planName: string;
  amount: number;
  currency?: string;
  transactionId: string;
  paymentStatus: string;
  paidAt: string;
};

export default function AdminTransactionsPage() {
  // Connect to GET /api/admin/transactions later
  const [transactions] = useState<TransactionRow[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#12211c]">
          Transactions
        </h1>
        <p className="text-[13px] text-[#64748b]">
          View Stripe subscription payments from tutors and students.
        </p>
      </div>

      <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#12211c]">
            Payment History ({transactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[14px] font-medium text-[#12211c]">
                No transactions recorded yet
              </p>
              <p className="mt-1 text-[13px] text-[#64748b]">
                Stripe Pro plan payments will appear here once completed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell>
                        <div className="text-[13px] font-medium text-[#12211c]">
                          {tx.userName}
                        </div>
                        <div className="text-[11px] text-[#64748b]">
                          {tx.userEmail}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{tx.userRole}</TableCell>
                      <TableCell className="font-medium">{tx.planName}</TableCell>
                      <TableCell>
                        ${tx.amount} {(tx.currency || "usd").toUpperCase()}
                      </TableCell>
                      <TableCell className="font-mono text-[12px]">
                        {tx.transactionId}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-800 uppercase hover:bg-emerald-100">
                          {tx.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.paidAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}