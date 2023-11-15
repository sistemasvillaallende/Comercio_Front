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
import Table from "../../base-components/Table";
import Cargando from '../Recursos/Cargando';
import { useParams, useNavigate } from "react-router-dom";
import { DownloadTableExcel, useDownloadExcel } from 'react-export-table-to-excel';


const ComerciosPorCalle = () => {

  const navigate = useNavigate();


  const [calleDesde, setCalleDesde] = React.useState('');
  const [calleHasta, setCalleHasta] = React.useState('');
  const [mostrarTabla, setMostrarTabla] = React.useState(false);
  const [cargando, setCargando] = React.useState(false);
  const [listadoDeComercios, setListadoDeComercios] = React.useState<InterfaceComerciosPorCalle[]>([]);

  const handleMostrarComercio = async (e: any) => {
    e.preventDefault();

    try {
      setCargando(true);

      const URL = `${import.meta.env.VITE_URL_API_IYC}Indycom/ConsultaIyc_x_calles?calledesde=${calleDesde}&callehasta=${calleHasta}`;
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

  return (
    <>
      <div className=" grid grid-cols-12 gap-6 mt-2 ml-3 mr-4 mb-4">
        <div className="col-span-12 intro-y lg:col-span-12">

          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Comercios por Calle</h2>
          </div>
          <form onSubmit={handleMostrarComercio}>
            <FormInline>

              <FormLabel
                htmlFor="horizontal-form-1"
                className="sm:w-20"
              >
                Desde
              </FormLabel>
              <FormInput
                id="horizontal-form-1"
                type="text"
                placeholder="Nombre Calle"
                onChange={(e) => setCalleDesde(e.target.value)}
              />

              <FormLabel
                htmlFor="horizontal-form-1"
                className="sm:w-20"
              >
                Hasta
              </FormLabel>
              <FormInput
                id="horizontal-form-1"
                type="text"
                placeholder="Nombre Calle"
                onChange={(e) => setCalleHasta(e.target.value)}
              />

              <Button
                variant="primary"
                className='ml-3'
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
            <table ref={tableRef}>
              <thead>
                <tr>
                  <th>Legajo</th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Contacto</th>
                </tr>
              </thead>
              <tbody>
                {listadoDeComercios.map((item, index) => (
                  <tr key={index}>
                    <td>{item.legajo}</td>
                    <td>{item.nombre}</td>
                    <td>{item.nom_calle} Nro. {item.nro_dom}, {item.nom_bario}</td>
                    <td>
                      {item.celular && <>Cel. {item.celular}< br /></>}
                      {item.telefono && <>Tel. {item.telefono} < br /></>}
                      {item.email && `Email. ${item.email}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </>
  )
}

export default ComerciosPorCalle