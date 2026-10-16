import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";
import { normalizeEmail, passwordMatches } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown; role?: unknown };
    const email = normalizeEmail(String(body.email ?? ""));
    const password = String(body.password ?? "");
    const role = body.role === "recruiter" ? "recruiter" : "applicant";
    const db = getDb();
    const [account] = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, role))).limit(1);
    if (!account || !(await passwordMatches(password, account.passwordSalt, account.passwordHash))) {
      return Response.json({ message: "Email, peran, atau kata sandi tidak sesuai." }, { status: 401 });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const [session] = await db.insert(sessions).values({ userId: account.id, expiresAt }).returning({ id: sessions.id });
    (await cookies()).set("job_streat_session", session.id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: expiresAt, path: "/" });
    return Response.json({ user: { id: account.id, email: account.email, role: account.role } });
  } catch (error) {
    console.error("Login failed", error);
    return Response.json({ message: "Login gagal. Coba lagi." }, { status: 500 });
  }
}
