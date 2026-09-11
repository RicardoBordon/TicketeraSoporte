import { Box, Container, Card, CardContent, Typography, Link } from "@mui/material";

export default function InfoPublica() {
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
      <Container maxWidth="sm">
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
              Ticketera Técnica — Grupo Midas
            </Typography>
          </Box>

          <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body1">
              Ticketera es una herramienta interna de Grupo Midas que usan los
              técnicos de nuestras salas (CASEROS, MERLO, CIUDADELA y
              HURLINGHAM) para generar tickets de soporte técnico. Cada ticket
              se envía automáticamente por correo electrónico al equipo de
              soporte.
            </Typography>

            <Typography variant="body1">
              Para enviar esos correos, la app se conecta con una cuenta de
              Gmail de cada sala usando la autenticación de Google (OAuth).
              Solo solicitamos permiso para <strong>enviar correos</strong> en
              nombre de esa cuenta — la app no lee, busca ni administra la
              bandeja de entrada de nadie.
            </Typography>

            <Typography variant="body1">
              Es una app de uso interno, exclusiva para el personal de Grupo
              Midas.
            </Typography>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Más información:{" "}
              <Link href="/privacidad">Política de privacidad</Link>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Contacto: soporte@grupomidas.com.ar
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}