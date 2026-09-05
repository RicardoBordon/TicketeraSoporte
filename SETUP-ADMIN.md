## Arquitectura

- **Login unificado**: una sola pantalla (`/`) sirve tanto para técnicos de sala
  como para el admin. `/api/login` valida contra `ADMIN_USER`/`ADMIN_PASSWORD_HASH`
  (admin) o contra `api/usuarios.js` (salas, con contraseñas hasheadas también).
  La sesión se guarda en una cookie httpOnly firmada (JWT) — nunca en `localStorage`.
- **Configuración dinámica** (email de destino, Client ID/Secret de Google, y el
  email + refresh token de cada sala) se guarda en **Vercel Global Config**
  (antes llamado "Edge Config" — mismo producto, nombre nuevo desde julio 2026),
  editable desde el panel sin necesidad de redeploy.
- **Conectar cuentas de Google**: desde el panel de admin, un botón por sala
  dispara el flujo OAuth (`/api/google-auth` → consentimiento de Google →
  `/api/google-callback`), que guarda el refresh token automáticamente. Nunca
  hace falta copiarlo a mano.

## 1. Variables de entorno necesarias

Cargalas en Vercel (Project → Settings → Environment Variables) para **Production**,
y en tu `.env.local` para desarrollo local:

| Variable                  | Para qué sirve                                                  |
|----------------------------|------------------------------------------------------------------|
| `JWT_SECRET`               | Firma las cookies de sesión. Generala con `openssl rand -hex 32` (o `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` en Windows). |
| `ADMIN_USER`               | Usuario para entrar como admin.                                   |
| `ADMIN_PASSWORD_HASH`      | Hash bcrypt de la contraseña de admin (ver sección 3).            |
| `SALA_CASEROS_USER` / `SALA_CASEROS_PASSWORD_HASH` | Login de la sala CASEROS (y lo mismo para MERLO, CIUDADELA, HURLINGHAM). |
| `GLOBAL_CONFIG_ID`         | ID del store de Global Config (`ecfg_...`), ver sección 2.        |
| `GLOBAL_CONFIG_API_TOKEN`  | Token de API de Vercel con **acceso completo a la cuenta** (no restringido a un proyecto). ⚠️ No lo llames `VERCEL_API_TOKEN` — ese prefijo está reservado por la plataforma y el valor no se guarda. |
| `GLOBAL_CONFIG_TEAM_ID`    | Solo si tu proyecto pertenece a un Team de Vercel (no una cuenta personal). |
| `GOOGLE_REDIRECT_URI`      | `https://tu-dominio.vercel.app/api/google-callback` en producción, `http://localhost:3000/api/google-callback` en local. |
| `APP_URL`                  | `https://tu-dominio.vercel.app` en producción, `http://localhost:3000` en local. |

`GLOBAL_CONFIG` (la cadena de conexión de lectura) la agrega Vercel solo al
conectar el store al proyecto — no la cargues a mano.

Las variables viejas (`CASEROS_EMAIL`, `CLIENT_ID`, `CLIENT_SECRET`, etc., sin
prefijo `SALA_`) siguen funcionando como respaldo hasta que guardes algo desde
el panel por primera vez.

## 2. Crear el Global Config en Vercel

1. Proyecto → **Storage** → **Create Database** → **Global Config**.
2. Nombralo (ej. `ticketera-config`) y conectalo a tu proyecto.
3. Copiá su ID (`ecfg_...`) → `GLOBAL_CONFIG_ID`.

## 3. Generar el hash de la contraseña de admin (y de cada sala)

```bash
node scripts/hash-password.js "tuContraseña"
```

Copiá el resultado (`$2a$10$...` o `$2b$10$...`) a la variable correspondiente.

## 4. Configurar Google Cloud Console

1. En tu cliente OAuth 2.0 (APIs y servicios → Credenciales), agregá como
   **URI de redirección autorizada**:
   - `http://localhost:3000/api/google-callback` (para probar en local)
   - `https://tu-dominio.vercel.app/api/google-callback` (producción)
2. El scope que pide la app es `https://mail.google.com/` — es el que
   necesita nodemailer para autenticar por SMTP (no alcanza con `gmail.send`,
   ese solo sirve para la API REST de Gmail).

## 5. Generar el token de API de Vercel

Account Settings → Tokens → Create Token, **sin restringir el scope** (acceso
completo a la cuenta, no "solo este proyecto"). Un token con permisos
restringidos puede fallar silenciosamente al crear ítems nuevos en Global
Config, aunque sí pueda actualizar uno que ya existe.

## 6. Primer guardado

La primera vez, entrá al panel, cargá el Client ID/Secret de Google y el
email de destino, y presioná **"Guardar cambios"** — esto crea el ítem
`config` en Global Config. Recién después vas a poder usar "Conectar cuenta
de Google" para cada sala.

## 7. Desplegar

`git push` a tu rama — Vercel redespliega automáticamente.
ENDOFFILE