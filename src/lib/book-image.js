const BOOK_IMAGE_FIELDS = [
  "bookImage",
  "imageUrl",
  "bookImageUrl",
  "coverImage",
  "image",
];

export function getBookImageUrl(book) {
  if (!book || typeof book !== "object") return "";

  for (const field of BOOK_IMAGE_FIELDS) {
    const value = book[field];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}
