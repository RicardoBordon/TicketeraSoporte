import { Box, Container, Card, CardContent, Typography, Divider } from "@mui/material";

export default function PoliticaPrivacidad() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3c4146, #2f3f4e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="md" sx={{ width: "100%" }}>
        <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #18283d, #3688da)",
              color: "white",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Política de privacidad
            </Typography>
            <Typography variant="body2">Ticketera Técnica — Grupo Midas</Typography>
          </Box>

          <CardContent sx={{ p: { xs: 2, sm: 4 }, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography variant="body1">
              Ticketera es una herramienta de uso interno de Grupo Midas. Esta
              página explica qué datos usa y cómo los trata.
            </Typography>

            <Divider />

            <Typography variant="subtitle1" fontWeight="bold">
              Qué datos usamos
            </Typography>
            <Typography variant="body1">
              La app guarda, para cada sala (CASEROS, MERLO, CIUDADELA,
              HURLINGHAM): la dirección de Gmail conectada y un token de
              autorización de Google (refresh token) que permite enviar
              correos en nombre de esa cuenta.
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
              Permiso de Google que solicitamos
            </Typography>
            <Typography variant="body1">
              Solicitamos únicamente el permiso <code>gmail.send</code> de
              Google, que permite enviar correos en nombre de la cuenta
              conectada. No solicitamos, ni podemos, leer, buscar, eliminar ni
              modificar ningún correo de la bandeja de entrada.
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
              Para qué se usan estos datos
            </Typography>
            <Typography variant="body1">
              Exclusivamente para enviar los tickets de soporte técnico que
              generan los técnicos de cada sala al equipo de soporte interno
              de Grupo Midas (soporte@grupomidas.com.ar). No compartimos estos
              datos con terceros, ni los usamos con fines publicitarios ni
              comerciales.
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
              Dónde se guardan
            </Typography>
            <Typography variant="body1">
              Los tokens de autorización se guardan de forma privada en la
              infraestructura de Vercel (Global Config), accesibles solo por
              el panel de administración de la app, protegido con usuario y
              contraseña.
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
              Cómo revocar el acceso
            </Typography>
            <Typography variant="body1">
              Cualquier cuenta de Gmail conectada puede revocar el acceso en
              cualquier momento desde{" "}
              <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noreferrer"
              >
              myaccount.google.com/permissions
            </a>
            .
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
              Contacto
            </Typography>
            <Typography variant="body1">rikyyy09@gmail.com</Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}