import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
  Divider,
  TextField
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

interface BajaComercialBody {
  id_auditoria: number;
  fecha: string;
  usuario: string;
  proceso: string;
  identificacion: string;
  autorizaciones: string;
  observaciones: string;
  detalle: string;
  ip: string;
}

const BajaComercial = () => {
  const { legajo } = useParams();
  const navigate = useNavigate();
  const [fechaBaja, setFechaBaja] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!fechaBaja) {
      setError('La fecha de baja es obligatoria');
      return;
    }

    if (!observaciones.trim()) {
      setError('Las observaciones son obligatorias');
      return;
    }

    try {
      // Convertir fecha de YYYY-MM-DD a DD/MM/YYYY
      const [year, month, day] = fechaBaja.split('-');
      const fechaFormateada = `${day}/${month}/${year}`;

      const bajaBody: BajaComercialBody = {
        id_auditoria: 0,
        fecha: fechaFormateada,
        usuario: "usuario", // Esto debería venir de tu sistema de autenticación
        proceso: "Baja Comercial",
        identificacion: legajo || '',
        autorizaciones: "",
        observaciones: observaciones,
        detalle: `Baja comercial del legajo ${legajo}`,
        ip: "" // Esto podría manejarse en el backend
      };

      const response = await axios.post(
        `${import.meta.env.VITE_URL_BASE}Indycom/BajaComercial?legajo=${legajo}&fecha_baja=${fechaBaja}`,
        bajaBody
      );

      if (response.data) {
        await Swal.fire({
          title: 'Éxito',
          text: 'El comercio ha sido dado de baja correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: "#27a3cf"
        });
        navigate(-1);
      } else {
        throw new Error('No se pudo dar de baja el comercio');
      }
    } catch (error) {
      console.error('Error al dar de baja:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo dar de baja el comercio',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: "#27a3cf"
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Baja de Comercio - Legajo: {legajo}
          </Typography>
          <Divider sx={{ my: 2 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Fecha de Baja
              </Typography>
              <input
                type="date"
                value={fechaBaja}
                onChange={(e) => {
                  setFechaBaja(e.target.value);
                  setError('');
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Observaciones
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={observaciones}
                onChange={(e) => {
                  setObservaciones(e.target.value);
                  setError('');
                }}
                placeholder="Ingrese el motivo de la baja"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 4
          }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!fechaBaja || !observaciones.trim()}
            >
              Confirmar Baja
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

// Estilos para el input de fecha
const style = document.createElement('style');
style.textContent = `
  input[type="date"] {
    appearance: none;
    -webkit-appearance: none;
    color: #333;
    font-family: inherit;
    outline: none;
  }

  input[type="date"]:focus {
    border-color: #27a3cf;
    box-shadow: 0 0 0 1px #27a3cf;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    background-color: transparent;
    cursor: pointer;
    padding: 5px;
  }

  input[type="date"]::-webkit-calendar-picker-indicator:hover {
    background-color: #f0f0f0;
    border-radius: 4px;
  }
`;
document.head.appendChild(style);

export default BajaComercial;
