import { limpiarCookieSala } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, mensaje: "Método no permitido" });
  }

  limpiarCookieSala(res);
  return res.json({ ok: true });
}