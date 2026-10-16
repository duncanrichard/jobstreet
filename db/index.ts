import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function getDb() {
  const databaseUrl = createDatabaseUrl() ?? readEnv("DATABASE_URL");
  if (!databaseUrl) throw new Error("Konfigurasi PostgreSQL belum lengkap. Isi POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, dan POSTGRES_PORT.");

  return drizzle(postgres(databaseUrl, { max: 1, connect_timeout: 10 }), { schema });
}

function createDatabaseUrl() {
  const POSTGRES_DB = readEnv("POSTGRES_DB");
  const POSTGRES_USER = readEnv("POSTGRES_USER");
  const POSTGRES_PASSWORD = readEnv("POSTGRES_PASSWORD");
  const POSTGRES_HOST = readEnv("POSTGRES_HOST") ?? "localhost";
  const POSTGRES_PORT = readEnv("POSTGRES_PORT") ?? "5432";
  if (!POSTGRES_DB || !POSTGRES_USER || !POSTGRES_PASSWORD) return null;
  return `postgresql://${encodeURIComponent(POSTGRES_USER)}:${encodeURIComponent(POSTGRES_PASSWORD)}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
}

type DatabaseEnvKey = "DATABASE_URL" | "POSTGRES_DB" | "POSTGRES_USER" | "POSTGRES_PASSWORD" | "POSTGRES_HOST" | "POSTGRES_PORT";

function readEnv(name: DatabaseEnvKey): string | undefined {
  return env[name] ?? process.env[name];
}
