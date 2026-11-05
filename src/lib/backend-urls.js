const EXPRESS_API_BASE_URL = process.env.EXPRESS_API_BASE_URL || "http://localhost:8000";

function getEndpointUrl(configuredUrl, path) {
  const url = configuredUrl
    ? new URL(configuredUrl)
    : new URL(path, `${EXPRESS_API_BASE_URL.replace(/\/+$/, "")}/`);

  return url.toString().replace(/\/+$/, "");
}

export const BOOKS_API_URL = getEndpointUrl(
  process.env.BOOKS_API_URL,
  "books",
);
export const BORROWS_API_URL = getEndpointUrl(
  process.env.BORROWS_API_URL,
  "borrows",
);
export const ADD_BOOKS_API_URL = getEndpointUrl(
  process.env.ADD_BOOKS_API_URL,
  "add-books",
);

export function getResourceUrl(endpoint, id) {
  const url = new URL(endpoint);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/${encodeURIComponent(id)}`;
  url.search = "";
  return url.toString();
}
