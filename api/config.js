import dotenv from "dotenv";
import { get } from "@vercel/global-config";
import { exigirAdmin } from "./_lib/auth.js";

dotenv.config({ path: ".env.local" });

const CLAVE_CONFIG = "config";

// Config por defecto: se usa la primera vez, antes de que exista
// algo guardado en Global Config. Podés ajustar el email de destino inicial.
function configPorDefecto() {
  return {
    emailDestino: process.env.EMAIL_DESTINO || "",
    clientId: process.env.CLIENT_ID || "",
    clientSecret: process.env.CLIENT_SECRET || "",
    turnos: {
      manana: { nombre: "Mañana", inicio: "06:01", fin: "14:00" },
      tarde: { nombre: "Tarde", inicio: "14:01", fin: "22:00" },
      noche: { nombre: "Noche", inicio: "22:01", fin: "06:00" },
    },
    salas: {
      CASEROS: {
        email: process.env.CASEROS_EMAIL || "",
        refreshToken: process.env.CASEROS_REFRESH_TOKEN || "",
      },
      MERLO: {
        email: process.env.MERLO_EMAIL || "",
        refreshToken: process.env.MERLO_REFRESH_TOKEN || "",
      },
      CIUDADELA: {
        email: process.env.CIUDADELA_EMAIL || "",
        refreshToken: process.env.CIUDADELA_REFRESH_TOKEN || "",
      },
      HURLINGHAM: {
        email: process.env.HURLINGHAM_EMAIL || "",
        refreshToken: process.env.HURLINGHAM_REFRESH_TOKEN || "",
      },
    },
  };
}

// Uso interno (sendMail.js, google-callback.js): config real, con secretos.
export async function obtenerConfigActual() {
  const guardada = await get(CLAVE_CONFIG);
  const predeterminada = configPorDefecto();

  return guardada
    ? { ...predeterminada, ...guardada, turnos: guardada.turnos || predeterminada.turnos }
    : predeterminada;
}

// Versión para mandar al navegador: nunca expone clientSecret ni
// refreshToken reales, solo si están configurados o no.
function configParaFrontend(config) {
  const salas = {};
  for (const [nombreSala, datos] of Object.entries(config.salas || {})) {
    salas[nombreSala] = {
      email: datos.email || "",
      refreshToken: "",
      refreshTokenConfigurado: Boolean(datos.refreshToken),
    };
  }

  return {
    emailDestino: config.emailDestino || "",
    clientId: "",
    clientIdConfigurado: Boolean(config.clientId),
    clientSecret: "",
    clientSecretConfigurado: Boolean(config.clientSecret),
    turnos: config.turnos,
    salas,
  };
}

// Combina lo que mandó el panel con lo que ya había guardado: si el panel
// mandó un campo sensible vacío, se conserva el valor anterior en vez de
// borrarlo. Si mandó algo nuevo, lo reemplaza.
async function combinarConGuardado(nuevoDesdeFrontend) {
  const actual = await obtenerConfigActual();

  const salas = {};
  for (const [nombreSala, datosNuevos] of Object.entries(nuevoDesdeFrontend.salas || {})) {
    const datosActuales = actual.salas?.[nombreSala] || {};
    salas[nombreSala] = {
      email: datosNuevos.email ?? datosActuales.email ?? "",
      refreshToken: datosNuevos.refreshToken ? datosNuevos.refreshToken : (datosActuales.refreshToken || ""),
    };
  }

  return {
    emailDestino: nuevoDesdeFrontend.emailDestino ?? actual.emailDestino ?? "",
    clientId: nuevoDesdeFrontend.clientId ? nuevoDesdeFrontend.clientId : (actual.clientId || ""),
    clientSecret: nuevoDesdeFrontend.clientSecret ? nuevoDesdeFrontend.clientSecret : (actual.clientSecret || ""),
    turnos: nuevoDesdeFrontend.turnos || actual.turnos,
    salas,
  };
}

async function intentarGuardar(nuevaConfig) {
  const globalConfigId = process.env.GLOBAL_CONFIG_ID;
  const token = process.env.GLOBAL_CONFIG_API_TOKEN;
  const teamId = process.env.GLOBAL_CONFIG_TEAM_ID; // opcional, solo si el proyecto está en un team

  if (!globalConfigId || !token) {
    throw new Error("Faltan GLOBAL_CONFIG_ID o GLOBAL_CONFIG_API_TOKEN en las variables de entorno");
  }

  const url = new URL(`https://api.vercel.com/v1/global-config/${globalConfigId}/items`);
  if (teamId) url.searchParams.set("teamId", teamId);

  const respuesta = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ operation: "upsert", key: CLAVE_CONFIG, value: nuevaConfig }],
    }),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(`No se pudo guardar la configuración en Global Config: ${detalle}`);
  }
}

export async function guardarConfig(nuevaConfig) {
  await intentarGuardar(nuevaConfig);
}

function validarConfig(config) {
  if (!config || typeof config !== "object") return "Configuración inválida";
  if (!config.emailDestino || typeof config.emailDestino !== "string") {
    return "Falta el email de destino";
  }
  if (!config.clientId || !config.clientSecret) {
    return "Faltan el Client ID o el Client Secret";
  }
  if (!config.turnos || typeof config.turnos !== "object") {
    return "Faltan los horarios de los turnos";
  }
  for (const [clave, turno] of Object.entries(config.turnos)) {
    if (!turno || typeof turno !== "object" || !/^\d{2}:\d{2}$/.test(turno.inicio) || !/^\d{2}:\d{2}$/.test(turno.fin)) {
      return `Horario inválido para el turno ${clave}`;
    }
  }
  if (!config.salas || typeof config.salas !== "object") {
    return "Faltan las salas";
  }
  for (const [nombreSala, datos] of Object.entries(config.salas)) {
    if (!datos || typeof datos !== "object") {
      return `Configuración inválida para la sala ${nombreSala}`;
    }
  }
  return null;
}

export default async function handler(req, res) {
  const admin = exigirAdmin(req, res);
  if (!admin) return; // exigirAdmin ya respondió 401

  if (req.method === "GET") {
    try {
      const config = await obtenerConfigActual();
      return res.json({ ok: true, config: configParaFrontend(config) });
    } catch (error) {
      return res.status(500).json({ ok: false, mensaje: "No se pudo leer la configuración" });
    }
  }

  if (req.method === "POST") {
    try {
      const configCompleta = await combinarConGuardado(req.body);

      const error = validarConfig(configCompleta);
      if (error) {
        return res.status(400).json({ ok: false, mensaje: error });
      }

      await guardarConfig(configCompleta);
      return res.json({ ok: true, config: configParaFrontend(configCompleta) });
    } catch (error) {
      return res.status(500).json({ ok: false, mensaje: error.message });
    }
  }

  return res.status(405).json({ ok: false, mensaje: "Método no permitido" });
}
