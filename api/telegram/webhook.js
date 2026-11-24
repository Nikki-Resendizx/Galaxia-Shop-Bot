export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  const received = req.headers["x-telegram-bot-api-secret-token"];
  if (expected && received !== expected) return res.status(401).send("Unauthorized");
  const update = req.body || {};
  // Bot commands and checkout flows are intentionally added in the next implementation stage.
  // Never log bot tokens or full update payloads, which may contain personal data.
  console.info("Telegram update received", { update_id: update.update_id, has_message: Boolean(update.message) });
  return res.status(200).json({ ok: true });
}