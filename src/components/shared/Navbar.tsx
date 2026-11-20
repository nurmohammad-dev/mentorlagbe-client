"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Crown,
  GraduationCap,
  LayoutDashboard,
  Menu as MenuIcon,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/auth-fetch";
import SignOutButton from "@/components/shared/SignOut";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7a5a]/40"
      aria-label="MentorLagbe home"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-[#0f7a5a] text-white">
        <GraduationCap
          className="size-[18px]"
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-[#12211c]">
        MentorLagbe
      </span>
    </Link>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="rounded-full bg-[#e8f3ee] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0f513f]">
      {role}
    </span>
  );
}

function PlanBadge({ plan }: { plan: "free" | "pro" }) {
  if (plan === "pro") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
        <Crown className="size-2.5 text-amber-600" />
        PRO
      </span>
    );
  }
  return (
    <span className="rounded-full border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-600">
      FREE
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const [userPlan, setUserPlan] = useState<"free" | "pro">("free");
  const [dbProfile, setDbProfile] = useState<{
    name?: string;
    image?: string | null;
  }>({});

  const closeMobile = () => setMobileOpen(false);
  const user = session?.user;
  const userRole = (user as { role?: string } | undefined)?.role || "student";

  useEffect(() => {
    if (!user?.email) return;

    let active = true;
    const syncProfile = async () => {
      try {
        const res = await authFetch("/api/users/me");
        if (res.ok && active) {
          const data = await res.json();
          setUserPlan(data?.plan === "pro" ? "pro" : "free");
          setDbProfile({
            name: data?.name,
            image: data?.image,
          });
        }
      } catch {
        // Fallback to session values
      }
    };

    syncProfile();
    return () => {
      active = false;
    };
  }, [user?.email, pathname]);

  const displayName = dbProfile.name || user?.name || "";
  const displayImage = dbProfile.image ?? user?.image;

  return (
    <header className="sticky top-0 z-50 border-b border-[#e4ece7] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-[13px] font-medium transition-colors",
                  active
                    ? "text-[#12211c]"
                    : "text-[#64748b] hover:text-[#12211c]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-gray-200" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`Open account menu for ${displayName}`}
                className="flex items-center gap-2 rounded-full p-1 pr-2 text-left outline-none transition-colors hover:bg-[#edf5f1] focus-visible:ring-2 focus-visible:ring-[#0f7a5a]/30"
              >
                <div className="relative shrink-0">
                  <Avatar className="size-8">
                    {displayImage ? (
                      <AvatarImage src={displayImage} alt={displayName} />
                    ) : null}
                    <AvatarFallback className="bg-[#0f7a5a] text-[10px] font-semibold text-white">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>

                  {userRole !== "admin" && userPlan === "pro" && (
                    <span
                      title="Pro Member"
                      className="absolute -bottom-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-amber-500 text-white ring-2 ring-white"
                    >
                      <Crown className="size-2" />
                    </span>
                  )}
                </div>

                <span className="hidden text-left sm:block">
                  <span className="block max-w-32 truncate text-[12px] font-semibold text-[#12211c]">
                    {displayName}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-[10px] capitalize text-[#64748b]">
                      {userRole}
                    </span>
                    {userRole !== "admin" && <PlanBadge plan={userPlan} />}
                  </span>
                </span>

                <ChevronDown
                  className="hidden size-3.5 text-[#64748b] sm:block"
                  aria-hidden="true"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-64 p-1.5"
              >
                <div className="flex items-start justify-between gap-2 px-2 py-1.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">
                      {displayName}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <RoleBadge role={userRole} />
                    {userRole !== "admin" && <PlanBadge plan={userPlan} />}
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  render={<Link href="/dashboard" />}
                  className="gap-2.5 px-2 py-2 text-[13px] font-medium"
                >
                  <LayoutDashboard className="size-4 text-[#0f7a5a]" />
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={<Link href="/dashboard/profile" />}
                  className="gap-2.5 px-2 py-2 text-[13px] font-medium"
                >
                  <User className="size-4 text-[#0f7a5a]" />
                  Update Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <div className="p-1">
                  <SignOutButton />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-9 px-3 text-[13px] font-medium text-[#475569] hover:text-[#12211c]"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-9 rounded-full bg-[#0f7a5a] px-4 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
                )}
              >
                Sign Up
              </Link>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 md:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <MenuIcon className="size-4" />
            </SheetTrigger>

            <SheetContent
              side="right"
              initialFocus={false}
              className="w-[86%] max-w-sm gap-0 bg-white p-0"
            >
              <SheetHeader className="border-b border-[#e4ece7] px-5 py-4">
                <SheetTitle className="sr-only">Main navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate MentorLagbe pages and account actions.
                </SheetDescription>
                <Brand onClick={closeMobile} />
              </SheetHeader>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1 px-3 py-4"
              >
                {NAV_LINKS.map((link) => {
                  const active = isActive(pathname, link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobile}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors",
                        active
                          ? "bg-[#e8f3ee] text-[#0f513f]"
                          : "text-[#475569] hover:bg-[#eef5f1] hover:text-[#12211c]"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-[#e4ece7] px-5 py-5">
                {user ? (
                  <>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="relative shrink-0">
                        <Avatar className="size-10">
                          {displayImage ? (
                            <AvatarImage src={displayImage} alt={displayName} />
                          ) : null}
                          <AvatarFallback className="bg-[#0f7a5a] text-[11px] font-semibold text-white">
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>

                        {userRole !== "admin" && userPlan === "pro" && (
                          <span
                            title="Pro Member"
                            className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-white ring-2 ring-white"
                          >
                            <Crown className="size-2.5" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[#12211c]">
                          {displayName}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <RoleBadge role={userRole} />
                          {userRole !== "admin" && (
                            <PlanBadge plan={userPlan} />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Link
                        href="/dashboard"
                        onClick={closeMobile}
                        className="rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#eef5f1] hover:text-[#12211c]"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={closeMobile}
                        className="rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#eef5f1] hover:text-[#12211c]"
                      >
                        Update Profile
                      </Link>
                      <div className="mt-1">
                        <SignOutButton onComplete={closeMobile} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/signin"
                      onClick={closeMobile}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-10 w-full rounded-full"
                      )}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={closeMobile}
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-10 w-full rounded-full bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]"
                      )}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}