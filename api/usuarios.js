import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const USERS = [
  {
    usuario: process.env.SALA_CASEROS_USER,
    passwordHash: process.env.SALA_CASEROS_PASSWORD_HASH,
    sala: "CASEROS",
  },
  {
    usuario: process.env.SALA_MERLO_USER,
    passwordHash: process.env.SALA_MERLO_PASSWORD_HASH,
    sala: "MERLO",
  },
  {
    usuario: process.env.SALA_CIUDADELA_USER,
    passwordHash: process.env.SALA_CIUDADELA_PASSWORD_HASH,
    sala: "CIUDADELA",
  },
  {
    usuario: process.env.SALA_HURLINGHAM_USER,
    passwordHash: process.env.SALA_HURLINGHAM_PASSWORD_HASH,
    sala: "HURLINGHAM",
  },
].filter((user) => user.usuario && user.passwordHash);

export default USERS;