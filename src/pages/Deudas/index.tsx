import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  TablePagination
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';

interface Deuda {
  tipo_transaccion: number;
  nro_transaccion: number;
  periodo: string;
  monto_original: number;
  debe: number;
  haber: number;
  vencimiento: string;
  pagado: boolean;
  recargo: number;
  declaracion_jurada: boolean;
}

interface CategoriaDeuda {
  cod_categoria: number;
  des_categoria: string;
  id_subrubro: number;
  tipo_deuda: number;
}

interface NuevaDeudaPayload {
  legajo: number;
  lstCtastes: Array<{
    tipo_transaccion: number;
    nro_pago_parcial: number;
    legajo: number;
    fecha_transaccion: string;
    periodo: string;
    monto_original: number;
    nro_plan: number;
    pagado: boolean;
    debe: number;
    haber: number;
    nro_procuracion: number;
    pago_parcial: boolean;
    vencimiento: string;
    nro_cedulon: number;
    declaracion_jurada: boolean;
    liquidacion_especial: boolean;
    cod_cate_deuda: number | null;
    monto_pagado: number;
    recargo: number;
    honorarios: number;
    iva_hons: number;
    tipo_deuda: number;
    decreto: string;
    observaciones: string;
    nro_cedulon_paypertic: number;
    des_movimiento: string;
    des_categoria: string;
    deuda: number;
    sel: number;
    costo_financiero: number;
    des_rubro: string;
    cod_tipo_per: number;
    sub_total: number;
    deuda_activa: number;
  }>;
  auditoria: {
    observaciones: string;
  };
}

interface AuditoriaPayload {
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

// Configuración global para SweetAlert2
const swalConfig = {
  position: 'top' as const,
  customClass: {
    container: 'swal-top'
  },
  focusConfirm: false // Evitar el foco automático en el botón de confirmar
};

const Deudas = () => {
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const { legajo } = useParams<{ legajo: string }>();
  const [openModal, setOpenModal] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaDeuda[]>([]);
  const [nuevaDeuda, setNuevaDeuda] = useState<NuevaDeudaPayload>({
    legajo: Number(legajo),
    lstCtastes: [{
      tipo_transaccion: 1,
      nro_pago_parcial: 0,
      legajo: Number(legajo),
      fecha_transaccion: new Date().toISOString(),
      periodo: "",
      monto_original: 0,
      nro_plan: 0,
      pagado: false,
      debe: 0,
      haber: 0,
      nro_procuracion: 0,
      pago_parcial: false,
      vencimiento: new Date().toISOString(),
      nro_cedulon: 0,
      declaracion_jurada: true,
      liquidacion_especial: false,
      cod_cate_deuda: null,
      monto_pagado: 0,
      recargo: 0,
      honorarios: 0,
      iva_hons: 0,
      tipo_deuda: 0,
      decreto: "",
      observaciones: "",
      nro_cedulon_paypertic: 0,
      des_movimiento: "",
      des_categoria: "string",
      deuda: 0,
      sel: 0,
      costo_financiero: 0,
      des_rubro: "",
      cod_tipo_per: 0,
      sub_total: 0,
      deuda_activa: 0
    }],
    auditoria: {
      observaciones: "string"
    }
  });
  const [editingDeuda, setEditingDeuda] = useState<Deuda | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Referencia para el diálogo
  const dialogRef = useRef<HTMLDivElement>(null);

  const fetchDeudas = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/ListarDeudasXLegajo?legajo=${legajo}`
      );
      setDeudas(response.data);
    } catch (error) {
      console.error('Error al obtener deudas:', error);
    }
  };

  useEffect(() => {
    if (legajo) {
      fetchDeudas();
    }
  }, [legajo]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/ListarCategoriaDeuda`
        );
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  const validateForm = () => {
    const { lstCtastes } = nuevaDeuda;
    const required = [
      'periodo',
      'monto_original',
      'debe',
      'vencimiento',
      'cod_cate_deuda'
    ];

    return required.every(field => lstCtastes[0][field]);
  };

