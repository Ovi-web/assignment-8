"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/authenticated-fetch";
import { getBookImageUrl } from "@/lib/book-image";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getBookTitle(borrow) {
  return String(borrow.bookTitle ?? borrow.title ?? "Untitled");
}

function getBookImage(borrow) {
  return getBookImageUrl(borrow);
}

function getBorrowId(borrow, index) {
  const id = borrow._id ?? borrow.id ?? borrow.borrowId;
  return id === undefined || id === null
    ? `${getBookTitle(borrow)}-${index}`
    : String(id);
}

export default function BorrowList({ borrows }) {
  const [activeBorrows, setActiveBorrows] = useState(borrows);
  const [returningId, setReturningId] = useState("");

  async function handleReturnBook(borrowId, title) {
    setReturningId(borrowId);

    try {
      const response = await authenticatedFetch("/api/borrows", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not return this book.");
      }

      setActiveBorrows((currentBorrows) =>
        currentBorrows.filter((borrow, index) => {
          return getBorrowId(borrow, index) !== borrowId;
        }),
      );
      toast.success(`"${title}" has been returned.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not return this book. Please try again.",
      );
    } finally {
      setReturningId("");
    }
  }

  if (activeBorrows.length === 0) {
    return (
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
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-[#ebe3d8] text-xs text-[#53657b]">
              <th scope="col" className="px-4 py-3 font-medium">
                Image
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Title
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Borrow Date
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Return Date
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activeBorrows.map((borrow, index) => {
              const title = getBookTitle(borrow);
              const image = getBookImage(borrow);
              const borrowId = getBorrowId(borrow, index);
              const hasDatabaseId = /^[a-f\d]{24}$/i.test(borrowId);
              const borrowDate =
                borrow.borrowDate ?? borrow.borrowedAt ?? borrow.createdAt;

              return (
                <tr
                  key={borrowId}
                  className="text-sm text-foreground/80 transition-colors hover:bg-[#f9f3ec]"
                >
                  <td className="px-4 py-2">
                    {image ? (
                      <Image
                        src={image}
                        alt={`Cover of ${title}`}
                        width={40}
                        height={52}
                        unoptimized
                        className="h-[52px] w-10 rounded-sm object-cover"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={`No cover available for ${title}`}
                        className="flex h-[52px] w-10 items-center justify-center rounded-sm bg-[#ebe3d8] text-[#8a6d4f]"
                      >
                        <BookOpen aria-hidden="true" size={18} />
                      </div>
                    )}
                  </td>
                  <td className="max-w-64 truncate px-4 py-2 font-medium text-[#102a3f]">
                    {title}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-xs text-muted-foreground">
                    {formatDate(borrowDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-xs text-muted-foreground">
                    {formatDate(borrow.returnDate)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleReturnBook(borrowId, title)}
                      disabled={!hasDatabaseId || Boolean(returningId)}
                      title={
                        hasDatabaseId
                          ? "Return this book"
                          : "This borrow record cannot be returned."
                      }
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#d7c8b7] bg-[#fffdf9] px-3 py-1.5 text-xs text-[#102a3f] transition-colors hover:border-[#c29261] hover:bg-[#ebe3d8] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {returningId === borrowId && (
                        <LoaderCircle
                          aria-hidden="true"
                          size={13}
                          className="animate-spin"
                        />
                      )}
                      {returningId === borrowId
                        ? "Returning..."
                        : "Return Book"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}