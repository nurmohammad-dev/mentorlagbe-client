"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

import GoogleButton from "@/components/shared/GoogleButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

type Errors = {
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toErrors(message?: string) {
  return message ? [{ message }] : undefined;
}

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const nextErrors: Errors = {};
    if (!EMAIL_PATTERN.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Enter your password.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);

    toast.add({
      title: "Welcome back",
      description: "Authentication isn't connected yet, so this is a preview sign-in.",
      type: "success",
    });
    router.push("/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="gap-0 rounded-2xl border border-[#e6ebe6] bg-white py-0 ring-0 shadow-[0_30px_60px_-40px_rgba(15,81,63,0.4)]">
        <CardHeader className="px-6 pt-7 pb-5">
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            Welcome back
          </h1>
          <CardDescription className="text-[13px] text-[#64748b]">
            Sign in to continue to your dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-7">
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup className="gap-4">
              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="email" className="text-[13px] text-[#33413b]">
                  Email address
                </FieldLabel>
                <InputGroup className="h-10">
                  <InputGroupAddon>
                    <Mail className="size-4" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    className="h-10 text-[13px]"
                  />
                </InputGroup>
                <FieldError errors={toErrors(errors.email)} />
              </Field>

              <Field data-invalid={Boolean(errors.password)}>
                <FieldLabel htmlFor="password" className="text-[13px] text-[#33413b]">
                  Password
                </FieldLabel>
                <InputGroup className="h-10">
                  <InputGroupAddon>
                    <Lock className="size-4" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={Boolean(errors.password)}
                    className="h-10 text-[13px]"
                  />
                  <InputGroupAddon align="inline-end" className="pr-1">
                    <InputGroupButton
                      size="icon-sm"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={toErrors(errors.password)} />
              </Field>

              <Field orientation="horizontal" className="items-center py-1">
                <Checkbox id="remember" name="remember" />
                <FieldLabel
                  htmlFor="remember"
                  className="text-[13px] font-normal text-[#475569] cursor-pointer"
                >
                  Keep me signed in
                </FieldLabel>
              </Field>

              <Button
                type="submit"
                disabled={loading}
                className="mt-1 h-11 w-full rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b] shadow-md transition-all"
              >
                {loading ? (
                  <>
                    <Spinner className="size-4" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>

          <FieldSeparator className="my-5 text-[11px] uppercase tracking-wide text-gray-400">
            or continue with
          </FieldSeparator>

          <GoogleButton
            label="Sign in with Google"
            onClick={() =>
              toast.add({
                title: "Google sign-in unavailable",
                description: "The auth provider isn't connected yet.",
                type: "info",
              })
            }
          />

          <p className="mt-6 text-center text-[13px] text-[#64748b]">
            New to MentorLagbe?{" "}
            <Link href="/signup" className="font-semibold text-[#0f7a5a] hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}