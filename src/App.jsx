import { useState } from "react";
import Tickets from "./components/Tickets";
import Login from "./components/Login";

function App() {

  const [usuario, setUsuario] = useState(() => {

    const guardado = localStorage.getItem("usuario");

    return guardado
      ? JSON.parse(guardado)
      : null;

  });


  const handleLogin = (usuarioLogueado) => {

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuarioLogueado)
    );

    setUsuario(usuarioLogueado);

  };


  const handleLogout = () => {

    localStorage.removeItem("usuario");

    setUsuario(null);

  };


  return (
    <>
      {
        usuario
          ? (
              <Tickets
                usuario={usuario}
                onLogout={handleLogout}
              />
            )
          : (
              <Login
                onLogin={handleLogin}
              />
            )
      }
    </>
  );
}

export default App;

