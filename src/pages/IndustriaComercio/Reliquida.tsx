import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const Reliquida = () => {
  const [periodos, setPeriodos] = useState<PeriodoReliquida[]>([]);
  const [periodosSeleccionados, setPeriodosSeleccionados] = useState<Set<number>>(new Set());
  const [periodosReliquidados, setPeriodosReliquidados] = useState<PeriodoReliquida[]>([]);
  const [totalMonto, setTotalMonto] = useState<number>(0);
  const [totalDebe, setTotalDebe] = useState<number>(0);
  const { legajo } = useParams();

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

  const handleReliquidar = async () => {
    try {
      const periodosAReliquidar = periodos
        .filter((_, index) => periodosSeleccionados.has(index))
        .map(periodo => {
          const periodoFormateado = {
            tipo_transaccion: 0,
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
          };

          console.log('Período formateado:', periodoFormateado);
          return periodoFormateado;
        });

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
        payload: error.config?.data
      });

      Swal.fire({
        title: 'Error',
        text: `Error al reliquidar los períodos: ${error.response?.data || error.message}`,
        icon: 'error'
      });
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
            tipo_transaccion: 0, //listo
            nro_transaccion: 0, //listo
            nro_pago_parcial: 0, //listo
            legajo: Number(legajo), //listo
            fecha_transaccion: new Date().toISOString(), //listo
            periodo: periodo.periodo,
            monto_original: periodo.monto_original,
            nro_plan: 0,
            pagado: false,
            debe: periodo.debe,
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Períodos a Reliquidar</h2>

      <div className="flex gap-4">
        {/* Tabla izquierda */}
        <div className="flex-1">
          <div className="h-[650px] flex flex-col">
            <h3 className="text-xl font-bold">Períodos</h3>
            <TableContainer component={Paper} sx={{ flex: 1 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Checkbox
                        checked={periodosSeleccionados.size === periodos.length && periodos.length > 0}
                        indeterminate={periodosSeleccionados.size > 0 && periodosSeleccionados.size < periodos.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell align="center">Período</TableCell>
                    <TableCell align="center">Monto</TableCell>
                    <TableCell align="center">Debe</TableCell>
                    <TableCell align="center">Vto.</TableCell>
                    <TableCell align="center">Tipo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {periodos.map((periodo, index) => (
                    <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell align="center">
                        <Checkbox
                          checked={periodosSeleccionados.has(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </TableCell>
                      <TableCell align="center">{periodo.periodo}</TableCell>
                      <TableCell align="center">{periodo.monto_original}</TableCell>
                      <TableCell align="center">{periodo.debe}</TableCell>
                      <TableCell align="center">{formatearFecha(periodo.vencimiento)}</TableCell>
                      <TableCell align="center">{periodo.tipo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        {/* Tabla derecha */}
        <div className="flex-1">
          <div className="h-[650px] flex flex-col">
            {periodosReliquidados.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold"> Reliquidados</h3>
                  <IconButton
                    color="error"
                    onClick={handleRemoveAllReliquidados}
                    title="Eliminar todos los períodos reliquidados"
                  >
                    <DeleteSweepIcon />
                  </IconButton>
                </div>
                <TableContainer component={Paper} sx={{ flex: 1 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Período</TableCell>
                        <TableCell align="center">Monto</TableCell>
                        <TableCell align="center">Debe</TableCell>
                        <TableCell align="center">Vto.</TableCell>
                        <TableCell align="center">Tipo</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {periodosReliquidados.map((periodo, index) => (
                        <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                          <TableCell align="center">{periodo.periodo}</TableCell>
                          <TableCell align="center">{periodo.monto_original}</TableCell>
                          <TableCell align="center">{periodo.debe}</TableCell>
                          <TableCell align="center">{formatearFecha(periodo.vencimiento)}</TableCell>
                          <TableCell align="center">{periodo.tipo}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveReliquidado(index)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">
                      Monto: $ {totalMonto.toFixed(2)}
                    </div>
                    <div className="font-semibold">
                      Debe: $ {totalDebe.toFixed(2)}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Paper sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="text-gray-500">No hay períodos reliquidados</span>
              </Paper>
            )}
          </div>
        </div>

      </div>
      <div className="flex justify-end mt-2 gap-2">
        <Button
          variant="contained"
          color="primary"
          onClick={handleReliquidar}
          disabled={periodosSeleccionados.size === 0}
        >
          Reliquidar
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleConfirmar}
          disabled={periodosReliquidados.length === 0}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default Reliquida; 