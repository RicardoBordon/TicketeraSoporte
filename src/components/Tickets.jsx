import { useEffect, useRef, useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoModal from './InfoModal';
import autofillSx from '../styles/autofillSx';

const categorias = [
  { nombre: 'Slots', asunto: 'SLOT' },
  { nombre: 'Cash Handiling', asunto: 'CASH' },
  { nombre: 'Bingo', asunto: 'BINGO' },
  { nombre: 'Redes', asunto: 'REDES' },
  { nombre: 'CCTV', asunto: 'CCTV' },
  { nombre: 'Lotería', asunto: 'LOTERÍA' },
  { nombre: 'Infraestructura', asunto: 'INFRA' },
];
const subcategorias = [
  'No enciende',
  'Pantalla congelada',
  'Pantalla negra',
  'Errores generales',
  'Botones sin respuesta',
  'Reinicio constante',
  'Sin comunicación con sistema',
  'Apertura de platos',
  'Ruleta en general',
];
const CASH = [
  'Billete trabado',
  'Ticket trabado',
  'Validador no acepta',
  'Validador fuera de servicio',
  'Impresora sin papel',
  'Impresora rota',
  'Error de impresión',
  'Retiro de dinero'
];
const BINGO = ['Falla bingera', 'Falla Bing Data', 'Falla impresora', 'Falla PC'];
const REDES = ['Sin conexión', 'Sector sin red', 'AP caído', 'Switch caído'];
const CCTV = ['Cámara sin señal', 'DVR caído', 'Sin grabación', 'Monitor sin imagen'];
const LOTERIA = ['Terminal caída', 'Sin conexión a sistema'];
const INFRA = [
  'Sector sin energía',
  'UPS con alarma',
  'Compresor roto',
  'Falla de climatización',
  'Rack apagado',
  'Pedido de herramientas',
  'Pedido de repuestos',
];
const SUBCATEGORIA_PERSONALIZADA = 'Personalizada';

const CRITICIDAD = ['Crítica', 'Alta', 'Media', 'Baja'];
const TURNOS_POR_DEFECTO = {
  manana: { nombre: 'Mañana', inicio: '06:01', fin: '14:00' },
  tarde: { nombre: 'Tarde', inicio: '14:01', fin: '22:00' },
  noche: { nombre: 'Noche', inicio: '22:01', fin: '06:00' },
};



const subcategoriasPorCategoria = {
  Slots: subcategorias,
  'Cash Handiling': CASH,
  Bingo: BINGO,
  Redes: REDES,
  CCTV: CCTV,
  Lotería: LOTERIA,
  Infraestructura: INFRA,
};

const formatFechaLatin = (date) => {
  if (!date) return '...';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const formatFechaInput = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const minutosDesdeMedianoche = (hora) => {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
};

const obtenerTurnoActual = (turnos) => {
  const ahora = new Date();
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

  for (const turno of Object.values(turnos)) {
    const inicio = minutosDesdeMedianoche(turno.inicio);
    const fin = minutosDesdeMedianoche(turno.fin);
    const coincide = inicio <= fin
      ? minutosActuales >= inicio && minutosActuales <= fin
      : minutosActuales >= inicio || minutosActuales <= fin;

    if (coincide) return turno.nombre;
  }

  return '';
};

export default function Tickets({ usuario, onLogout }) {
  const [sala] = useState(usuario?.sala || '');
  const [uid, setUid] = useState('');
  const uidInputRef = useRef(null);
  const [cat, setCat] = useState('');
  const [criticidad, setCriticidad] = useState('');
  const [turno, setTurno] = useState('');
  const [turnoManual, setTurnoManual] = useState(false);
  const [turnos, setTurnos] = useState(TURNOS_POR_DEFECTO);
  const [fecha, setFecha] = useState(formatFechaLatin(new Date()));
  const [subcat, setSubcat] = useState('');
  const [subcatPersonalizada, setSubcatPersonalizada] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [motivo, setMotivo] = useState('');
  const [status, setStatus] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    let activo = true;

    fetch('/api/turnos')
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((data) => {
        if (!activo || !data?.ok) return;
        setTurnos(data.turnos);
      })
      .catch(() => {
        if (activo) setTurno(obtenerTurnoActual(TURNOS_POR_DEFECTO));
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    const actualizarTurno = () => {
      if (!turnoManual) setTurno(obtenerTurnoActual(turnos));
    };
    actualizarTurno();
    const intervalo = window.setInterval(actualizarTurno, 60_000);

    return () => window.clearInterval(intervalo);
  }, [turnos, turnoManual]);

  const mostrarToast = (mensaje) => {
    setStatus(mensaje);
    setShowToast(true);
  };

  const cerrarToast = () => {
    setShowToast(false);
    setStatus('');
    window.requestAnimationFrame(() => uidInputRef.current?.focus());
  };

  useEffect(() => {
    if (!showToast || !status.includes('éxito')) return undefined;

    const temporizador = window.setTimeout(cerrarToast, 3000);
    return () => window.clearTimeout(temporizador);
  }, [showToast, status]);

  const parseFechaLatin = (value) => {
    const cleaned = value.replace(/[^0-9]/g, '');

    if (cleaned.length !== 8) return null;

    const day = Number(cleaned.slice(0, 2));
    const month = Number(cleaned.slice(2, 4));
    const year = Number(cleaned.slice(4, 8));

    if (!day || !month || !year) return null;

    const parsedDate = new Date(year, month - 1, day);

    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() + 1 !== month ||
      parsedDate.getDate() !== day
    ) {
      return null;
    }

    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${String(year)}`;
  };

 const [categoriaAsunto, setCategoriaAsunto] = useState('');

 const handleCategoriaChange = (nombreCategoria) => {
  setCat(nombreCategoria);
  setSubcat('');
  setSubcatPersonalizada('');

  const categoria = categorias.find(c => c.nombre === nombreCategoria);

  setCategoriaAsunto(categoria ? categoria.asunto : '');
};

  const subcategoriaOptions = subcategoriasPorCategoria[cat] ?? [];
  const subcategoriaSeleccionada = subcat === SUBCATEGORIA_PERSONALIZADA
    ? subcatPersonalizada.trim()
    : subcat;
  const fechaCompleta = fecha.replace(/[^0-9]/g, '').length === 8;
  const fechaValida = fechaCompleta && parseFechaLatin(fecha) !== null;

  const camposObligatoriosCompletos = Boolean(
    sala &&
    uid &&
    tecnico &&
    cat &&
    subcategoriaSeleccionada &&
    criticidad &&
    turno &&
    fechaValida
  );

  const handleFormKeyDown = (e) => {
    if (e.key !== 'Enter' || e.target.name === 'motivo') return;

    if (!camposObligatoriosCompletos) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === 'Enviando...') return;

    if (!camposObligatoriosCompletos) {
      mostrarToast('Completa todos los campos obligatorios');
      return;
    }

    mostrarToast('Enviando...');

    try {
      const respuesta = await fetch('/api/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sala,
          uid,
          tecnico,
          categoria: cat,
          categoriaAsunto,
          subcategoria: subcategoriaSeleccionada,
          criticidad,
          turno,
          fecha,
          motivo,
        }),
      });

      const data = await respuesta.json();

      if (data.ok) {
        mostrarToast('¡Ticket enviado con éxito!');
        setUid('');
        window.requestAnimationFrame(() => uidInputRef.current?.focus());
        setCat('');
        setSubcat('');
        setSubcatPersonalizada('');
        setCriticidad('');
        setTurno('');
        setTurnoManual(false);
        setTecnico('');
        setMotivo('');
        setCategoriaAsunto('');
      } else {
        mostrarToast('Error al enviar ticket');
      }
    } catch (error) {
      console.error(error);
      mostrarToast('Error de conexión con servidor');
    }
  };

  const toastColor = status.includes('éxito') ? '#2e7d32' : status.includes('Completa') ? '#ed6c02' : '#d32f2f';

  //Hacer que el nombre y apellido del técnico se formatee automáticamente a mayúsculas la primera letra de cada palabra
  const formatearNombre = (texto) => {
  return texto
    .toLowerCase()
    .replace(/(^\p{L}|\s+\p{L})/gu, (letra) => letra.toUpperCase());
};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #3c4146, #2f3f4e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0.3,
      }}
    >
      <Container maxWidth="md">
        <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #18283d, #1976D2)',
              color: 'white',
              p: 4,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                minHeight: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
              }}
            >
              Generador de Tickets Técnicos
            </Typography>

            <Button
              variant="contained"
              size="small"
              onClick={() => setShowInfo(true)}
              sx={{
                position: 'absolute',
                right: 108,
                top: 3,
                p: 0.5,
                color: 'white',
                borderRadius: 2,
                backgroundColor: '#6e6e6e',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#4f4f4f',
                },
              }}
            >
              Info
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={() => {
                if (typeof onLogout === 'function') onLogout();
              }}
              sx={{
                position: 'absolute',
                right: 3,
                top: 3,
                p:0.5,
                color: 'white',
                borderRadius: 2,
                backgroundColor: '#3a454e',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#000000',
                  borderColor: 'white',
                },
              }}
            >
              Cerrar sesión
            </Button>
            

            <Typography variant="caption" sx={{ p:0, color: '#e0e0e0', fontSize: '0.85rem' }}>
              Usuario: {usuario?.usuario}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="1. Sala"
                value={sala}
                  InputProps={{
                  readOnly: true,
                  }}
                    sx={autofillSx}
              />

              <TextField
                fullWidth
                size="small"
                label="2. UID/ Ubicación"
                variant="outlined"
                placeholder="123456"
                name="uid"
                value={uid}
                inputRef={uidInputRef}
                onChange={(e) => setUid(e.target.value.slice(0, 30))}
                inputProps={{ maxLength: 30 }}
                sx={autofillSx}
              />

              <TextField
                fullWidth
                size="small"
                label="3. Técnico Responsable"
                variant="outlined"
                placeholder="Nombre y Apellido"
                name="tecnico"
                value={tecnico}
                onChange={(e) => setTecnico(formatearNombre(e.target.value))}
                sx={autofillSx}
              />

              <FormControl fullWidth size="small">
                <InputLabel id="cat-label">4. Seleccionar Categoría</InputLabel>
                <Select
                  labelId="cat-label"
                  name="categoria"
                  value={cat}
                  label="4. Seleccionar Categoría"
                  onChange={(e) => handleCategoriaChange(e.target.value)}
                >
                {categorias.map((categoria) => (
                <MenuItem
                 key={categoria.nombre}
                 value={categoria.nombre}
                >
                {categoria.nombre}
                </MenuItem>
))}
                </Select>
              </FormControl>

              <TextField
                select
                fullWidth
                size="small"
                label="5. Seleccionar Sub-Categoría"
                name="subcategoria"
                value={subcat}
                onChange={(e) => setSubcat(e.target.value)}
                disabled={!subcategoriaOptions.length}
                helperText={!subcategoriaOptions.length ? 'Selecciona categoría primero' : ''}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  {subcategoriaOptions.length ? 'Selecciona una subcategoría' : 'Selecciona categoría primero'}
                </MenuItem>
                {subcategoriaOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
                <MenuItem value={SUBCATEGORIA_PERSONALIZADA}>
                  {SUBCATEGORIA_PERSONALIZADA}
                </MenuItem>
              </TextField>

              {subcat === SUBCATEGORIA_PERSONALIZADA && (
                <TextField
                  fullWidth
                  size="small"
                  label="Sub-Categoría personalizada"
                  name="subcategoriaPersonalizada"
                  placeholder="Ingresa la subcategoría"
                  value={subcatPersonalizada}
                  onChange={(e) => setSubcatPersonalizada(e.target.value.slice(0, 100))}
                  inputProps={{ maxLength: 100 }}
                  required
                  variant="outlined"
                  sx={autofillSx}
                  
                />
              )}

              <TextField
                fullWidth
                size="small"
                label="6. Motivo (No obligatorio)"
                name="motivo"
                placeholder="Describe el motivo del ticket (máx. 300 caracteres)"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value.slice(0, 300))}
                multiline
                minRows={3}
                inputProps={{ maxLength: 300 }}
                sx={{
                  ...autofillSx,
                  '& .MuiInputBase-input': {
                    ...autofillSx['& .MuiInputBase-input'],
                    textAlign: 'left',
                  },
                }}
              />

              <FormControl fullWidth size="small">
                <InputLabel id="criticidad-label">7. Criticidad</InputLabel>
                <Select
                  labelId="criticidad-label"
                  name="criticidad"
                  value={criticidad}
                  label="7. Criticidad"
                  onChange={(e) => setCriticidad(e.target.value)}
                >
                  {CRITICIDAD.map((nivel) => (
                    <MenuItem key={nivel} value={nivel}>
                      {nivel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="turno-label">8. Turno</InputLabel>
                <Select
                  labelId="turno-label"
                  name="turno"
                  value={turno}
                  label="8. Turno"
                  onChange={(e) => {
                    setTurno(e.target.value);
                    setTurnoManual(true);
                  }}
                >
                  {Object.values(turnos).map(({ nombre }) => (
                    <MenuItem key={nombre} value={nombre}>
                      {nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <TextField
                  fullWidth
                  size="small"
                  label="9. Fecha"
                  name="fecha"
                  placeholder="dd/mm/aaaa"
                  value={fecha}
                  onChange={(e) => setFecha(formatFechaInput(e.target.value))}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  helperText={
                    fechaValida
                      ? 'Fecha del sistema cargada automáticamente. Corrige si es necesario.'
                      : fechaCompleta
                        ? 'Formato inválido, use dd/mm/aaaa'
                        : 'Ingrese fecha en formato dd/mm/aaaa'
                  }
                  error={fechaCompleta && !fechaValida}
                  sx={{ ...autofillSx, '& .MuiInputBase-input': { padding: 1, letterSpacing: '0.01rem', textAlign: 'center' } }}
                />
              </FormControl>
            </CardContent>

            <Box
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: '#dddbd3',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#555', mb: 0.5 }}>
                Datos en vivo:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sala: <strong>{sala}</strong> | UID: <strong>{uid || '...'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Técnico: <strong>{tecnico || '...'}</strong> | Categoría: <strong>{cat || '...'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subcategoría: <strong>{subcategoriaSeleccionada || '...'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Criticidad: <strong>{criticidad || '...'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Turno: <strong>{turno || '...'}</strong> | Fecha: <strong>{fechaValida ? fecha : 'Formato inválido'}</strong>
              </Typography>
            </Box>

            <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <Button type="submit" variant="contained" color="primary" size="medium" sx={{ width: '100%', maxWidth: 150 }}>
                {status === 'Enviando...' ? 'Enviando...' : 'Enviar'}
              </Button>
              {showToast && status && (
                <Box
                  onClick={status === 'Enviando...' ? undefined : cerrarToast}
                  sx={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(10, 15, 20, 0.45)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                  }}
                >
                  <Box
                    sx={{
                      width: 'auto',
                      minWidth: 220,
                      maxWidth: { xs: '40vw', sm: 320 },
                      px: 3,
                      py: 2,
                      borderRadius: 3,
                      backgroundColor: toastColor,
                      color: 'white',
                      boxShadow: 6,
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 800,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    }}
                  >
                    {status === 'Enviando...' ? (
                      <>
                        <CircularProgress
                          size={36}
                          thickness={5}
                          sx={{ display: 'block', mx: 'auto', mb: 1, color: 'white' }}
                        />
                        {status}
                      </>
                    ) : (
                      <>
                        {status.includes('éxito') ? (
                          <CheckCircleOutlineIcon sx={{ display: 'block', mx: 'auto', mb: 1, fontSize: 40 }} />
                        ) : (
                          <ErrorOutlineIcon sx={{ display: 'block', mx: 'auto', mb: 1, fontSize: 40 }} />
                        )}
                        {status}
                      </>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </form>

          <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />
        </Card>
      </Container>
    </Box>
  );
}
