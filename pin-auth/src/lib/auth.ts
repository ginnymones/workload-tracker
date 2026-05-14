import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "wt_session";
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-dev-secret");

export async function createSession(workspaceId: string): Promise<string> {
  const token = await new SignJWT({ workspaceId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return token;
}

export async function getSession(request?: NextRequest): Promise<string | null> {
  try {
    let token: string | undefined;

    if (request) {
      token = request.cookies.get(COOKIE_NAME)?.value;
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    }

    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    return payload.workspaceId as string;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
