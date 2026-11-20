"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient, signIn, useSession } from "@/lib/auth-client";

export default function SignInPage() {
  const { data: session, isPending: sessionPending } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (!sessionPending && session?.user) {
      window.location.replace("/dashboard");
    }
  }, [session, sessionPending]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(email, password)) return;

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.add({
          title: "Sign in failed",
          description:
            error.message ||
            "Invalid credentials. Make sure this account is registered.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      toast.add({
        title: "Welcome back!",
        description: "Redirecting to your dashboard...",
        type: "success",
      });

      // Full navigation ensures fresh session cookies are read immediately
      window.location.href = "/dashboard";
    } catch {
      toast.add({
        title: "Something went wrong",
        description: "Unable to connect to authentication service.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.add({
          title: "Google sign in failed",
          description: error.message || "Could not sign in with Google.",
          type: "error",
        });
        setGoogleLoading(false);
      }
    } catch {
      toast.add({
        title: "Something went wrong",
        description: "Unable to connect to Google authentication.",
        type: "error",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#e3eae5] bg-white p-6 shadow-[0_24px_48px_-32px_rgba(16,32,27,0.25)] sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
          Sign in to your account
        </h1>
        <p className="mt-1.5 text-[13px] text-[#5b6b64]">
          Enter your credentials to access your account.
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
          disabled={loading || googleLoading}
          className="h-11 w-full rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]"
        >
          {loading ? (
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
          or
        </span>
        <div className="h-px flex-1 bg-[#e8eeea]" />
      </div>

      <Button
        type="button"
        disabled={loading || googleLoading}
        onClick={handleGoogleSignIn}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#f5f5f5] text-[13px] font-semibold text-[#12211c] hover:bg-[#e8eeea]"
      >
        {googleLoading ? (
          <Loader2 className="size-4 animate-spin text-[#0f7a5a]" />
        ) : (
          <FcGoogle className="h-5 w-5" />
        )}
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-[13px] text-[#5b6b64]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#0f7a5a] hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}