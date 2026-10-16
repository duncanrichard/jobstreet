import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { sessions } from "@/db/schema";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("job_streat_session")?.value;
  if (sessionId) await getDb().delete(sessions).where(eq(sessions.id, sessionId));
  cookieStore.delete("job_streat_session");
  return Response.json({ ok: true });
}
