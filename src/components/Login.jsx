import { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import autofillSx from '../styles/autofillSx';

export default function Login({ onLogin }) {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e) => {

  e.preventDefault();

  setError("");

  try {

    const respuesta = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usuario,
        password
      })
    });

    const data = await respuesta.json();

    console.log(data);

    if (data.ok) {

      localStorage.setItem(
        "usuario",
        JSON.stringify(data.usuario)
      );

      onLogin(data.usuario);

    } else {

      setError(data.mensaje);

    }

  } catch(error) {

    console.error(error);
    setError("Error de conexión");

  }; 

}; 


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: 'linear-gradient(135deg, #3c4146, #2f3f4e)',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 0,
      }}
    >

      <Container maxWidth="xs">

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 5,
          }}
        >

          <Box
            sx={{
              background: 'linear-gradient(135deg, #18283d, #1976D2)',
              color: "white",
              textAlign: "center",
              py: 3,
            }}
          >

            <Typography variant="h5" fontWeight="bold">
              Grupo Midas
            </Typography>

            <Typography variant="caption">
              Acceso a Ticketera Técnica
            </Typography>

          </Box>


          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              p: 3,
            }}
          >

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}


            <form onSubmit={handleSubmit}>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >


                {/* neutralize browser autofill for text inputs */}
                <TextField
                  label="Usuario"
                  size="small"
                  value={usuario}
                  onChange={(e)=>setUsuario(e.target.value)}
                  fullWidth
                  sx={autofillSx}
                />


                <TextField
                  label="Contraseña"
                  type="password"
                  size="small"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  fullWidth
                  sx={autofillSx}
                />


                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  Ingresar
                </Button>

              </Box>

            </form>


          </CardContent>

        </Card>

      </Container>

    </Box>
  );
} 