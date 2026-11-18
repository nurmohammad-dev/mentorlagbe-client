"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
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

type NavbarUser = {
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  image?: string;
};

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

// Temporary demo user so both navbar states can be reviewed before auth is wired up.
const DEMO_USER: NavbarUser = {
  name: "Admin User",
  email: "admin@mentorlagbe.com",
  role: "admin",
};

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
        <GraduationCap className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-[#12211c]">
        MentorLagbe
      </span>
    </Link>
  );
}

function RoleBadge({ role }: { role: NavbarUser["role"] }) {
  return (
    <span className="rounded-full bg-[#e8f3ee] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0f513f]">
      {role}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<NavbarUser | null>(DEMO_USER);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);
  const signOut = () => {
    setUser(null);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e4ece7] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`Open account menu for ${user.name}`}
                className="flex items-center gap-2 rounded-full p-1 pr-1.5 text-left outline-none transition-colors hover:bg-[#edf5f1] focus-visible:ring-2 focus-visible:ring-[#0f7a5a]/30"
              >
                <Avatar className="size-8">
                  {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                  <AvatarFallback className="bg-[#0f7a5a] text-[10px] font-semibold text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <span className="hidden text-left sm:block">
                  <span className="block max-w-32 truncate text-[12px] font-semibold text-[#12211c]">
                    {user.name}
                  </span>
                  <span className="block text-[10px] capitalize text-[#64748b]">
                    {user.role}
                  </span>
                </span>

                <ChevronDown className="hidden size-3.5 text-[#64748b] sm:block" aria-hidden="true" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8} className="w-60 p-1.5">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{user.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
                  </div>
                  <RoleBadge role={user.role} />
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

                <DropdownMenuItem
                  variant="destructive"
                  onClick={signOut}
                  className="gap-2.5 px-2 py-2 text-[13px] font-medium"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </DropdownMenuItem>
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

              <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-3 py-4">
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
                      <Avatar className="size-10">
                        {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                        <AvatarFallback className="bg-[#0f7a5a] text-[11px] font-semibold text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[#12211c]">
                          {user.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <RoleBadge role={user.role} />
                          <span className="truncate text-[11px] text-[#64748b]">
                            {user.email}
                          </span>
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
                      <button
                        type="button"
                        onClick={signOut}
                        className="mt-1 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/signin"
                      onClick={closeMobile}
                      className={cn(buttonVariants({ variant: "outline" }), "h-10 w-full rounded-full")}
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
