import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import Swal from 'sweetalert2';

interface Calle {
  value: string;
  text: string;
  campo_enlace: string;
}

interface DomicilioPostalData {
  cod_calle_dom_esp: number;
  nom_calle_dom_esp: string;
  nro_dom_esp: number;
  piso_dpto_esp: string;
  local_esp: string;
  cod_postal: string;
  nom_barrio: string;
  ciudad: string;
  provincia: string;
  pais: string;
  email_envio_cedulon: string;
  telefono: string;
  celular: string;
}

const DomicilioPostal = () => {
  const { legajo } = useParams();
  const [formData, setFormData] = useState<DomicilioPostalData | null>(null);
  const [calles, setCalles] = useState<Calle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDomicilioData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Indycom/GetByPk?legajo=${legajo}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchDomicilioData();
  }, [legajo]);

  const handleSearch = async (value: string) => {
    if (value.length > 2) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Indycom/GetCalle?nomcalle=${value}`);
        setCalles(response.data);
      } catch (error) {
        console.error('Error al buscar calles:', error);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Mostrar modal para ingresar observaciones
      const { value: observaciones, isConfirmed } = await Swal.fire({
        title: 'Observaciones',
        input: 'textarea',
        inputLabel: 'Ingrese las observaciones de la actualización',
        inputPlaceholder: 'Escriba aquí sus observaciones...',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar una observación';
          }
          return null;
        }
      });

      if (!isConfirmed) return;

      setLoading(true);

      await axios.put(`${import.meta.env.VITE_URL_BASE}Indycom/ActualizarDomicilioPostal?legajo=${legajo}`, {
        ...formData,
        objAuditoria: {
          id_auditoria: 0,
          fecha: new Date().toISOString(),
          usuario: "",
          proceso: "Actualización de domicilio postal",
          identificacion: legajo,
          autorizaciones: "",
          observaciones: observaciones,
          detalle: "",
          ip: ""
        }
      });

      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Domicilio actualizado exitosamente',
        confirmButtonText: 'Aceptar'
      });

    } catch (error) {
      console.error('Error al actualizar:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el domicilio',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof DomicilioPostalData, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (!formData) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Domicilio Postal
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={calles}
                getOptionLabel={(option) => option.text}
                onInputChange={(_, value) => handleSearch(value)}
                onChange={(_, value) => handleInputChange('cod_calle_dom_esp', value?.value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Calle"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número"
                type="number"
                value={formData.nro_dom_esp || ''}
                onChange={(e) => handleInputChange('nro_dom_esp', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Piso/Dpto"
                value={formData.piso_dpto_esp || ''}
                onChange={(e) => handleInputChange('piso_dpto_esp', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Local"
                value={formData.local_esp || ''}
                onChange={(e) => handleInputChange('local_esp', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código Postal"
                value={formData.cod_postal || ''}
                onChange={(e) => handleInputChange('cod_postal', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Barrio"
                value={formData.nom_barrio || ''}
                onChange={(e) => handleInputChange('nom_barrio', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ciudad"
                value={formData.ciudad || ''}
                onChange={(e) => handleInputChange('ciudad', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Provincia"
                value={formData.provincia || ''}
                onChange={(e) => handleInputChange('provincia', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="País"
                value={formData.pais || ''}
                onChange={(e) => handleInputChange('pais', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email_envio_cedulon || ''}
                onChange={(e) => handleInputChange('email_envio_cedulon', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono || ''}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Celular"
                value={formData.celular || ''}
                onChange={(e) => handleInputChange('celular', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Actualizar domicilio'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default DomicilioPostal;