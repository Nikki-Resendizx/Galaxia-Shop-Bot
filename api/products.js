import { getSql } from "./_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const sql = getSql();
    const rows = await sql`
      select id, name, description, price, image_url, category, featured
      from products
      where active = true
      order by featured desc, created_at desc
      limit 60
    `;
    return res.status(200).json({ products: rows });
  } catch (error) {
    console.error("Products query failed:", error?.message);
    return res.status(200).json({ products: [], source: "database_unavailable" });
  }
}