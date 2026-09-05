import { useCallback, useEffect, useState } from "react";
import Tickets from "./components/Tickets";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    fetch("/api/session", { credentials: "include" })
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((data) => setUsuario(data?.ok ? data.usuario : null))
      .catch(() => setUsuario(null))
      .finally(() => setCargandoSesion(false));
  }, []);

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
