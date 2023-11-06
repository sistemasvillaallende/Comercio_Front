import React from 'react'
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

            </FormInline>
          </form>
        </div>

        <div className="conScroll justify-between col-span-10 intro-y lg:col-span-12">
          {cargando && <Cargando mensaje="cargando" />}
          {mostrarTabla && (
            <Table striped className='mb-4'>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                    Legajo
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-left">
                    Nombre
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-left">
                    Dirección
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                    Contacto
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border-b-0 text-center">

                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {listadoDeComercios.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className="border-b-0 whitespace-nowrap text-center">
                      {item.legajo}
                    </Table.Td>
                    <Table.Td className="border-b-0 whitespace-nowrap text-left">
                      {item.nombre}
                      {item.nom_fantasia !== "" && (`Nombre Fantasía: ${item.nom_fantasia}`)}
                    </Table.Td>
                    <Table.Td className="border-b-0 whitespace-nowrap text-left">
                      {item.nom_calle} Nro. {item.nro_dom},                      {item.nom_bario}
                    </Table.Td>
                    <Table.Td className="border-b-0 whitespace-nowrap text-left">
                      {item.celular && <>Cel. {item.celular}< br /></>}
                      {item.telefono && <>Tel. {item.telefono} < br /></>}
                      {item.email && `Email. ${item.email}`}
                    </Table.Td>
                    <Table.Td className="border-b-0 text-center">
                      <Button
                        variant="primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/${item.legajo}/ver`)}
                      >
                        <Lucide icon="Eye" className="w-3 h-3" />
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </div>
      </div>

    </>
  )
}

export default ComerciosPorCalle