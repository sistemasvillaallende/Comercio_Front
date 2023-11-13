import React, { useEffect, useState } from "react";

import axios from "axios";
import Table from "../../base-components/Table";
import { FormSelect, FormSwitch } from "../../base-components/Form";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import { currencyFormat, selectCalculaMontos } from "../../utils/helper";
import Swal from "sweetalert2";

import { LstDeuda } from "../../interfaces/LstDeuda";
import { Tarjetas } from "../../interfaces/Tarjetas";
import { Planes_Cobro } from "../../interfaces/Planes_Cobro";
import { CheckOut } from "../../interfaces/CheckOut";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Interface } from "readline";
import { VCtasctes } from "../../interfaces/VCtasctes";
import { CreateCedulones } from "../../interfaces/CreateCedulones";
import { DateTime } from "litepicker/dist/types/datetime";
import { useNavigate } from "react-router-dom";
import { useCedulonesContext } from "../../context/CedulonesProviders";
import { CedulonImpresion } from "../../interfaces/IndustriaComercio";


interface LstProcuraciones {
  nroProc: number;
  txtProc: string;
}

const Autos = () => {

  const navigate = useNavigate();

  const { cedulonParaImpresionProvider, setCedulonParaImpresion } = useCedulonesContext();
  const [proc, setProc] = useState<number[] | null>([]);
  const [tarjetas, setTarjetas] = useState<Tarjetas[]>([]);
  const [PlanesCobro, setPlanesCobro] = useState<Planes_Cobro[] | null>(null);

  const [spinner, setSpinner] = useState<boolean>();
  const [PlanCobro, setPlanCobro] = useState<Planes_Cobro>();
  const { elementoIndCom } = useIndustriaComercioContext();
  const [deuda, setDeuda] = useState<LstDeuda[]>([]);
  const [deudaSeleccionada, setDeudaSeleccionada] = useState<LstDeuda[]>([]);
  const [checkout, setCheckout] = useState<CheckOut>();

  const [formSwitchState, setFormSwitchState] = useState<{ [key: string]: boolean }>({});



  function setDescripcionPlanes(planes_con_descripcion: Planes_Cobro[]) {
    planes_con_descripcion?.forEach((element) => {
      if (element.con_dto_interes == 1) {
        if (element.ali_dto_interes != 0) {
          element.descripcion +=
            " Con descuento del " +
            element.ali_dto_interes +
            "% sobre intereses por mora";
        }
      }
      element.descripcion +=
        " - (Costo financiero " + element.ali_costo_financiero + "%)";
      //planes_con_descripcion.push(element);
      if (element.valor_min_cuota > 0) {
        const sum = deudaSeleccionada.reduce(
          (prev, next) => prev + next.debe,
          0
        );
        if (element.valor_min_cuota > sum) {
          if (planes_con_descripcion) {
            planes_con_descripcion = planes_con_descripcion?.filter(
              (a) => a.cod_plan == element.cod_plan
            );
          }
        }
      }
    });
    if (planes_con_descripcion) {
      setPlanesCobro(planes_con_descripcion);
      setPlanCobro(planes_con_descripcion[0]);
    }
  }

  function handleTarjetaChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    let url =
      `${import.meta.env.VITE_URL_TARJETAS}getPlanBySubsistema?subsistema=` +
      4 +
      `&deuda=0&cod_tarjeta=` +
      value;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setDescripcionPlanes(data);
      })
      .catch((error) => console.error(error));
  }
  function handlePlanChange(event: React.ChangeEvent<HTMLSelectElement>) {
    if (PlanesCobro) {
      var planes = PlanesCobro.find(
        (p) => p.cod_plan == Number.parseInt(event.target.value)
      );
      if (planes != undefined && planes) {
        setPlanCobro(planes);
        setCheckout(selectCalculaMontos(deudaSeleccionada, planes));
      }
    }
  }
  const handleCedulonClick = () => {


    const cedulonParaImpresion: CedulonImpresion = {
      tarjetaDeCredito: tarjetas.find((tarjeta) => tarjeta.cod_tarjeta == PlanCobro?.cod_tarjeta)?.des_tarjeta || '',
      cantCuotas: checkout?.cantidad_cuota || 0,
      montoCuota: checkout?.monto_cuota || 0,
      montoOriginal: checkout?.monto_original || 0,
      credito: checkout?.credito || 0,
      interesMora: checkout?.interes_mora || 0,
      descuento: checkout?.descuento || 0,
      costoFinanciero: checkout?.costo_financiero || 0,
      total: checkout?.total || 0,
    }

    setCedulonParaImpresion(cedulonParaImpresion);

    const urlApi = `${import.meta.env.VITE_URL_API_IYC_CEDULONES}EmitoCedulonComercio`;

    const listaVCtasctes = deudaSeleccionada.map((deuda) => {
      return {
        deudaOriginal: deuda.monto_original,
        intereses: 0,
        nro_cedulon_paypertic: deuda.nro_cedulon_paypertic,
        pago_parcial: deuda.pago_parcial,
        pago_a_cuenta: deuda.pago_a_cuenta,
        nro_transaccion: deuda.nroTtransaccion,
        periodo: deuda.periodo,
        importe: deuda.debe,
        fecha_vencimiento: deuda.vencimiento,
        categoria_deuda: deuda.categoriaDeuda,
      };
    });
    const fecha = new Date();
    const hoy = fecha.getDate();
    const requestBody = {
      legajo: elementoIndCom?.legajo,
      vencimiento: fecha.toLocaleDateString(),
      monto_cedulon: checkout?.total,
      listadeuda: listaVCtasctes,
      nroProc: 0
    };

    axios
      .post(urlApi, requestBody)
      .then((response) => {
        if (response) {
          Swal.fire({
            title: "Cedulón generado",
            text: `Se ha generado el cedulón Nro. ${response.data}`,
            icon: "success",
            confirmButtonText: "Imprimir Cedulón",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            confirmButtonColor: "#27a3cf",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/Cedulon/${response.data}`);
            }
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: error.code,
          text: error.message,
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });
      });
  }

  useEffect(() => {

    const fetchData2 = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API_IYC}Ctasctes_indycom/getListDeudaIyC?legajo=` +
        elementoIndCom?.legajo
      );
      setDeuda(response.data);
    };
    fetchData2();

    let url = `${import.meta.env.VITE_URL_TARJETAS}getTarjetasDesktop`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTarjetas(data);
        let url2 =
          `${import.meta.env.VITE_URL_TARJETAS
          }getPlanBySubsistema?subsistema=` +
          4 +
          `&deuda=0&cod_tarjeta=` +
          data[0].cod_tarjeta;
        fetch(url2)
          .then((response2) => response2.json())
          .then((data2) => {
            setDescripcionPlanes(data2);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }, []);

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    if (value == "1") {
      const fetchData2 = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_CTACTE}getListDeudaAuto?dominio=` +
          elementoIndCom?.legajo
        );
        setDeuda(response.data);
        setProc(null);
      };
      fetchData2();
    }
    if (value == "2") {
      const fetchData2 = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_CTACTE
          }getListDeudaAutoNoVencida?dominio=` + elementoIndCom?.legajo
        );
        setDeuda(response.data);
        setProc(null);
      };
      fetchData2();
    }
    if (value == "3") {
      const fetchData2 = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_CTACTE
          }getListDeudaAutoProcurada?dominio=` + elementoIndCom?.legajo
        );
        setDeuda(response.data);
        setProc(
          response.data
            .map((obj: { nro_proc: any }) => obj.nro_proc) // Obtenemos un array con solo los valores de la propiedad tipo
            .filter(
              (value: any, index: any, self: string | any[]) =>
                self.indexOf(value) === index
            )
        );
      };
      fetchData2();
      var anula: LstDeuda[] = []
      setDeudaSeleccionada(anula);
    }
  }


  const handleChangeSelectCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const updatedFormSwitchState = { ...formSwitchState };
    const updatedDeudaSeleccionada = checked ? [...deuda] : [];

    deuda.forEach((deudaItem) => {
      updatedFormSwitchState[deudaItem.nroTtransaccion.toString()] = checked;
    });

    setFormSwitchState(updatedFormSwitchState);
    setDeudaSeleccionada(updatedDeudaSeleccionada);

    if (PlanCobro !== undefined && PlanCobro) {
      setCheckout(selectCalculaMontos(updatedDeudaSeleccionada, PlanCobro));
    }
  }


  function handleChangeSelectCheck(event: React.ChangeEvent<HTMLInputElement>) {

    const obj = deuda?.find(
      (d: { nroTtransaccion: number }) =>
        d.nroTtransaccion == Number.parseInt(event.target.name)
    );
    if (event.target.checked) {
      if (obj != null && deudaSeleccionada != null) {
        const newArray = [...deudaSeleccionada, obj];
        setDeudaSeleccionada(newArray);
        if (PlanCobro != undefined && PlanCobro) {
          setCheckout(selectCalculaMontos(newArray, PlanCobro));
        }
      }
    } else {
      const result = deudaSeleccionada?.findIndex(
        (o) => o.nroTtransaccion == Number.parseInt(event.target.name)
      );
      const deuda_nueva = deudaSeleccionada.splice(result, 1);
      setDeudaSeleccionada(deudaSeleccionada);
      if (PlanCobro != undefined && PlanCobro) {
        setCheckout(selectCalculaMontos(deudaSeleccionada, PlanCobro));
      }
    }
    //modifico el estado del switch 
    const updatedFormSwitchState = { ...formSwitchState };
    updatedFormSwitchState[event.target.name] = event.target.checked;
    setFormSwitchState(updatedFormSwitchState);

  }

  const construirTabla = (deuda: LstDeuda[]) => {
    return (
      <>
        <Table.Tbody style={{ marginBottom: "10px" }}>
          {deuda?.map((auto, index) => (
            <Table.Tr key={index}>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "0px",
                  fontSize: "15px",
                }}
              >
                <div
                  style={{
                    maxWidth: "90%",
                    marginBottom: "7px",
                    marginTop: "7px",
                  }}
                >
                  <div
                    className="px-2 py-1 text-xs font-medium text-white rounded-full cursor-pointer bg-danger"
                    style={{ display: "inline" }}
                  >
                    En mora
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#164e63",
                      paddingLeft: "5px",
                      display: "inline-grid",
                    }}
                  >
                    {auto.desCategoria} - {auto.periodo}
                    <br />
                    <p
                      style={{
                        fontSize: "14px",
                        paddingTop: "10px",
                        fontWeight: "400",
                      }}
                    >
                      Venció el: {auto.vencimiento}
                    </p>
                  </span>
                </div>
              </Table.Td>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "0px",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                {currencyFormat(auto.debe)}
              </Table.Td>
              <Table.Td
                style={{
                  paddingTop: "6px",
                  paddingBottom: "0px",
                  fontSize: "15px",
                }}
              >
                <div className="mt-2">
                  <FormSwitch>
                    <FormSwitch.Input
                      id="checkbox-switch-7"
                      type="checkbox"
                      name={auto.nroTtransaccion.toString()}
                      onChange={handleChangeSelectCheck}
                      checked={formSwitchState[auto.nroTtransaccion.toString()] || false}
                    />
                    <FormSwitch.Label htmlFor="checkbox-switch-7"></FormSwitch.Label>
                  </FormSwitch>
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </>
    )
  }

  return (
    <>
      <div style={{ padding: "25px" }}>
        <div>
          <div
            className="grid grid-cols-12 gap-6 mt-5"
            style={{ marginTop: "0px" }}
          >
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <h2>GESTIÓN DE CEDULONES</h2>
              <hr style={{ display: "block" }} />
            </div>
            <div
              className="col-span-12 lg:col-span-6 2xl:col-span-6"
              style={{ textAlign: "right" }}
            ></div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8 2xl:col-span-8">
              <div className="grid grid-cols-12 gap-4 mt-5">
                <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
                  <strong>Periodos</strong>
                  <FormSelect
                    className="mt-2 sm:mr-2"
                    onChange={handleSelectChange}
                    aria-label="Default select example"
                  >
                    <option key="1" value="1">Periodos vencidos</option>
                    <option key="2" value="2">Periodos no vencidos</option>
                    <option key="3" value="3">Periodos procurados</option>
                    <option key="4" value="4">Periodo anual</option>
                  </FormSelect>
                </div>
                <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
                  <strong>Procuración</strong>
                  <br />
                  <FormSelect className="mt-2 sm:mr-2">
                    {" "}
                    {proc?.map((pr, index) => (
                      <option value={pr}>{"Procuración Nro.: " + pr}</option>
                    ))}
                  </FormSelect>
                </div>
              </div>
              <div
                className="containerctacte box"
                style={{
                  backgroundColor: "white",
                  marginTop: "10px",
                  paddingTop: "0px",
                }}
              >
                <div
                  className="col-span-12 containerctacte"
                  style={{ height: "400px", overflowY: "scroll" }}
                >
                  <hr />
                  <Table style={{ backgroundColor: "white" }}>
                    <Table.Thead
                      style={{
                        position: "sticky",
                        zIndex: "50",
                        top: "0",
                        color: "white",
                        backgroundColor: "rgb(22 78 99)",
                      }}
                    >
                      <Table.Tr>
                        <Table.Th>PERIODO</Table.Th>
                        <Table.Th>SALDO</Table.Th>
                        <Table.Th>
                          {" "}
                          <FormSwitch>
                            <FormSwitch.Input
                              id="checkbox-switch-7"
                              type="checkbox"
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                handleChangeSelectCheckAll(event);
                              }}
                            />
                            <FormSwitch.Label htmlFor="checkbox-switch-7"></FormSwitch.Label>
                          </FormSwitch>
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    {construirTabla(deuda)}
                  </Table>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 2xl:col-span-4">
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
                  <FormSelect
                    className="mt-2 sm:mr-2"
                    onChange={handleTarjetaChange}
                  >
                    {tarjetas.map((cate, index) => (
                      <option value={cate.cod_tarjeta} key={index}>
                        {cate.des_tarjeta}
                      </option>
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
                  <FormSelect
                    className="mt-2 sm:mr-2"
                    onChange={handlePlanChange}
                  >
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
                          paddingRight: "10px",
                        }}
                      >
                        {currencyFormat(checkout ? checkout.monto_original : 0)}
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
                          paddingRight: "10px",
                        }}
                      >
                        {currencyFormat(checkout ? checkout.credito : 0)}
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
                          paddingRight: "10px",
                        }}
                      >
                        {currencyFormat(checkout ? checkout.interes_mora : 0)}
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
                          paddingRight: "10px",
                        }}
                      >
                        {currencyFormat(checkout ? checkout.descuento : 0)}
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
                          paddingRight: "10px",
                        }}
                      >
                        {currencyFormat(
                          checkout ? checkout.costo_financiero : 0
                        )}
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
                        {checkout ? checkout.cantidad_cuota : 0} Cuotas de:
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "6px",
                          paddingBottom: "6px",
                          fontSize: "15px",
                          textAlign: "right",
                          paddingRight: "10px",
                        }}
                      >
                        {currencyFormat(checkout ? checkout.monto_cuota : 0)}
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
                        {currencyFormat(checkout ? checkout.total : 0)}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tbody style={{ marginBottom: "10px" }}></Table.Tbody>
                  </Table>
                  <Button
                    onClick={() => handleCedulonClick()}
                    variant="primary"
                    className="mb-2 mr-1"
                    style={{ width: "100%", marginTop: "20px" }}
                  >
                    Generar Cedulon
                    {spinner && (
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Autos;
