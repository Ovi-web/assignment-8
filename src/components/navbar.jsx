"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

const navigation = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/all-books" },
  { label: "Add Book", href: "/add-books" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const user = session?.user;
  const visibleNavigation = (user ? navigation : navigation.slice(0, 2)).map(
    (item) => ({
      ...item,
      active:
        item.href === "/"
          ? pathname === "/"
          : pathname === item.href || pathname.startsWith(`${item.href}/`),
    }),
  );

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("You are logged out.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not log out.",
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  const userName = user?.name || "BookNook member";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#d7c8b7] bg-[#f9f3ec]/90 text-primary shadow-[0_8px_24px_rgba(16,42,63,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:min-h-[78px] sm:gap-5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="BookNook home">
          <Image
            src="/logo.png"
            alt="BookNook Online Library"
            width={200}
            height={56}
            priority
            className="h-auto w-[min(38vw,180px)] object-contain sm:w-[200px]"
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
          {visibleNavigation.map(({ label, href, active }) => (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`text-sm transition-colors ${
                active ? "font-semibold text-[#102a3f]" : "text-[#53657b] hover:text-[#102a3f]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {isPending ? (
            <span aria-hidden="true" className="size-10 animate-pulse rounded-full bg-[#102a3f]/10" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`Open ${userName}'s user menu`}
                className="rounded-full outline-none ring-[#c29261] transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f3ec]"
              >
                <Avatar className="size-10 border border-[#d7c8b7] bg-[#102a3f]/5 ring-2 ring-[#c29261]/25">
                  <AvatarImage src={user.image || undefined} alt={userName} />
                  <AvatarFallback className="bg-[#102a3f] font-semibold text-[#f4efe8]">
                    {userName.charAt(0).toUpperCase() || <UserRound size={17} />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <p className="truncate text-sm font-medium text-[#102a3f]">{userName}</p>
                  <p className="mt-1 truncate text-xs text-[#586a7b]">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href="/my-profile" className="flex items-center gap-2" />}
                >
                  <UserRound aria-hidden="true" size={16} />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut} className="text-[#9d4a3f] focus:bg-[#9d4a3f]/10 focus:text-[#9d4a3f]">
                  <LogOut aria-hidden="true" size={16} />
                  {isSigningOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-[#d9c9b7] px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#102a3f] transition-colors hover:bg-[#102a3f]/5 sm:px-4 sm:text-xs sm:tracking-[0.12em]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#102a3f] px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#f5efe6] transition-colors hover:bg-[#183a57] sm:px-4 sm:text-xs sm:tracking-[0.12em]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <nav aria-label="Main navigation" className="booknook-mobile-nav flex items-center justify-start gap-5 overflow-x-auto px-4 pb-2 md:hidden sm:justify-center">
        {visibleNavigation.map(({ label, href, active }) => (
          <Link
            key={label}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 text-[11px] font-medium transition-colors ${
              active ? "text-[#102a3f]" : "text-[#53657b]"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}