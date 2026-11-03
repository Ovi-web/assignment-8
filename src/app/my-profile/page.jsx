import { UserRound } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { requireUser } from "@/lib/require-user";

function formatMembershipDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function MyProfilePage() {
  const user = await requireUser("/my-profile");
  const name = user.name || "BookNook member";
  const initial = name.charAt(0).toUpperCase();

  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6">
      <section
        aria-label="My profile"
        className="w-full max-w-md rounded-2xl border border-[#d7c8b7] bg-[#fffdf9] p-8 text-center shadow-xl shadow-[#102a3f]/10 sm:p-10"
      >
        <Avatar className="mx-auto size-28 border border-[#d7c8b7] ring-4 ring-[#c29261]/20">
          <AvatarImage src={user.image || undefined} alt={name} />
          <AvatarFallback className="bg-[#ebe3d8] font-display text-3xl font-semibold text-[#102a3f]">
            {initial || <UserRound aria-hidden="true" size={34} />}
          </AvatarFallback>
        </Avatar>

        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-[#102a3f]">
          {name}
        </h1>
        <p className="mt-1 break-all text-sm text-muted-foreground">{user.email}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          Member since {formatMembershipDate(user.createdAt)}
        </p>
      </section>
    </main>
  );
}