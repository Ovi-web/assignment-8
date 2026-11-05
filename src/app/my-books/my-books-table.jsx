"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/authenticated-fetch";
import { getBookImageUrl } from "@/lib/book-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function getBookId(book, index) {
  return String(book._id ?? book.id ?? book.bookId ?? `${book.title}-${index}`);
}

function getTitle(book) {
  return String(book.bookTitle ?? book.title ?? "Untitled");
}

async function readApiResponse(response) {
  const body = await response.text();
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch {
    return { message: body };
  }
}

export default function MyBooksTable({
  books: initialBooks,
  userName,
  userEmail,
}) {
  const [books, setBooks] = useState(initialBooks);
  const [editingBook, setEditingBook] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function handleEdit(event) {
    event.preventDefault();
    if (!editingBook) return;

    const formData = new FormData(event.currentTarget);
    const updates = {
      title: String(formData.get("title") ?? "").trim(),
      author: String(formData.get("author") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      totalCopies: Number(formData.get("totalCopies")),
      imageUrl: String(formData.get("imageUrl") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
    };

    if (!updates.title || !updates.author || !updates.category) {
      toast.error("Title, author, and category are required.");
      return;
    }

    if (!Number.isInteger(updates.totalCopies) || updates.totalCopies < 1) {
      toast.error("Total copies must be a whole number greater than zero.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await authenticatedFetch(
        `/api/books/${encodeURIComponent(getBookId(editingBook, 0))}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        },
      );
      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result?.message || "Could not update this book. Please try again.",
        );
      }

      setBooks((currentBooks) =>
        currentBooks.map((book, index) =>
          getBookId(book, index) === getBookId(editingBook, 0)
            ? {
                ...book,
                ...updates,
                bookTitle: updates.title,
                authorName: updates.author,
                bookImage: updates.imageUrl,
                image: updates.imageUrl,
                shortDescription: updates.description,
              }
            : book,
        ),
      );
      setEditingBook(null);
      toast.success("Book updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update this book.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(book, index) {
    const id = getBookId(book, index);
    const title = getTitle(book);
    if (!window.confirm(`Delete "${title}" from your books?`)) return;

    setDeletingId(id);
    try {
      const response = await authenticatedFetch(`/api/books/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result?.message || "Could not delete this book. Please try again.",
        );
      }

      setBooks((currentBooks) =>
        currentBooks.filter((item, itemIndex) => getBookId(item, itemIndex) !== id),
      );
      toast.success("Book deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete this book.",
      );
    } finally {
      setDeletingId("");
    }
  }

  const fieldClassName =
    "h-10 w-full min-w-0 rounded-md border border-[#d7c8b7] bg-[#f9f3ec] px-3 text-sm text-[#102a3f] outline-none focus-visible:ring-2 focus-visible:ring-[#c29261]";

  return (
    <>
      {books.length === 0 ? (
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
          <Link
            href="/add-books"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#102a3f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#183a57]"
          >
            Add New Book
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-[#ebe3d8] text-xs text-[#53657b]">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Book
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Copies
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {books.map((book, index) => {
                  const title = getTitle(book);
                  const image = getBookImageUrl(book);
                  const id = getBookId(book, index);

                  return (
                    <tr
                      key={id}
                      className="text-sm text-foreground/80 transition-colors hover:bg-[#f9f3ec]"
                    >
                      <td className="px-5 py-2">
                        <div className="flex items-center gap-3">
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
                            <span className="flex h-[52px] w-10 items-center justify-center rounded-sm bg-[#ebe3d8] text-[#8a6d4f]">
                              <BookOpen aria-hidden="true" size={18} />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="max-w-72 truncate font-medium text-[#102a3f]">
                              {title}
                            </p>
                            <p className="max-w-72 truncate text-xs text-muted-foreground">
                              {String(book.authorName ?? book.author ?? "Unknown")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-2">
                        <span className="rounded bg-[#ebe3d8] px-2 py-1 text-xs text-[#53657b]">
                          {String(book.category ?? "Uncategorized")}
                        </span>
                      </td>
                      <td className="px-5 py-2 text-muted-foreground">
                        {String(book.totalCopies ?? 0)}
                      </td>
                      <td className="px-5 py-2 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingBook(book)}
                            className="inline-flex items-center rounded-md border border-[#d7c8b7] bg-[#fffdf9] px-2.5 py-1.5 text-xs text-[#102a3f] transition-colors hover:bg-[#ebe3d8]"
                          >
                            <Pencil aria-hidden="true" size={13} className="mr-1" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(book, index)}
                            disabled={Boolean(deletingId)}
                            className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === id ? (
                              <LoaderCircle
                                aria-hidden="true"
                                size={13}
                                className="mr-1 animate-spin"
                              />
                            ) : (
                              <Trash2
                                aria-hidden="true"
                                size={13}
                                className="mr-1"
                              />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog
        open={Boolean(editingBook)}
        onOpenChange={(open) => {
          if (!open && !isSaving) setEditingBook(null);
        }}
      >
        <DialogContent className="flex max-h-[85vh] max-h-[85dvh] w-full max-w-xl flex-col overflow-hidden border border-[#d7c8b7] bg-[#fffdf9] p-0 text-[#102a3f] sm:max-w-xl">
          <DialogHeader className="shrink-0 border-b border-[#d7c8b7] bg-[#fffdf9] p-4 pr-12 sm:p-6 sm:pr-14">
            <DialogTitle>Edit book</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the book details in your collection.
            </DialogDescription>
          </DialogHeader>
          {editingBook && (
            <form
              onSubmit={handleEdit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6 [scrollbar-width:thin]">
                <label className="block min-w-0 space-y-1.5 text-sm">
                  <span>Title</span>
                  <input
                    name="title"
                    defaultValue={
                      editingBook.title ?? editingBook.bookTitle ?? ""
                    }
                    className={fieldClassName}
                    required
                  />
                </label>
                <div className="grid min-w-0 gap-4 md:grid-cols-2">
                  <label className="block min-w-0 space-y-1.5 text-sm">
                    <span>Added by</span>
                    <input
                      value={userName}
                      className={fieldClassName}
                      readOnly
                    />
                  </label>
                  <label className="block min-w-0 space-y-1.5 text-sm">
                    <span>User email</span>
                    <input
                      type="email"
                      value={userEmail}
                      className={fieldClassName}
                      readOnly
                    />
                  </label>
                </div>
                <label className="block min-w-0 space-y-1.5 text-sm">
                  <span>Author</span>
                  <input
                    name="author"
                    defaultValue={
                      editingBook.author ?? editingBook.authorName ?? ""
                    }
                    className={fieldClassName}
                    required
                  />
                </label>
                <div className="grid min-w-0 gap-4 md:grid-cols-2">
                  <label className="block min-w-0 space-y-1.5 text-sm">
                    <span>Category</span>
                    <input
                      name="category"
                      defaultValue={editingBook.category ?? ""}
                      className={fieldClassName}
                      required
                    />
                  </label>
                  <label className="block min-w-0 space-y-1.5 text-sm">
                    <span>Total copies</span>
                    <input
                      name="totalCopies"
                      type="number"
                      min="1"
                      step="1"
                      defaultValue={editingBook.totalCopies ?? 1}
                      className={fieldClassName}
                      required
                    />
                  </label>
                </div>
                {getBookImageUrl(editingBook) && (
                  <div className="relative mx-auto aspect-[2/3] max-h-48 w-32 overflow-hidden rounded-lg border border-border bg-[#f9f3ec]">
                    <Image
                      src={getBookImageUrl(editingBook)}
                      alt={`Cover of ${getTitle(editingBook)}`}
                      fill
                      unoptimized
                      sizes="128px"
                      className="object-contain"
                    />
                  </div>
                )}
                <label className="block min-w-0 space-y-1.5 text-sm">
                  <span>Cover image URL</span>
                  <input
                    name="imageUrl"
                    type="url"
                    defaultValue={getBookImageUrl(editingBook)}
                    className={fieldClassName}
                  />
                </label>
                <label className="block min-w-0 space-y-1.5 text-sm">
                  <span>Description</span>
                  <textarea
                    name="description"
                    defaultValue={
                      editingBook.description ??
                      editingBook.shortDescription ??
                      ""
                    }
                    maxLength={500}
                    className={`${fieldClassName} min-h-24 resize-y py-2`}
                  />
                </label>
              </div>
              <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-[#d7c8b7] bg-[#fffdf9] p-4">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={isSaving}
                  className="h-9 rounded-md border border-[#d7c8b7] px-3 text-sm text-[#53657b] hover:bg-[#f9f3ec] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#102a3f] px-3 text-sm font-medium text-white hover:bg-[#183a57] disabled:opacity-50"
                >
                  {isSaving && (
                    <LoaderCircle
                      aria-hidden="true"
                      size={15}
                      className="animate-spin"
                    />
                  )}
                  Save changes
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}