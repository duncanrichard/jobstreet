declare namespace Cloudflare {
  interface Env {
  DATABASE_URL?: string;
  POSTGRES_DB?: string;
  POSTGRES_USER?: string;
  POSTGRES_PASSWORD?: string;
  POSTGRES_HOST?: string;
  POSTGRES_PORT?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
