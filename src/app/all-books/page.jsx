import { Suspense } from "react";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import BookCover from "@/components/book-cover";
import BookDetailsButton from "@/components/book-details-button";
import { getBookImageUrl } from "@/lib/book-image";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import { BOOKS_API_URL } from "@/lib/backend-urls";
import { sortBooksNewestFirst } from "@/lib/sort-books";

function BookGridSkeleton() {
  return (
    <div
      aria-label="Loading books"
      aria-busy="true"
      className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 10 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <div className="aspect-[2/3] animate-pulse bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function getBookId(book, index) {
  const id = book._id ?? book.id ?? book.bookId;

  if (id !== undefined && id !== null && String(id).trim()) {
    return String(id);
  }

  const title = book.bookTitle ?? book.title ?? "book";
  const slug = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "book"}-${index + 1}`;
}

function getBookList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.books)) {
    return payload.books;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  throw new Error("The books API returned an unexpected response.");
}

async function fetchBooks() {
  const requestHeaders = await headers();
  const response = await fetch(BOOKS_API_URL, {
    cache: "no-store",
    headers: await getBackendAuthHeaders(requestHeaders),
  });

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "The books endpoint was not found. Check the backend route."
        : `The book server returned an error (${response.status}).`,
    );
  }

  return sortBooksNewestFirst(getBookList(await response.json()));
}

async function BookCatalog() {
  let books = [];
  let errorMessage = "";

  try {
    books = await fetchBooks();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "We couldn't load the books. Please try again.";
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center"
      >
        <h2 className="font-semibold text-red-800">Unable to load books</h2>
        <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
        <h2 className="text-lg font-semibold">No books yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The library is waiting for its first book.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book, index) => {
        const title = String(book.bookTitle ?? book.title ?? "Untitled");
        const author = String(
          book.authorName ?? book.author ?? "Unknown author",
        );
        const category = String(book.category ?? "Uncategorized");
        const imageUrl = getBookImageUrl(book);
        const id = getBookId(book, index);

        return (
          <Card
            key={id}
            className="h-full gap-0 overflow-hidden rounded-lg border border-border bg-card py-0 text-card-foreground shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#c29261]/60 hover:shadow-lg hover:shadow-[#102a3f]/10"
          >
            <BookCover
              imageUrl={imageUrl}
              title={title}
              author={author}
              index={index}
              aspectClass="aspect-[2/3]"
            />

            <CardHeader className="min-w-0 gap-2 px-4 pt-4 pb-2">
              <p className="truncate text-xs text-muted-foreground">{category}</p>
              <h2 className="truncate text-lg font-semibold" title={title}>
                {title}
              </h2>
              <p className="truncate text-sm text-muted-foreground" title={author}>
                by {author}
              </p>
            </CardHeader>

            <CardContent className="mt-auto px-4 pb-4">
              <BookDetailsButton
                bookId={id}
                className="flex h-10 w-full items-center justify-center rounded-md bg-[#102a3f] px-3 text-sm font-medium text-white transition-colors hover:bg-[#183a57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c29261]"
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function AllBooksPage() {
  return (
    <main className="min-h-[70vh] flex-1 bg-background text-foreground">
      <header className="border-b border-[#d7c8b7] bg-[#ebe3d8] px-4 py-8 text-center sm:py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          All Books
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every book on the BookNook shelf.
        </p>
      </header>

      <section
        aria-label="Book catalog"
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8"
      >
        <Suspense fallback={<BookGridSkeleton />}>
          <BookCatalog />
        </Suspense>
      </section>
    </main>
  );
}