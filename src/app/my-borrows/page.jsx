import Link from "next/link";
import { BookOpen } from "lucide-react";
import BorrowList from "@/app/my-borrows/borrow-list";
import { requireUser } from "@/lib/require-user";

const BORROWS_API_URL =
  process.env.BORROWS_API_URL || "http://localhost:8000/borrows";

export const dynamic = "force-dynamic";

function getBorrowList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.borrows)) {
    return payload.borrows;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  throw new Error("The borrows API returned an unexpected response.");
}

async function getMyBorrows(user) {
  const url = new URL(BORROWS_API_URL);
  url.searchParams.set("email", user.email);
  let response;

  try {
    response = await fetch(url, {
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Could not connect to the borrow server. Make sure it is running and try again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "The borrows endpoint was not found. Check the backend route."
        : `The borrow server returned an error (${response.status}).`,
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The borrow server returned invalid data.");
  }

  const normalizedEmail = user.email.trim().toLowerCase();

  return getBorrowList(payload).filter((borrow) => {
    if (!borrow || typeof borrow !== "object") {
      return false;
    }

    const borrowerEmail = borrow.userEmail ?? borrow.email ?? "";
    return (
      typeof borrowerEmail === "string" &&
      borrowerEmail.trim().toLowerCase() === normalizedEmail
    );
  });
}

export default async function MyBorrowsPage() {
  const user = await requireUser("/my-borrows");
  let borrows = [];
  let errorMessage = "";

  try {
    borrows = await getMyBorrows(user);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "We couldn't load your borrowed books. Please try again.";
  }

  return (
    <main className="min-h-[70vh] flex-1 bg-background text-foreground">
      <header className="border-b border-[#d7c8b7] bg-[#ebe3d8] px-4 py-8 text-center sm:py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          My Borrows
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Books you are reading right now.
        </p>
      </header>

      <section
        aria-label="Your borrowed books"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10"
      >
        {errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center"
          >
            <h2 className="font-semibold text-red-800">
              Unable to load your borrows
            </h2>
            <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
          </div>
        ) : borrows.length > 0 ? (
          <BorrowList borrows={borrows} />
        ) : (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <BookOpen
              aria-hidden="true"
              size={28}
              className="mx-auto text-[#8a6d4f]"
            />
            <h2 className="mt-4 text-lg font-semibold">
              You haven&apos;t borrowed any books yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse the library and find your next read.
            </p>
            <Link
              href="/all-books"
              className="mt-5 inline-flex rounded-md bg-[#102a3f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#183a57]"
            >
              Browse Books
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}