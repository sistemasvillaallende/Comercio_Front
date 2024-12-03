import { useEffect, useState } from 'react'
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Checkbox,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button as MuiButton
} from '@mui/material';
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserProvider";
import { formatNumberToARS, formatDateToDDMMYYYY } from "../../utils/Operaciones";

const EliminarCancelacion = () => {
  const { elementoIndCom } = useIndustriaComercioContext();
  const [reLiquidaciones, setReLiquidaciones] = useState<ReLiquidacion[]>([]);
  const [reLiquidacionesSeleccionadas, setReLiquidacionesSeleccionadas] = useState<ReLiquidacion[]>([]);
  const [motivo, setMotivo] = useState<number>(0);
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/Listar_Periodos_cancelados?legajo=${elementoIndCom?.legajo}`
    console.log(apiUrl)
    axios.get(apiUrl).then((response) => {
      setReLiquidaciones(response.data);
    }).catch((error) => {
      Swal.fire({
        title: `${error.response.data.message}`,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
    });
  }, [])

  const handleSeleccionar = (e: ReLiquidacion) => {
    const reLiquidacionSeleccionada = reLiquidacionesSeleccionadas.find((reLiquidacion) => reLiquidacion.periodo === e.periodo);
    if (reLiquidacionSeleccionada) {
      const reLiquidacionesFiltradas = reLiquidacionesSeleccionadas.filter((reLiquidacion) => reLiquidacion.periodo !== e.periodo);
      setReLiquidacionesSeleccionadas(reLiquidacionesFiltradas);
    } else {
      setReLiquidacionesSeleccionadas([...reLiquidacionesSeleccionadas, e]);
    }
  }

  const handleSeleccionarTodo = () => {
    if (reLiquidacionesSeleccionadas.length === reLiquidaciones.length) {
      setReLiquidacionesSeleccionadas([]);
    } else {
      setReLiquidacionesSeleccionadas([...reLiquidaciones]);
    }
  }

  const verFechaActual = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Sumamos 1 ya que en JavaScript los meses comienzan en 0
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    return formattedDate;
  }

  const handleCancelarCtaCte = (auditoria: String) => {
    const consulta = {
      "legajo": elementoIndCom?.legajo,
      "lstCtasTes": reLiquidacionesSeleccionadas,
      "auditoria": {
        "id_auditoria": 0,
        "fecha": verFechaActual(),
        "usuario": user?.userName,
        "proceso": "Reliquidación de deuda",
        "identificacion": "string",
        "autorizaciones": "string",
        "observaciones": auditoria,
        "detalle": "string",
        "ip": "string"
      }
    }
    console.log(consulta)
    const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/Confirma_elimina_cancelacion`;
    axios.post(apiUrl, consulta).then((response) => {
      Swal.fire({
        title: 'Eliminación de Cancelación',
        text: "Se ha eliminado las cancelaciones de los periodos seleccionados.",
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      setReLiquidacionesSeleccionadas([]);
      console.log(response)
      navigate(`/${elementoIndCom?.legajo}/ver`);
    }).catch((error) => {
      Swal.fire({
        title: `${error.response.status}: ${error.response.statusText}`,
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      console.log(error);
    });
  }

  const handleAuditoria = async () => {
    const { value } = await Swal.fire({
      title: 'Autorización',
      input: 'textarea',
      inputPlaceholder: 'Observaciones',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: "#27a3cf",
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar un texto para continuar';
        }
      },
    });

    if (value) {
      handleCancelarCtaCte(value);
    }
  }

  const handleCancelar = () => {
    setReLiquidacionesSeleccionadas([]);
    navigate(`/${elementoIndCom?.legajo}/ver`);
  }

  const sumarMontosSeleccionados = () => {
    const total = reLiquidacionesSeleccionadas.reduce((accumulator, liquidacion) => {
      return accumulator + liquidacion.monto_original;
    }, 0);

    return total;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Título principal */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Revertir Cancelación Especial de Periodos en la Cuenta Corriente
          </Typography>
        </Grid>

        {/* Tabla de Periodos Cancelados */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Periodos Cancelados
            </Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
              <MuiTable stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onChange={handleSeleccionarTodo}
                        checked={reLiquidacionesSeleccionadas.length === reLiquidaciones.length}
                      />
                    </TableCell>
                    <TableCell>Periodo</TableCell>
                    <TableCell align="right">Debe</TableCell>
                    <TableCell align="right">Nro Trans</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reLiquidaciones.map((liquidacion, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={() => handleSeleccionar(liquidacion)}
                          checked={reLiquidacionesSeleccionadas.includes(liquidacion)}
                        />
                      </TableCell>
                      <TableCell>{liquidacion?.periodo}</TableCell>
                      <TableCell align="right">{formatNumberToARS(liquidacion?.debe)}</TableCell>
                      <TableCell align="right">{liquidacion?.nro_transaccion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Tabla de Periodos a Revertir */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Periodos a Revertir
            </Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
              <MuiTable stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>Periodo</TableCell>
                    <TableCell align="right">Debe</TableCell>
                    <TableCell align="right">Nro Trans</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reLiquidacionesSeleccionadas.map((liquidacion, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={() => handleSeleccionar(liquidacion)}
                          checked={reLiquidacionesSeleccionadas.includes(liquidacion)}
                        />
                      </TableCell>
                      <TableCell>{liquidacion?.periodo}</TableCell>
                      <TableCell align="right">{formatNumberToARS(liquidacion?.monto_original)}</TableCell>
                      <TableCell align="right">{liquidacion?.nro_transaccion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" color="primary">
                Total:
              </Typography>
              <Typography variant="h6" color="primary">
                {formatNumberToARS(sumarMontosSeleccionados())}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Botones de acción */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <MuiButton
              variant="contained"
              color="primary"
              onClick={handleAuditoria}
            >
              Confirmar
            </MuiButton>
            <MuiButton
              variant="outlined"
              onClick={handleCancelar}
            >
              Cancelar
            </MuiButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EliminarCancelacion