import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DDJJ } from '../../interfaces/Comercio';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
  IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import BackspaceIcon from '@mui/icons-material/Backspace';
import AddIcon from '@mui/icons-material/Add';

const VerDeclaracionesJuradas = () => {
  const { legajo } = useParams<{ legajo: string }>();
  const [declaraciones, setDeclaraciones] = useState<DDJJ[]>([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroFechaVencimiento, setFiltroFechaVencimiento] = useState('');
  const [filtroNroTransaccion, setFiltroNroTransaccion] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeclaraciones = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Indycom/GetElementosDJLiquidados?legajo=${legajo}`);
        setDeclaraciones(response.data);
      } catch (error) {
        console.error('Error al cargar las declaraciones juradas:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cargar las declaraciones juradas.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
      }
    };

    fetchDeclaraciones();
  }, [legajo]);

  const handleBuscar = () => {
    const declaracionesFiltradas = declaraciones.filter((declaracion) => {
      return (
        (filtroPeriodo === '' || declaracion.periodo.includes(filtroPeriodo)) &&
        (filtroFechaVencimiento === '' || declaracion.vencimiento.includes(filtroFechaVencimiento)) &&
        (filtroNroTransaccion === '' || declaracion.ddjj.nro_transaccion.toString().includes(filtroNroTransaccion))
      );
    });
    setDeclaraciones(declaracionesFiltradas);
  };

  const handleClear = () => {
    setFiltroPeriodo('');
    setFiltroFechaVencimiento('');
    setFiltroNroTransaccion('');
    const fetchDeclaraciones = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Indycom/GetElementosDJLiquidados?legajo=${legajo}`);
        setDeclaraciones(response.data);
      } catch (error) {
        console.error('Error al cargar las declaraciones juradas:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cargar las declaraciones juradas.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
      }
    };

    fetchDeclaraciones();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEliminar = async (nro_transaccion: number, periodo: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const { value: observaciones } = await Swal.fire({
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

      if (observaciones) {
        const body = {
          "id_auditoria": 0,
          "fecha": "string",
          "usuario": "string",
          "proceso": "string",
          "identificacion": "string",
          "autorizaciones": "string",
          "observaciones": observaciones,
          "detalle": "string",
          "ip": "string"
        };

        try {
          await axios.post(`${import.meta.env.VITE_URL_BASE}Indycom/EliminaDJIyC?legajo=${legajo}&nro_transaccion=${nro_transaccion}&periodo=${encodeURIComponent(periodo)}`, body);
          Swal.fire({
            title: 'Eliminado',
            text: 'La declaración jurada ha sido eliminada.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#27a3cf',
          });
          // Actualizar la lista de declaraciones después de eliminar
          setDeclaraciones(declaraciones.filter(declaracion => declaracion.ddjj.nro_transaccion !== nro_transaccion));
        } catch (error) {
          console.error('Error al eliminar la declaración jurada:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al eliminar la declaración jurada.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#27a3cf',
          });
        }
      }
    }
  };

  const handleImprimir = (nro_transaccion: number, legajo: number) => {
    navigate(`/${legajo}/imprimir-juradas/${nro_transaccion}`);
  }

  return (
    <>
      <Box component="form" sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Periodo"
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value)}
          placeholder="Buscar por periodo"
          fullWidth
          margin="normal"
          size='small'
        />
        <TextField
          label="Fecha de Vencimiento"
          value={filtroFechaVencimiento}
          onChange={(e) => setFiltroFechaVencimiento(e.target.value)}
          placeholder="Buscar por fecha de vencimiento"
          fullWidth
          margin="normal"
          size='small'
        />
        <TextField
          label="Nro de Transacción"
          value={filtroNroTransaccion}
          onChange={(e) => setFiltroNroTransaccion(e.target.value)}
          placeholder="Buscar por Nro de Transacción"
          fullWidth
          margin="normal"
          size='small'
        />
        <IconButton color="primary" onClick={handleBuscar}>
          <SearchIcon />
        </IconButton>
        <IconButton color="error" onClick={handleClear}>
          <BackspaceIcon />
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Periodo</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Vto.</TableCell>
              <TableCell>Nro Transacción</TableCell>
              <TableCell>Completa</TableCell>
              <TableCell>Presentación</TableCell>
              <TableCell>Pres. Web</TableCell>
              <TableCell>Código Zona</TableCell>
              <TableCell>Código Tipo Per</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {declaraciones
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((declaracion, index) => (
                <TableRow key={declaracion.ddjj.nro_transaccion}>
                  <TableCell>{declaracion.periodo}</TableCell>
                  <TableCell>
                    {declaracion.monto_original.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS'
                    })}
                  </TableCell>
                  <TableCell>{declaracion.vencimiento}</TableCell>
                  <TableCell>{declaracion.ddjj.nro_transaccion}</TableCell>
                  <TableCell>{declaracion.ddjj.completa ? 'Sí' : 'No'}</TableCell>
                  <TableCell>
                    {new Date(declaracion.ddjj.fecha_presentacion_ddjj)
                      .toLocaleDateString('es-AR')}
                  </TableCell>
                  <TableCell>{declaracion.ddjj.presentacion_web}</TableCell>
                  <TableCell>{declaracion.ddjj.cod_zona}</TableCell>
                  <TableCell>{declaracion.ddjj.cod_tipo_per}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>

                      <IconButton
                        color="error"
                        onClick={() => handleEliminar(
                          declaracion.ddjj.nro_transaccion,
                          declaracion.periodo
                        )}
                      >
                        <DeleteIcon />
                      </IconButton>

                      <IconButton
                        color="info"
                        onClick={() => handleImprimir(
                          declaracion.ddjj.nro_transaccion,
                          declaracion.ddjj.legajo
                        )}
                      >
                        <PrintIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={declaraciones.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

export default VerDeclaracionesJuradas;