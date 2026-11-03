import { Suspense } from "react";
import Link from "next/link";
import BookCover from "@/components/book-cover";
import BookDetailsButton from "@/components/book-details-button";
import { getBookImageUrl } from "@/lib/book-image";
import { sortBooksNewestFirst } from "@/lib/sort-books";

const NEW_ARRIVALS_API_URL = "http://localhost:8000/books?limit=6";

function NewArrivalsSkeleton() {
  return (
    <div aria-label="Loading new arrivals" aria-busy="true" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.5rem] border border-[#d7c8b7] bg-white/80">
          <div className="aspect-[2/3] animate-pulse bg-[#102a3f]/8" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-20 animate-pulse rounded-full bg-[#102a3f]/8" />
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-[#102a3f]/8" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-[#102a3f]/8" />
            <div className="h-10 animate-pulse rounded-full bg-[#102a3f]/8" />
          </div>
        </div>
      ))}
    </div>
  );
}

function getBookList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.books)) return payload.books;
  if (payload && Array.isArray(payload.data)) return payload.data;

  throw new Error("The books API returned an unexpected response.");
}

function getBookId(book, title, index) {
  const id = book._id ?? book.id ?? book.bookId;

  if (id !== undefined && id !== null && String(id).trim()) {
    return String(id);
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "book"}-${index + 1}`;
}

async function LatestBooks() {
  let response;

  try {
    response = await fetch(NEW_ARRIVALS_API_URL, { cache: "no-store" });
  } catch {
    return <p role="alert" className="text-center text-sm text-[#8d4e40]">Could not connect to the book server. Please try again later.</p>;
  }

  if (!response.ok) {
    return <p role="alert" className="text-center text-sm text-[#8d4e40]">The book server returned an error ({response.status}).</p>;
  }

  let books;
  try {
    books = sortBooksNewestFirst(getBookList(await response.json()));
  } catch (error) {
    return (
      <p role="alert" className="text-center text-sm text-[#8d4e40]">
        {error instanceof Error ? error.message : "The books API returned an invalid response."}
      </p>
    );
  }

  if (books.length === 0) {
    return <p className="rounded-[1.5rem] border border-[#d7c8b7] bg-white/80 px-6 py-10 text-center text-sm text-[#52657a]">No books have been added to the library yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.slice(0, 6).map((book, index) => {
        const title = String(book.bookTitle ?? book.title ?? "Untitled");
        const author = String(book.authorName ?? book.author ?? "Unknown author");
        const category = String(book.category ?? "Uncategorized");
        const imageUrl = getBookImageUrl(book);
        const id = getBookId(book, title, index);

        return (
          <article
            key={id}
            className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#d7c8b7] bg-white/90 text-[#102a3f] shadow-[0_16px_40px_rgba(16,42,63,0.07)] transition duration-200 hover:-translate-y-1 hover:border-[#c29261]/60 hover:shadow-[0_24px_54px_rgba(16,42,63,0.12)]"
          >
            <BookCover imageUrl={imageUrl} title={title} author={author} index={index} aspectClass="aspect-[3/2]" />

            <div className="flex flex-1 flex-col p-4">
              <span className="w-fit rounded-full border border-[#c29261]/30 bg-[#c29261]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#102a3f]">
                {category}
              </span>
              <h3 className="mt-3 truncate text-lg font-semibold" title={title}>{title}</h3>
              <p className="mt-1 truncate text-sm text-[#52657a]" title={author}>by {author}</p>
              <BookDetailsButton
                bookId={id}
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-[#102a3f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#183d5d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102a3f]"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function NewArrivals() {
  return (
    <section aria-labelledby="new-arrivals-heading" className="bg-[#f6f1eb] px-4 py-16 text-[#102a3f] sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#102a3f]">Collections</p>
          <h2 id="new-arrivals-heading" className="mt-3 text-4xl font-semibold sm:text-5xl">New Arrivals</h2>
          <p className="mt-3 text-sm text-[#52657a] sm:text-base">Fresh picks from readers who have shared their favorites with the community.</p>
        </header>

        <Suspense fallback={<NewArrivalsSkeleton />}>
          <LatestBooks />
        </Suspense>

        <div className="mt-8 text-center">
          <Link
            href="/all-books"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#102a3f] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#102a3f] transition-colors hover:bg-[#102a3f] hover:text-white"
          >
            See All Books
          </Link>
        </div>
      </div>
    </section>
  );
}