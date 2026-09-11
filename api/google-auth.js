import dotenv from "dotenv";
import { google } from "googleapis";
import { exigirAdmin, firmarTokenAdmin } from "./_lib/auth.js";
import { obtenerConfigActual } from "./config.js";

dotenv.config({ path: ".env.local" });

const SALAS_VALIDAS = new Set(["CASEROS", "MERLO", "CIUDADELA", "HURLINGHAM"]);

function obtenerRedirectUri(req) {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI;

  const protocolo = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocolo}://${host}/api/google-callback`;
}

export default async function handler(req, res) {
  const admin = exigirAdmin(req, res);
  if (!admin) return;

  const sala = String(req.query?.sala || "").toUpperCase();
  if (!SALAS_VALIDAS.has(sala)) {
    return res.status(400).json({ ok: false, mensaje: "Sala inválida" });
  }

  try {
    const config = await obtenerConfigActual();
    if (!config.clientId || !config.clientSecret) {
      return res.status(400).json({
        ok: false,
        mensaje: "Guardá primero el Client ID y el Client Secret de Google",
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      obtenerRedirectUri(req)
    );

    const state = firmarTokenAdmin({ flujo: "google", sala });
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
],
      state,
    });

    return res.redirect(url);
  } catch (error) {
    console.error("ERROR iniciando autorización de Google:", error);
    return res.status(500).json({ ok: false, mensaje: "No se pudo iniciar Google" });
  }
}