import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import USERS from "./usuarios.js";
import {
  firmarTokenAdmin,
  firmarTokenSala,
  setCookieAdmin,
  setCookieSala,
} from "./_lib/auth.js";

dotenv.config({ path: ".env.local" });


export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      mensaje: "Método no permitido",
    });
  }

  const { usuario, password } = req.body || {};

  const adminUser = process.env.ADMIN_USER;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (adminUser && adminPasswordHash && usuario === adminUser) {
    const passwordValida = await bcrypt.compare(password || "", adminPasswordHash);

    if (!passwordValida) {
      return res.status(401).json({
        ok: false,
        mensaje: "Usuario o contraseña incorrectos",
      });
    }

    const token = firmarTokenAdmin({ admin: true, usuario });
    setCookieAdmin(res, token);

    return res.json({
      ok: true,
      usuario: {
        usuario,
        rol: "admin",
      },
    });
  }

  const usuarioEncontrado = USERS.find((u) => u.usuario === usuario);

  if (!usuarioEncontrado || !(await bcrypt.compare(password || "", usuarioEncontrado.passwordHash))) {
    return res.status(401).json({
      ok: false,
      mensaje: "Usuario o contraseña incorrectos",
    });
  }

  const tokenSala = firmarTokenSala({
    usuario: usuarioEncontrado.usuario,
    sala: usuarioEncontrado.sala,
  });
  setCookieSala(res, tokenSala);

  return res.json({
    ok: true,
    usuario: {
      usuario: usuarioEncontrado.usuario,
      sala: usuarioEncontrado.sala,
      rol: "sala",
    },
  });
}