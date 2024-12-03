import React, { useRef } from 'react'
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormInline,
  FormSelect,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { InterfaceComerciosPorCalle } from "../../interfaces/IndustriaComercio";
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper
} from '@mui/material';
import Cargando from '../Recursos/Cargando';
import { useParams, useNavigate } from "react-router-dom";
import { DownloadTableExcel, useDownloadExcel } from 'react-export-table-to-excel';
import { Autocomplete, TextField, debounce } from '@mui/material';
import { Link } from 'react-router-dom';

interface ICalle {
  value: string;
  text: string;
  campo_enlace: string;
}

const ComerciosPorCalle = () => {

  const navigate = useNavigate();


  const [calleDesde, setCalleDesde] = React.useState<ICalle | null>(null);
  const [calleHasta, setCalleHasta] = React.useState<ICalle | null>(null);
  const [mostrarTabla, setMostrarTabla] = React.useState(false);
  const [cargando, setCargando] = React.useState(false);
  const [listadoDeComercios, setListadoDeComercios] = React.useState<InterfaceComerciosPorCalle[]>([]);
  const [opcionesCalle, setOpcionesCalle] = React.useState<ICalle[]>([]);
  const [loadingCalles, setLoadingCalles] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleMostrarComercio = async (e: any) => {
    e.preventDefault();
    if (!calleDesde || !calleHasta) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor seleccione las calles desde y hasta',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      return;
    }

    try {
      setCargando(true);

      const URL = `${import.meta.env.VITE_URL_BASE}Indycom/ConsultaIyc_x_calles?calledesde=${calleDesde.text}&callehasta=${calleHasta.text}`;
      console.log(URL)

      const response = await axios.get(URL);
      setListadoDeComercios(response.data);
      setMostrarTabla(true);
      setCargando(false);
      if (response.data === "") {
        Swal.fire({
          title: 'Error',
          text: 'Al parecer no hay datos para mostrar, por favor intente con otros parámetros.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
      }
      setMostrarTabla(true);
      setCargando(false);

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Al parecer hay un error al cargar los datos, por favor intente nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      setCargando(false);
    }

  };

  const tableRef = useRef(null)

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'ComerciosPorCalle',
    sheet: 'Comercios por Calle',
  })

  const buscarCalles = async (busqueda: string) => {
    if (!busqueda || busqueda.length < 2) {
      setOpcionesCalle([]);
      return;
    }

    setLoadingCalles(true);
    try {
      const URL = `${import.meta.env.VITE_URL_BASE}Indycom/GetCalle?nomcalle=${busqueda}`;
      const response = await axios.get(URL);
      setOpcionesCalle(response.data);
    } catch (error) {
      console.error('Error al buscar calles:', error);
      setOpcionesCalle([]);
    } finally {
      setLoadingCalles(false);
    }
  };

  const buscarCallesDebounced = React.useMemo(
    () => debounce(buscarCalles, 300),
    []
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className='paginas'>
      <div className=" grid grid-cols-12 gap-6 mt-2 ml-3 mr-4 mb-4">
        <div className="col-span-12 intro-y lg:col-span-12">

          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Comercios por Calle</h2>
          </div>
          <form onSubmit={handleMostrarComercio}>
            <FormInline>

              <FormLabel
                htmlFor="calle-desde"
                className="sm:w-20"
              >
                Desde
              </FormLabel>
              <Autocomplete
                id="calle-desde"
                options={opcionesCalle}
                getOptionLabel={(option) => option.text}
                value={calleDesde}
                onChange={(_, newValue) => setCalleDesde(newValue)}
                onInputChange={(_, newInputValue) => {
                  buscarCallesDebounced(newInputValue);
                }}
                loading={loadingCalles}
                loadingText="Buscando..."
                noOptionsText="No hay resultados"
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Buscar calle..."
                    size="small"
                    fullWidth
                  />
                )}
              />

              <FormLabel
                htmlFor="calle-hasta"
                className="sm:w-20"
              >
                Hasta
              </FormLabel>
              <Autocomplete
                id="calle-hasta"
                options={opcionesCalle}
                getOptionLabel={(option) => option.text}
                value={calleHasta}
                onChange={(_, newValue) => setCalleHasta(newValue)}
                onInputChange={(_, newInputValue) => {
                  buscarCallesDebounced(newInputValue);
                }}
                loading={loadingCalles}
                loadingText="Buscando..."
                noOptionsText="No hay resultados"
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Buscar calle..."
                    size="small"
                    fullWidth
                  />
                )}
              />

              <Button
                variant="primary"
                className='ml-3'
                type="submit"
              >
                <Lucide icon="Filter" className="w-4 h-4 mr-1" />
                Filtrar
              </Button>

              <Button
                variant="soft-success"
                className='ml-3'
                onClick={onDownload}
              >
                <Lucide icon="Filter" className="w-4 h-4 mr-1" />
                Excel
              </Button>

            </FormInline>
          </form>
        </div>

        <div className="conScroll justify-between col-span-10 intro-y lg:col-span-12 comCalle">
          {cargando && <Cargando mensaje="cargando" />}
          {mostrarTabla && (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <MUITable stickyHeader ref={tableRef}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Legajo</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Dirección</TableCell>
                      <TableCell>Contacto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listadoDeComercios
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Link to={`/${item.legajo}/ver`}>{item.legajo}</Link>
                          </TableCell>
                          <TableCell>
                            <Link to={`/${item.legajo}/ver`}>{item.nombre}</Link>
                          </TableCell>
                          <TableCell>
                            <Link to={`/${item.legajo}/ver`}>{item.nom_calle} Nro. {item.nro_dom}, {item.nom_bario}</Link>
                          </TableCell>
                          <TableCell>
                            <Link to={`/${item.legajo}/ver`}>
                              {item.celular && <>Cel. {item.celular}<br /></>}
                              {item.telefono && <>Tel. {item.telefono}<br /></>}
                              {item.email && `Email. ${item.email}`}
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </MUITable>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={listadoDeComercios.length}
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
        </div>
      </div>

    </div>
  )
}

export default ComerciosPorCalle