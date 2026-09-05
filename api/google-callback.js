import dotenv from "dotenv";
import { google } from "googleapis";
import { obtenerConfigActual, guardarConfig } from "./config.js";
import { verificarTokenAdmin } from "./_lib/auth.js";

dotenv.config({ path: ".env.local" });

function obtenerRedirectUri(req) {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI;

  const protocolo = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocolo}://${host}/api/google-callback`;
}

function obtenerAppUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL;

  const protocolo = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocolo}://${host}`;
}

function redirigir(req, res, resultado, mensaje) {
  const base = obtenerAppUrl(req);
  const url = new URL(base);
  url.searchParams.set("google", resultado);
  if (mensaje) url.searchParams.set("mensaje", mensaje);
  return res.redirect(url.toString());
}

function mensajeDeError(error) {
  const mensaje = error?.response?.data?.error_description || error?.message;
  return String(mensaje || "Error desconocido")
    .replace(/[\r\n]/g, " ")
    .slice(0, 180);
}

export default async function handler(req, res) {
  const { code, state, error } = req.query || {};
  if (error) {
    const detalle = req.query?.error_description || error;
    return redirigir(req, res, "error", `Google: ${detalle}`);
  }

  const datosEstado = verificarTokenAdmin(state);
  if (!datosEstado?.flujo || datosEstado.flujo !== "google" || !datosEstado.sala) {
    return redirigir(req, res, "error", "Solicitud de autorización inválida");
  }

  try {
    const config = await obtenerConfigActual();
    const oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      obtenerRedirectUri(req)
    );
    const { tokens } = await oauth2Client.getToken(code);

    const refreshToken = tokens.refresh_token || config.salas?.[datosEstado.sala]?.refreshToken;
    if (!refreshToken) {
      return redirigir(req, res, "error", "Google no devolvió un refresh token");
    }

    oauth2Client.setCredentials(tokens);
    const perfil = await oauth2Client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });
    const email = perfil.data.email;

    const nuevaConfig = {
      ...config,
      salas: {
        ...config.salas,
        [datosEstado.sala]: {
          ...config.salas[datosEstado.sala],
          email,
          refreshToken,
        },
      },
    };
    await guardarConfig(nuevaConfig);
    return redirigir(req, res, "ok");
  } catch (errorCallback) {
    return redirigir(req, res, "error", `Google: ${mensajeDeError(errorCallback)}`);
  }
}