"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  User,
} from "lucide-react";

import GoogleButton from "@/components/shared/GoogleButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
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
import { cn } from "@/lib/utils";

type Role = "student" | "tutor";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLES = [
  {
    value: "student",
    label: "Student",
    description: "I want to learn",
    icon: GraduationCap,
  },
  {
    value: "tutor",
    label: "Tutor",
    description: "I want to teach",
    icon: BookOpen,
  },
] as const;

function toErrors(message?: string) {
  return message ? [{ message }] : undefined;
}

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const nextErrors: Errors = {};
    if (!name) nextErrors.name = "Please enter your full name.";
    if (!EMAIL_PATTERN.test(email))
      nextErrors.email = "Enter a valid email address.";
    if (password.length < 6) nextErrors.password = "Use at least 6 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);

    toast.add({
      title: "Account created",
      description: `Welcome to MentorLagbe, ${name.split(" ")[0]}! Sign-in isn't connected yet.`,
      type: "success",
    });
    router.push("/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="gap-0 rounded-2xl border border-[#e6ebe6] bg-white py-0 ring-0 shadow-[0_30px_60px_-40px_rgba(15,81,63,0.4)]">
        <CardHeader className="px-6 pt-7 pb-5">
          <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
            Create your account
          </h1>
          <CardDescription className="text-[13px] text-[#64748b]">
            Join as a student or tutor — it only takes a minute.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-7">
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup className="gap-4">
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel
                  htmlFor="name"
                  className="text-[13px] text-[#33413b]"
                >
                  Full name
                </FieldLabel>
                <InputGroup className="h-10">
                  <InputGroupAddon>
                    <User className="size-4" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. John Doe"
                    aria-invalid={Boolean(errors.name)}
                    className="h-10 text-[13px]"
                  />
                </InputGroup>
                <FieldError errors={toErrors(errors.name)} />
              </Field>

              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel
                  htmlFor="email"
                  className="text-[13px] text-[#33413b]"
                >
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
                <FieldLabel
                  htmlFor="password"
                  className="text-[13px] text-[#33413b]"
                >
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
                    autoComplete="new-password"
                    placeholder="••••••••"
                    aria-invalid={Boolean(errors.password)}
                    className="h-10 text-[13px]"
                  />
                  <InputGroupAddon align="inline-end" className="pr-1">
                    <InputGroupButton
                      size="icon-sm"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription className="text-[12px]">
                  At least 6 characters.
                </FieldDescription>
                <FieldError errors={toErrors(errors.password)} />
              </Field>

              {/* Role selection fixed layout */}
              <div
                role="radiogroup"
                aria-label="I want to join as"
                className="grid grid-cols-2 gap-3"
              >
                {ROLES.map((option) => {
                  const Icon = option.icon;
                  const selected = role === option.value;

                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#0f7a5a]/30",
                        selected
                          ? "border-[#0f7a5a] bg-[#eef7f2] text-[#0f513f] shadow-sm"
                          : "border-[#dfe6e1] bg-white text-[#475569] hover:bg-[#f6faf8]",
                      )}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={selected}
                        onChange={() => setRole(option.value)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0",
                          selected
                            ? "bg-[#0f7a5a] text-white"
                            : "bg-gray-100 text-gray-500",
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold leading-tight">
                          {option.label}
                        </span>
                        <span className="block text-[11px] text-[#7b8b84] truncate mt-0.5">
                          {option.description}
                        </span>
                      </div>
                      {selected ? (
                        <Check
                          className="size-4 shrink-0 text-[#0f7a5a]"
                          aria-hidden="true"
                        />
                      ) : null}
                    </label>
                  );
                })}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b] shadow-md transition-all"
              >
                {loading ? (
                  <>
                    <Spinner className="size-4" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
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
            label="Sign up with Google"
            onClick={() =>
              toast.add({
                title: "Google sign-up unavailable",
                description: "The auth provider isn't connected yet.",
                type: "info",
              })
            }
          />

          <p className="mt-6 text-center text-[13px] text-[#64748b]">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-[#0f7a5a] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
