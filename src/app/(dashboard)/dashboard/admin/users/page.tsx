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
import { toast } from "@/components/ui/toast";

type RoleOption = "student" | "tutor" | "admin";

type AdminUserRow = {
  _id: string;
  name: string;
  email: string;
  role: RoleOption;
  plan?: "free" | "pro";
};

export default function UserManagementPage() {
  // Connect to GET /api/admin/users later
  const [users, setUsers] = useState<AdminUserRow[]>([]);

  const handleRoleChange = (userId: string, newRole: RoleOption) => {
    // Connect PATCH /api/admin/users/:id/role later
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
    );
    toast.add({
      title: "Role updated",
      description: `User role changed to ${newRole}.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#12211c]">
          User Management
        </h1>
        <p className="text-[13px] text-[#64748b]">
          View registered users and update roles between student, tutor, and
          admin.
        </p>
      </div>

      <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#12211c]">
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[14px] font-medium text-[#12211c]">
                No users loaded yet
              </p>
              <p className="mt-1 text-[13px] text-[#64748b]">
                Connected user records will appear here once the backend API is
                linked.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead className="text-right">Change Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium text-[#12211c]">
                        {user.name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {user.plan || "free"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[#e8f3ee] text-[#0f513f] uppercase hover:bg-[#e8f3ee]">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <select
                          aria-label={`Change role for ${user.name}`}
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              e.target.value as RoleOption
                            )
                          }
                          className="h-9 rounded-lg border border-input bg-background px-2.5 text-[13px]"
                        >
                          <option value="student">student</option>
                          <option value="tutor">tutor</option>
                          <option value="admin">admin</option>
                        </select>
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