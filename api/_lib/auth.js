import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const COOKIE_NAME = "admin_token";
const SALA_COOKIE_NAME = "sala_token";
const MAX_AGE_SECONDS = 60 * 60 * 2; // 2 horas

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Falta la variable de entorno JWT_SECRET");
  }
  return secret;
}

export function firmarTokenAdmin(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: MAX_AGE_SECONDS });
}

export function verificarTokenAdmin(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

// Vercel parsea automáticamente las cookies en req.cookies para las
// funciones serverless con la firma (req, res).
export function obtenerAdminDeRequest(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  return verificarTokenAdmin(token);
}

export function setCookieAdmin(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  const partes = [
    `${COOKIE_NAME}=${token}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${MAX_AGE_SECONDS}`,
    "SameSite=Strict",
  ];
  if (isProd) partes.push("Secure");
  res.setHeader("Set-Cookie", partes.join("; "));
}

export function limpiarCookieAdmin(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
  );
}

// Middleware simple: llamalo al principio de cada handler protegido.
// Devuelve el payload del admin si es válido, o responde 401 y devuelve null.
export function exigirAdmin(req, res) {
  const admin = obtenerAdminDeRequest(req);
  if (!admin) {
    res.status(401).json({ ok: false, mensaje: "No autorizado" });
    return null;
  }
  return admin;
}

export function firmarTokenSala(payload) {
  return jwt.sign({ ...payload, tipo: "sala" }, getSecret(), {
    expiresIn: MAX_AGE_SECONDS,
  });
}

export function obtenerSalaDeRequest(req) {
  const token = req.cookies?.[SALA_COOKIE_NAME];
  if (!token) return null;
  const sala = verificarTokenAdmin(token);
  return sala?.tipo === "sala" ? sala : null;
}

export function obtenerUsuarioDeRequest(req) {
  const admin = obtenerAdminDeRequest(req);
  if (admin?.admin) {
    return { usuario: admin.usuario, rol: "admin" };
  }

  const sala = obtenerSalaDeRequest(req);
  if (sala) {
    return { usuario: sala.usuario, sala: sala.sala, rol: "sala" };
  }

  return null;
}

export function setCookieSala(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  const partes = [
    `${SALA_COOKIE_NAME}=${token}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${MAX_AGE_SECONDS}`,
    "SameSite=Strict",
  ];
  if (isProd) partes.push("Secure");
  res.setHeader("Set-Cookie", partes.join("; "));
}

export function limpiarCookieSala(res) {
  res.setHeader(
    "Set-Cookie",
    `${SALA_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
  );
}

export function exigirSala(req, res) {
  const sala = obtenerSalaDeRequest(req);
  if (!sala) {
    res.status(401).json({ ok: false, mensaje: "Sesión expirada" });
    return null;
  }
  return sala;
}
