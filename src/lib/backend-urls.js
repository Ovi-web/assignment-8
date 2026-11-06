export const BOOKS_API_URL =
  process.env.BOOKS_API_URL || `${process.env.NEXT_PUBLIC_API_URL}/books`;
export const BORROWS_API_URL =
  process.env.BORROWS_API_URL || `${process.env.NEXT_PUBLIC_API_URL}/borrows`;
export const ADD_BOOKS_API_URL =
  process.env.ADD_BOOKS_API_URL || `${process.env.NEXT_PUBLIC_API_URL}/add-books`;

export function getResourceUrl(endpoint, id) {
  const url = new URL(endpoint);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/${encodeURIComponent(id)}`;
  url.search = "";
  return url.toString();
}
