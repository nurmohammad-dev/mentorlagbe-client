"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";

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

type ApplicationStatus = "pending" | "accepted" | "rejected";

type StudentApplication = {
  _id: string;
  tuitionTitle: string;
  tutorName: string;
  tutorEmail: string;
  monthlyFee: number;
  appliedAt: string;
  status: ApplicationStatus;
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
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

export default function MyApplicationsPage() {
  // Initial empty list; connect to GET /api/applications/student later
  const [applications, setApplications] = useState<StudentApplication[]>([]);

  const handleCancel = (id: string) => {
    // Replace with DELETE request to backend API
    setApplications((prev) =>
      prev.filter((item) => !(item._id === id && item.status === "pending"))
    );
    toast.add({
      title: "Application cancelled",
      description: "Your pending tuition application has been removed.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#12211c]">
            My Applications
          </h1>
          <p className="text-[13px] text-[#64748b]">
            View your submitted tuition applications and cancel pending ones.
          </p>
        </div>

        <Link href="/tuitions">
          <Button className="rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]">
            Find More Tuitions
          </Button>
        </Link>
      </div>

      <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#12211c]">
            Applied Tuitions ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[14px] font-medium text-[#12211c]">
                No applications found yet
              </p>
              <p className="mt-1 text-[13px] text-[#64748b]">
                Browse approved tuitions and apply to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tuition Title</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Monthly Fee</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell className="font-medium text-[#12211c]">
                        {app.tuitionTitle}
                      </TableCell>
                      <TableCell>
                        <div className="text-[13px] font-medium text-[#12211c]">
                          {app.tutorName}
                        </div>
                        <div className="text-[11px] text-[#64748b]">
                          {app.tutorEmail}
                        </div>
                      </TableCell>
                      <TableCell>${app.monthlyFee}/mo</TableCell>
                      <TableCell>{app.appliedAt}</TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {app.status === "pending" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(app._id)}
                            className="rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="mr-1 size-3.5" />
                            Cancel
                          </Button>
                        ) : (
                          <span className="text-[12px] text-[#64748b]">—</span>
                        )}
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