import { auth } from "@/lib/auth";
import { SignJWT } from "jose";

const jwtSecret = process.env.JWT_SECRET;
const jwtSecretKey = jwtSecret
  ? new TextEncoder().encode(jwtSecret)
  : null;

async function createBackendToken(requestHeaders) {
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) return null;

  if (!jwtSecretKey || jwtSecretKey.byteLength < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 bytes.");
  }

  const user = session.user;
  return new SignJWT({
    user: {
      id: user.id,
      email: user.email,
    },
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(jwtSecretKey);
}

export async function getBackendAuthHeaders(requestHeaders, additionalHeaders = {}) {
  const cookie = requestHeaders.get("cookie");
  const token = await createBackendToken(requestHeaders);

  return {
    ...(cookie ? { cookie } : {}),
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    ...additionalHeaders,
  };
}
