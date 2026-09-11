import dotenv from "dotenv";
import { google } from "googleapis";
import { get } from "@vercel/global-config";
import { exigirSala } from "./_lib/auth.js";

dotenv.config({ path: ".env.local" });


// Config por defecto: se usa si todavía no guardaste nada desde el panel
// de admin, para no romper lo que ya tenías funcionando.
function configPorDefecto() {
  return {
    emailDestino: process.env.EMAIL_DESTINO || "soporte@grupomidas.com.ar",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    salas: {
      CASEROS: {
        email: process.env.CASEROS_EMAIL,
        refreshToken: process.env.CASEROS_REFRESH_TOKEN,
      },
      MERLO: {
        email: process.env.MERLO_EMAIL,
        refreshToken: process.env.MERLO_REFRESH_TOKEN,
      },
      CIUDADELA: {
        email: process.env.CIUDADELA_EMAIL,
        refreshToken: process.env.CIUDADELA_REFRESH_TOKEN,
      },
      HURLINGHAM: {
        email: process.env.HURLINGHAM_EMAIL,
        refreshToken: process.env.HURLINGHAM_REFRESH_TOKEN,
      },
    },
  };
}

async function obtenerConfig() {
  try {
    const guardada = await get("config");
    if (guardada) return guardada;
  } catch (error) {
    console.error("No se pudo leer config de Global Config, uso variables de entorno:", error);
  }
  return configPorDefecto();
}

// Arma el mensaje en formato RFC 2822 (lo que espera la API de Gmail) y lo
// codifica en base64url, como exige `users.messages.send`.
function construirMensajeBase64(remitente, destinatario, asunto, cuerpo) {
  const mensaje = [
    `From: ${remitente}`,
    `To: ${destinatario}`,
    `Subject: =?utf-8?B?${Buffer.from(asunto, "utf-8").toString("base64")}?=`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    cuerpo,
  ].join("\r\n");

  return Buffer.from(mensaje)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Método no permitido",
    });
  }

  const usuarioSala = exigirSala(req, res);
  if (!usuarioSala) return;

  try {
    const {
      uid,
      tecnico,
      categoria,
      categoriaAsunto,
      subcategoria,
      criticidad,
      turno,
      fecha,
      motivo,
    } = req.body;

    const salaAutorizada = usuarioSala.sala;
    const salaFormateada = String(salaAutorizada || '')
      .toLowerCase()
      .replace(/(^|\s)([a-z])/g, (match, space, letter) => `${space}${letter.toUpperCase()}`);

    const config = await obtenerConfig();
    const gmail = config.salas?.[salaAutorizada];

    if (!gmail) {
      throw new Error(`No existe configuración para la sala: ${salaAutorizada}`);
    }

    if (!config.clientId || !config.clientSecret) {
      throw new Error("Faltan Client ID/Client Secret en la configuración");
    }

    if (!gmail.email || !gmail.refreshToken) {
      throw new Error(`Faltan credenciales para la sala: ${salaAutorizada}`);
    }

    const oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret
    );

    oauth2Client.setCredentials({
      refresh_token: gmail.refreshToken,
    });

    const gmailApi = google.gmail({ version: "v1", auth: oauth2Client });

    const esUidValido = /^\d{1,7}$/.test(uid);
    const fragmentoUid = esUidValido ? `UID ${uid} ` : uid;

    const asunto = `${salaAutorizada} | ${categoriaAsunto} | ${fragmentoUid} | ${subcategoria}`;
    const cuerpo = `
Categoría: ${categoria} — ${subcategoria}
Criticidad: ${criticidad}
Sala/Ubicación: ${salaFormateada}
Máquina/UID: ${uid}
Motivo: ${motivo || 'Sin motivo'}
Técnico responsable: ${tecnico}
Turno/Fecha: ${turno} — ${fecha}
`;

    const mensajeCodificado = construirMensajeBase64(
      gmail.email,
      config.emailDestino,
      asunto,
      cuerpo
    );

    await gmailApi.users.messages.send({
      userId: "me",
      requestBody: { raw: mensajeCodificado },
    });

    return res.status(200).json({
      ok: true,
      mensaje: "Ticket enviado correctamente",
    });
  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}