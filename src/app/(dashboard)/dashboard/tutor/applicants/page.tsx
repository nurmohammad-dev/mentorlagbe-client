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

type ApplicantStatus = "pending" | "accepted" | "rejected";

type ApplicantItem = {
  _id: string;
  tuitionTitle: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote?: string;
  status: ApplicantStatus;
};

function ApplicantStatusBadge({ status }: { status: ApplicantStatus }) {
  if (status === "accepted") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
        Accepted
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

export default function ManageApplicantsPage() {
  // Connect to GET /api/applications/tutor later
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);

  const handleStatusChange = (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    // Connect PATCH /api/applications/:id/status later
    setApplicants((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item))
    );
    toast.add({
      title: `Application ${status}`,
      description: `Student application marked as ${status}.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#12211c]">
          Manage Applicants
        </h1>
        <p className="text-[13px] text-[#64748b]">
          Review student applications for your tuitions and accept or reject
          them.
        </p>
      </div>

      <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#12211c]">
            Student Applications ({applicants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applicants.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[14px] font-medium text-[#12211c]">
                No applications received yet
              </p>
              <p className="mt-1 text-[13px] text-[#64748b]">
                Once students apply to your approved tuitions, they will appear
                here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Tuition & Schedule</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Decision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicants.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell className="font-medium text-[#12211c]">
                        {app.studentName}
                      </TableCell>
                      <TableCell>
                        <div className="text-[12px]">{app.studentEmail}</div>
                        <div className="text-[11px] text-[#64748b]">
                          {app.studentPhone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[13px] font-medium">
                          {app.tuitionTitle}
                        </div>
                        <div className="text-[11px] text-[#64748b]">
                          {app.preferredSchedule}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48 truncate text-[12px] text-[#64748b]">
                        {app.studentNote || "—"}
                      </TableCell>
                      <TableCell>
                        <ApplicantStatusBadge status={app.status} />
                      </TableCell>
                      <TableCell className="space-x-1.5 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(app._id, "accepted")}
                          className="h-8 rounded-lg bg-[#0f7a5a] text-white hover:bg-[#0c654b]"
                        >
                          <Check className="mr-1 size-3.5" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(app._id, "rejected")}
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