  const handleEdit = (deuda: Deuda) => {
    setEditingDeuda(deuda);
    setNuevaDeuda({
      legajo: Number(legajo),
      lstCtastes: [{
        ...deuda,
        legajo: Number(legajo),
        fecha_transaccion: new Date().toISOString(),
        tipo_transaccion: 1,
        nro_pago_parcial: 0,
        nro_plan: 0,
        pagado: false,
        haber: 0,
        nro_procuracion: 0,
        pago_parcial: false,
        nro_cedulon: 0,
        declaracion_jurada: true,
        liquidacion_especial: false,
        monto_pagado: 0,
        honorarios: 0,
        iva_hons: 0,
        tipo_deuda: 0,
        decreto: "",
        observaciones: "",
        nro_cedulon_paypertic: 0,
        des_movimiento: "",
        deuda: 0,
        sel: 0,
        costo_financiero: 0,
        des_rubro: "",
        cod_tipo_per: 0,
        sub_total: 0,
        deuda_activa: 0
      }],
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
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      await Swal.fire({
        ...swalConfig,
        title: 'Error',
        text: 'Por favor complete todos los campos requeridos',
        icon: 'error'
      });
      return;
    }

    try {
      const endpoint = editingDeuda
        ? `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/ModificarDeuda`
        : `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/NuevaDeuda`;

      if (editingDeuda) {
        // Si es edición, usamos PUT
        const payload = {
          legajo: Number(legajo),
          lstCtastes: [{
            ...nuevaDeuda.lstCtastes[0],
            nro_transaccion: editingDeuda.nro_transaccion,
            tipo_transaccion: 1,
            nro_pago_parcial: 0,
            legajo: Number(legajo),
            fecha_transaccion: new Date().toISOString(),
            nro_plan: 0,
            pagado: false,
            haber: 0,
            nro_procuracion: 0,
            pago_parcial: false,
            nro_cedulon: 0,
            declaracion_jurada: true,
            liquidacion_especial: false,
            monto_pagado: 0,
            honorarios: 0,
            iva_hons: 0,
            tipo_deuda: 0,
            decreto: "",
            observaciones: "",
            nro_cedulon_paypertic: 0,
            des_movimiento: "",
            deuda: 0,
            sel: 0,
            costo_financiero: 0,
            des_rubro: "",
            cod_tipo_per: 0,
            sub_total: 0,
            deuda_activa: 0,
            vencimiento: nuevaDeuda.lstCtastes[0].vencimiento
              ? new Date(nuevaDeuda.lstCtastes[0].vencimiento).toISOString()
              : new Date().toISOString()
          }],
          auditoria: {
            id_auditoria: 0,
            fecha: "string",
            usuario: "string",
            proceso: "string",
            identificacion: "string",
            autorizaciones: "string",
            observaciones: nuevaDeuda.auditoria.observaciones || "string",
            detalle: "string",
            ip: "string"
          }
        };

        console.log('Payload de modificación:', payload); // Para debugging

        await axios.put(endpoint, payload);
      } else {
        // Si es nueva deuda, usamos POST
        await axios.post(endpoint, nuevaDeuda);
      }

      // Primero cerramos el modal y limpiamos los estados
      setOpenModal(false);
      setEditingDeuda(null);
      // Reseteamos el estado de nuevaDeuda
      setNuevaDeuda({
        legajo: Number(legajo),
        lstCtastes: [{
          tipo_transaccion: 1,
          nro_pago_parcial: 0,
          legajo: Number(legajo),
          fecha_transaccion: new Date().toISOString(),
          periodo: "",
          monto_original: 0,
          nro_plan: 0,
          pagado: false,
          debe: 0,
          haber: 0,
          nro_procuracion: 0,
          pago_parcial: false,
          vencimiento: new Date().toISOString(),
          nro_cedulon: 0,
          declaracion_jurada: true,
          liquidacion_especial: false,
          cod_cate_deuda: null,
          monto_pagado: 0,
          recargo: 0,
          honorarios: 0,
          iva_hons: 0,
          tipo_deuda: 0,
          decreto: "",
          observaciones: "",
          nro_cedulon_paypertic: 0,
          des_movimiento: "",
          des_categoria: "string",
          deuda: 0,
          sel: 0,
          costo_financiero: 0,
          des_rubro: "",
          cod_tipo_per: 0,
          sub_total: 0,
          deuda_activa: 0
        }],
        auditoria: {
          observaciones: "string"
        }
      });

      // Luego actualizamos los datos
      await fetchDeudas();

      // Finalmente mostramos el mensaje de éxito
      await Swal.fire({
        ...swalConfig,
        title: '¡Éxito!',
        text: editingDeuda ? 'La deuda ha sido modificada correctamente' : 'La deuda ha sido creada correctamente',
        icon: 'success'
      });

    } catch (error) {
      console.error('Error al procesar deuda:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', error.response?.data);
      }

      // Cerramos el modal incluso en caso de error
      setOpenModal(false);
      setEditingDeuda(null);
      setNuevaDeuda({
        legajo: Number(legajo),
        lstCtastes: [{
          tipo_transaccion: 1,
          nro_pago_parcial: 0,
          legajo: Number(legajo),
          fecha_transaccion: new Date().toISOString(),
          periodo: "",
          monto_original: 0,
          nro_plan: 0,
          pagado: false,
          debe: 0,
          haber: 0,
          nro_procuracion: 0,
          pago_parcial: false,
          vencimiento: new Date().toISOString(),
          nro_cedulon: 0,
          declaracion_jurada: true,
          liquidacion_especial: false,
          cod_cate_deuda: null,
          monto_pagado: 0,
          recargo: 0,
          honorarios: 0,
          iva_hons: 0,
          tipo_deuda: 0,
          decreto: "",
          observaciones: "",
          nro_cedulon_paypertic: 0,
          des_movimiento: "",
          des_categoria: "string",
          deuda: 0,
          sel: 0,
          costo_financiero: 0,
          des_rubro: "",
          cod_tipo_per: 0,
          sub_total: 0,
          deuda_activa: 0
        }],
        auditoria: {
          observaciones: "string"
        }
      });

      await Swal.fire({
        ...swalConfig,
        title: 'Error',
        text: editingDeuda ? 'No se pudo modificar la deuda' : 'No se pudo crear la deuda',
        icon: 'error'
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setNuevaDeuda(prev => ({
      ...prev,
      lstCtastes: [
        {
          ...prev.lstCtastes[0],
          [field]: value
        }
      ]
    }));
  };

  // Función para formatear montos
  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  // Función para formatear fechas
  const formatFecha = (fecha: string) => {
    return format(new Date(fecha), 'dd/MM/yyyy');
  };

  // Calcular total de deuda
  const totalDeuda = deudas.reduce((acc, deuda) => acc + deuda.debe, 0);

  const handleDelete = async (nro_transaccion: number) => {
    const { value: observaciones } = await Swal.fire({
      ...swalConfig,
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      input: 'textarea',
      inputLabel: 'Observaciones',
      inputPlaceholder: 'Ingrese las observaciones...',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar observaciones';
        }
        return null;
      }
    });

    if (observaciones) {
      try {
        const auditoria: AuditoriaPayload = {
          id_auditoria: 0,
          fecha: "string",
          usuario: "string",
          proceso: "string",
          identificacion: "string",
          autorizaciones: "string",
          observaciones: observaciones,
          detalle: "string",
          ip: "string"
        };

        await axios.delete(
          `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/EliminarDeuda?legajo=${legajo}&nro_transaccion=${nro_transaccion}`,
          { data: auditoria }
        );

        await Swal.fire({
          ...swalConfig,
          title: '¡Eliminado!',
          text: 'La deuda ha sido eliminada correctamente',
          icon: 'success'
        });

        fetchDeudas();
      } catch (error) {
        console.error('Error al eliminar deuda:', error);
        await Swal.fire({
          ...swalConfig,
          title: 'Error',
          text: 'No se pudo eliminar la deuda',
          icon: 'error'
        });
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calcular deudas para la página actual
  const deudasPaginadas = deudas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingDeuda(null);
    setNuevaDeuda({
      legajo: Number(legajo),
      lstCtastes: [{
        tipo_transaccion: 1,
        nro_pago_parcial: 0,
        legajo: Number(legajo),
        fecha_transaccion: new Date().toISOString(),
        periodo: "",
        monto_original: 0,
        nro_plan: 0,
        pagado: false,
        debe: 0,
        haber: 0,
        nro_procuracion: 0,
        pago_parcial: false,
        vencimiento: new Date().toISOString(),
        nro_cedulon: 0,
        declaracion_jurada: true,
        liquidacion_especial: false,
        cod_cate_deuda: null,
        monto_pagado: 0,
        recargo: 0,
        honorarios: 0,
        iva_hons: 0,
        tipo_deuda: 0,
        decreto: "",
        observaciones: "",
        nro_cedulon_paypertic: 0,
        des_movimiento: "",
        des_categoria: "string",
        deuda: 0,
        sel: 0,
        costo_financiero: 0,
        des_rubro: "",
        cod_tipo_per: 0,
        sub_total: 0,
        deuda_activa: 0
      }],
      auditoria: {
        observaciones: "string"
      }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Deudas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Nueva Deuda
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" color="primary">
          Total Deuda: {formatMonto(totalDeuda)}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Nº Trans.</TableCell>
              <TableCell>Período</TableCell>
              <TableCell align="right">Monto Original</TableCell>
              <TableCell align="right">Recargo</TableCell>
              <TableCell align="right">Debe</TableCell>
              <TableCell align="right">Haber</TableCell>
              <TableCell>Vencimiento</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>DDJJ</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deudasPaginadas.map((deuda) => (
              <TableRow
                key={deuda.nro_transaccion}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <TableCell>{deuda.nro_transaccion}</TableCell>
                <TableCell>{deuda.periodo}</TableCell>
                <TableCell align="right">{formatMonto(deuda.monto_original)}</TableCell>
                <TableCell align="right">{formatMonto(deuda.recargo)}</TableCell>
                <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                  {formatMonto(deuda.debe)}
                </TableCell>
                <TableCell align="right" sx={{ color: 'success.main' }}>
                  {formatMonto(deuda.haber)}
                </TableCell>
                <TableCell>{formatFecha(deuda.vencimiento)}</TableCell>
                <TableCell>
                  <Chip
                    label={deuda.pagado ? "Pagado" : "Pendiente"}
                    color={deuda.pagado ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={deuda.declaracion_jurada ? "Sí" : "No"}
                    color={deuda.declaracion_jurada ? "info" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(deuda)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(deuda.nro_transaccion)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {deudasPaginadas.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No hay deudas para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={deudas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={false}
        aria-labelledby="dialog-title"
        ref={dialogRef}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
            pt: 2
          }
        }}
        disableRestoreFocus
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle id="dialog-title">
          {editingDeuda ? 'Modificar Deuda' : 'Crear Nueva Deuda'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
            component="form"
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Período (YYYY/MM)"
              value={nuevaDeuda.lstCtastes[0].periodo}
              onChange={(e) => handleInputChange('periodo', e.target.value)}
            />
            <TextField
              label="Monto Original"
              type="number"
              value={nuevaDeuda.lstCtastes[0].monto_original}
              onChange={(e) => handleInputChange('monto_original', Number(e.target.value))}
            />
            <TextField
              label="Debe"
              type="number"
              value={nuevaDeuda.lstCtastes[0].debe}
              onChange={(e) => handleInputChange('debe', Number(e.target.value))}
            />
            <TextField
              label="Recargo"
              type="number"
              value={nuevaDeuda.lstCtastes[0].recargo}
              onChange={(e) => handleInputChange('recargo', Number(e.target.value))}
            />
            <TextField
              label="Vencimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={nuevaDeuda.lstCtastes[0].vencimiento.split('T')[0]}
              onChange={(e) => handleInputChange('vencimiento', e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="categoria-label">Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                label="Categoría"
                value={nuevaDeuda.lstCtastes[0].cod_cate_deuda || ''}
                onChange={(e) => {
                  const selectedCatId = Number(e.target.value);
                  const selectedCategoria = categorias.find(
                    cat => cat.cod_categoria === selectedCatId
                  );

                  setNuevaDeuda(prev => ({
                    ...prev,
                    lstCtastes: [{
                      ...prev.lstCtastes[0],
                      cod_cate_deuda: selectedCatId,
                      des_categoria: selectedCategoria?.des_categoria?.trim() || 'string'
                    }]
                  }));
                }}
              >
                {categorias.map((cat) => (
                  <MenuItem
                    key={cat.cod_categoria}
                    value={cat.cod_categoria}
                  >
                    {cat.des_categoria.trim()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Observaciones"
              multiline
              rows={4}
              value={nuevaDeuda.auditoria.observaciones}
              onChange={(e) => setNuevaDeuda(prev => ({
                ...prev,
                auditoria: { ...prev.auditoria, observaciones: e.target.value }
              }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Deudas;

// Agregar estilos globales para SweetAlert2
const style = document.createElement('style');
style.textContent = `
  .swal-top {
    padding-top: 16px !important;
  }
  .swal2-container {
    align-items: flex-start !important;
    padding-top: 16px !important;
  }
`;
document.head.appendChild(style);