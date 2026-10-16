import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";
import { createSalt, hashPassword, normalizeEmail } from "@/lib/auth";

type Role = "applicant" | "recruiter";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown; role?: unknown };
    const email = normalizeEmail(String(body.email ?? ""));
    const password = String(body.password ?? "");
    const role: Role = body.role === "recruiter" ? "recruiter" : "applicant";
    if (!/^\S+@\S+\.\S+$/.test(email)) return Response.json({ message: "Email tidak valid." }, { status: 400 });
    if (password.length < 8) return Response.json({ message: "Kata sandi minimal 8 karakter." }, { status: 400 });

    const db = getDb();
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length) return Response.json({ message: "Email ini sudah terdaftar. Silakan masuk." }, { status: 409 });

    const passwordSalt = createSalt();
    const passwordHash = await hashPassword(password, passwordSalt);
    const [account] = await db.insert(users).values({ email, passwordHash, passwordSalt, role }).returning({ id: users.id, email: users.email, role: users.role });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const [session] = await db.insert(sessions).values({ userId: account.id, expiresAt }).returning({ id: sessions.id });
    (await cookies()).set("job_streat_session", session.id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: expiresAt, path: "/" });
    return Response.json({ user: account }, { status: 201 });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") return Response.json({ message: "Email ini sudah terdaftar. Silakan masuk." }, { status: 409 });
    console.error("Registration failed", error);
    return Response.json({ message: "Pendaftaran gagal. Coba lagi." }, { status: 500 });
  }
}
