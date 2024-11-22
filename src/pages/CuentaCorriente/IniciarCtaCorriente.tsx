import { useState, useEffect, ChangeEvent } from "react";
import Swal from "sweetalert2";
import {
  FormTextarea,
  FormLabel,
  FormInput,
  FormSelect,
} from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import { useUserContext } from "../../context/UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Cargando from "../Recursos/Cargando";
import {
  transformarFechaNuevoFormato,
  devolverFechaConGuiones,
  devolverVencimiento,
  devolverFechaConBarra
} from "../../utils/IycUtils";

interface Periodo {
  periodo: string;
  [key: string]: any;
}

import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button as MuiButton,
  Grid,
  Container,
  Checkbox,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  TableRow,
  TableCell
} from '@mui/material';
import {
  KeyboardDoubleArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowLeft
} from '@mui/icons-material';

const IniciarCtaCorriente = () => {
  const { dominio } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState<boolean>(false);

  const { elementoIndCom, traerElemento } = useIndustriaComercioContext();

  const [periodosExistentes, setPeriodosExistentes] = useState<Periodo[]>([]);
  const [periodosIncluidos, setPeriodosIncluidos] = useState<Periodo[]>([]);
  const [periodosSeleccionadosExistentes, setPeriodosSeleccionadosExistentes] =
    useState<string[]>([]);
  const [periodosSeleccionadosIncluidos, setPeriodosSeleccionadosIncluidos] =
    useState<string[]>([]);

  const moverPeriodoExistentesAIncluidos = () => {
    const nuevosPeriodosIncluidos = periodosExistentes.filter((periodo) =>
      periodosSeleccionadosExistentes.includes(periodo.periodo)
    );
    setPeriodosExistentes(
      periodosExistentes.filter(
        (periodo) => !periodosSeleccionadosExistentes.includes(periodo.periodo)
      )
    );
    setPeriodosIncluidos([...periodosIncluidos, ...nuevosPeriodosIncluidos]);
  };

  const moverPeriodoIncluidosAExistentes = () => {
    const nuevosPeriodosExistentes = periodosIncluidos.filter((periodo) =>
      periodosSeleccionadosIncluidos.includes(periodo.periodo)
    );
    setPeriodosIncluidos(
      periodosIncluidos.filter(
        (periodo) => !periodosSeleccionadosIncluidos.includes(periodo.periodo)
      )
    );
    setPeriodosExistentes([...periodosExistentes, ...nuevosPeriodosExistentes]);
  };

  const moverTodosExistentesAIncluidos = () => {
    setPeriodosIncluidos([...periodosIncluidos, ...periodosExistentes]);
    setPeriodosExistentes([]);
  };

  const moverTodosIncluidosAExistentes = () => {
    setPeriodosExistentes([...periodosExistentes, ...periodosIncluidos]);
    setPeriodosIncluidos([]);
  };

  const traerPeriodos = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/IniciarCtacte?legajo=${elementoIndCom?.legajo}`;
      const response = await axios.get(apiUrl);
      setPeriodosExistentes(response.data);
      setCargando(true);
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.message || "Error desconocido",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
      navigate(-1);
    }
  };

  useEffect(() => {
    traerPeriodos();
  }, []);

  const cancelar = () => {
    navigate(-1);
  };

  const cadenaFecha = "30/04/2021 12:00:00 a.m.";
  const fechaTransformada = transformarFechaNuevoFormato(cadenaFecha);

  const iniciarCtaCte = () => {
    const fechaActual = new Date();
    const lstCtasTes = periodosIncluidos.map((periodo) => {
      return {
        "tipo_transaccion": 1,
        "nro_transaccion": 1234,
        "nro_pago_parcial": 0,
        "legajo": 0,
        "fecha_transaccion": devolverFechaConGuiones(fechaActual),
        "periodo": periodo.periodo,
        "monto_original": 0,
        "nro_plan": 0,
        "pagado": true,
        "debe": 0,
        "haber": 0,
        "nro_procuracion": 0,
        "pago_parcial": true,
        "vencimiento": devolverVencimiento(periodo.vencimiento),
        "nro_cedulon": 0,
        "declaracion_jurada": true,
        "liquidacion_especial": true,
        "cod_cate_deuda": 0,
        "monto_pagado": 0,
        "recargo": 0,
        "honorarios": 0,
        "iva_hons": 0,
        "tipo_deuda": 0,
        "decreto": "string",
        "observaciones": "string",
        "nro_cedulon_paypertic": 0,
        "des_movimiento": "string",
        "des_categoria": "string",
        "deuda": 0,
        "sel": 0,
        "costo_financiero": 0,
        "des_rubro": "string",
        "cod_tipo_per": 0,
        "sub_total": 0
      }
    });

    const consulta =
    {
      "legajo": elementoIndCom?.legajo,
      "lstCtasTes": lstCtasTes,
      "auditoria": {
        "id_auditoria": 0,
        "fecha": devolverFechaConGuiones(fechaActual),
        "usuario": user?.userName,
        "proceso": "string",
        "identificacion": "string",
        "autorizaciones": "string",
        "observaciones": "Iniciar Cuenta Corriente",
        "detalle": "string",
        "ip": "string"
      }
    }
    console.log(consulta)
    const urlApi = `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/Confirma_iniciar_ctacte`;
    axios.post(urlApi, consulta)
      .then((response) => {
        if (response.data) {
          Swal.fire({
            title: "Éxito",
            text: "Se inició la cuenta corriente correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          });
          navigate(-1);
        } else {
          Swal.fire({
            title: "Error",
            text: "No se pudo iniciar la cuenta corriente",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: `Error: ${error.response.status}`,
          text: `${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });
        console.log(error);
      });
  }

  const handleSelectExistente = (periodo: string) => {
    const seleccionados = [...periodosSeleccionadosExistentes];
    const index = seleccionados.indexOf(periodo);
    if (index === -1) {
      seleccionados.push(periodo);
    } else {
      seleccionados.splice(index, 1);
    }
    setPeriodosSeleccionadosExistentes(seleccionados);
  };

  const handleSelectIncluido = (periodo: string) => {
    const seleccionados = [...periodosSeleccionadosIncluidos];
    const index = seleccionados.indexOf(periodo);
    if (index === -1) {
      seleccionados.push(periodo);
    } else {
      seleccionados.splice(index, 1);
    }
    setPeriodosSeleccionadosIncluidos(seleccionados);
  };

  const handleSelectAllExistentes = () => {
    if (periodosSeleccionadosExistentes.length === periodosExistentes.length) {
      setPeriodosSeleccionadosExistentes([]);
    } else {
      setPeriodosSeleccionadosExistentes(periodosExistentes.map(p => p.periodo));
    }
  };

  const handleSelectAllIncluidos = () => {
    if (periodosSeleccionadosIncluidos.length === periodosIncluidos.length) {
      setPeriodosSeleccionadosIncluidos([]);
    } else {
      setPeriodosSeleccionadosIncluidos(periodosIncluidos.map(p => p.periodo));
    }
  };

  const formatearFecha = (fechaCompleta: string): string => {
    const [fecha, hora] = fechaCompleta.split(" ");
    const [dia, mes, anio] = fecha.split("/");
    const nuevaFecha = `${dia} / ${mes} / ${anio}`;
    return nuevaFecha;
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          <h5>Iniciar Cuenta Corriente</h5>
          <h6>Legajo: {elementoIndCom?.legajo}</h6>
        </Box>

        {!cargando && <Cargando mensaje="cargando los periodos" />}

        {cargando && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <h6>Periodos Existentes</h6>
              <TableContainer sx={{ minHeight: 300, maxHeight: 500 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={periodosSeleccionadosExistentes.length === periodosExistentes.length}
                          indeterminate={
                            periodosSeleccionadosExistentes.length > 0 &&
                            periodosSeleccionadosExistentes.length < periodosExistentes.length
                          }
                          onChange={handleSelectAllExistentes}
                        />
                      </TableCell>
                      <TableCell>Periodo</TableCell>
                      <TableCell>Vencimiento</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {periodosExistentes.map((periodo) => (
                      <TableRow
                        key={periodo.periodo}
                        hover
                        onClick={() => handleSelectExistente(periodo.periodo)}
                        role="checkbox"
                        selected={periodosSeleccionadosExistentes.includes(periodo.periodo)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={periodosSeleccionadosExistentes.includes(periodo.periodo)}
                          />
                        </TableCell>
                        <TableCell>{periodo.periodo}</TableCell>
                        <TableCell>{formatearFecha(periodo.vencimiento)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              justifyContent: 'center',
              padding: '0 20px'
            }}>
              <MuiButton
                variant="contained"
                onClick={moverPeriodoExistentesAIncluidos}
                startIcon={<KeyboardArrowRight />}
              >
                Mover
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={moverPeriodoIncluidosAExistentes}
                startIcon={<KeyboardArrowLeft />}
              >
                Mover
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={moverTodosExistentesAIncluidos}
                startIcon={<KeyboardDoubleArrowRight />}
              >
                Mover Todo
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={moverTodosIncluidosAExistentes}
                startIcon={<KeyboardDoubleArrowLeft />}
              >
                Mover Todo
              </MuiButton>
            </Box>

            <Box sx={{ flex: 1 }}>
              <h6>Periodos Incluidos</h6>
              <TableContainer sx={{ minHeight: 300, maxHeight: 500 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={periodosSeleccionadosIncluidos.length === periodosIncluidos.length}
                          indeterminate={
                            periodosSeleccionadosIncluidos.length > 0 &&
                            periodosSeleccionadosIncluidos.length < periodosIncluidos.length
                          }
                          onChange={handleSelectAllIncluidos}
                        />
                      </TableCell>
                      <TableCell>Periodo</TableCell>
                      <TableCell>Vencimiento</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {periodosIncluidos.map((periodo) => (
                      <TableRow
                        key={periodo.periodo}
                        hover
                        onClick={() => handleSelectIncluido(periodo.periodo)}
                        role="checkbox"
                        selected={periodosSeleccionadosIncluidos.includes(periodo.periodo)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={periodosSeleccionadosIncluidos.includes(periodo.periodo)}
                          />
                        </TableCell>
                        <TableCell>{periodo.periodo}</TableCell>
                        <TableCell>{formatearFecha(periodo.vencimiento)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <MuiButton
            variant="contained"
            color="primary"
            onClick={iniciarCtaCte}
          >
            Confirmar
          </MuiButton>
          <MuiButton
            variant="outlined"
            onClick={cancelar}
          >
            Cancelar
          </MuiButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default IniciarCtaCorriente;
