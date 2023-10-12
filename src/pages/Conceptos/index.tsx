import { useEffect, useState } from 'react'
import { useAutoContext } from "../../context/AutoProvider";
import Table from "../../base-components/Table";
import axios from "axios";
import Swal from "sweetalert2";
import { ConceptoDeAuto, Concepto } from '../../interfaces/Vehiculo';
import { formatNumberToARS } from '../../utils/Operaciones';
import { useNavigate } from 'react-router-dom';
import { convertirFecha } from '../../utils/AutosUtils';
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import EditarConcepto from './EditarConcepto';
import NuevoConcepto from './NuevoConcepto';
import { useUserContext } from '../../context/UserProvider';
import { set } from 'lodash';

const Conceptos = () => {
  const { vehiculo } = useAutoContext();
  const { user } = useUserContext();
  const [conceptosDeAuto, setconceptosPorAuto] = useState<ConceptoDeAuto[]>([]);
  const [conceptos, setconceptos] = useState<Concepto[]>([]);
  const [concepto, setConcepto] = useState<ConceptoDeAuto>();
  const navigate = useNavigate();
  const [showNuevoConcepto, setShowNuevoConcepto] = useState(false);

  useEffect(() => {
    obtenerConceptosPorAuto();
  }, [])

  const obtenerConceptosPorAuto = () => {
    const apiUrl = `${import.meta.env.VITE_URL_API_AUTO}Conceptos_auto/getConceptos_x_Auto?dominio=${vehiculo?.dominio}`;
    axios
      .get(apiUrl)
      .then((response) => {
        setconceptosPorAuto(response.data);
      })
      .catch((error) => {
        Swal.fire({
          title: error.code,
          text: error.message,
          icon: `error`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
        console.log(error);
        navigate(`/auto/${vehiculo?.dominio}/ver`);
      });
  }

  const obtenerConceptos = () => {
    const apiUrl = `${import.meta.env.VITE_URL_API_AUTO}Conceptos_auto/readConceptos`;
    axios
      .get(apiUrl)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setconceptos(response.data);
        } else {
          const conceptosArray = [response.data];
          setconceptos(conceptosArray);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const verConcepto = (cod_concepto_dominio: number) => {
    obtenerConceptos();
    const concepto = conceptos.find(concepto => concepto.cod_concepto_dominio === cod_concepto_dominio);
    return concepto;
  }

  const nuevoConcepto = () => {
    setShowNuevoConcepto(true);
    setConcepto(undefined);
  }

  const editarConceptosPorAuto = (concepto: ConceptoDeAuto) => {
    setConcepto(concepto);
    setShowNuevoConcepto(false);
  }

  const eliminarConceptosPorAuto = (dominio: string | undefined, cod_concepto_dominio: number) => {
    const apiUrl = `${import.meta.env.VITE_URL_API_AUTO}Conceptos_auto/DeleteConcepto?dominio=${dominio}&cod_concepto_dominio=${cod_concepto_dominio}&usuario=${user?.userName}`;
    Swal.fire({
      title: '¿Está seguro que desea eliminar el concepto?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#27a3cf',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(apiUrl)
          .then((response) => {
            Swal.fire({
              title: 'Concepto eliminado',
              text: response.data,
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#27a3cf',
            });
            obtenerConceptosPorAuto();
            setConcepto(undefined);
          })
          .catch((error) => {
            Swal.fire({
              title: error.code,
              text: error.message,
              icon: `error`,
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#27a3cf',
            });
            console.log(error);
          });
      }
    })
  }

  return (
    <>
      {concepto && <EditarConcepto {...{ concepto, setConcepto, verConcepto, obtenerConceptosPorAuto }} />}
      {showNuevoConcepto && <NuevoConcepto {...{ concepto, setConcepto, verConcepto, setShowNuevoConcepto, obtenerConceptosPorAuto }} />}
      <div className="conScroll grid grid-cols-12 gap-6 mt-1 ml-2">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="grid grid-cols-12 gap-6 mt-1">
            <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
              <h2>Conceptos</h2>
              <Button variant="primary" className="mb-2 mr-1 mt-3" onClick={() => nuevoConcepto()}>
                <Lucide icon="Plus" className="w-5 h-5" /> Concepto
              </Button>
            </div>
            <div className="col-span-12 intro-y lg:col-span-12">
              {
                conceptosDeAuto.length > 0 &&
                <Table className="mt-1">
                  <Table.Thead variant="light">
                    <Table.Tr>
                      <Table.Th className="whitespace-nowrap text-center">Nro.</Table.Th>
                      <Table.Th className="whitespace-nowrap text-center">Concepto</Table.Th>
                      <Table.Th className="whitespace-nowrap text-center">Porcentaje</Table.Th>
                      <Table.Th className="whitespace-nowrap text-center">Monto</Table.Th>
                      <Table.Th className="whitespace-nowrap text-center">Vence</Table.Th>
                      <Table.Th className="whitespace-nowrap text-center">Decreto</Table.Th>
                      <Table.Th className="whitespace-nowrap text-center">Acciones</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {conceptosDeAuto.map((concepto, index) => (
                      <Table.Tr key={index}>
                        <Table.Td className="whitespace-nowrap text-center">{concepto?.cod_concepto_dominio}</Table.Td>
                        <Table.Td className="whitespace-nowrap text-lefth">{concepto?.des_concepto_dominio}</Table.Td>
                        <Table.Td className="whitespace-nowrap text-center">{concepto?.porcentaje}</Table.Td>
                        <Table.Td className="whitespace-nowrap text-right">{formatNumberToARS(concepto?.monto)}</Table.Td>
                        <Table.Td className="whitespace-nowrap text-center">{convertirFecha(concepto?.vencimiento)}</Table.Td>
                        <Table.Td className="whitespace-nowrap text-center">{concepto?.nro_decreto}</Table.Td>
                        <Table.Td className="whitespace-nowrap text-right">
                          <Button variant="primary" className="mb-2 mr-1" onClick={() => editarConceptosPorAuto(concepto)}>
                            <Lucide icon="Edit" className="w-5 h-5" />
                          </Button>
                          <Button variant="danger" className="mb-2 mr-1" onClick={() => eliminarConceptosPorAuto(concepto?.dominio, concepto?.cod_concepto_dominio)}>
                            <Lucide icon="Trash" className="w-5 h-5" />
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Conceptos