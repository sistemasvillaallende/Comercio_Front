import { useEffect, useState } from 'react'
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button as MuiButton
} from '@mui/material';
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserProvider";
import { formatNumberToARS, formatDateToDDMMYYYY } from "../../utils/Operaciones";

const CancelarCtaCte = () => {
  const { elementoIndCom } = useIndustriaComercioContext();
  const [reLiquidaciones, setReLiquidaciones] = useState<ReLiquidacion[]>([]);
  const [reLiquidacionesSeleccionadas, setReLiquidacionesSeleccionadas] = useState<ReLiquidacion[]>([]);
  const [motivo, setMotivo] = useState<number>(0);
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/Listar_periodos_a_cancelar?legajo=${elementoIndCom?.legajo}`
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

    const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/Confirma_cancelacion_ctasctes?tipo_transaccion=${motivo}`;
    axios.post(apiUrl, consulta).then((response) => {
      Swal.fire({
        title: 'Cancelación realizada',
        text: "Se ha cancelado correctamente los periodos seleccionados.",
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      setReLiquidacionesSeleccionadas([]);
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
    if (motivo === 0) {
      Swal.fire({
        title: 'Debe seleccionar un motivo',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      return;
    }
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
            Cancelación especial de periodos de Cuenta Corriente
          </Typography>
        </Grid>

        {/* Tabla de Periodos Disponibles */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Periodos disponibles
            </Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onChange={handleSeleccionarTodo}
                        checked={reLiquidacionesSeleccionadas.length === reLiquidaciones.length}
                      />
                    </TableCell>
                    <TableCell>Periodo</TableCell>
                    <TableCell align="right">Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reLiquidaciones.map((liquidacion, index) => (
                    <TableRow key={index} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={() => handleSeleccionar(liquidacion)}
                          checked={reLiquidacionesSeleccionadas.includes(liquidacion)}
                        />
                      </TableCell>
                      <TableCell>{liquidacion?.periodo}</TableCell>
                      <TableCell align="right">
                        {formatNumberToARS(liquidacion?.monto_original)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Tabla de Periodos a Cancelar */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Periodos a Cancelar
            </Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onChange={handleSeleccionarTodo}
                        checked={reLiquidacionesSeleccionadas.length === reLiquidaciones.length}
                      />
                    </TableCell>
                    <TableCell>Periodo</TableCell>
                    <TableCell align="right">Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reLiquidacionesSeleccionadas.map((liquidacion, index) => (
                    <TableRow key={index} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={() => handleSeleccionar(liquidacion)}
                          checked={reLiquidacionesSeleccionadas.includes(liquidacion)}
                        />
                      </TableCell>
                      <TableCell>{liquidacion?.periodo}</TableCell>
                      <TableCell align="right">
                        {formatNumberToARS(liquidacion?.monto_original)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

        {/* Selector de Motivo y Botones */}
        <Grid item xs={12} md={5}>
          <FormControl fullWidth>
            <InputLabel>Motivo</InputLabel>
            <Select
              value={motivo}
              label="Motivo"
              onChange={(e) => setMotivo(Number(e.target.value))}
            >
              <MenuItem value={0}>Seleccione un motivo</MenuItem>
              <MenuItem value={7}>Cancelación Operativa</MenuItem>
              <MenuItem value={8}>Decreto/Resolución</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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

export default CancelarCtaCte