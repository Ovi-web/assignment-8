import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/require-user";
import MyBooksTable from "@/app/my-books/my-books-table";
import { sortBooksNewestFirst } from "@/lib/sort-books";

export const dynamic = "force-dynamic";

const BOOKS_API_URL =
  process.env.BOOKS_API_URL || "http://localhost:8000/books";

function getBookList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.books)) return payload.books;
  if (payload && Array.isArray(payload.data)) return payload.data;
  throw new Error("The books API returned an unexpected response.");
}

async function getMyBooks(user) {
  const url = new URL(BOOKS_API_URL);
  url.searchParams.set("email", user.email);

  let response;
  try {
    response = await fetch(url, {
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Could not connect to the book server. Make sure it is running and try again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "The books endpoint was not found. Check the backend route."
        : `The book server returned an error (${response.status}).`,
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The book server returned invalid data.");
  }

  const normalizedEmail = user.email.trim().toLowerCase();
  return sortBooksNewestFirst(
    getBookList(payload).filter(
      (book) =>
        typeof book?.userEmail === "string" &&
        book.userEmail.trim().toLowerCase() === normalizedEmail,
    ),
  );
}

export default async function MyBooksPage() {
  const user = await requireUser("/my-books");
  let books = [];
  let errorMessage = "";

  try {
    books = await getMyBooks(user);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "We couldn't load your books. Please try again.";
  }

  return (
    <main className="min-h-[70vh] flex-1 bg-background text-foreground">
      <header className="border-b border-[#d7c8b7] bg-[#ebe3d8] px-4 py-8 text-center sm:py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          My Books
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Books you added to the library.
        </p>
      </header>

      <section
        aria-label="Your books"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10"
      >
        {errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center"
          >
            <h2 className="font-semibold text-red-800">
              Unable to load your books
            </h2>
            <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <BookOpen
              aria-hidden="true"
              size={28}
              className="mx-auto text-[#8a6d4f]"
            />
            <h2 className="mt-4 text-lg font-semibold">No books added yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Books you add to the library will appear here.
            </p>
            <Button
              render={<Link href="/add-books" />}
              className="mt-5 bg-[#102a3f] text-white hover:bg-[#183a57]"
            >
              <Plus aria-hidden="true" />
              Add New Book
            </Button>
          </div>
        ) : (
          <MyBooksTable
            books={books}
            userName={user.name}
            userEmail={user.email}
          />
        )}
      </section>
    </main>
  );
}