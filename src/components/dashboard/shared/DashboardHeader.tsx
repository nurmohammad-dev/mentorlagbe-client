"use client";

import Link from "next/link";
import { Crown, Menu, PanelLeft } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserPlan, UserRole } from "./DashboardSidebar";

type DashboardHeaderProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: UserRole;
    plan?: UserPlan;
  };
  onToggleDesktopSidebar: () => void;
  onOpenMobileSidebar: () => void;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function DashboardHeader({
  user,
  onToggleDesktopSidebar,
  onOpenMobileSidebar,
}: DashboardHeaderProps) {
  const isPro = user.plan === "pro";

  return (
    <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-[#e4ece7] bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileSidebar}
          className="size-9 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="size-5 text-[#12211c]" />
        </Button>

        {/* Desktop Collapsible Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDesktopSidebar}
          className="hidden size-9 md:inline-flex"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="size-5 text-[#475569]" />
        </Button>

        <div>
          <h2 className="text-[15px] font-semibold text-[#12211c] capitalize">
            {user.role} Dashboard
          </h2>
          <p className="hidden text-[12px] text-[#64748b] sm:block">
            Welcome back, {user.name.split(" ")[0]}
          </p>
        </div>
      </div>

      {/* Right User Summary */}
      <Link
        href="/dashboard/profile"
        className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1.5 transition-colors hover:bg-[#eef5f1]"
      >
        <div className="relative shrink-0">
          <Avatar className="size-8">
            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
            <AvatarFallback className="bg-[#0f7a5a] text-[10px] font-semibold text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          {user.role !== "admin" && isPro && (
            <span
              title="Pro Member"
              className="absolute -bottom-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-amber-500 text-white ring-2 ring-white"
            >
              <Crown className="size-2" />
            </span>
          )}
        </div>

        <div className="hidden text-left sm:block">
          <p className="max-w-36 truncate text-[12px] font-semibold text-[#12211c]">
            {user.name}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wide text-[#0f7a5a]">
              {user.role}
            </span>

            {user.role !== "admin" &&
              (isPro ? (
                <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-300 bg-amber-50 px-1.5 py-0 text-[9px] font-bold uppercase text-amber-700">
                  <Crown className="size-2.5 text-amber-600" />
                  PRO
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-1.5 py-0 text-[9px] font-semibold uppercase text-slate-600">
                  FREE
                </span>
              ))}
          </div>
        </div>
      </Link>
    </header>
  );
}