import { cookies } from "next/headers";
import { isValidSession } from "./store";

export const SESSION_COOKIE = "sid";

// The admin "user" is whoever holds a valid session cookie. Single-admin app.
export async function getAdminUser() {
  const sid = (await cookies()).get(SESSION_COOKIE)?.value;
  if (sid && isValidSession(sid)) {
    return { email: process.env.ADMIN_EMAIL || "admin" };
  }
  return null;
}

export async function assertAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorized");
  return user;
}
