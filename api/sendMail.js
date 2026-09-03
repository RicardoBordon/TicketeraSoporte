import dotenv from "dotenv";
import { google } from "googleapis";
import nodemailer from "nodemailer";

dotenv.config();

function obtenerCredencialesGmail(sala) {
  const cuentas = {
    CASEROS: {
      email: process.env.CASEROS_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.CASEROS_REFRESH_TOKEN,
    },

    MERLO: {
      email: process.env.MERLO_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.MERLO_REFRESH_TOKEN,
    },

    CIUDADELA: {
      email: process.env.CIUDADELA_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.CIUDADELA_REFRESH_TOKEN,
    },

    HURLINGHAM: {
      email: process.env.HURLINGHAM_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.HURLINGHAM_REFRESH_TOKEN,
    },
  };

  return cuentas[sala];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Método no permitido",
    });
  }

  try {
    const {
      sala,
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

    const salaFormateada = String(sala || '')
      .toLowerCase()
      .replace(/(^|\s)([a-z])/g, (match, space, letter) => `${space}${letter.toUpperCase()}`);

    const gmail = obtenerCredencialesGmail(sala);

    if (!gmail) {
      throw new Error(`No existe configuración para la sala: ${sala}`);
    }

    if (
      !gmail.email ||
      !gmail.clientId ||
      !gmail.clientSecret ||
      !gmail.refreshToken
    ) {
      throw new Error(`Faltan credenciales para la sala: ${sala}`);
    }

    const oauth2Client = new google.auth.OAuth2(
      gmail.clientId,
      gmail.clientSecret
    );

    oauth2Client.setCredentials({
      refresh_token: gmail.refreshToken,
    });

    const accessToken = await oauth2Client.getAccessToken();

    if (!accessToken.token) {
      throw new Error("No se pudo obtener el Access Token");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: gmail.email,
        clientId: gmail.clientId,
        clientSecret: gmail.clientSecret,
        refreshToken: gmail.refreshToken,
        accessToken: accessToken.token,
      },
    });

  const esUidValido = /^\d{1,7}$/.test(uid);
  const fragmentoUid = esUidValido ? `UID ${uid} ` : uid;

    await transporter.sendMail({
      from: gmail.email,
      to: ["soporte@grupomidas.com"],
      subject: `${sala} | ${categoriaAsunto} | ${fragmentoUid} | ${subcategoria}`,
      text: `
Categoría: ${categoria} — ${subcategoria}
Criticidad: ${criticidad}
Sala/Ubicación: ${salaFormateada}
Máquina/UID: ${uid}
Motivo: ${motivo || 'Sin motivo'}
Técnico responsable: ${tecnico}
Turno/Fecha: ${turno} — ${fecha}

`});

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