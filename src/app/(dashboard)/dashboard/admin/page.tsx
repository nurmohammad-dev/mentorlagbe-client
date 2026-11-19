"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, ShieldCheck, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authFetch } from "@/lib/auth-fetch";
import { cn } from "@/lib/utils";

interface RegisteredUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  plan?: "free" | "pro";
  createdAt?: string;
}

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "student" | "tutor" | "admin"
  >("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await authFetch("/api/users");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setUsers(data);
        } else {
          toast.add({
            title: "Failed to load users",
            description: data?.message || "Could not fetch registered users.",
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

    fetchUsers();
  }, []);

  const handleRoleChange = async (
    userId: string,
    newRole: "student" | "tutor" | "admin"
  ) => {
    setUpdatingId(userId);
    try {
      const res = await authFetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.add({
          title: "Role update failed",
          description: data?.message || "Could not change user role.",
          type: "error",
        });
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );

      toast.add({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}.`,
        type: "success",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const query = search.trim().toLowerCase();
    const matchesQuery =
      !query ||
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query);
    return matchesRole && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
          User & Role Management
        </h1>
        <p className="mt-1 text-[13px] text-[#5b6b64]">
          View all registered members and assign Student, Tutor, or Admin
          permissions.
        </p>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a9a93]" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border-[#dce5df] bg-white pl-10 text-[13px]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#e3eae5] bg-white p-1">
          {(["all", "student", "tutor", "admin"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setRoleFilter(tab)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[12px] font-semibold capitalize transition-colors",
                roleFilter === tab
                  ? "bg-[#0f7a5a] text-white"
                  : "text-[#5b6b64] hover:text-[#12211c]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex h-60 items-center justify-center rounded-2xl border border-[#e3eae5] bg-white">
          <Loader2 className="size-6 animate-spin text-[#0f7a5a]" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cfe0d7] bg-white p-12 text-center">
          <p className="text-[15px] font-semibold text-[#12211c]">
            No matching users found
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e3eae5] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#eef2ef] bg-[#fbfaf7] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Current Role</th>
                  <th className="px-5 py-3.5">Subscription</th>
                  <th className="px-5 py-3.5 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2ef]">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#fbfaf7]/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#12211c]">{user.name}</p>
                      <p className="text-[12px] text-[#64748b]">{user.email}</p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                          user.role === "admin" &&
                            "bg-purple-100 text-purple-800",
                          user.role === "tutor" &&
                            "bg-[#e8f3ee] text-[#0f513f]",
                          user.role === "student" &&
                            "bg-sky-100 text-sky-800"
                        )}
                      >
                        {user.role === "admin" ? (
                          <ShieldCheck className="size-3" />
                        ) : null}
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {user.plan === "pro" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                          <Sparkles className="size-3" />
                          Pro
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                          Free
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <select
                        aria-label={`Change role for ${user.name}`}
                        disabled={updatingId === user._id}
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value as "student" | "tutor" | "admin"
                          )
                        }
                        className="h-9 rounded-xl border border-[#dce5df] bg-[#fbfaf7] px-3 text-[12px] font-medium text-[#12211c] outline-none focus:border-[#0f7a5a] disabled:opacity-50"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                      </select>
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