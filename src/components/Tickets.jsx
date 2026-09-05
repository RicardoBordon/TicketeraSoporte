import { useState } from 'react';
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
} from '@mui/material';
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
const TURNOS = ['Mañana', 'Tarde', 'Noche'];



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

export default function Tickets({ usuario, onLogout }) {
  const [sala] = useState(usuario?.sala || '');
  const [uid, setUid] = useState('');
  const [cat, setCat] = useState('');
  const [criticidad, setCriticidad] = useState('');
  const [turno, setTurno] = useState('');
  const [fecha, setFecha] = useState(formatFechaLatin(new Date()));
  const [subcat, setSubcat] = useState('');
  const [subcatPersonalizada, setSubcatPersonalizada] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [motivo, setMotivo] = useState('');
  const [status, setStatus] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const mostrarToast = (mensaje) => {
    setStatus(mensaje);
    setShowToast(true);

    window.setTimeout(() => {
      setShowToast(false);
      setStatus('');
    }, 6000);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setCat('');
        setSubcat('');
        setSubcatPersonalizada('');
        setCriticidad('');
        setTurno('');
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

          <form onSubmit={handleSubmit}>
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
                  onChange={(e) => setTurno(e.target.value)}
                >
                  {TURNOS.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
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
                Enviar
              </Button>
              {showToast && status && (
                <Box
                  onClick={() => {
                    setShowToast(false);
                    setStatus('');
                  }}
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
                    {status}
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
