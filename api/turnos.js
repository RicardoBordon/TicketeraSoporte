import { obtenerConfigActual } from "./config.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, mensaje: "Método no permitido" });
  }

  try {
    const config = await obtenerConfigActual();
    return res.json({ ok: true, turnos: config.turnos });
  } catch (error) {
    console.error("No se pudieron leer los horarios de turnos:", error);
    return res.status(500).json({ ok: false, mensaje: "No se pudieron cargar los horarios" });
  }
}