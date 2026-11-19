"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    const user = session?.user;
    if (!user) {
      router.replace("/signin");
      return;
    }

    const role = (user as { role?: string }).role || "student";
    if (role === "admin") {
      router.replace("/dashboard/admin");
    } else if (role === "tutor") {
      router.replace("/dashboard/tutor");
    } else {
      router.replace("/dashboard/student");
    }
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2">
      <Loader2 className="size-7 animate-spin text-[#0f7a5a]" />
      <p className="text-[13px] text-[#5b6b64]">
        Loading your role dashboard...
      </p>
    </div>
  );
}