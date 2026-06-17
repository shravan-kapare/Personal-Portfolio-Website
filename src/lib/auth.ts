import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secretKey = process.env.ADMIN_PASSWORD || "default-secret-do-not-use-in-prod";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(username?: string, password?: string) {
  // If credentials are not set in the environment, disable login completely for security
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    console.error("ADMIN_USERNAME or ADMIN_PASSWORD is not set in the environment. Login disabled.");
    return false;
  }

  // Strict validation against environment variables
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return false;
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ role: "admin", expires });

  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true, secure: process.env.NODE_ENV === "production" });
  return true;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function verifyApiAuth(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  if (!session) return false;
  try {
    await decrypt(session);
    return true;
  } catch (err) {
    return false;
  }
}
