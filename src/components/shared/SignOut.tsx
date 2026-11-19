"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";


export default function SignOutButton({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.add({
            title: "Signed out",
            description: "You have been successfully signed out.",
            type: "success",
          });
          router.push("/signin");
          if (onComplete) onComplete();
        },
        onError: (ctx) => {
          toast.add({
            title: "Error",
            description: ctx.error.message || "Failed to sign out.",
            type: "error",
          });
        },
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
    >
      <LogOut className="size-4" />
      Sign Out
    </button>
  );
}
