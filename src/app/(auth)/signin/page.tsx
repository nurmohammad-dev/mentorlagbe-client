"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Shield,
  UserCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import GoogleButton from "@/components/shared/GoogleButton";
import { authClient } from "@/lib/auth-client";

const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    label: "Demo Admin",
    email: "admin@mentorlagbe.com",
    password: "Password123!",
    badge: "Full Moderation",
    icon: Shield,
  },
  {
    role: "Tutor",
    label: "Demo Tutor",
    email: "tutor@mentorlagbe.com",
    password: "Password123!",
    badge: "Post & Manage",
    icon: GraduationCap,
  },
  {
    role: "Student",
    label: "Demo Student",
    email: "student@mentorlagbe.com",
    password: "Password123!",
    badge: "Browse & Apply",
    icon: UserCheck,
  },
];

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = (targetEmail: string, targetPassword: string) => {
    const nextErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!targetEmail.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!emailRegex.test(targetEmail.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!targetPassword) {
      nextErrors.password = "Password is required.";
    } else if (targetPassword.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const executeSignIn = async (
    targetEmail: string,
    targetPassword: string,
    demoRole?: string
  ) => {
    if (!validateForm(targetEmail, targetPassword)) return;

    setLoading(true);
    if (demoRole) setActiveDemo(demoRole);

    try {
      const { error } = await authClient.signIn.email({
        email: targetEmail.trim(),
        password: targetPassword,
      });

      if (error) {
        toast.add({
          title: "Sign in failed",
          description:
            error.message ||
            "Invalid credentials. Make sure this account is registered.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Welcome back!",
        description: demoRole
          ? `Signed in with ${demoRole} demo account.`
          : "You have signed in successfully.",
        type: "success",
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.add({
        title: "Something went wrong",
        description: "Unable to connect to authentication service.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setActiveDemo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeSignIn(email, password);
  };

  const handleDemoLogin = async (demo: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setErrors({});
    await executeSignIn(demo.email, demo.password, demo.role);
  };

  return (
    <div className="rounded-3xl border border-[#e3eae5] bg-white p-6 shadow-[0_24px_48px_-32px_rgba(16,32,27,0.25)] sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
          Sign in to your account
        </h1>
        <p className="mt-1.5 text-[13px] text-[#5b6b64]">
          Enter your credentials or use one-click demo access below.
        </p>
      </div>

      {/* Email & Password Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="signin-email"
            className="block text-[12px] font-semibold text-[#12211c]"
          >
            Email Address
          </label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a9a93]" />
            <Input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className="h-11 rounded-xl border-[#dce5df] bg-[#fbfaf7] pl-10 text-[13px] focus-visible:border-[#0f7a5a] focus-visible:bg-white"
            />
          </div>
          {errors.email ? (
            <p className="mt-1 text-[11px] font-medium text-red-600">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="signin-password"
            className="block text-[12px] font-semibold text-[#12211c]"
          >
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a9a93]" />
            <Input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              className="h-11 rounded-xl border-[#dce5df] bg-[#fbfaf7] pl-10 pr-10 text-[13px] focus-visible:border-[#0f7a5a] focus-visible:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a9a93] hover:text-[#12211c]"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="mt-1 text-[11px] font-medium text-red-600">
              {errors.password}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]"
        >
          {loading && !activeDemo ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {/* Divider & Social Login */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e8eeea]" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#8a9a93]">
          or continue with
        </span>
        <div className="h-px flex-1 bg-[#e8eeea]" />
      </div>

      <GoogleButton />

      {/* 1-Click Demo Login Section */}
      <div className="mt-6 rounded-2xl border border-[#e3ece7] bg-[#f7faf8] p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#0f513f]">
            <Zap className="size-3.5 text-[#0f7a5a]" />
            Quick Demo Access (1-Click)
          </span>
          <span className="text-[10px] font-medium text-[#64748b]">
            Instant Role Test
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((demo) => {
            const Icon = demo.icon;
            const isThisLoading = loading && activeDemo === demo.role;

            return (
              <button
                key={demo.role}
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin(demo)}
                className="group flex flex-col items-center rounded-xl border border-[#dce7e1] bg-white px-2.5 py-2.5 text-center transition-all hover:border-[#0f7a5a] hover:bg-[#eef7f2] disabled:opacity-60"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#e8f3ee] text-[#0f7a5a] transition-colors group-hover:bg-[#0f7a5a] group-hover:text-white">
                  {isThisLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </span>
                <span className="mt-1.5 text-[12px] font-semibold text-[#12211c]">
                  {demo.role}
                </span>
                <span className="mt-0.5 text-[10px] text-[#64748b]">
                  {demo.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-center text-[13px] text-[#5b6b64]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#0f7a5a] hover:underline"
        >
          Create free account
        </Link>
      </p>
    </div>
  );
}