import { Box, Button, Typography } from '@mui/material';

export default function InfoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(20, 25, 30, 0.55)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        p: 2,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 960,
          maxHeight: '90vh',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderRadius: 3,
          boxShadow: 24,
          overflowY: 'auto',
          p: 3,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          size="small"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 28,
            right: 16,
            color: '#333',
            backgroundColor: '#d0d0d0',
            textTransform: 'none',
            '&:hover, &:active': {
              backgroundColor: '#000000',
              color: '#ffffff',
            },
          }}
        >
          Cerrar
        </Button>

        <Box sx={{ backgroundColor: '#e3f2fd', borderRadius: 2, p: 3, mb: 3, width: 'calc(100% - 32px)', mx: 'auto' }}>
          <Typography variant="h5" sx={{ m: 0, color: '#1565c0', fontWeight: 600 }}>
            Información
          </Typography>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1, color: '#333', fontWeight: 700 }}>
          Categorías
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
          Toda intervención debe clasificarse en una y solo una de las siguientes categorías. El código en mayúsculas es el que se usa en el campo TIPO del asunto 
        </Typography>
        <Box sx={{ overflowX: 'auto', mb: 3 }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: 650,
              backgroundColor: '#f3f3f3',
              border: '1px solid #d1d1d1',
              '& th, & td': { border: '1px solid #d1d1d1', fontSize: '0.85rem' },
              '& th': { backgroundColor: '#e6e6e6', textAlign: 'center', py: 1, px: 1.5 },
              '& th:last-child, & td:last-child': { textAlign: 'left' },
              '& td': { py: 0.9, px: 1.5 },
            }}
          >
            <Box component="thead">
              <Box component="tr">
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Categoría
                </Box>
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Código (asunto)
                </Box>
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Cuándo usarla
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Slots
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  SLOT
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Fallas o intervenciones en máquinas tragamonedas y ruletas (UID).
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Cash Handling
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  CASH
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Billeteros, validadores, retiro de dinero de isla.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Bingo
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  BINGO
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Equipamiento y sistemas específicos de bingo (bingera, Bing Data, PCs e impresoras asociadas).
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Redes
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  REDES
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Conectividad cableada/Wi-Fi, switches, AP, enlaces.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  CCTV
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  CCTV
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Cámaras, DVR/NVR, monitores y grabación de video.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Lotería
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  LOTERIA
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Sistemas y terminales vinculados a operaciones de lotería.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Infraestructura
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  INFRA
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Energía, UPS, racks, cableado estructurado, climatización, herramientas y repuestos.
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1, color: '#333', fontWeight: 700 }}>
          Sub-categorías por categoría
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
        Dentro de cada categoría se utilizan las siguientes sub-categorías para describir la falla. Si el caso no encaja en ninguna, usar texto libre corto (máx. 5 palabras).  
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: 650,
              backgroundColor: '#f3f3f3',
              border: '1px solid #d1d1d1',
              '& th, & td': { border: '1px solid #d1d1d1', fontSize: '0.85rem' },
              '& th': { backgroundColor: '#e6e6e6', textAlign: 'center', py: 1, px: 1.5 },
              '& th:last-child, & td:last-child': { textAlign: 'left' },
              '& td': { py: 0.9, px: 1.5 },
            }}
          >
            <Box component="thead">
              <Box component="tr">
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Categoría
                </Box>
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Sub-categorías
                  <Box component="div" sx={{ fontWeight: 400, fontSize: '0.85rem', color: '#555', mt: 0.5 }}>
                    / Frases estándar para el campo PROBLEMA
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Slots
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  No enciende, Pantalla congelada, Pantalla negra, Errores generales, Botones sin respuesta, Reinicio constante, Sin comunicación con sistema, Apertura de platos, Ruleta en general
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Cash Handling
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Billete trabado, Ticket trabado, Validador no acepta, Validador fuera de servicio, Impresora sin papel, Impresora rota, Error de impresión, Retiro de dinero  
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Bingo
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Falla bingera, Falla Bing Data, Falla impresora, Falla PC
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Redes
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Sin conexión, Sector sin red, AP caído, Switch caído
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  CCTV
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Cámaras sin señal, DVR caído, Sin grabación, Monitor sin imagen
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Lotería
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Terminal caída, Sin conexión a sistema
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Infraestructura
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Sector sin energía, UPS con alarma, Compresor roto, Falla de climatización, Rack apagado, Pedido de herramientas, Pedido de repuestos
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, color: '#333', fontWeight: 700 }}>
          Detalle de sub-categorías — Cash Handling
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
          Por ser la categoría con mayor recurrencia, Cash Handling cuenta con un detalle ampliado de sub-categorías, criticidad sugerida y descripción de cada caso.
        </Typography>
        <Box sx={{ overflowX: 'auto', mb: 2 }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: 650,
              backgroundColor: '#f3f3f3',
              border: '1px solid #d1d1d1',
              '& th, & td': { border: '1px solid #d1d1d1', fontSize: '0.85rem' },
              '& th': { backgroundColor: '#e6e6e6', textAlign: 'center', py: 1, px: 1.5 },
              '& th:last-child, & td:last-child': { textAlign: 'left' },
              '& td': { py: 0.9, px: 1.5 },
            }}
          >
            <Box component="thead">
              <Box component="tr">
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Sub-categoría
                </Box>
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Criticidad sugerida
                </Box>
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Descripción
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Billete trabado
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Media
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Billete físicamente atascado en el validador.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Ticket trabado
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Media
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Ticket TITO atascado al imprimir o ingresar.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Validador no acepta
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Media
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  El validador funciona pero rechaza billetes válidos.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Validador fuera de servicio
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Media
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  El validador no enciende o no responde.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Impresora sin papel
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Media
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Falta de papel para impresión de TITO.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Impresora rota
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Media
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  La impresora de tickets no funciona.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Varias máquinas con falla similar
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Alta
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Más de una máquina del mismo sector con la misma falla (posible lote o firmware).
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, color: '#333', fontWeight: 700 }}>
          Niveles de Criticidad
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
          Toda intervención debe clasificarse en uno de los siguientes niveles, que se indica en el cuerpo del ticket.
        </Typography>
        <Box sx={{ overflowX: 'auto', mb: 2 }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: 650,
              backgroundColor: '#f3f3f3',
              border: '1px solid #d1d1d1',
              '& th, & td': { border: '1px solid #d1d1d1', fontSize: '0.85rem' },
              '& th': { backgroundColor: '#e6e6e6', textAlign: 'center', py: 1, px: 1.5 },
              '& th:last-child, & td:last-child': { textAlign: 'left' },
              '& td': { py: 0.9, px: 1.5 },
            }}
          >
            <Box component="thead">
              <Box component="tr">
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Criticidad
                </Box>
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Definición
                </Box>
                <Box
                  component="th"
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #d1d1d1',
                    color: '#333',
                    fontWeight: 700,
                  }}
                >
                  Ejemplos
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Crítica
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Parada total de operación o pérdida directa de recaudación. Requiere atención inmediata.
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Sala caída, servidor principal fuera de línea, varias máquinas sin servicio.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Alta
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Impacta a varias máquinas, una sala o un servicio clave; opera con riesgo o degradado.
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Switch caído en un sector, CCTV de un área sin grabar, falta de insumos.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Media
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Afecta a una sola máquina o usuario; la operación continúa.
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2, borderBottom: '1px solid #f0f0f0' }}>
                  Una slot fuera de servicio, billete trabado, validador con fallas repetidas.
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Baja
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Mejora, consulta o tarea programable que no afecta la operación.
                </Box>
                <Box component="td" sx={{ py: 1.25, px: 2 }}>
                  Mantenimiento de slots y ruletas.
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
