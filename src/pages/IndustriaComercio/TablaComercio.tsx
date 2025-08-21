import DataTable, { TableColumn } from "react-data-table-component";
import { useEffect, useState, useMemo } from "react";
import axios from 'axios';
import Lucide from "../../base-components/Lucide"
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import BotonActivo from "../../components/BotonActivo";

type Dato = {
  legajo: number;
  nro_contrib: number;
  des_com: string;
  nom_fantasia: string;
  nro_cuit: string;
  nom_calle: string;
  nom_barrio: string;
  ciudad: string;
  cod_calle_dom_esp: number
};

const TablaComercio = () => {

  const [cargando, setCargando] = useState<boolean>(true)
  const [apiData, setApiData] = useState<Dato[]>([]);
  const navigate = useNavigate();
  const { traerElemento } = useIndustriaComercioContext();
  const [filtro, setFiltro] = useState<string>("");


  useEffect(() => {
    const fetchData = async () => {
      // const registrosPorPagina = import.meta.env.VITE_REGISTROS_POR_PAGINA; // No se usa en esta URL
      const URL = `${import.meta.env.VITE_URL_BASE}Indycom/read`;
      try {
        const response = await axios.get<Dato[]>(URL);
        setApiData(response.data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los datos de comercios.",
          icon: "error",
          confirmButtonColor: "#27a3cf",
        });
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []); // Se ejecuta una vez al montar el componente

  const columnas: TableColumn<Dato>[] = [
    {
      name: 'Legajo',
      selector: row => row.legajo,
      maxWidth: "80px"
    },
    {
      name: 'Nro Contrib',
      selector: row => row.nro_contrib,
      maxWidth: "80px"
    },
    {
      name: 'Descripcion',
      selector: row => row.des_com,
    },
    {
      name: 'Nombre Fantasia',
      selector: row => row.nom_fantasia,
    },
    {
      name: 'CUIT',
      selector: row => row.nro_cuit,
      maxWidth: "130px"
    },
    {
      name: 'Dirección',
      selector: row => <span>{row.nom_calle} {row.cod_calle_dom_esp.toString()}, {row.nom_barrio}</span >,
      minWidth: '200px',
    },
    {
      name: "",
      cell: (row) => <button className="p-2 bg-sky-200 rounded hover:bg-sky-400" onClick={() => handleVerElemento(row)}> <Lucide icon="Eye" className="w-5 h-5" /></button>,
      maxWidth: "50px"
    }

  ]

  const handleVerElemento = (dato: Dato) => {
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
    navigate(`/${dato.legajo}/ver`);
  };

  const getDatosFiltrados = (): Dato[] => {
    if (!filtro.trim()) {
      return apiData;
    }
    const filtroLower = filtro.toLowerCase();
    return apiData.filter((dato) => {
      return (
        dato.legajo.toString().includes(filtroLower) ||
        dato.nro_contrib.toString().includes(filtroLower) ||
        (dato.des_com && dato.des_com.toLowerCase().includes(filtroLower)) ||
        (dato.nom_fantasia && dato.nom_fantasia.toLowerCase().includes(filtroLower)) ||
        (dato.nro_cuit && dato.nro_cuit.toLowerCase().includes(filtroLower)) ||
        (dato.nom_calle && dato.nom_calle.toLowerCase().includes(filtroLower)) ||
        (dato.nom_barrio && dato.nom_barrio.toLowerCase().includes(filtroLower)) ||
        (dato.ciudad && dato.ciudad.toLowerCase().includes(filtroLower)) ||
        (dato.cod_calle_dom_esp && dato.cod_calle_dom_esp.toString().toLowerCase().includes(filtroLower))
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-white pt-5">
      <div className="pl-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-1/3"
        />
        <BotonActivo to="nuevo" texto="Nuevo" />
      </div>
      <DataTable
        columns={columnas}
        data={getDatosFiltrados()}
        pagination
        highlightOnHover
        striped
        fixedHeader
        progressPending={cargando}
        progressComponent={<h2>cargando...</h2>}
      />
    </div>
  )
}

export default TablaComercio