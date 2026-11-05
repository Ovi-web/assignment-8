import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import { BOOKS_API_URL, getResourceUrl } from "@/lib/backend-urls";
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

function forwardResponse(response, body) {
  return new Response(body || null, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "text/plain; charset=utf-8",
    },
  });
}

function getBookList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.books)) return payload.books;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return null;
}

async function getOwnedBook(id, email, requestHeaders) {
  const url = new URL(BOOKS_API_URL);
  url.searchParams.set("email", email);
  const response = await fetch(url, {
    cache: "no-store",
    headers: await getBackendAuthHeaders(requestHeaders),
  });

  if (!response.ok) {
    const error = new Error("Could not verify book ownership.");
    error.status = response.status;
    throw error;
  }

  const books = getBookList(await response.json());
  if (!books) {
    throw new Error("The book server returned invalid data.");
  }

  return books.find(
    (book) =>
      String(book?._id ?? book?.id ?? book?.bookId) === id &&
      typeof book?.userEmail === "string" &&
      book.userEmail.trim().toLowerCase() === email.trim().toLowerCase(),
  );
}

async function getRequestUser(requestHeaders) {
  const session = await auth.api.getSession({ headers: requestHeaders });
  return session?.user ?? null;
}

export async function PATCH(request, { params }) {
  const requestHeaders = await headers();
  const user = await getRequestUser(requestHeaders);
  if (!user) {
    return NextResponse.json({ message: "Please log in to edit books." }, { status: 401 });
  }

  const { id } = await params;
  if (!OBJECT_ID_PATTERN.test(id)) {
    return NextResponse.json({ message: "The book ID is invalid." }, { status: 400 });
  }

  let updates;
  try {
    updates = await request.json();
  } catch {
    return NextResponse.json({ message: "The book details are invalid." }, { status: 400 });
  }

  if (
    !updates ||
    typeof updates !== "object" ||
    Array.isArray(updates) ||
    typeof updates.title !== "string" ||
    !updates.title.trim() ||
    typeof updates.author !== "string" ||
    !updates.author.trim() ||
    typeof updates.category !== "string" ||
    !updates.category.trim() ||
    !Number.isInteger(updates.totalCopies) ||
    updates.totalCopies < 1 ||
    typeof updates.imageUrl !== "string" ||
    typeof updates.description !== "string"
  ) {
    return NextResponse.json({ message: "Please provide valid book details." }, { status: 400 });
  }

  try {
    const book = await getOwnedBook(id, user.email, requestHeaders);
    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const backendUpdates = {
      ...updates,
      image: updates.imageUrl,
      bookTitle: updates.title,
      authorName: updates.author,
      bookImage: updates.imageUrl,
      shortDescription: updates.description,
    };
    const response = await fetch(getResourceUrl(BOOKS_API_URL, id), {
      method: "PATCH",
      headers: await getBackendAuthHeaders(requestHeaders, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(backendUpdates),
    });
    return forwardResponse(response, await response.text());
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not update this book." },
      { status: Number.isInteger(error?.status) ? error.status : 502 },
    );
  }
}

export async function DELETE(_request, { params }) {
  const requestHeaders = await headers();
  const user = await getRequestUser(requestHeaders);
  if (!user) {
    return NextResponse.json({ message: "Please log in to delete books." }, { status: 401 });
  }

  const { id } = await params;
  if (!OBJECT_ID_PATTERN.test(id)) {
    return NextResponse.json({ message: "The book ID is invalid." }, { status: 400 });
  }

  try {
    const book = await getOwnedBook(id, user.email, requestHeaders);
    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const response = await fetch(getResourceUrl(BOOKS_API_URL, id), {
      method: "DELETE",
      headers: await getBackendAuthHeaders(requestHeaders),
    });
    return forwardResponse(response, await response.text());
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not delete this book." },
      { status: Number.isInteger(error?.status) ? error.status : 502 },
    );
  }
}