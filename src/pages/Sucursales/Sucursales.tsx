import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Slide,
  Autocomplete,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import Swal from 'sweetalert2';

interface Sucursal {
  legajo: number;
  nro_sucursal: number;
  des_com: string;
  nom_fantasia: string;
  nom_calle: string;
  nro_dom: number;
  nom_barrio: string;
  ciudad: string;
  provincia: string;
  nro_res: string;
  fecha_hab: string;
  dado_baja: boolean;
  nro_local: string;
  piso_dpto: string;
  vto_inscripcion: string;
}

interface NuevaSucursal {
  sucursal: {
    legajo: number;
    des_com: string;
    nom_fantasia: string;
    cod_calle: number;
    nom_calle: string;
    nro_dom: number;
    cod_barrio: number;
    nom_barrio: string;
    ciudad: string;
    provincia: string;
    pais: string;
    cod_postal: string;
    nro_res: string;
    fecha_inicio: string;
    fecha_Baja: string | null;
    fecha_hab: string;
    dado_baja: boolean;
    nro_exp_mesa_ent: string;
    fecha_alta: string;
    cod_zona: string;
    nro_local: string;
    piso_dpto: string;
    vto_inscripcion: string;
  };
  auditoria: {
    id_auditoria: number;
    fecha: string;
    usuario: string;
    proceso: string;
    identificacion: string;
    autorizaciones: string;
    observaciones: string;
    detalle: string;
    ip: string;
  };
}

interface Calle {
  value: string;
  text: string;
  campo_enlace: string;
}

// Crear una configuración base para Swal
const swalConfig = {
  position: 'top' as const,
  confirmButtonColor: '#27a3cf',
  showClass: {
    popup: 'animate__animated animate__fadeInDown'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp'
  }
};

