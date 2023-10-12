import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Table from "../../base-components/Table";
import { FormSelect } from "../../base-components/Form";
import { currencyFormat } from "../../utils/helper";
import { Tarjetas } from "../../interfaces/Tarjetas";
import { Planes_Cobro } from "../../interfaces/Planes_Cobro";
import { setPlanCobro, selectPlanCobro, selectCheckOut } from "../../stores/CheckOutSlice";
import { useDispatch } from "react-redux";
import { store } from "../../stores/store";

interface Props {
  subsistema: number;
}
const CheckOutPago = ({ subsistema }: Props) => {
  const dispatch = useDispatch();
  const [tarjetas, setTarjetas] = useState<Tarjetas[]>([]);
  const [PlanesCobro, setPlanesCobro] = useState<Planes_Cobro[] | null>(null);
  useEffect(() => {
    let url = `${import.meta.env.VITE_URL_TARJETAS}getTarjetasDesktop`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTarjetas(data);
        let url2 =
          `${
            import.meta.env.VITE_URL_TARJETAS
          }getPlanBySubsistema?subsistema=` +
          subsistema +
          `&deuda=0&cod_tarjeta=` +
          data[0].cod_tarjeta;
        fetch(url2)
          .then((response2) => response2.json())
          .then((data2) => {
            setPlanesCobro(data2);
            if (PlanesCobro) dispatch(setPlanCobro(PlanesCobro[0]));
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }, []);

  function handleTarjetaChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    let url =
      `${import.meta.env.VITE_URL_TARJETAS}getPlanBySubsistema?subsistema=` +
      subsistema +
      `&deuda=0&cod_tarjeta=` +
      value;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPlanesCobro(data);
        if (PlanesCobro) dispatch(setPlanCobro(PlanesCobro[0]));
      })
      .catch((error) => console.error(error));
  }
  function handlePlanChange(event: React.ChangeEvent<HTMLSelectElement>) {
    if (PlanesCobro) {
      var planes = PlanesCobro.find(
        (p) => p.cod_plan == Number.parseInt(event.target.value)
      );
      if (planes) setPlanCobro(planes);
    }
    //calculoMontos();
  }
  return (
    <>
      <div
        className="col-span-12"
        style={{
          boxShadow: "0px 6px 14px 0px",
          borderRadius: "15px",
          paddingTop: "20px",
          paddingBottom: "25px",
        }}
      >
        <div
          className="col-span-12"
          style={{ margin: "20px", marginTop: "0", marginBottom: "0" }}
        >
          <br />
          <FormSelect className="mt-2 sm:mr-2" onChange={handleTarjetaChange}>
            {tarjetas.map((cate, index) => (
              <option value={cate.cod_tarjeta}>{cate.des_tarjeta}</option>
            ))}
          </FormSelect>
        </div>
        <div
          className="col-span-12"
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            marginBottom: "20px",
            marginTop: "0",
          }}
        >
          <br />
          <FormSelect className="mt-2 sm:mr-2" onChange={handlePlanChange}>
            {PlanesCobro?.map((cate, index) => (
              <option value={cate.cod_plan}>{cate.descripcion}</option>
            ))}
          </FormSelect>
        </div>
        <div
          className="col-span-12"
          style={{ margin: "20px", marginTop: "0", marginBottom: "0" }}
        >
          <Table style={{ backgroundColor: "white" }}>
            <Table.Tr>
              <Table.Td
                style={{
                  paddingLeft: "10px",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                }}
              >
                Monto Original:
              </Table.Td>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  textAlign: "right",
                  fontWeight: "600",
                  paddingRight: "10px",
                }}
              >
                {currencyFormat(selectCheckOut(store.getState()).monto_original)}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  paddingLeft: "10px",
                }}
              >
                Crédito:
              </Table.Td>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  textAlign: "right",
                  fontWeight: "600",
                  paddingRight: "10px",
                }}
              >
                {currencyFormat(selectCheckOut(store.getState()).credito)}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  paddingLeft: "10px",
                }}
              >
                Intereses Mora:
              </Table.Td>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  textAlign: "right",
                  fontWeight: "600",
                  paddingRight: "10px",
                }}
              >
                {currencyFormat(selectCheckOut(store.getState()).interes_mora)}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  paddingLeft: "10px",
                }}
              >
                Descuento:
              </Table.Td>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  textAlign: "right",
                  fontWeight: "600",
                  paddingRight: "10px",
                }}
              >
                {currencyFormat(selectCheckOut(store.getState()).descuento)}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  paddingLeft: "10px",
                }}
              >
                Costo financiero:
              </Table.Td>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  textAlign: "right",
                  fontWeight: "600",
                  paddingRight: "10px",
                }}
              >
                {currencyFormat(selectCheckOut(store.getState()).costo_financiero)}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  paddingLeft: "10px",
                }}
              >
                {selectCheckOut(store.getState()).cantidad_cuota} Cuotas
                de:
              </Table.Td>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  textAlign: "right",
                  fontWeight: "600",
                  paddingRight: "10px",
                }}
              >
                {currencyFormat(selectCheckOut(store.getState()).monto_cuota)}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  paddingLeft: "10px",
                  fontWeight: "600",
                }}
              >
                Total:
              </Table.Td>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  fontSize: "15px",
                  textAlign: "right",
                  fontWeight: "600",
                  paddingRight: "10px",
                }}
              >
                {currencyFormat(selectCheckOut(store.getState()).total)}
              </Table.Td>
            </Table.Tr>
            <Table.Tbody style={{ marginBottom: "10px" }}></Table.Tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default CheckOutPago;
