import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import NuevoConceptoModal from './NuevoConceptoModal';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

interface Concepto {
  cod_concepto_iyc: number;
  des_concepto_iyc: string;
  porcentaje: number;
  monto: number;
  vencimiento: string;
  nro_decreto: number;
}

const Concepto = () => {
  const { legajo } = useParams();
  const [conceptos, setConceptos] = useState<Concepto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [conceptoEditar, setConceptoEditar] = useState<Concepto | undefined>();
  const [modo, setModo] = useState<'crear' | 'editar'>('crear');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [conceptoAEliminar, setConceptoAEliminar] = useState<Concepto | null>(null);

  useEffect(() => {

    fetchConceptos();
  }, [legajo]);

  const fetchConceptos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Conceptos_iyc/getConceptos_x_iyc?legajo=${legajo}`
      );
      setConceptos(response.data);
    } catch (error) {
      console.error('Error al cargar conceptos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  const formatearFecha = (fecha: string) => {
    return dayjs(fecha).format('DD/MM/YYYY');
  };

  const handleOpenModal = (concepto?: Concepto) => {
    if (concepto) {
      setConceptoEditar(concepto);
      setModo('editar');
    } else {
      setConceptoEditar(undefined);
      setModo('crear');
    }
    setOpenModal(true);
  };

  const handleDeleteClick = (concepto: Concepto) => {
    setConceptoAEliminar(concepto);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!conceptoAEliminar) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL_BASE}Conceptos_iyc/DeleteConcepto?legajo=${legajo}&cod_concepto_iyc=${conceptoAEliminar.cod_concepto_iyc}&usuario=usuario`
      );

      if (response.status === 200) {
        setOpenDeleteDialog(false);

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El concepto se ha eliminado correctamente',
          confirmButtonText: 'Aceptar'
        });

        setConceptoAEliminar(null);
        await fetchConceptos();
      } else {
        throw new Error('Error en la respuesta del servidor');
      }

    } catch (error) {
      console.error('Error al eliminar concepto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el concepto. Por favor, intente nuevamente',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className="paginas">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Conceptos del Legajo {legajo}</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Concepto
        </Button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="right">Porcentaje</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell align="center">Vencimiento</TableCell>
                  <TableCell align="center">Nro. Decreto</TableCell>
                  <TableCell align="center">Editar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conceptos
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((concepto, index) => (
                    <TableRow key={index}>
                      <TableCell>{concepto.cod_concepto_iyc}</TableCell>
                      <TableCell>{concepto.des_concepto_iyc.trim()}</TableCell>
                      <TableCell align="right">{concepto.porcentaje}%</TableCell>
                      <TableCell align="right">{formatearMonto(concepto.monto)}</TableCell>
                      <TableCell align="center">{formatearFecha(concepto.vencimiento)}</TableCell>
                      <TableCell align="center">{concepto.nro_decreto}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenModal(concepto)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(concepto)}
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
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={conceptos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
          />
        </Paper>
      )}

      <NuevoConceptoModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setConceptoEditar(undefined);
        }}
        legajo={legajo || ''}
        onConceptoCreado={() => {
          fetchConceptos();
        }}
        conceptoEditar={conceptoEditar}
        modo={modo}
      />

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea eliminar este concepto?
          {conceptoAEliminar && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Código:</strong> {conceptoAEliminar.cod_concepto_iyc}<br />
              <strong>Descripción:</strong> {conceptoAEliminar.des_concepto_iyc.trim()}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Concepto;