import { useEffect, useState } from "react";
import { BaseImponible } from "../../interfaces/IndustriaComercio";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FormSelect,
  FormInput,
  FormLabel,
  FormSwitch,
  InputGroup,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserProvider";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button as MuiButton,
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Container,
  Grid,
  Card,
  CardContent,
  TablePagination
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import * as XLSX from 'xlsx';
import { currencyFormat } from "../../utils/helper";
import CircularProgress from '@mui/material/CircularProgress';


const BasesImponibles = () => {

  const { elementoIndCom, tipoLiquidacion, tipoCondicionIVA, situacionJudicial, tipoDeEntidad } = useIndustriaComercioContext();


  const [periodoDesde, setPeriodoDesde] = useState("");
  const [periodoHasta, setPeriodoHasta] = useState("");
  const [listaBasesImponibles, setListaBasesImponibles] = useState<BaseImponible[]>([]);
  const { user } = useUserContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState<keyof BaseImponible>('periodo');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {

  }, []);

  const formatPeriod = (value: string) => {
    // Eliminar cualquier caracter que no sea número
    const numbers = value.replace(/\D/g, '');

    // Limitar a 6 dígitos (AAAAMM)
    const truncated = numbers.slice(0, 6);

    // Insertar la barra después de los primeros 4 dígitos
    if (truncated.length > 4) {
      return truncated.slice(0, 4) + '/' + truncated.slice(4);
    }
    return truncated;
  };

  const handleBuscar = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const URL = `${import.meta.env.VITE_URL_BASE}Indycom/GetBasesImponibles?legajo=11079&periodo_desde=${periodoDesde}&periodo_hasta=${periodoHasta}`;
      const response = await axios.get(URL);
      setListaBasesImponibles(response.data);
      setPage(0); // Reset a la primera página cuando se hace una nueva búsqueda
    } catch (error: any) {
      Swal.fire({
        title: `ERROR: ${error.response.statusText}`,
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const dataToExport = listaBasesImponibles.map(item => ({
      'Período': item.periodo,
      'Concepto': item.concepto,
      'Nº Transacción': item.nro_transaccion,
      'Debe': item.debe,
      'Monto Original': item.monto_original,
      'Importe': item.importe
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bases Imponibles');

    XLSX.writeFile(wb, `Bases_Imponibles_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property: keyof BaseImponible) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data: BaseImponible[]) => {
    return [...data].sort((a, b) => {
      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ py: 3 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" component="h2">
                    Bases Imponibles
                  </Typography>
                  {listaBasesImponibles.length > 0 && (
                    <MuiButton
                      variant="contained"
                      color="primary"
                      startIcon={<FileDownloadIcon />}
                      onClick={handleExportToExcel}
                    >
                      Exportar a Excel
                    </MuiButton>
                  )}
                </Box>

                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Período Desde"
                      variant="outlined"
                      size="small"
                      value={periodoDesde}
                      onChange={(e) => setPeriodoDesde(formatPeriod(e.target.value))}
                      inputProps={{ maxLength: 7 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Período Hasta"
                      variant="outlined"
                      size="small"
                      value={periodoHasta}
                      onChange={(e) => setPeriodoHasta(formatPeriod(e.target.value))}
                      inputProps={{ maxLength: 7 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <MuiButton
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon />}
                        onClick={handleBuscar}
                      >
                        Buscar
                      </MuiButton>
                      <MuiButton
                        variant="outlined"
                        color="secondary"
                      >
                        Cancelar
                      </MuiButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {listaBasesImponibles.length > 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 0, position: 'relative' }}>
                  {loading && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      zIndex: 1,
                    }}>
                      <CircularProgress />
                    </Box>
                  )}
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'common.white',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSort('periodo')}
                          >
                            Período
                            {orderBy === 'periodo' && (
                              <Box component="span" sx={{ ml: 1 }}>
                                {order === 'desc' ? '↓' : '↑'}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'common.white',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSort('concepto')}
                          >
                            Concepto
                            {orderBy === 'concepto' && (
                              <Box component="span" sx={{ ml: 1 }}>
                                {order === 'desc' ? '↓' : '↑'}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'common.white',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSort('nro_transaccion')}
                          >
                            Nº Transacción
                            {orderBy === 'nro_transaccion' && (
                              <Box component="span" sx={{ ml: 1 }}>
                                {order === 'desc' ? '↓' : '↑'}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'common.white',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSort('debe')}
                          >
                            Debe
                            {orderBy === 'debe' && (
                              <Box component="span" sx={{ ml: 1 }}>
                                {order === 'desc' ? '↓' : '↑'}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'common.white',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSort('monto_original')}
                          >
                            Monto Original
                            {orderBy === 'monto_original' && (
                              <Box component="span" sx={{ ml: 1 }}>
                                {order === 'desc' ? '↓' : '↑'}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'common.white',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSort('importe')}
                          >
                            Importe
                            {orderBy === 'importe' && (
                              <Box component="span" sx={{ ml: 1 }}>
                                {order === 'desc' ? '↓' : '↑'}
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortData(listaBasesImponibles)
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((item, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                                '&:hover': {
                                  backgroundColor: 'action.selected',
                                  cursor: 'pointer'
                                }
                              }}
                            >
                              <TableCell align="center">{item.periodo}</TableCell>
                              <TableCell align="left">{item.concepto}</TableCell>
                              <TableCell align="center">{item.nro_transaccion}</TableCell>
                              <TableCell align="right">
                                {new Intl.NumberFormat('es-AR', {
                                  style: 'currency',
                                  currency: 'ARS'
                                }).format(item.debe)}
                              </TableCell>
                              <TableCell align="right">
                                {new Intl.NumberFormat('es-AR', {
                                  style: 'currency',
                                  currency: 'ARS'
                                }).format(item.monto_original)}
                              </TableCell>
                              <TableCell align="right">
                                {new Intl.NumberFormat('es-AR', {
                                  style: 'currency',
                                  currency: 'ARS'
                                }).format(item.importe)}
                              </TableCell>
                            </TableRow>
                          ))}
                        <TableRow
                          sx={{
                            backgroundColor: 'grey.100',
                            '& .MuiTableCell-root': {
                              fontWeight: 'bold',
                              borderTop: '2px solid rgba(224, 224, 224, 1)'
                            }
                          }}
                        >
                          <TableCell colSpan={3} align="right">Totales:</TableCell>
                          <TableCell align="right">
                            {new Intl.NumberFormat('es-AR', {
                              style: 'currency',
                              currency: 'ARS'
                            }).format(listaBasesImponibles.reduce((sum, item) => sum + item.debe, 0))}
                          </TableCell>
                          <TableCell align="right">
                            {new Intl.NumberFormat('es-AR', {
                              style: 'currency',
                              currency: 'ARS'
                            }).format(listaBasesImponibles.reduce((sum, item) => sum + item.monto_original, 0))}
                          </TableCell>
                          <TableCell align="right">
                            {new Intl.NumberFormat('es-AR', {
                              style: 'currency',
                              currency: 'ARS'
                            }).format(listaBasesImponibles.reduce((sum, item) => sum + item.importe, 0))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={listaBasesImponibles.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  )
}

export default BasesImponibles