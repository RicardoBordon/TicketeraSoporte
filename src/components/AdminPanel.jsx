import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import autofillSx from "../styles/autofillSx";

export default function AdminPanel({ onSesionExpirada }) {
  const [config, setConfig] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [credencialSolicitada, setCredencialSolicitada] = useState(null);
  const [credencialesEditables, setCredencialesEditables] = useState({
    clientId: false,
    clientSecret: false,
  });
  const [mensaje, setMensaje] = useState(() => {
    const parametros = new URLSearchParams(window.location.search);
    const resultadoGoogle = parametros.get("google");
    if (!resultadoGoogle) return null;

    return resultadoGoogle === "ok"
      ? { tipo: "success", texto: "Cuenta de Google conectada correctamente" }
      : { tipo: "error", texto: parametros.get("mensaje") || "No se pudo conectar la cuenta de Google" };
  });

  useEffect(() => {
    async function cargarConfig() {
      setCargando(true);
      try {
        const respuesta = await fetch("/api/config", { credentials: "include" });

        if (respuesta.status === 401) {
          onSesionExpirada();
          return;
        }

        const data = await respuesta.json();
        if (data.ok) {
          setConfig(data.config);
        } else {
          setMensaje({ tipo: "error", texto: data.mensaje || "No se pudo cargar la configuración" });
        }
      } catch (error) {
        console.error(error);
        setMensaje({ tipo: "error", texto: "Error de conexión" });
      } finally {
        setCargando(false);
      }
    }

    cargarConfig();
  }, [onSesionExpirada]);

  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    if (!parametros.has("google")) return;
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje(null);

    try {
      const respuesta = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });

      if (respuesta.status === 401) {
        onSesionExpirada();
        return;
      }

      const data = await respuesta.json();

      if (data.ok) {
        setCredencialesEditables({ clientId: false, clientSecret: false });
        setMensaje({ tipo: "success", texto: "Configuración guardada correctamente" });
      } else {
        setMensaje({ tipo: "error", texto: data.mensaje || "No se pudo guardar" });
      }
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "Error de conexión" });
    } finally {
      setGuardando(false);
    }
  };

  const handleLogout = async () => {
    setCredencialesEditables({ clientId: false, clientSecret: false });
    try {
      await fetch("/api/admin-logout", { method: "POST", credentials: "include" });
    } catch (error) {
      console.error(error);
    }
    onSesionExpirada();
  };

  const conectarGoogle = (sala) => {
    window.location.href = `/api/google-auth?sala=${encodeURIComponent(sala)}`;
  };

  const actualizarSala = (sala, campo, valor) => {
    setConfig((prev) => ({
      ...prev,
      salas: {
        ...prev.salas,
        [sala]: {
          ...prev.salas[sala],
          [campo]: valor,
        },
      },
    }));
  };

  const cerrarMensaje = () => setMensaje(null);

  const confirmarEdicionCredencial = () => {
    setCredencialesEditables((prev) => ({ ...prev, [credencialSolicitada]: true }));
    setCredencialSolicitada(null);
  };

  if (cargando) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!config) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Alert severity="error">{mensaje?.texto || "No se pudo cargar la configuración"}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3c4146, #2f3f4e)",
        py: 4,
        px: 1,
      }}
    >
      <Container maxWidth="md">
        <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #18283d, #3688da)",
              color: "white",
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                Panel de Administración
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={handleLogout}
              sx={{ backgroundColor: "#3a454e", "&:hover": { backgroundColor: "#000" } }}
            >
              Cerrar sesión
            </Button>
          </Box>

          <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>

            <Box sx={{ p: 2, border: "1px solid #161515", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: "#142b42", fontWeight: 600, p:2, mb:2 }}>Configuración general</Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email de destino de los tickets"
                  value={config.emailDestino}
                  onChange={(e) => setConfig((prev) => ({ ...prev, emailDestino: e.target.value }))}
                  sx={{ ...autofillSx, mb: 3 }}
                />

                <Divider />
                <Typography variant="subtitle2" sx={{ color: "#425466", fontWeight: 700 }}>Credenciales App de Cloud (Modificable en caso de migración)</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    fullWidth
                    size="small"
                    label="Client ID"
                    type="password"
                    autoComplete="new-password"
                    disabled={!credencialesEditables.clientId}
                    value={config.clientId}
                    onChange={(e) => setConfig((prev) => ({ ...prev, clientId: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={autofillSx}
                  />
                  <IconButton
                    aria-label="Editar Client ID"
                    title="Editar Client ID"
                    onClick={() => setCredencialSolicitada("clientId")}
                    sx={{ width: 40, height: 40, border: "1px solid #1769aa", borderRadius: 0, color: "#1769aa", flexShrink: 0 }}
                  >
                    <EditOutlined />
                  </IconButton>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    fullWidth
                    size="small"
                    label="Client Secret"
                    type="password"
                    autoComplete="new-password"
                    disabled={!credencialesEditables.clientSecret}
                    value={config.clientSecret}
                    onChange={(e) => setConfig((prev) => ({ ...prev, clientSecret: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={autofillSx}
                  />
                  <IconButton
                    aria-label="Editar Client Secret"
                    title="Editar Client Secret"
                    onClick={() => setCredencialSolicitada("clientSecret")}
                    sx={{ width: 40, height: 40, border: "1px solid #1769aa", borderRadius: 0, color: "#1769aa", flexShrink: 0 }}
                  >
                    <EditOutlined />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ p: 2, border: "1px solid #161515", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: "#142b42", fontWeight: 600, p: 2, mb: 2 }}>
                Horarios automáticos de turnos
              </Typography>
              <Stack spacing={2}>
                {Object.entries(config.turnos || {}).map(([clave, turno]) => (
                  <Stack key={clave} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                    <Typography sx={{ width: { sm: 90 }, fontWeight: 600 }}>{turno.nombre}</Typography>
                    <TextField
                      size="small"
                      type="time"
                      label="Desde"
                      value={turno.inicio}
                      onChange={(e) => setConfig((prev) => ({
                        ...prev,
                        turnos: { ...prev.turnos, [clave]: { ...prev.turnos[clave], inicio: e.target.value } },
                      }))}
                      slotProps={{ inputLabel: { shrink: true } }}
                      sx={autofillSx}
                    />
                    <TextField
                      size="small"
                      type="time"
                      label="Hasta"
                      value={turno.fin}
                      onChange={(e) => setConfig((prev) => ({
                        ...prev,
                        turnos: { ...prev.turnos, [clave]: { ...prev.turnos[clave], fin: e.target.value } },
                      }))}
                      slotProps={{ inputLabel: { shrink: true } }}
                      sx={autofillSx}
                    />
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ color: "#142b42", fontWeight: 700 }}>Emisores por sala</Typography>
            </Box>

            {Object.entries(config.salas).map(([sala, datos]) => (
              <Box
                key={sala}
                sx={{
                  p: 2,
                  border: "1px solid #161515",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  backgroundColor: "#eef0f1",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} sx={{ width: "100%" }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#680515", p: 1 }}>{sala}</Typography>
 
                </Stack>

                <TextField
                  fullWidth
                  size="small"
                  label="Email emisor (cuenta de Gmail)"
                  value={datos.email}
                  onChange={(e) => actualizarSala(sala, "email", e.target.value)}
                  sx={autofillSx}
                />

                <Button
                  variant="outlined"
                  onClick={() => conectarGoogle(sala)}
                  disabled={!config.clientId || !config.clientSecret}
                >
                  {datos.refreshToken ? "Cambiar cuenta de Google" : "Conectar cuenta de Google"}
                </Button>
              </Box>
            ))}

            <Button
              variant="contained"
              size="large"
              onClick={handleGuardar}
              disabled={guardando}
              sx={{ alignSelf: { xs: "stretch", sm: "center" }, mt: 1, minWidth: 220, py: 1.2, backgroundColor: "#1769aa", "&:hover": { backgroundColor: "#125487" } }}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </Button>
          </CardContent>
        </Card>

        {mensaje && (
          <Box
            onClick={cerrarMensaje}
            role="alert"
            aria-live="polite"
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 1400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(10, 15, 20, 0.45)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: "auto",
                minWidth: 220,
                maxWidth: { xs: "80vw", sm: 360 },
                px: 3,
                py: 2,
                borderRadius: 3,
                backgroundColor: mensaje.tipo === "success" ? "#2e7d32" : "#d32f2f",
                color: "white",
                boxShadow: 6,
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 800,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {mensaje.texto}
            </Box>
          </Box>
        )}

        <Dialog
          open={Boolean(credencialSolicitada)}
          onClose={() => setCredencialSolicitada(null)}
          aria-labelledby="editar-credenciales-titulo"
          PaperProps={{ sx: { backgroundColor: "#ffffff", color: "#142b42" } }}
        >
          <DialogTitle id="editar-credenciales-titulo" sx={{ color: "#142b42", fontWeight: 700 }}>
            Editar {credencialSolicitada === "clientId" ? "Client ID" : "Client Secret"}
          </DialogTitle>
          <DialogContent sx={{ color: "#333333" }}>
            ¿Confirmás que querés habilitar la edición de esta Credencial App de Cloud?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCredencialSolicitada(null)}>Cancelar</Button>
            <Button variant="contained" onClick={confirmarEdicionCredencial} autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
