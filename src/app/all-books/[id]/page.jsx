import Link from "next/link";
import { notFound } from "next/navigation";
import BookCover from "@/components/book-cover";
import BookBorrowDialog from "@/components/book-borrow-dialog";
import { getBookImageUrl } from "@/lib/book-image";
import { requireUser } from "@/lib/require-user";

const BOOKS_API_URL =
  process.env.BOOKS_API_URL || "http://localhost:8000/books";

async function getBook(id) {
  let response;

  try {
    response = await fetch(
      `${BOOKS_API_URL}/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error(
      "Could not connect to the book server. Make sure it is running and try again.",
    );
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`The book server returned an error (${response.status}).`);
  }

  const book = await response.json();
  if (!book || typeof book !== "object" || Array.isArray(book)) {
    throw new Error("The book server returned an invalid response.");
  }

  return book;
}

export default async function BookDetailsPage({ params }) {
  const { id } = await params;
  await requireUser(`/all-books/${id}`);

  let book = null;
  let error = "";

  try {
    book = await getBook(id);
  } catch (problem) {
    error =
      problem instanceof Error
        ? problem.message
        : "Could not load this book. Please try again.";
  }

  if (!book && !error) notFound();

  if (error) {
    return (
      <main className="flex-1 bg-background px-4 py-16 text-foreground sm:px-6">
        <section
          role="alert"
          className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-center sm:p-8"
        >
          <h1 className="text-xl font-semibold text-red-800">
            Book details unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-red-700">{error}</p>
          <Link
            href="/all-books"
            className="mt-6 inline-flex rounded-md bg-[#102a3f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#183a57]"
          >
            Back to All Books
          </Link>
        </section>
      </main>
    );
  }

  const title = book.bookTitle || book.title || "Untitled";
  const author = book.authorName || book.author || "Unknown author";
  const category = book.category || "Uncategorized";
  const imageUrl = getBookImageUrl(book);
  const description =
    book.shortDescription || book.description || "No description available.";
  const ownerName =
    book.userName || book.addedBy?.name || book.ownerName || "BookNook member";
  const ownerEmail =
    book.userEmail || book.addedBy?.email || book.ownerEmail || "";
  const copiesLeft = Number(
    book.availableCopies ?? book.copiesLeft ?? book.totalCopies,
  );

  return (
    <main className="flex-1 bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <article className="mx-auto grid max-w-6xl items-start gap-8 md:grid-cols-[minmax(260px,0.82fr)_minmax(0,1.18fr)] md:gap-10 lg:gap-12">
        <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-lg border border-border shadow-xl shadow-[#102a3f]/10">
          <BookCover
            imageUrl={imageUrl}
            title={title}
            author={author}
            index={0}
            aspectClass="aspect-[2/3]"
          />
        </div>

        <div className="flex min-w-0 flex-col pt-1 md:pt-0">
          <p className="w-fit rounded-full border border-[#d7c8b7] bg-[#ebe3d8] px-3 py-1 text-xs font-medium text-[#8a6d4f]">
            {category}
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">by {author}</p>
          <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-foreground/80 sm:text-base">
            {description}
          </p>

          <BookBorrowDialog
            bookId={id}
            bookTitle={title}
            bookImage={imageUrl}
            authorName={author}
            category={category}
            ownerName={ownerName}
            ownerEmail={ownerEmail}
            initialCopies={copiesLeft}
          />
        </div>
      </article>
    </main>
  );
}