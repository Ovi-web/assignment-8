import { authClient } from "@/lib/auth-client";

export async function authenticatedFetch(input, init = {}) {
  const { data, error } = await authClient.$fetch("/token", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (error || typeof data?.token !== "string") {
    throw new Error(
      error?.message || "Your session may have expired. Please try again.",
    );
  }

  const requestHeaders = new Headers(init.headers);
  requestHeaders.set("Authorization", `Bearer ${data.token}`);

  return fetch(input, {
    ...init,
    credentials: "include",
    headers: requestHeaders,
  });
}
