import { useEffect, useState } from "react";
import { BaseImponible } from "../../interfaces/IndustriaComercio";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FormSelect,
  FormInput,
  FormLabel,
  FormSwitch,
  InputGroup,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserProvider";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import Table from "../../base-components/Table";
import { currencyFormat } from "../../utils/helper";


const BasesImponibles = () => {

  const { elementoIndCom, tipoLiquidacion, tipoCondicionIVA, situacionJudicial, tipoDeEntidad } = useIndustriaComercioContext();


  const [periodoDesde, setPeriodoDesde] = useState("");
  const [periodoHasta, setPeriodoHasta] = useState("");
  const [listaBasesImponibles, setListaBasesImponibles] = useState<BaseImponible[]>([]);
  const { user } = useUserContext();

  useEffect(() => {

  }, []);

  const handleBuscar = (e: any) => {
    e.preventDefault();
    const fetchData = async () => {
      const URL = `${import.meta.env.VITE_URL_API_IYC}Indycom/GetBasesImponibles?legajo=11079&periodo_desde=${periodoDesde}&periodo_hasta=${periodoHasta}`;
      try {
        const response = await axios.get(URL);
        console.log(response);
        setListaBasesImponibles(response.data);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `${error}`,
          icon: "error",
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
      }
    };
    fetchData();
  };



  return (
    <>

      <div className="conScroll grid grid-cols-12 gap-6 mt-2 ml-3 mr-4 p-4">
        <div className="col-span-12 intro-y lg:col-span-12">

          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Bases Imponibles</h2>
          </div>

          <div className="grid grid-cols-12 gap-6 mt-3">

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formFechaDesde">Desde</FormLabel>
              <FormInput
                type="text"
                id="formFechaDesde"
                value={periodoDesde}
                onChange={(e) => setPeriodoDesde(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formFechaHasta">Hasta</FormLabel>
              <FormInput
                type="text"
                id="formFechaHasta"
                value={periodoHasta}
                onChange={(e) => setPeriodoHasta(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-5 mt-7">
              <Button
                variant="primary"
                onClick={handleBuscar}
              >
                Ver Bases imponibles
              </Button>
              <Button
                variant="secondary"
                className="ml-3">
                Cancelar
              </Button>
            </div>

          </div>

        </div>
        <div>
          {listaBasesImponibles.length > 0 && (
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                    Periodo
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-left">
                    Concepto
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                    Nro. Transacción
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                    Debe
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                    Monto Original
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                    Importe
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {listaBasesImponibles.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className="border-b-0 whitespace-nowrap text-center">
                      {item.periodo}
                    </Table.Td>
                    <Table.Td className="border-b-0 whitespace-nowrap text-left">
                      {item.concepto}
                    </Table.Td>
                    <Table.Td className="border-b-0 whitespace-nowrap text-center">
                      {item.nro_transaccion}
                    </Table.Td>
                    <Table.Td className="border-b-0 whitespace-nowrap text-right">
                      {currencyFormat(item.debe)}
                    </Table.Td>
                    <Table.Td className="border-b-0 whitespace-nowrap text-right">
                      {currencyFormat(item.monto_original)}
                    </Table.Td>
                    <Table.Td className="border-b-0 whitespace-nowrap text-right">
                      {currencyFormat(item.importe)}
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

export default BasesImponibles