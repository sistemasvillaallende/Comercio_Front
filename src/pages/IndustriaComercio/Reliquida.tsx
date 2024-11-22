import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PeriodoReliquida } from '../../interfaces/Comercio';
import Swal from 'sweetalert2';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  IconButton,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Reliquida = () => {
  const [periodos, setPeriodos] = useState<PeriodoReliquida[]>([]);
  const [periodosSeleccionados, setPeriodosSeleccionados] = useState<Set<number>>(new Set());
  const [periodosReliquidados, setPeriodosReliquidados] = useState<PeriodoReliquida[]>([]);
  const [totalMonto, setTotalMonto] = useState<number>(0);
  const [totalDebe, setTotalDebe] = useState<number>(0);
  const { legajo } = useParams();
  const navigate = useNavigate();

  const obtenerPeriodos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/Listar_periodos_a_reliquidar?legajo=${legajo}`
      );
      setPeriodos(response.data);
    } catch (error) {
      console.error('Error al obtener períodos:', error);
    }
  };

  useEffect(() => {
    obtenerPeriodos();
  }, [legajo]);

  const handleCheckboxChange = (index: number) => {
    setPeriodosSeleccionados(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Seleccionar todos
      const allIndexes = periodos.map((_, index) => index);
      setPeriodosSeleccionados(new Set(allIndexes));
    } else {
      // Deseleccionar todos
      setPeriodosSeleccionados(new Set());
    }
  };

  const handleReliquidar = async () => {
    try {
      const periodosAReliquidar = periodos
        .filter((_, index) => periodosSeleccionados.has(index))
        .map(periodo => ({
          tipo_transaccion: periodo.tipo_transaccion,
          nro_transaccion: Number(periodo.nro_transaccion) || 0,
          nro_pago_parcial: 0,
          legajo: Number(legajo),
          fecha_transaccion: new Date().toISOString(),
          periodo: periodo.periodo || "",
          monto_original: Number(periodo.monto_original) || 0,
          nro_plan: 0,
          pagado: false,
          debe: Number(periodo.debe) || 0,
          haber: 0,
          nro_procuracion: 0,
          pago_parcial: false,
          vencimiento: periodo.vencimiento || new Date().toISOString(),
          nro_cedulon: 0,
          declaracion_jurada: false,
          liquidacion_especial: false,
          cod_cate_deuda: 0,
          monto_pagado: 0,
          recargo: 0,
          honorarios: 0,
          iva_hons: 0,
          tipo_deuda: 0,
          decreto: "",
          observaciones: "",
          nro_cedulon_paypertic: 0,
          des_movimiento: "",
          des_categoria: "",
          deuda: 0,
          sel: 0,
          costo_financiero: 0,
          des_rubro: "",
          cod_tipo_per: 1,
          sub_total: 0,
          deuda_activa: 0
        }));

      console.log('Cantidad de períodos a reliquidar:', periodosAReliquidar.length);
      console.log('Payload completo:', periodosAReliquidar);

      const response = await axios.post(
        `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/Reliquidar_periodos?legajo=${legajo}`,
        periodosAReliquidar,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        const nuevosReliquidados = periodos.filter((_, index) => periodosSeleccionados.has(index));

        const nuevoTotalMonto = nuevosReliquidados.reduce((acc, periodo) =>
          acc + Number(periodo.monto_original || 0), 0);
        const nuevoTotalDebe = nuevosReliquidados.reduce((acc, periodo) =>
          acc + Number(periodo.debe || 0), 0);

        setTotalMonto(prev => prev + nuevoTotalMonto);
        setTotalDebe(prev => prev + nuevoTotalDebe);
        setPeriodosReliquidados([...periodosReliquidados, ...nuevosReliquidados]);
        setPeriodos(periodos.filter((_, index) => !periodosSeleccionados.has(index)));
        setPeriodosSeleccionados(new Set());

        Swal.fire({
          title: '¡Éxito!',
          text: 'Los períodos han sido reliquidados correctamente',
          icon: 'success'
        });
      }
    } catch (error: any) {
      console.error('Error detallado:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        status: error.response?.status
      });

      let mensajeError = 'Error al reliquidar los períodos';

      if (error.response?.status === 400) {
        mensajeError = error.response.data.message || error.response.data || mensajeError;

        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error'
        }).then(() => {
          navigate(`/comercio/${legajo}/iniciarctacte`);
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error'
        });
      }
    }
  };

  const handleRemoveReliquidado = (index: number) => {
    const periodoADevolver = periodosReliquidados[index];
    setPeriodos([...periodos, periodoADevolver]);

    setTotalMonto(prev => prev - Number(periodoADevolver.monto_original));
    setTotalDebe(prev => prev - Number(periodoADevolver.debe));

    setPeriodosReliquidados(periodosReliquidados.filter((_, i) => i !== index));
  };

  const handleRemoveAllReliquidados = () => {
    setPeriodos([...periodos, ...periodosReliquidados]);
    setPeriodosReliquidados([]);
    setTotalMonto(0);
    setTotalDebe(0);
  };

  const handleConfirmar = async () => {
    const result = await Swal.fire({
      title: 'Autorización',
      html: `
        <div class="text-left">
          <p class="font-bold">Totales:</p>
          <p>Monto: $ ${totalMonto.toFixed(2)}</p>
          <p>Debe: $ ${totalDebe.toFixed(2)}</p>
        </div>
      `,
      input: 'text',
      inputPlaceholder: 'Observaciones',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      try {
        const payload = {
          legajo: Number(legajo),
          lstCtastes: periodosReliquidados.map(periodo => ({
            tipo_transaccion: periodo.tipo_transaccion,
            nro_transaccion: Number(periodo.nro_transaccion) || 0,
            nro_pago_parcial: 0,
            legajo: Number(legajo),
            fecha_transaccion: new Date().toISOString(),
            periodo: periodo.periodo,
            monto_original: Number(periodo.monto_original) || 0,
            nro_plan: 0,
            pagado: false,
            debe: Number(periodo.debe) || 0,
            haber: 0,
            nro_procuracion: 0,
            pago_parcial: false,
            vencimiento: periodo.vencimiento,
            nro_cedulon: 0,
            declaracion_jurada: false,
            liquidacion_especial: false,
            cod_cate_deuda: 0,
            monto_pagado: 0,
            recargo: 0,
            honorarios: 0,
            iva_hons: 0,
            tipo_deuda: 0,
            decreto: "",
            observaciones: result.value || "",
            nro_cedulon_paypertic: 0,
            des_movimiento: "",
            des_categoria: "",
            deuda: 0,
            sel: 0,
            costo_financiero: 0,
            des_rubro: "",
            cod_tipo_per: 1,
            sub_total: 0,
            deuda_activa: 0
          })),
          auditoria: {
            id_auditoria: 0,
            fecha: new Date().toISOString(),
            usuario: "string",
            proceso: "string",
            identificacion: "string",
            autorizaciones: "string",
            observaciones: result.value || "",
            detalle: "string",
            ip: "string"
          }
        };

        await axios.post(
          `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/Confirma_reliquidacion`,
          payload
        );

        // Limpiar la tabla de reliquidados y totales
        setPeriodosReliquidados([]);
        setTotalMonto(0);
        setTotalDebe(0);

        // Recargar la tabla de períodos
        await obtenerPeriodos();

        Swal.fire('¡Éxito!', 'La reliquidación se ha confirmado correctamente', 'success');
      } catch (error) {
        console.error('Error al confirmar reliquidación:', error);
        Swal.fire('Error', 'Hubo un error al confirmar la reliquidación', 'error');
      }
    }
  };

  return (
    <div className='paginas'>
      <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
        {/* Tabla Izquierda */}
        <Box sx={{ flex: 1, minWidth: '45%' }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                Períodos a Reliquidar
              </Box>
            </Box>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={periodosSeleccionados.size > 0 && periodosSeleccionados.size < periodos.length}
                        checked={periodosSeleccionados.size === periodos.length && periodos.length > 0}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Período</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell align="right">Debe</TableCell>
                    <TableCell>Vto.</TableCell>
                    <TableCell>Tipo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {periodos.map((periodo, index) => (
                    <TableRow
                      key={index}
                      hover
                      selected={periodosSeleccionados.has(index)}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={periodosSeleccionados.has(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </TableCell>
                      <TableCell>{periodo.periodo}</TableCell>
                      <TableCell align="right">
                        ${Number(periodo.monto_original).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ${Number(periodo.debe).toFixed(2)}
                      </TableCell>
                      <TableCell>{formatearFecha(periodo.vencimiento)}</TableCell>
                      <TableCell>{periodo.tipo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>



        {/* Tabla Derecha */}
        <Box sx={{ flex: 1, minWidth: '45%' }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                Períodos Reliquidados
              </Box>
              {periodosReliquidados.length > 0 && (
                <IconButton
                  color="error"
                  onClick={handleRemoveAllReliquidados}
                  title="Eliminar todos los períodos reliquidados"
                >
                  <DeleteSweepIcon />
                </IconButton>
              )}
            </Box>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Período</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell align="right">Debe</TableCell>
                    <TableCell>Vto.</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {periodosReliquidados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <span>No hay períodos reliquidados</span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    periodosReliquidados.map((periodo, index) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>{periodo.periodo}</TableCell>
                        <TableCell align="right">
                          ${Number(periodo.monto_original).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          ${Number(periodo.debe).toFixed(2)}
                        </TableCell>
                        <TableCell>{formatearFecha(periodo.vencimiento)}</TableCell>
                        <TableCell>{periodo.tipo}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveReliquidado(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
      {/* Botones centrales */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
        alignItems: 'flex-end'  // Alinea los botones a la derecha
      }}>
        <Button
          variant="contained"
          startIcon={<CompareArrowsIcon />}
          onClick={handleReliquidar}
          disabled={periodosSeleccionados.size === 0}
          sx={{ minWidth: 'fit-content' }}  // Hace que el botón se ajuste al contenido
        >
          Reliquidar
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={handleConfirmar}
          disabled={periodosReliquidados.length === 0}
          sx={{ minWidth: 'fit-content' }}  // Hace que el botón se ajuste al contenido
        >
          Confirmar
        </Button>
      </Box>
    </div>
  );
};

export default Reliquida; 