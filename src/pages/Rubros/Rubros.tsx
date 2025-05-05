import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  TextField,
  Box,
  Button,
  Modal,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { Rubro, RubroComercio } from '../../interfaces/Comercio';
import { Label } from '@headlessui/react/dist/components/label/label';
import { set } from 'lodash';

const Rubros = () => {
  const [rubros, setRubros] = useState<RubroComercio[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchRubro, setSearchRubro] = useState('');
  const [rubrosBusqueda, setRubrosBusqueda] = useState<Rubro[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<Rubro | null>(null);
  const [selectedEditRubro, setSelectedEditRubro] = useState<RubroComercio | null>(null);
  const { legajo } = useParams<{ legajo: string }>();

  // Formulario
  const [nroSucursal, setNroSucursal] = useState<number>(0);
  const [codMinimo, setCodMinimo] = useState<number>(0);
  const [codConvenio, setCodConvenio] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(0);
  const [exento, setExento] = useState<boolean>(false);
  const [descuento, setDescuento] = useState<boolean>(false);
  const [valor, setValor] = useState<number>(0);
  const [concepto, setConcepto] = useState<string>('');

  useEffect(() => {
    traerRubros();
  }, [searchTerm, page, rowsPerPage]);

  const traerRubros = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Indycom/mostrarRubro?legajo=${legajo}`);
      setRubros(response.data);
    } catch (error) {
      console.error('Error al obtener los rubros:', error);
    }
  };

  const buscarRubros = async (busqueda: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Indycom/busquedaRubros?busqueda=${busqueda}`);
      setRubrosBusqueda(response.data);
    } catch (error) {
      console.error('Error al buscar los rubros:', error);
    }
  };

  const handleEdit = async (rubro: RubroComercio) => {
    setSelectedEditRubro(rubro);
    setNroSucursal(rubro.nro_sucursal);
    setCodMinimo(rubro.cod_minimo);
    setCodConvenio(rubro.cod_convenio);
    setCantidad(rubro.cantidad);
    setExento(rubro.exento);
    setDescuento(rubro.descuento);
    setValor(rubro.valor);
    setConcepto(rubro.concepto);
    setEditModalOpen(true);
  };

  const handleEditConfirm = async () => {
    if (selectedEditRubro) {
      setEditModalOpen(false); // Close the modal before showing Swal

      const { value: observaciones } = await Swal.fire({
        title: 'Editar Rubro',
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
        const updatedRubro = {
          rubro: {
            legajo: legajo,
            cod_rubro: selectedEditRubro.cod_rubro,
            nro_sucursal: nroSucursal,
            cod_minimo: codMinimo,
            cod_convenio: codConvenio,
            cantidad: cantidad,
            exento: exento,
            descuento: descuento,
            valor: valor
          },
          auditoria: {
            id_auditoria: 0,
            fecha: new Date().toISOString(),
            usuario: 'usuario',
            proceso: 'proceso',
            identificacion: 'identificacion',
            autorizaciones: 'autorizaciones',
            observaciones: observaciones,
            detalle: 'detalle',
            ip: 'ip'
          }
        };
        try {
          await axios.put(`${import.meta.env.VITE_URL_BASE}Indycom/updateRubro`, updatedRubro);
          traerRubros();
          setSelectedEditRubro(null);
        } catch (error) {
          console.error('Error al editar el rubro:', error);
        }
      } else {
        setEditModalOpen(true); // Reopen the modal if the user cancels Swal
      }
    }
  };

  const handleDelete = async (cod_rubro: number, legajo: number) => {
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
      const auditoria = {
        id_auditoria: 0,
        fecha: new Date().toISOString(),
        usuario: 'usuario',
        proceso: 'proceso',
        identificacion: 'identificacion',
        autorizaciones: 'autorizaciones',
        observaciones: observaciones,
        detalle: 'detalle',
        ip: 'ip'
      };

      try {
        await axios.delete(`${import.meta.env.VITE_URL_BASE}Indycom/deleteRubro?legajo=${legajo}&cod_rubro=${cod_rubro}`, {
          data: auditoria
        });
        traerRubros();
      } catch (error) {
        console.error('Error al eliminar el rubro:', error);
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

  const handleNuevoRubro = () => {
    traerRubros();
    setSearchRubro('');
    setSelectedRubro(null);
    setNroSucursal(0);
    setCodMinimo(0);
    setCodConvenio(0);
    setCantidad(0);
    setExento(false);
    setDescuento(false);
    setValor(0);
    setConcepto('');
    setModalOpen(true);
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setSelectedRubro(null);
    setNroSucursal(0);
    setCodMinimo(0);
    setCodConvenio(0);
    setCantidad(0);
    setExento(false);
    setDescuento(false);
    setValor(0);
    setConcepto('');
  }

  const handleCancelarEdit = () => {
    setEditModalOpen(false);
    setSelectedEditRubro(null);
    setNroSucursal(0);
    setCodMinimo(0);
    setCodConvenio(0);
    setCantidad(0);
    setExento(false);
    setDescuento(false);
    setValor(0);
    setConcepto('');
  }

  const handleSelectRubro = async () => {
    if (selectedRubro) {
      setModalOpen(false); // Close the modal before showing Swal

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
        const nuevoRubro = {
          rubro: {
            legajo: legajo,
            cod_rubro: selectedRubro.codigo,
            nro_sucursal: nroSucursal,
            cod_minimo: codMinimo,
            cod_convenio: codConvenio,
            cantidad: cantidad,
            exento: exento,
            descuento: descuento,
            valor: valor
          },
          auditoria: {
            id_auditoria: 0,
            fecha: new Date().toISOString(),
            usuario: 'usuario',
            proceso: 'proceso',
            identificacion: 'identificacion',
            autorizaciones: 'autorizaciones',
            observaciones: observaciones,
            detalle: 'detalle',
            ip: 'ip'
          }
        };

        try {
          await axios.post(`${import.meta.env.VITE_URL_BASE}Indycom/nuevoRubro`, nuevoRubro);
          traerRubros();
          setSelectedRubro(null);
          setNroSucursal(0);
          setCodMinimo(0);
          setCodConvenio(0);
          setCantidad(0);
          setExento(false);
          setDescuento(false);
          setValor(0);
          setConcepto('');
        } catch (error) {
          console.error('Error al agregar el nuevo rubro:', error);
        }
      } else {
        setModalOpen(true); // Reopen the modal if the user cancels Swal
      }
    }
  };

  return (
    <div className='paginas'>
      <h2>Rubros</h2>
      <div className='flex mb-2'>
        <Button variant="contained" color="primary" onClick={handleNuevoRubro}>
          Nuevo Rubro
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Concepto</TableCell>
              <TableCell>Código Rubro</TableCell>
              <TableCell>Nro Sucursal</TableCell>
              <TableCell>Cod Mínimo</TableCell>
              <TableCell>Cod Convenio</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Exento</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rubros.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((rubro) => (
              <TableRow key={rubro.cod_rubro}>
                <TableCell>{rubro.concepto}</TableCell>
                <TableCell>{rubro.cod_rubro}</TableCell>
                <TableCell>{rubro.nro_sucursal}</TableCell>
                <TableCell>{rubro.cod_minimo}</TableCell>
                <TableCell>{rubro.cod_convenio}</TableCell>
                <TableCell>{rubro.cantidad}</TableCell>
                <TableCell>{rubro.exento ? 'Sí' : 'No'}</TableCell>
                <TableCell>{rubro.descuento ? 'Sí' : 'No'}</TableCell>
                <TableCell>{rubro.valor}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(rubro)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => legajo && handleDelete(rubro.cod_rubro, parseInt(legajo))}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rubros.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            p: 4,
            backgroundColor: 'white',
            margin: 'auto',
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            width: '50%'
          }}
        >
          <h2>Agregar Nuevo Rubro</h2>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Buscar Rubro
          </InputLabel>
          <TextField
            value={searchRubro}
            onChange={(e) => {
              setSearchRubro(e.target.value);
              buscarRubros(e.target.value);
            }}
            fullWidth
          />
          <Select
            fullWidth
            value={selectedRubro ? selectedRubro.codigo : ''}
            onChange={(e) => {
              const rubro = rubrosBusqueda.find(r => r.codigo === e.target.value);
              setSelectedRubro(rubro || null);
            }}
          >
            {rubrosBusqueda.map((rubro) => (
              <MenuItem key={rubro.codigo} value={rubro.codigo}>
                {rubro.concepto}
              </MenuItem>
            ))}
          </Select>
          <div className="flex w-full space-x-2 mb-3 mt-3">
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Nro Sucursal
              </InputLabel>
              <TextField
                type='number'
                value={nroSucursal}
                onChange={(e) => setNroSucursal(parseInt(e.target.value))}
                fullWidth
              />
            </div>
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Cod Mínimo
              </InputLabel>
              <TextField
                type='number'
                value={codMinimo}
                onChange={(e) => setCodMinimo(parseInt(e.target.value))}
                fullWidth
              />
            </div>
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Cod Convenio
              </InputLabel>
              <TextField
                value={codConvenio}
                type='number'
                onChange={(e) => setCodConvenio(parseInt(e.target.value))}
                fullWidth
              />
            </div>
          </div>

          <div className="flex w-full space-x-2 mb-3">
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Cantidad
              </InputLabel>
              <TextField
                value={cantidad}
                type='number'
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                fullWidth
              />
            </div>
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Exento
              </InputLabel>
              <Select
                label="Exento"
                value={exento ? 'Sí' : 'No'}
                onChange={(e) => setExento(e.target.value === 'Sí')}
                fullWidth
              >
                <MenuItem value="Sí">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </div>
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Descuento
              </InputLabel>
              <Select
                label="Descuento"
                value={descuento ? 'Sí' : 'No'}
                onChange={(e) => setDescuento(e.target.value === 'Sí')}
                fullWidth
              >
                <MenuItem value="Sí">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </div>
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Valor
              </InputLabel>
              <TextField
                type='number'
                value={valor}
                onChange={(e) => setValor(parseFloat(e.target.value))}
                fullWidth
              />
            </div>
          </div>

          <div className="flex space-x-2 w-full justify-center">
            <Button variant="contained" color="warning" onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSelectRubro}>
              Agregar Rubro
            </Button>
          </div>

        </Box>
      </Modal>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            p: 4,
            backgroundColor: 'white',
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            width: '50%'
          }}
        >
          <h2>Editar Rubro</h2>
          <p>{concepto}</p>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Buscar Rubro
          </InputLabel>
          <TextField
            value={searchRubro}
            onChange={(e) => {
              setSearchRubro(e.target.value);
              buscarRubros(e.target.value);
            }}
            fullWidth
          />
          <Select
            fullWidth
            value={selectedEditRubro ? selectedEditRubro.cod_rubro : ''}
            onChange={(e) => {
              const rubro = rubrosBusqueda.find(r => r.codigo === e.target.value);
              if (rubro) {
                const rubroComercio: RubroComercio = {
                  ...rubro,
                  legajo: legajo ? parseInt(legajo) : 0,
                  cod_rubro: rubro.codigo,
                  nro_sucursal: nroSucursal,
                  cod_minimo: codMinimo,
                  cod_convenio: codConvenio,
                  cantidad: cantidad,
                  exento: exento,
                  descuento: descuento,
                  valor: valor,
                  concepto: concepto
                };
                setSelectedEditRubro(rubroComercio);
              } else {
                setSelectedEditRubro(null);
              }
            }}
          >
            {rubrosBusqueda.map((rubro) => (
              <MenuItem key={rubro.codigo} value={rubro.codigo}>
                {rubro.concepto}
              </MenuItem>
            ))}
          </Select>
          <div className="flex w-full space-x-2 mb-3 mt-3">
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Nro Sucursal
              </InputLabel>
              <TextField
                type='number'
                value={nroSucursal}
                onChange={(e) => setNroSucursal(parseInt(e.target.value))}
                fullWidth
              />
            </div>
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Cod Mínimo
              </InputLabel>
              <TextField
                type='number'
                value={codMinimo}
                onChange={(e) => setCodMinimo(parseInt(e.target.value))}
                fullWidth
              />
            </div>
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Cod Convenio
              </InputLabel>
              <TextField
                type='number'
                value={codConvenio}
                onChange={(e) => setCodConvenio(parseInt(e.target.value))}
                fullWidth
              />
            </div>
          </div>

          <div className="flex w-full space-x-2 mb-3 mt-3">
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Cantidad
              </InputLabel>
              <TextField
                type='number'
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                fullWidth
              />
            </div>
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Exento
              </InputLabel>
              <Select
                label="Exento"
                value={exento ? 'Sí' : 'No'}
                onChange={(e) => setExento(e.target.value === 'Sí')}
                fullWidth
              >
                <MenuItem value="Sí">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </div>
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Descuento
              </InputLabel>
              <Select
                label="Descuento"
                value={descuento ? 'Sí' : 'No'}
                onChange={(e) => setDescuento(e.target.value === 'Sí')}
                fullWidth
              >
                <MenuItem value="Sí">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </div>
            <div>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Valor
              </InputLabel>
              <TextField
                type='number'
                value={valor}
                onChange={(e) => setValor(parseFloat(e.target.value))}
                fullWidth
              />
            </div>
          </div>

          <div className="flex space-x-2 w-full justify-center">
            <Button variant="contained" color="warning" onClick={handleCancelarEdit}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleEditConfirm}>
              Editar Rubro
            </Button>
          </div>

        </Box>
      </Modal>
    </div >
  );
};

export default Rubros;