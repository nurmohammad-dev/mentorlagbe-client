"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/signin");
      return;
    }

    const role =
      (session.user as { role?: "student" | "tutor" | "admin" }).role ||
      "student";
    router.replace(`/dashboard/${role}`);
  }, [isPending, session, router]);

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Spinner className="size-6 text-[#0f7a5a]" />
    </div>
  );
}