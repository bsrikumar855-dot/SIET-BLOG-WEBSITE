import { cookies } from "next/headers";
import type { User } from "./types";

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) {
      return null;
    }

    const BASE = `${process.env.NEXT_PUBLIC_API_BASE!}/api/v1`;
    const res = await fetch(`${BASE}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const user = await res.json();
    return user as User;
  } catch (error) {
    console.warn("getSession: Authentication fetch failed or was offline.", error);
    return null;
  }
}
