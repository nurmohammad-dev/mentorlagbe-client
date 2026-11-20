"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import DashboardSidebar, {
  type UserRole,
} from "@/components/dashboard/shared/DashboardSidebar";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/auth-fetch";

export type UserPlan = "free" | "pro";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [plan, setPlan] = useState<UserPlan>("free");
  const [dbProfile, setDbProfile] = useState<{
    name?: string;
    image?: string | null;
  }>({});

  const rawUser = session?.user as
    | {
        name: string;
        email: string;
        image?: string | null;
        role?: UserRole;
      }
    | undefined;

  const role: UserRole = rawUser?.role || "student";

  useEffect(() => {
    if (isPending) return;

    if (!rawUser) {
      router.replace("/signin");
      return;
    }

    // Prevent accessing another role's dashboard route
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      router.replace(`/dashboard/${role}`);
    } else if (pathname.startsWith("/dashboard/tutor") && role !== "tutor") {
      router.replace(`/dashboard/${role}`);
    } else if (
      pathname.startsWith("/dashboard/student") &&
      role !== "student"
    ) {
      router.replace(`/dashboard/${role}`);
    }
  }, [isPending, rawUser, role, pathname, router]);

  useEffect(() => {
    if (!rawUser?.email) return;

    let active = true;
    const syncUserPlan = async () => {
      try {
        const res = await authFetch("/api/users/me");
        if (res.ok && active) {
          const data = await res.json();
          setPlan(data?.plan === "pro" ? "pro" : "free");
          setDbProfile({
            name: data?.name,
            image: data?.image,
          });
        }
      } catch {
        // Keep default fallback values
      }
    };

    syncUserPlan();
    return () => {
      active = false;
    };
  }, [rawUser?.email, pathname]);

  if (isPending || !rawUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <div className="flex items-center gap-2.5 text-[14px] font-medium text-[#475569]">
          <Spinner className="size-5 text-[#0f7a5a]" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  const user = {
    name: dbProfile.name || rawUser.name,
    email: rawUser.email,
    image: dbProfile.image ?? rawUser.image,
    role,
    plan,
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8faf9]">
      <DashboardSidebar
        user={user}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          user={user}
          onToggleDesktopSidebar={() => setCollapsed((prev) => !prev)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}