import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
  TablePagination
} from '@mui/material';
import { Tab } from '@headlessui/react';

interface Props {
  setCancelar: React.Dispatch<React.SetStateAction<boolean>>;
}

const CrearDeclaracionJurada: React.FC<Props> = ({ setCancelar }) => {
  const { legajo } = useParams<{ legajo: string }>();
  const navigate = useNavigate();
  const [declaraciones, setDeclaraciones] = useState<DDJJ[]>([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroFechaVencimiento, setFiltroFechaVencimiento] = useState('');
  const [filtroNroTransaccion, setFiltroNroTransaccion] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchDeclaraciones = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Indycom/GetElementosDJSinLiquidar?legajo=${legajo}`);
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
        const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Indycom/GetElementosDJSinLiquidar?legajo=${legajo}`);
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

  const crearDDJJ = (nroTransaccion: number, legajo: number) => {
    setCancelar(true);
    navigate(`/${legajo}/declaraciones-juradas/${nroTransaccion}`);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Periodo</TableCell>
              <TableCell>Imp. Actual</TableCell>
              <TableCell>Vencimiento.</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {declaraciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((declaracion) => (
              <TableRow key={declaracion.ddjj.nro_transaccion}>
                <TableCell>{declaracion.periodo}</TableCell>
                <TableCell>{declaracion.monto_original.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</TableCell>
                <TableCell>{declaracion.vencimiento}</TableCell>
                <TableCell>{declaracion.categoria}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success" onClick={() => crearDDJJ(declaracion.ddjj.nro_transaccion, declaracion.ddjj.legajo)}>
                    Crear
                  </Button>
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

export default CrearDeclaracionJurada;