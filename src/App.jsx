import { useCallback, useEffect, useState } from "react";
import Tickets from "./components/Tickets";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import InfoPublica from "./components/InfoPublica";
import PoliticaPrivacidad from "./components/PoliticaPrivacidad";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  const ruta = window.location.pathname;

  useEffect(() => {
    // Las páginas públicas no necesitan sesión, no hace falta consultarla.
    if (ruta === "/info" || ruta === "/privacidad") {
      setCargandoSesion(false);
      return;
    }

    fetch("/api/session", { credentials: "include" })
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((data) => setUsuario(data?.ok ? data.usuario : null))
      .catch(() => setUsuario(null))
      .finally(() => setCargandoSesion(false));
  }, [ruta]);

  const handleLogin = (usuarioLogueado) => {
    setUsuario(usuarioLogueado);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUsuario(null);
  };

  const handleSesionAdminExpirada = useCallback(() => {
    setUsuario(null);
  }, []);

  // Páginas públicas: accesibles sin login, para la verificación de Google.
  if (ruta === "/info") return <InfoPublica />;
  if (ruta === "/privacidad") return <PoliticaPrivacidad />;

  if (cargandoSesion) return null;

  if (usuario?.rol === "admin") {
    return <AdminPanel onSesionExpirada={handleSesionAdminExpirada} />;
  }

  return (
    <>
      {usuario ? (
        <Tickets usuario={usuario} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;