// Definir la transición personalizada
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Sucursales = () => {
  const { legajo } = useParams<{ legajo: string }>();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [nuevaSucursal, setNuevaSucursal] = useState<NuevaSucursal>({
    sucursal: {
      legajo: Number(legajo) || 0,
      des_com: '',
      nom_fantasia: '',
      cod_calle: 0,
      nom_calle: '',
      nro_dom: 0,
      cod_barrio: 0,
      nom_barrio: '',
      ciudad: 'Villa Allende',
      provincia: 'Córdoba',
      pais: 'ARGENTINA',
      cod_postal: 'X5105',
      nro_res: '',
      fecha_inicio: '2024-03-07T00:00:00',
      fecha_Baja: null,
      fecha_hab: '2024-03-07T00:00:00',
      dado_baja: false,
      nro_exp_mesa_ent: '',
      fecha_alta: '2024-03-07T00:00:00',
      cod_zona: '',
      nro_local: '',
      piso_dpto: '',
      vto_inscripcion: '2024-03-07T00:00:00'
    },
    auditoria: {
      id_auditoria: 0,
      fecha: 'string',
      usuario: 'string',
      proceso: 'string',
      identificacion: 'string',
      autorizaciones: 'string',
      observaciones: 'observaciones',
      detalle: 'string',
      ip: 'string'
    }
  });
  const [calles, setCalles] = useState<Calle[]>([]);
  const [loadingCalles, setLoadingCalles] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        if (!legajo) return;
        const response = await axios.get(
          `${import.meta.env.VITE_URL_BASE}Indycom/GetSucurales?legajo=${legajo}`
        );
        setSucursales(response.data);
      } catch (error: any) {
        console.error('Error al cargar sucursales:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSucursales();
  }, [legajo]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validar el campo
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Actualizar el valor
    if (name.startsWith('auditoria.')) {
      const auditoriaField = name.split('.')[1];
      setNuevaSucursal(prev => ({
        ...prev,
        auditoria: {
          ...prev.auditoria,
          [auditoriaField]: value
        }
      }));
    } else {
      setNuevaSucursal(prev => ({
        ...prev,
        sucursal: {
          ...prev.sucursal,
          [name]: value
        }
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!(await validarCamposRequeridos())) return;

      const requestBody = {
        sucursal: {
          legajo: Number(legajo),
          des_com: nuevaSucursal.sucursal.des_com,
          nom_fantasia: nuevaSucursal.sucursal.nom_fantasia,
          cod_calle: Number(nuevaSucursal.sucursal.cod_calle),
          nom_calle: nuevaSucursal.sucursal.nom_calle,
          nro_dom: Number(nuevaSucursal.sucursal.nro_dom),
          cod_barrio: Number(nuevaSucursal.sucursal.cod_barrio || 0),
          nom_barrio: nuevaSucursal.sucursal.nom_barrio,
          ciudad: nuevaSucursal.sucursal.ciudad,
          provincia: nuevaSucursal.sucursal.provincia,
          pais: "ARGENTINA",
          cod_postal: nuevaSucursal.sucursal.cod_postal,
          nro_res: nuevaSucursal.sucursal.nro_res,
          fecha_inicio: "2023-03-07T00:00:00",
          fecha_Baja: null,
          fecha_hab: "2024-06-11T00:00:00",
          dado_baja: false,
          nro_exp_mesa_ent: (nuevaSucursal.sucursal.nro_exp_mesa_ent || "").padEnd(15, " "),
          fecha_alta: "2023-08-30T00:00:00",
          cod_zona: (nuevaSucursal.sucursal.cod_zona || "").padEnd(2, " "),
          nro_local: nuevaSucursal.sucursal.nro_local || "",
          piso_dpto: nuevaSucursal.sucursal.piso_dpto || "",
          vto_inscripcion: "2023-11-28T00:00:00"
        },
        auditoria: {
          id_auditoria: 0,
          fecha: "string",
          usuario: "string",
          proceso: "string",
          identificacion: "string",
          autorizaciones: "string",
          observaciones: "string",
          detalle: "string",
          ip: "string"
        }
      };

      console.log('Datos a enviar:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(
        `${import.meta.env.VITE_URL_BASE}Indycom/NuevaSucursal?legajo=${legajo}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setOpenModal(false);
        await Swal.fire({
          ...swalConfig,
          title: '¡Éxito!',
          text: 'Sucursal creada exitosamente',
          icon: 'success'
        });

        // Recargar sucursales
        const sucursalesResponse = await axios.get(
          `${import.meta.env.VITE_URL_BASE}Indycom/GetSucurales?legajo=${legajo}`
        );
        setSucursales(sucursalesResponse.data);
      }
    } catch (error: any) {
      setOpenModal(false);
      console.error('Error completo:', error);
      await Swal.fire({
        ...swalConfig,
        title: 'Error',
        text: `Error al crear sucursal: ${error.response?.data?.message || error.message}`,
        icon: 'error'
      });
    }
  };

  const buscarCalles = async (busqueda: string) => {
    if (busqueda.length < 1) return;
    setLoadingCalles(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Indycom/GetCalle?nomcalle=${busqueda}`
      );
      setCalles(response.data);
    } catch (error) {
      console.error('Error al buscar calles:', error);
    } finally {
      setLoadingCalles(false);
    }
  };

  const handleCalleChange = (_event: any, newValue: Calle | null) => {
    if (newValue) {
      setNuevaSucursal(prev => ({
        ...prev,
        sucursal: {
          ...prev.sucursal,
          cod_calle: parseInt(newValue.value),
          nom_calle: newValue.text
        }
      }));
    }
  };

  const handleEdit = async () => {
    try {
      if (!selectedSucursal) {
        await Swal.fire({
          ...swalConfig,
          title: 'Error',
          text: 'No se ha seleccionado ninguna sucursal para editar',
          icon: 'error'
        });
        return;
      }

      if (!(await validarCamposRequeridos())) return;

      const requestBody = {
        sucursal: {
          legajo: Number(legajo),
          des_com: nuevaSucursal.sucursal.des_com,
          nom_fantasia: nuevaSucursal.sucursal.nom_fantasia,
          cod_calle: Number(nuevaSucursal.sucursal.cod_calle),
          nom_calle: nuevaSucursal.sucursal.nom_calle,
          nro_dom: Number(nuevaSucursal.sucursal.nro_dom),
          cod_barrio: Number(nuevaSucursal.sucursal.cod_barrio || 0),
          nom_barrio: nuevaSucursal.sucursal.nom_barrio,
          ciudad: nuevaSucursal.sucursal.ciudad,
          provincia: nuevaSucursal.sucursal.provincia,
          pais: "ARGENTINA",
          cod_postal: nuevaSucursal.sucursal.cod_postal,
          nro_res: nuevaSucursal.sucursal.nro_res,
          fecha_inicio: "2023-03-07T00:00:00",
          fecha_Baja: null,
          fecha_hab: "2024-06-11T00:00:00",
          dado_baja: false,
          nro_exp_mesa_ent: (nuevaSucursal.sucursal.nro_exp_mesa_ent || "").padEnd(15, " "),
          fecha_alta: "2023-08-30T00:00:00",
          cod_zona: (nuevaSucursal.sucursal.cod_zona || "").padEnd(2, " "),
          nro_local: nuevaSucursal.sucursal.nro_local || "",
          piso_dpto: nuevaSucursal.sucursal.piso_dpto || "",
          vto_inscripcion: "2023-11-28T00:00:00"
        },
        auditoria: {
          id_auditoria: 0,
          fecha: "string",
          usuario: "string",
          proceso: "string",
          identificacion: "string",
          autorizaciones: "string",
          observaciones: "string",
          detalle: "string",
          ip: "string"
        }
      };

      const response = await axios.put(
        `${import.meta.env.VITE_URL_BASE}Indycom/ModificarSucursal?legajo=${legajo}&nro_sucursal=${selectedSucursal.nro_sucursal}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setEditModalOpen(false);
        await Swal.fire({
          ...swalConfig,
          title: '¡Éxito!',
          text: 'Sucursal modificada exitosamente',
          icon: 'success'
        });

        // Recargar sucursaleszzzzz
        const sucursalesResponse = await axios.get(
          `${import.meta.env.VITE_URL_BASE}Indycom/GetSucurales?legajo=${legajo}`
        );
        setSucursales(sucursalesResponse.data);
      }
    } catch (error: any) {
      setEditModalOpen(false)
      console.error('Error completo:', error);
      await Swal.fire({
        ...swalConfig,
        title: 'Error',
        text: `Error al modificar sucursal: ${error.response?.data?.message || error.message}`,
        icon: 'error'
      });
    }
  };

  const validarCamposRequeridos = async () => {
    const camposRequeridos = {
      'Descripción Comercial': nuevaSucursal.sucursal.des_com,
      'Nombre Fantasía': nuevaSucursal.sucursal.nom_fantasia,
      'Código de Calle': nuevaSucursal.sucursal.cod_calle,
      'Número de Domicilio': nuevaSucursal.sucursal.nro_dom,
      'Barrio': nuevaSucursal.sucursal.nom_barrio,
      'Ciudad': nuevaSucursal.sucursal.ciudad,
      'Provincia': nuevaSucursal.sucursal.provincia,
      'Código Postal': nuevaSucursal.sucursal.cod_postal,
      'Número de Resolución': nuevaSucursal.sucursal.nro_res,
      'Número de Expediente': nuevaSucursal.sucursal.nro_exp_mesa_ent,
    };

    const camposFaltantes = Object.entries(camposRequeridos)
      .filter(([_, valor]) => !valor)
      .map(([campo]) => campo);

    if (camposFaltantes.length > 0) {
      await Swal.fire({
        ...swalConfig,
        title: 'Campos Requeridos',
        html: `Por favor complete los siguientes campos:<br><br>${camposFaltantes.join('<br>')}`,
        icon: 'warning'
      });
      return false;
    }
    return true;
  };

  const handleDelete = async (nroSucursal: number) => {
    try {
      // Mostrar confirmación con campo de observaciones
      const result = await Swal.fire({
        ...swalConfig,
        title: '¿Está seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        input: 'textarea',
        inputLabel: 'Observaciones',
        inputPlaceholder: 'Ingrese las observaciones de la eliminación...',
        inputAttributes: {
          'aria-label': 'Observaciones'
        },
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        const auditoria = {
          id_auditoria: 0,
          fecha: "string",
          usuario: "string",
          proceso: "string",
          identificacion: "string",
          autorizaciones: "string",
          observaciones: result.value || "string", // Usar las observaciones ingresadas
          detalle: "string",
          ip: "string"
        };

        const response = await axios.delete(
          `${import.meta.env.VITE_URL_BASE}Indycom/EliminarSucursal?legajo=${legajo}&nro_sucursal=${nroSucursal}`,
          {
            data: auditoria
          }
        );

        if (response.data) {
          await Swal.fire({
            ...swalConfig,
            title: '¡Eliminado!',
            text: 'La sucursal ha sido eliminada.',
            icon: 'success'
          });

          // Recargar sucursales
          const sucursalesResponse = await axios.get(
            `${import.meta.env.VITE_URL_BASE}Indycom/GetSucurales?legajo=${legajo}`
          );
          setSucursales(sucursalesResponse.data);
        }
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      await Swal.fire({
        ...swalConfig,
        title: 'Error',
        text: `Error al eliminar sucursal: ${error.response?.data?.message || error.message}`,
        icon: 'error'
      });
    }
  };

  // Función de validación
  const validateField = (name: string, value: any) => {
    let error = '';
    switch (name) {
      case 'des_com':
        if (!value) error = 'La descripción comercial es requerida';
        break;
      case 'nom_fantasia':
        if (!value) error = 'El nombre de fantasía es requerido';
        break;
      case 'cod_calle':
        if (!value) error = 'El código de calle es requerido';
        break;
      case 'nro_dom':
        if (!value) error = 'El número de domicilio es requerido';
        break;
      case 'nom_barrio':
        if (!value) error = 'El barrio es requerido';
        break;
      case 'ciudad':
        if (!value) error = 'La ciudad es requerida';
        break;
      case 'provincia':
        if (!value) error = 'La provincia es requerida';
        break;
      case 'cod_postal':
        if (!value) error = 'El código postal es requerido';
        break;
      case 'nro_res':
        if (!value) error = 'El número de resolución es requerido';
        break;
      case 'nro_exp_mesa_ent':
        if (!value) error = 'El número de expediente es requerido';
        break;
    }
    return error;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="paginas">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Sucursales</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ backgroundColor: '#27a3cf' }}
        >
          Nueva Sucursal
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N° Suc.</TableCell>
              <TableCell>Nombre Fantasía</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Barrio</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell>N° Resolución</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Vto. Habilitación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sucursales.map((sucursal) => (
              <TableRow key={sucursal.nro_sucursal}>
                <TableCell>{sucursal.nro_sucursal}</TableCell>
                <TableCell>{sucursal.nom_fantasia}</TableCell>
                <TableCell>{sucursal.des_com}</TableCell>
                <TableCell>
                  {`${sucursal.nom_calle} ${sucursal.nro_dom} ${sucursal.piso_dpto} ${sucursal.nro_local ? `(Local ${sucursal.nro_local})` : ''}`}
                </TableCell>
                <TableCell>{sucursal.nom_barrio}</TableCell>
                <TableCell>{`${sucursal.ciudad}, ${sucursal.provincia}`}</TableCell>
                <TableCell>{sucursal.nro_res}</TableCell>
                <TableCell>
                  <Chip
                    label={sucursal.dado_baja ? "Baja" : "Activa"}
                    color={sucursal.dado_baja ? "error" : "success"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(sucursal.fecha_hab)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => {
                        setSelectedSucursal(sucursal);
                        setNuevaSucursal({
                          ...nuevaSucursal,
                          sucursal: {
                            ...sucursal,
                            legajo: Number(legajo)
                          }
                        });
                        setEditModalOpen(true);
                      }}
                      size="small"
                      sx={{ color: '#27a3cf' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(sucursal.nro_sucursal)}
                      size="small"
                      sx={{ color: '#ff4444' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            margin: 0,
            zIndex: 9999,
            maxHeight: '90vh', // Limitar la altura máxima al 90% de la altura de la ventana
            overflowY: 'auto'  // Permitir el desplazamiento vertical si el contenido es demasiado alto
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.25rem' }}>Nueva Sucursal</DialogTitle>
        <DialogContent sx={{ fontSize: '0.875rem' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',     // Pantalla extra pequeña: ancho completo
                    sm: '1 1 calc(50% - 8px)'  // Pantalla pequeña y mayor: 50%
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Nombre Fantasía"
                name="nom_fantasia"
                value={nuevaSucursal.sucursal.nom_fantasia}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(50% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Descripción Comercial"
                name="des_com"
                value={nuevaSucursal.sucursal.des_com}
                onChange={handleInputChange}
              />
              <Autocomplete
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(70% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                options={calles}
                getOptionLabel={(option) => option.text}
                loading={loadingCalles}
                onInputChange={(_event, newInputValue) => {
                  buscarCalles(newInputValue);
                }}
                onChange={handleCalleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Calle"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCalles ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                noOptionsText="Sin resultados"
                loadingText="Buscando..."
                filterOptions={(x) => x} // Desactivar filtrado local
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(30% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Número"
                name="nro_dom"
                value={nuevaSucursal.sucursal.nro_dom}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(50% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Barrio"
                name="nom_barrio"
                value={nuevaSucursal.sucursal.nom_barrio}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(50% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Ciudad"
                name="ciudad"
                value={nuevaSucursal.sucursal.ciudad}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Provincia"
                name="provincia"
                value={nuevaSucursal.sucursal.provincia}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="N° Local"
                name="nro_local"
                value={nuevaSucursal.sucursal.nro_local}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Piso/Dpto"
                name="piso_dpto"
                value={nuevaSucursal.sucursal.piso_dpto}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Código Postal"
                name="cod_postal"
                value={nuevaSucursal.sucursal.cod_postal}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="N° Resolución"
                name="nro_res"
                value={nuevaSucursal.sucursal.nro_res}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="N° Expediente Mesa Entrada"
                name="nro_exp_mesa_ent"
                value={nuevaSucursal.sucursal.nro_exp_mesa_ent}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Código de Zona"
                name="cod_zona"
                value={nuevaSucursal.sucursal.cod_zona}
                onChange={handleInputChange}
              />
              <TextField
                type="datetime-local"
                label="Fecha Habilitación"
                name="fecha_hab"
                value={nuevaSucursal.sucursal.fecha_hab.split('.')[0]}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33% - 8px)' }, '& .MuiInputBase-input': { fontSize: '0.875rem' }, '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
              />
              <TextField
                type="datetime-local"
                label="Fecha Inicio"
                name="fecha_inicio"
                value={nuevaSucursal.sucursal.fecha_inicio.split('.')[0]}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33% - 8px)' }, '& .MuiInputBase-input': { fontSize: '0.875rem' }, '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
              />
              <TextField
                type="datetime-local"
                label="Vencimiento Inscripción"
                name="vto_inscripcion"
                value={nuevaSucursal.sucursal.vto_inscripcion.split('.')[0]}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33% - 8px)' }, '& .MuiInputBase-input': { fontSize: '0.875rem' }, '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <h3 style={{ fontSize: '1rem' }}>Información de Auditoría</h3>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <TextField
                  label="Observaciones"
                  name="auditoria.observaciones"
                  value={nuevaSucursal.auditoria.observaciones}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  sx={{ flex: '1 1 100%', '& .MuiInputBase-input': { fontSize: '0.875rem' }, '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit" sx={{ fontSize: '0.875rem' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: '#27a3cf', fontSize: '0.875rem' }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            margin: 0,
            zIndex: 9999,
            maxHeight: '90vh', // Limitar la altura máxima al 90% de la altura de la ventana
            overflowY: 'auto'  // Permitir el desplazamiento vertical si el contenido es demasiado alto
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.25rem' }}>Editar Sucursal</DialogTitle>
        <DialogContent sx={{ fontSize: '0.875rem' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',     // Pantalla extra pequeña: ancho completo
                    sm: '1 1 calc(50% - 8px)'  // Pantalla pequeña y mayor: 50%
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Nombre Fantasía"
                name="nom_fantasia"
                value={nuevaSucursal.sucursal.nom_fantasia}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(50% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Descripción Comercial"
                name="des_com"
                value={nuevaSucursal.sucursal.des_com}
                onChange={handleInputChange}
              />
              <Autocomplete
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(70% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                options={calles}
                getOptionLabel={(option) => option.text}
                loading={loadingCalles}
                onInputChange={(_event, newInputValue) => {
                  buscarCalles(newInputValue);
                }}
                onChange={handleCalleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Calle"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCalles ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                noOptionsText="Sin resultados"
                loadingText="Buscando..."
                filterOptions={(x) => x} // Desactivar filtrado local
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(30% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Número"
                name="nro_dom"
                value={nuevaSucursal.sucursal.nro_dom}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(50% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Barrio"
                name="nom_barrio"
                value={nuevaSucursal.sucursal.nom_barrio}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(50% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Ciudad"
                name="ciudad"
                value={nuevaSucursal.sucursal.ciudad}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Provincia"
                name="provincia"
                value={nuevaSucursal.sucursal.provincia}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="N° Local"
                name="nro_local"
                value={nuevaSucursal.sucursal.nro_local}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Piso/Dpto"
                name="piso_dpto"
                value={nuevaSucursal.sucursal.piso_dpto}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Código Postal"
                name="cod_postal"
                value={nuevaSucursal.sucursal.cod_postal}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="N° Resolución"
                name="nro_res"
                value={nuevaSucursal.sucursal.nro_res}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="N° Expediente Mesa Entrada"
                name="nro_exp_mesa_ent"
                value={nuevaSucursal.sucursal.nro_exp_mesa_ent}
                onChange={handleInputChange}
              />
              <TextField
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(33% - 8px)'
                  },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' }
                }}
                label="Código de Zona"
                name="cod_zona"
                value={nuevaSucursal.sucursal.cod_zona}
                onChange={handleInputChange}
              />
              <TextField
                type="datetime-local"
                label="Fecha Habilitación"
                name="fecha_hab"
                value={nuevaSucursal.sucursal.fecha_hab.split('.')[0]}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33% - 8px)' }, '& .MuiInputBase-input': { fontSize: '0.875rem' }, '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
              />
              <TextField
                type="datetime-local"
                label="Fecha Inicio"
                name="fecha_inicio"
                value={nuevaSucursal.sucursal.fecha_inicio.split('.')[0]}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33% - 8px)' }, '& .MuiInputBase-input': { fontSize: '0.875rem' }, '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
              />
              <TextField
                type="datetime-local"
                label="Vencimiento Inscripción"
                name="vto_inscripcion"
                value={nuevaSucursal.sucursal.vto_inscripcion.split('.')[0]}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33% - 8px)' }, '& .MuiInputBase-input': { fontSize: '0.875rem' }, '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <h3 style={{ fontSize: '1rem' }}>Información de Auditoría</h3>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <TextField
                  label="Observaciones"
                  name="auditoria.observaciones"
                  value={nuevaSucursal.auditoria.observaciones}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  sx={{ flex: '1 1 100%', '& .MuiInputBase-input': { fontSize: '0.875rem' }, '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="inherit" sx={{ fontSize: '0.875rem' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleEdit}
            variant="contained"
            sx={{ backgroundColor: '#27a3cf', fontSize: '0.875rem' }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sucursales;