import { obtenerUsuarioDeRequest } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, mensaje: "Método no permitido" });
  }

  const usuario = obtenerUsuarioDeRequest(req);
  if (!usuario) {
    return res.status(401).json({ ok: false, mensaje: "Sesión no válida" });
  }

  return res.json({ ok: true, usuario });
}