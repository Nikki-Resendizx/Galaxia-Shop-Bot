import { getSql } from "./_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });
  try {
    const sql = getSql();
    await sql`select 1 as connected`;
    return res.status(200).json({ ok: true, service: "galaxia-shop-api", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error?.message);
    return res.status(503).json({ ok: false, service: "galaxia-shop-api", database: "disconnected" });
  }
}