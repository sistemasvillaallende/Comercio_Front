import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "../../base-components/Table";
import classNames from "classnames";
import { FormSelect, FormInput, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Swal from "sweetalert2";
import { Vehiculo } from "../../interfaces/Vehiculo";
import Cargando from "../Recursos/Cargando";
import { ElementoIndustriaComercio } from "../../interfaces/IndustriaComercio";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";


const index = () => {
  const [elementoIyC, setElementoIyC] = useState<ElementoIndustriaComercio>();
  const [cantPaginas, setCantPaginas] = useState<number>(0);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const navigate = useNavigate();
  const [strParametro, setStrParametro] = useState<string>("");
  const [buscarPor, setBuscarPor] = useState<string>("0");
  const [verTabla, setVerTabla] = useState<boolean>(false);
  const { elementoIndCom, setElementoIndCom, traerElemento } = useIndustriaComercioContext();

  const handlePageChange = (newPage: number) => {
    const paginaNum = newPage;
    setPaginaActual(paginaNum);

    if (buscarPor && strParametro) {
      const fetchData = async () => {
        const registrosPorPagina = 10;
        const URL = `${import.meta.env.VITE_URL_API_IYC}GetIndycomPaginado?buscarPor=${buscarPor}&strParametro=${strParametro}&pagina=${paginaNum}&registros_por_pagina=${registrosPorPagina}`;
        const response = await axios.get(URL);
        if (response.data === "") {
          Swal.fire({
            title: 'Error',
            text: 'Al parecer ya no hay páginas.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#27a3cf',
          });

          return;
        }

        setCantPaginas(response.data.totalPaginas);
        setElementoIyC(response.data.resultado);
        setCantPaginas(response.data.totalPaginas);
        setVerTabla(true);
      };

      fetchData();
    }
  };


  const renderPagination = () => {
    const paginationItems: JSX.Element[] = [];
    const pageRange = 5;

    let startPage = Math.max(1, paginaActual - pageRange);
    let endPage = Math.min(cantPaginas, paginaActual + pageRange);

    if (paginaActual > 1) {
      paginationItems.push(
        <Button
          key="prev"
          variant="primary"
          className="mr-2"
          onClick={() => handlePageChange(paginaActual - 1)}
        >
          &lt;
        </Button>
      );
    }

    if (startPage > 1) {
      paginationItems.push(
        <Button
          key={1}
          variant="secondary"
          className="mr-2"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>
      );

      if (startPage > 2) {
        paginationItems.push(
          <span key="ellipsis-prev" className="mr-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <Button
          key={i}
          variant={i === paginaActual ? "primary" : "secondary"}
          className="mr-2"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    if (endPage < cantPaginas) {
      if (endPage < cantPaginas - 1) {
        paginationItems.push(
          <span key="ellipsis-next" className="mr-2">
            ...
          </span>
        );
      }

      paginationItems.push(
        <Button
          key={cantPaginas}
          variant="secondary"
          className="mr-2"
          onClick={() => handlePageChange(cantPaginas)}
        >
          {cantPaginas}
        </Button>
      );
    }

    if (paginaActual < cantPaginas) {
      paginationItems.push(
        <Button
          key="next"
          variant="primary"
          className="mr-2"
          onClick={() => handlePageChange(paginaActual + 1)}
        >
          &gt;
        </Button>
      );
    }

    return paginationItems;
  };

  const handleVerElemento = (dato: ElementoIndustriaComercio) => {
    if (!dato.legajo) {
      Swal.fire({
        title: "Error",
        text: "El Elemento no contiene legajo.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    traerElemento(dato.legajo.toString());
    navigate(`/iyc/${dato.legajo}/ver`);
  };

  const handleNueoElemento = () => {
    navigate(`/nuevoElemento`);
  };

  const handleBuscar = (e: any) => {
    e.preventDefault();

    if (!buscarPor || !strParametro) {
      Swal.fire({
        title: "Faltan parámetros o criterios de búsqueda",
        text: "Por favor, ingrese criterios de búsqueda válidos.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
      return;
    }
    const fetchData = async () => {
      const registrosPorPagina = 10;
      const paginaNum = 1;
      setPaginaActual(paginaNum);
      const URL = `${import.meta.env.VITE_URL_API_IYC}GetIndycomPaginado?buscarPor=${buscarPor}&strParametro=${strParametro}&pagina=${paginaNum}&registros_por_pagina=${registrosPorPagina}`;
      const response = await axios.get(URL);
      setCantPaginas(response.data.totalPaginas);
      setElementoIyC(response.data.resultado);
      setCantPaginas(response.data.totalPaginas);
      setVerTabla(true);
      if (response.status === 204) {
        Swal.fire({
          title: "Sin resultados",
          text: "ERROR 204: La consulta no tuvo resultado.",
          icon: "error",
          confirmButtonColor: "#27a3cf",
        });
        setVerTabla(false);
        return;
      }
    };
    fetchData();
  };


  const handleLimpiar = () => {
    window.location.href = "/";
  }

  const transformarDinero = (dinero: number) => {
    return dinero.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    });
  };

  return (
    <>
      <div className="conScrollInicio conScroll grid grid-cols-12 gap-6">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="grid grid-cols-12 gap-6 mt-1">
            <div className="col-span-12 intro-y lg:col-span-12">
              <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
                <div className="flex justify-start">
                  <form id="formBuscar" className="ml-1 flex justify-start" onSubmit={handleBuscar}>
                    <div className="relative hidden sm:block">
                      <FormLabel htmlFor="vertical-form-1">Buscar por</FormLabel>
                      <FormSelect
                        className="ml-3 mt-2 sm:mr-2 w-100"
                        name="buscarPor"
                        id="buscarPor"
                        value={buscarPor}
                        onChange={(e) => setBuscarPor(e.target.value)}
                      >
                        <option value="0">- Parametro -</option>
                        <option value="legajo">Legajo</option>
                        <option value="cuit">CUIT</option>
                        <option value="nom_fantasia">Nom Fantasía</option>
                        <option value="titular">Titular</option>
                      </FormSelect>
                      <FormInput
                        type="text"
                        className="mr-5 border-transparent w-56 shadow-none rounded-5 pr-8"
                        placeholder="Buscar..."
                        value={strParametro}
                        onChange={(e) => setStrParametro(e.target.value)}
                        name="parametro"
                        id="parametro"
                      />
                    </div>
                    <Button variant="primary" className="mt-2 mb-3 mr-3">
                      Buscar
                    </Button>
                  </form>
                  <Button variant="secondary" className="mt-2 mb-3 mr-3" onClick={handleLimpiar}>
                    Limpiar
                  </Button>
                </div>
                <Button
                  variant="primary"
                  className="ml-4 mt-2 mb-3 mr-3"
                  onClick={handleNueoElemento}
                >
                  <Lucide icon="PlusSquare" className="w-4 h-4 mr-2" />
                  Elemento
                </Button>
              </div>
            </div>
          </div>
          {verTabla &&
            <div className="overflow-x-auto">
              {!elementoIyC && (
                <Cargando mensaje="Buscando vehículos" />
              )}
              <Table className="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">Legajo</Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">Contribuyente</Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">Desc. Comercial</Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">Nombre de Fantasía</Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">CUIT</Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">Dirección</Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap text-center">Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Array.isArray(elementoIyC) && elementoIyC.map((data: any, index: number) => (
                    <Table.Tr key={index}>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {data.legajo}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {data.nro_contrib}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {data.des_com}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {data.nom_fantasia}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {data.nro_cuit}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <p>{data.nom_calle}, {data.nom_barrio}</p>
                        <p>
                          <a href={`https://maps.google.com/?q=${data.nom_calle_dom_esp} ${data.nro_dom_esp}, ${data.ciudad_dom_esp.trim()}, ${data.provincia_dom_esp.trim()}`}
                            target="_new"
                          >
                            {data.nom_calle_dom_esp} {data.nro_dom_esp && "Nro."} {data.nro_dom_esp} {data.nom_barrio_dom_esp === "" && ","} {data.nom_barrio_dom_esp}
                          </a>
                        </p>
                      </Table.Td>
                      <Table.Td className="text-danger text-right first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <Button
                          variant="primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleVerElemento(data)}
                        >
                          <Lucide icon="Eye" className="w-5 h-5" />
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <div className="w-full text-center">
                {Array.isArray(elementoIyC) && elementoIyC.length >= 10 && renderPagination()}
              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default index