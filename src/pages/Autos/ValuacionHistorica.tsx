import { useEffect, useState } from 'react'
import { useAutoContext } from "../../context/AutoProvider";
import Table from "../../base-components/Table";
import axios from "axios";
import Swal from "sweetalert2";
import { Valuacion } from '../../interfaces/Vehiculo';
import { formatNumberToARS } from '../../utils/Operaciones';
import { useNavigate } from 'react-router-dom';

const ValuacionHistorica = () => {

  const { vehiculo } = useAutoContext();
  const [valuacionesHistoricas, setValuacionesHistoricas] = useState<Valuacion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_URL_AUTO}GetValuacion?codigo_cip=${vehiculo?.codigo_cip}&anio=${vehiculo?.anio}`;
    console.log(vehiculo);
    axios
      .get(apiUrl)
      .then((response) => {
        setValuacionesHistoricas(response.data);
        console.log
      })
      .catch((error) => {
        Swal.fire({
          title: 'Sin Información',
          text: "No se encontraron valuaciones historicas para el vehículo.",
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
        console.log(error);
        navigate(`/auto/${vehiculo?.dominio}/ver`);
      });
  }, [])

  return (
    <div className="conScroll grid grid-cols-12 gap-6 mt-1 ml-2">
      <div className="col-span-12 intro-y lg:col-span-12">
        <div className="grid grid-cols-12 gap-6 mt-1">
          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Valuación Histórica</h2>
          </div>
          <div className="col-span-12 intro-y lg:col-span-6">
            <Table className="mt-5">
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap text-center">Año Liquidación</Table.Th>
                  <Table.Th className="whitespace-nowrap text-center">Base Imponible</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {valuacionesHistoricas.map((valuacion) => (
                  <Table.Tr key={valuacion?.anio}>
                    <Table.Td className="whitespace-nowrap text-center">{valuacion?.anio}</Table.Td>
                    <Table.Td className="whitespace-nowrap text-right">{formatNumberToARS(valuacion?.base_imponible)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValuacionHistorica