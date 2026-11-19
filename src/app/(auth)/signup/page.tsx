"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import GoogleButton from "@/components/shared/GoogleButton";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type UserRole = "student" | "tutor";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      nextErrors.name = "Full name is required.";
    } else if (name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const signUpPayload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        plan: "free",
      };

      const { error } = await authClient.signUp.email(
        signUpPayload as Parameters<typeof authClient.signUp.email>[0]
      );

      if (error) {
        toast.add({
          title: "Registration failed",
          description:
            error.message || "Could not create account. Please try again.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Account created!",
        description: `Welcome to MentorLagbe as a ${role === "tutor" ? "Tutor" : "Student"} (Free Plan).`,
        type: "success",
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.add({
        title: "Something went wrong",
        description: "Unable to complete registration right now.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#e3eae5] bg-white p-6 shadow-[0_24px_48px_-32px_rgba(16,32,27,0.25)] sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
          Create your free account
        </h1>
        <p className="mt-1.5 text-[13px] text-[#5b6b64]">
          Choose your role to get started with MentorLagbe.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        {/* Role Selection Cards */}
        <div>
          <span className="block text-[12px] font-semibold text-[#12211c]">
            I want to join as
          </span>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={cn(
                "flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all",
                role === "student"
                  ? "border-[#0f7a5a] bg-[#eef7f2] ring-2 ring-[#0f7a5a]/20"
                  : "border-[#dce5df] bg-[#fbfaf7] hover:border-[#b7cbc0]"
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  role === "student"
                    ? "bg-[#0f7a5a] text-white"
                    : "bg-white text-[#5b6b64]"
                )}
              >
                <BookOpen className="size-4" />
              </span>
              <span className="mt-2.5 text-[13px] font-semibold text-[#12211c]">
                Student
              </span>
              <span className="mt-0.5 text-[11px] text-[#64748b]">
                Find mentors & apply
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={cn(
                "flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all",
                role === "tutor"
                  ? "border-[#0f7a5a] bg-[#eef7f2] ring-2 ring-[#0f7a5a]/20"
                  : "border-[#dce5df] bg-[#fbfaf7] hover:border-[#b7cbc0]"
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  role === "tutor"
                    ? "bg-[#0f7a5a] text-white"
                    : "bg-white text-[#5b6b64]"
                )}
              >
                <GraduationCap className="size-4" />
              </span>
              <span className="mt-2.5 text-[13px] font-semibold text-[#12211c]">
                Tutor
              </span>
              <span className="mt-0.5 text-[11px] text-[#64748b]">
                Post tuition batches
              </span>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="signup-name"
            className="block text-[12px] font-semibold text-[#12211c]"
          >
            Full Name
          </label>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a9a93]" />
            <Input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Nur Mohammad"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className="h-11 rounded-xl border-[#dce5df] bg-[#fbfaf7] pl-10 text-[13px] focus-visible:border-[#0f7a5a] focus-visible:bg-white"
            />
          </div>
          {errors.name ? (
            <p className="mt-1 text-[11px] font-medium text-red-600">
              {errors.name}
            </p>
          ) : null}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="signup-email"
            className="block text-[12px] font-semibold text-[#12211c]"
          >
            Email Address
          </label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a9a93]" />
            <Input
              id="signup-email"
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

        {/* Password */}
        <div>
          <label
            htmlFor="signup-password"
            className="block text-[12px] font-semibold text-[#12211c]"
          >
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a9a93]" />
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
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
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Free Account
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {/* Divider & Social Login */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e8eeea]" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#8a9a93]">
          or sign up with
        </span>
        <div className="h-px flex-1 bg-[#e8eeea]" />
      </div>

      <GoogleButton
        label="Sign up with Google"
        onClick={() => {
          void authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
          });
        }}
      />

      <p className="mt-6 text-center text-[13px] text-[#5b6b64]">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-[#0f7a5a] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}