"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

type TuitionItem = {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  monthlyFee: number;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
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

export default function MyTuitionsPage() {
  // Connect to GET /api/tuitions/tutor later
  const [tuitions, setTuitions] = useState<TuitionItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFee, setEditFee] = useState("");

  const startEdit = (item: TuitionItem) => {
    setEditingId(item._id);
    setEditTitle(item.title);
    setEditFee(String(item.monthlyFee));
  };

  const saveEdit = (id: string) => {
    // Connect PATCH /api/tuitions/:id later
    setTuitions((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              title: editTitle.trim() || item.title,
              monthlyFee: Number(editFee) || item.monthlyFee,
            }
          : item
      )
    );
    setEditingId(null);
    toast.add({
      title: "Tuition updated",
      description: "Changes saved successfully.",
      type: "success",
    });
  };

  const toggleActive = (id: string) => {
    // Connect PATCH /api/tuitions/:id/status later
    setTuitions((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
    toast.add({
      title: "Status updated",
      description: "Active / Closed status toggled.",
      type: "success",
    });
  };

  const deleteTuition = (id: string) => {
    // Connect DELETE /api/tuitions/:id later
    setTuitions((prev) => prev.filter((item) => item._id !== id));
    toast.add({
      title: "Tuition deleted",
      description: "Listing removed.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#12211c]">
            My Tuitions
          </h1>
          <p className="text-[13px] text-[#64748b]">
            Edit listings, toggle Active/Closed status, or delete tuitions.
          </p>
        </div>

        <Link href="/dashboard/tutor/post-tuition">
          <Button className="rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]">
            <Plus className="mr-1.5 size-4" />
            Post New
          </Button>
        </Link>
      </div>

      <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#12211c]">
            Created Tuitions ({tuitions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tuitions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[14px] font-medium text-[#12211c]">
                No tuitions created yet
              </p>
              <p className="mt-1 text-[13px] text-[#64748b]">
                Click &ldquo;Post New&rdquo; to create your first tuition batch.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject & Level</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Listing</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tuitions.map((item) => {
                    const isEditing = editingId === item._id;

                    return (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium text-[#12211c]">
                          {isEditing ? (
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="h-8 w-44"
                            />
                          ) : (
                            item.title
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-[13px]">{item.subject}</div>
                          <div className="text-[11px] text-[#64748b]">
                            {item.classLevel} • {item.mode}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editFee}
                              onChange={(e) => setEditFee(e.target.value)}
                              className="h-8 w-24"
                            />
                          ) : (
                            `$${item.monthlyFee}/mo`
                          )}
                        </TableCell>
                        <TableCell>
                          <ApprovalBadge status={item.approvalStatus} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.isActive ? "Active" : "Closed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-1.5 text-right">
                          {isEditing ? (
                            <Button
                              size="sm"
                              onClick={() => saveEdit(item._id)}
                              className="h-8 rounded-lg bg-[#0f7a5a] text-white"
                            >
                              Save
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(item)}
                              className="h-8 rounded-lg"
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(item._id)}
                            title="Toggle Active / Closed"
                            className="h-8 rounded-lg"
                          >
                            <Power className="size-3.5" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTuition(item._id)}
                            className="h-8 rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}