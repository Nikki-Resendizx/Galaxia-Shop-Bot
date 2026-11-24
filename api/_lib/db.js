import { neon } from "@neondatabase/serverless";

export function getSql() {
  const connectionString =
    process.env.GALAXIA_SHOP_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.GALAXIA_SHOP_POSTGRES_URL;
  if (!connectionString) throw new Error("Missing Neon database connection string");
  return neon(connectionString);
}