"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

import SignOutButton from "@/components/shared/SignOut";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type UserRole = "student" | "tutor" | "admin";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type DashboardUser = {
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
};

const ROLE_MENUS: Record<UserRole, NavItem[]> = {
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    {
      label: "My Applications",
      href: "/dashboard/student/my-applications",
      icon: FileText,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  ],
  tutor: [
    { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard },
    {
      label: "Post a Tuition",
      href: "/dashboard/tutor/post-tuition",
      icon: PlusCircle,
    },
    {
      label: "My Tuitions",
      href: "/dashboard/tutor/my-tuitions",
      icon: BookOpen,
    },
    {
      label: "Manage Applicants",
      href: "/dashboard/tutor/applicants",
      icon: Users,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    {
      label: "User Management",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "Tuition Approvals",
      href: "/dashboard/admin/tuitions",
      icon: ShieldCheck,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  ],
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

function isLinkActive(pathname: string, href: string) {
  const isOverview =
    href === "/dashboard/student" ||
    href === "/dashboard/tutor" ||
    href === "/dashboard/admin";
  return isOverview
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarContentProps = {
  user: DashboardUser;
  collapsed: boolean;
  pathname: string;
  menuItems: NavItem[];
  isMobile?: boolean;
  onCloseMobile: () => void;
};

function SidebarContent({
  user,
  collapsed,
  pathname,
  menuItems,
  isMobile = false,
  onCloseMobile,
}: SidebarContentProps) {
  const compact = !isMobile && collapsed;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Brand Header */}
      <div className="flex h-[72px] items-center border-b border-[#e4ece7] px-4">
        <Link
          href="/"
          onClick={() => isMobile && onCloseMobile()}
          className={cn(
            "flex items-center gap-2.5",
            compact && "mx-auto justify-center"
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0f7a5a] text-white">
            <GraduationCap className="size-[18px]" strokeWidth={2.2} />
          </span>
          {!compact && (
            <span className="text-[15px] font-semibold tracking-tight text-[#12211c]">
              MentorLagbe
            </span>
          )}
        </Link>
      </div>

      {/* User Profile Summary */}
      <div className="border-b border-[#e4ece7] p-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl bg-[#f6faf8] p-2.5",
            compact && "justify-center p-2"
          )}
        >
          <Avatar className="size-9 shrink-0">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-[#0f7a5a] text-[11px] font-semibold text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          {!compact && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[#12211c]">
                {user.name}
              </p>
              <span className="mt-0.5 inline-block rounded-full bg-[#e8f3ee] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0f513f]">
                {user.role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Role Navigation */}
      <nav
        aria-label="Dashboard navigation"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={compact ? item.label : undefined}
              onClick={() => isMobile && onCloseMobile()}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                compact && "justify-center px-2",
                active
                  ? "bg-[#0f7a5a] text-white shadow-xs"
                  : "text-[#475569] hover:bg-[#eef5f1] hover:text-[#12211c]"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!compact && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-1 border-t border-[#e4ece7] p-3">
        <Link
          href="/"
          title={compact ? "Back to Home" : undefined}
          onClick={() => isMobile && onCloseMobile()}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-[#475569] transition-colors hover:bg-[#eef5f1] hover:text-[#12211c]",
            compact && "justify-center px-2"
          )}
        >
          <Home className="size-4 shrink-0" />
          {!compact && <span>Back to Home</span>}
        </Link>

        {!compact && (
          <SignOutButton onComplete={() => isMobile && onCloseMobile()} />
        )}
      </div>
    </div>
  );
}

type DashboardSidebarProps = {
  user: DashboardUser;
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

export default function DashboardSidebar({
  user,
  collapsed,
  mobileOpen,
  setMobileOpen,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const menuItems = ROLE_MENUS[user.role] || ROLE_MENUS.student;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-[#e4ece7] bg-white transition-all duration-200 md:block",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="sticky top-0 h-screen">
          <SidebarContent
            user={user}
            collapsed={collapsed}
            pathname={pathname}
            menuItems={menuItems}
            onCloseMobile={() => setMobileOpen(false)}
          />
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[82%] max-w-xs gap-0 bg-white p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Dashboard Navigation</SheetTitle>
            <SheetDescription>
              Navigate your MentorLagbe dashboard sections.
            </SheetDescription>
          </SheetHeader>
          <SidebarContent
            user={user}
            collapsed={collapsed}
            pathname={pathname}
            menuItems={menuItems}
            isMobile
            onCloseMobile={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}