-- Keep inserts from the application valid when `updated_at` is omitted.
UPDATE "users" SET "updated_at" = CURRENT_TIMESTAMP WHERE "updated_at" IS NULL;
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
