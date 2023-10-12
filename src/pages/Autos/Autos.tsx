import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "../../base-components/Table";
import classNames from "classnames";
import { FormSelect, FormInput, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { useAutoContext } from "../../context/AutoProvider";
import Swal from "sweetalert2";
import { Vehiculo } from "../../interfaces/Vehiculo";
import Cargando from "../Recursos/Cargando";
import { getSituacion, getUltimoPeriodo } from "../../utils/AutosUtils";

const Autos = () => {
  const [autos, setAutos] = useState<Vehiculo[]>([]);
  const [cantPaginas, setCantPaginas] = useState<number>(0);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const { pagina } = useParams();
  const navigate = useNavigate();
  const [strParametro, setStrParametro] = useState<string>("");
  const [buscarPor, setBuscarPor] = useState<string>("0");
  const [activos, setActivos] = useState<string>("1");
  const [verTabla, setVerTabla] = useState<boolean>(false);
  const { traerAuto } = useAutoContext();

  const handlePageChange = (newPage: number) => {
    const paginaNum = newPage;
    setPaginaActual(paginaNum);

    if (buscarPor && strParametro) {
      const fetchData = async () => {
        const registrosPorPagina = 10;
        const URL = `${import.meta.env.VITE_URL_AUTO}GetVehiculosPaginado?buscarPor=${buscarPor}&strParametro=${strParametro}&activo=${activos}&pagina=${paginaNum}&registros_por_pagina=${registrosPorPagina}`;
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
        setAutos(response.data.resultado);
        setCantPaginas(response.data.totalPaginas);
        setVerTabla(true);
        console.log('URL PAGINA', URL);
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

  const modificarAuto = (vehiculo: Vehiculo) => {
    const dominioSinEspacios = vehiculo.dominio.trim();
    if (dominioSinEspacios === "") {
      Swal.fire({
        title: "Error",
        text: "El vehículo NO contiene dominio.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
      return;
    }
    traerAuto(dominioSinEspacios);
    navigate(`/auto/${dominioSinEspacios}/editar`);
  };

  const handleVerAuto = (vehiculo: Vehiculo) => {
    const dominioSinEspacios = vehiculo.dominio.trim();
    if (!dominioSinEspacios) {
      Swal.fire({
        title: "Error",
        text: "El vehículo no contiene dominio.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    traerAuto(dominioSinEspacios);
    navigate(`/auto/${dominioSinEspacios}/ver`);
  };

  const handleNuevoVehiculo = () => {
    navigate(`/nuevoVehiculo`);
  };

  const handleBuscar = (e: any) => {
    e.preventDefault();

    if (!buscarPor || !strParametro || buscarPor === "0") {
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
      const URL = `${import.meta.env.VITE_URL_AUTO}GetVehiculosPaginado?buscarPor=${buscarPor}&strParametro=${strParametro}&activo=${activos}&pagina=${paginaNum}&registros_por_pagina=${registrosPorPagina}`;
      const response = await axios.get(URL);
      setCantPaginas(response.data.totalPaginas);
      setAutos(response.data.resultado);
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
      console.log("Buscar", URL)
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

  const handleVerMultas = (vehiculo: Vehiculo) => {
    const dominioSinEspacios = vehiculo.dominio.trim();
    if (!dominioSinEspacios) {
      Swal.fire({
        title: "Error",
        text: "El vehículo no contiene dominio.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    window.open(`https://vecino.villaallende.gov.ar/Cedulones/Multa.aspx?dominio=${dominioSinEspacios}`, '_blank');
  }

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
                        <option value="">- Parametro -</option>
                        <option value="dominio">Dominio</option>
                        <option value="cuit">CUIT</option>
                        <option value="titular">Titular</option>
                      </FormSelect>
                      <FormLabel htmlFor="vertical-form-1">y ver</FormLabel>
                      <FormSelect
                        className="ml-3 mt-2 sm:mr-2 w-100"
                        name="activos"
                        id="activos"
                        value={activos}
                        onChange={(e) => setActivos(e.target.value)}
                      >
                        <option value="1">activos</option>
                        <option value="0">inactivos</option>
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
                  onClick={handleNuevoVehiculo}
                >
                  <Lucide icon="PlusSquare" className="w-4 h-4 mr-2" />
                  Vehículo
                </Button>
              </div>
            </div>
          </div>
          {verTabla &&
            <div className="overflow-x-auto">
              {!autos && (
                <Cargando mensaje="Buscando vehículos" />
              )}
              <Table className="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Vehículo
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Propietario
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap text-center">
                      Estado
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap text-center">
                      Ultimo Periodo <br />
                      de Liquidación
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap text-center">
                      Situación
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap text-center">
                      Saldo
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap text-center">
                      Multas
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap text-right">
                      Acciones
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {autos.map((auto, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        Dominio: <strong>{auto.dominio} </strong> <br />
                        Marca: {auto.marca} <br />
                        Año: {auto.anio}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        CUIT: {auto.cuit} <br />
                        Nombre y Apellido: <br /> {auto.nombre}
                      </Table.Td>
                      <Table.Td
                        className={classNames({
                          "text-success first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]":
                            !auto.baja,
                          "text-danger first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]":
                            auto.baja,
                        })}
                      >
                        {auto.baja ? "BAJA" : "ACTIVO"}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] text-center">
                        {getUltimoPeriodo(auto.per_ult)}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {getSituacion(auto.cod_situacion_judicial)}
                      </Table.Td>
                      <Table.Td className="text-danger text-right first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div className={classNames({
                          "text-danger": auto.saldo_adeudado,
                          "text-success": !auto.saldo_adeudado
                        })}>
                          {transformarDinero(auto.saldo_adeudado)}
                        </div>
                      </Table.Td>
                      <Table.Td className="text-danger text-right first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {auto.multas > 0 && (
                          <Button
                            variant="soft-danger"
                            onClick={() => handleVerMultas(auto)}
                            style={{ cursor: "pointer" }}
                          >
                            <Lucide icon="AlertTriangle" className="w-5 h-5" />{auto.multas}
                          </Button>)}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <Button
                          variant="primary"
                          onClick={() => handleVerAuto(auto)}
                          style={{ cursor: "pointer" }}
                        >
                          <Lucide icon="Eye" className="w-5 h-5" />
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <div className="w-full text-center">{renderPagination()}</div>
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Autos;
