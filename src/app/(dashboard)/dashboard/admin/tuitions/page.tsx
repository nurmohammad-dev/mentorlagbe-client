"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";

type ApprovalStatus = "pending" | "approved" | "rejected";

type AdminTuitionRow = {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  monthlyFee: number;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: ApprovalStatus;
};

function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  if (status === "approved") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
        Approved
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
      Pending
    </Badge>
  );
}

export default function AdminTuitionsPage() {
  // Connect to GET /api/admin/tuitions later
  const [tuitions, setTuitions] = useState<AdminTuitionRow[]>([]);

  const handleDecision = (
    id: string,
    approvalStatus: "approved" | "rejected"
  ) => {
    // Connect PATCH /api/admin/tuitions/:id/approval later
    setTuitions((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, approvalStatus } : item
      )
    );
    toast.add({
      title: `Tuition ${approvalStatus}`,
      description: `Listing status updated to ${approvalStatus}.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#12211c]">
          Tuition Approvals
        </h1>
        <p className="text-[13px] text-[#64748b]">
          Review tuition posts submitted by tutors and approve or reject them.
        </p>
      </div>

      <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#12211c]">
            Submitted Tuitions ({tuitions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tuitions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[14px] font-medium text-[#12211c]">
                No tuition posts to moderate yet
              </p>
              <p className="mt-1 text-[13px] text-[#64748b]">
                Tutor-submitted listings will appear here for approval.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Subject & Mode</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Moderation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tuitions.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium text-[#12211c]">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <div className="text-[13px] font-medium">
                          {item.tutorName}
                        </div>
                        <div className="text-[11px] text-[#64748b]">
                          {item.tutorEmail}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[13px]">{item.subject}</div>
                        <div className="text-[11px] text-[#64748b]">
                          {item.classLevel} • {item.mode}
                        </div>
                      </TableCell>
                      <TableCell>${item.monthlyFee}/mo</TableCell>
                      <TableCell>
                        <ApprovalBadge status={item.approvalStatus} />
                      </TableCell>
                      <TableCell className="space-x-1.5 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleDecision(item._id, "approved")}
                          className="h-8 rounded-lg bg-[#0f7a5a] text-white hover:bg-[#0c654b]"
                        >
                          <Check className="mr-1 size-3.5" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecision(item._id, "rejected")}
                          className="h-8 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <X className="mr-1 size-3.5" />
                          Reject
                        </Button>
                      </TableCell>
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