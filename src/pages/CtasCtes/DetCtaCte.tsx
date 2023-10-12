import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "../../base-components/Table";
import classNames from "classnames";
import { FormSelect, FormInput, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Menu from "../../base-components/Headless/Menu";
import { useAutoContext } from "../../context/AutoProvider";
import { Dialog } from "../../base-components/Headless";

interface DetTransaccion {
  tipo_movimiento: string;
  periodo: string;
  categoria_deuda: string;
  pago_parcial: string;
  nro_transaccion: string;
}
function currencyFormat(num: number) {
  return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
interface Props {
  modal: boolean;
  setModal: (modal: boolean) => void;
  tipo_transaccion: number;
  nro_transaccion: number;
}
const DetCtaCte = ({
  modal,
  setModal,
  tipo_transaccion,
  nro_transaccion,
}: Props) => {
  const [detalle, setDetalle] = useState<DetTransaccion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL_CTACTE
        }Datos_transaccion?tipo_transaccion=` +
          tipo_transaccion +
          `&nro_transaccion=` +
          nro_transaccion
      );

      setDetalle(response.data);
    };

    fetchData();
  }, []);

  return (
    <>
      <Dialog
        open={modal}
        onClose={() => {
          setModal(false);
        }}
      >
        <Dialog.Panel className="p-10 text-center">
          <Table style={{ backgroundColor: "white" }}>
            <Table.Thead
              style={{
                position: "sticky",
                top: "0",
                color: "white",
                backgroundColor: "rgb(22 78 99)",
              }}
            >
              <Table.Tr>
                <Table.Th>Movimiento</Table.Th>
                <Table.Th>Periodo</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {detalle.map((det, index) => (
                <Table.Tr key={index}>
                  <Table.Td
                    style={{
                      paddingTop: "4px",
                      paddingBottom: "0px",
                      fontSize: "13px",
                      border: "none",
                    }}
                  >
                    {det.categoria_deuda}
                  </Table.Td>
                  <Table.Td
                    style={{
                      textAlign: "right",
                      paddingTop: "4px",
                      paddingBottom: "0px",
                      fontSize: "13px",
                      border: "none",
                    }}
                  >
                    {currencyFormat(Number.parseFloat(det.pago_parcial))}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default DetCtaCte;
