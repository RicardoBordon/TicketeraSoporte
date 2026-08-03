import USERS from "./usuarios.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      mensaje: "Método no permitido",
    });
  }

  const { usuario, password } = req.body;

  const usuarioEncontrado = USERS.find(
    (u) =>
      u.usuario === usuario &&
      u.password === password
  );

  if (!usuarioEncontrado) {
    return res.status(401).json({
      ok: false,
      mensaje: "Usuario o contraseña incorrectos",
    });
  }

  return res.json({
    ok: true,
    usuario: {
      usuario: usuarioEncontrado.usuario,
      sala: usuarioEncontrado.sala,
    },
  });
}