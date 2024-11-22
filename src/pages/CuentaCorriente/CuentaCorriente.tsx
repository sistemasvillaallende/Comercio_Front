import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "../../base-components/Table";
import classNames from "classnames";
import { FormSelect, FormInput, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Menu from "../../base-components/Headless/Menu";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import ModalDetTransaccion from "./ModalDetTransaccion";
import ModalDetPago from "./ModalDetPago";
import ModalDetDeuda from "./ModalDetDeuda";
import ModalDetProcuracion from "./ModalDetProcuracion";
import ModalDetPlan from "./ModalDetPlan";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React, { useRef } from "react";
// Interfaces de Cta. Cte.
import {
  Ctasctes,
  Combo,
  DetCedulon,
  DetPago,
  DetDeuda,
  DetProcuracion,
  Chequera,
  DetallePlanPago,
  DetPlanPago
} from "../../interfaces/Ctasctes"

const CuentaCorriente = () => {
  const divRef = useRef(null);
  const { elementoIndCom } = useIndustriaComercioContext();
  const [autos, setAutos] = useState<Ctasctes[]>([]);
  const [cate_deuda, setCate_deuda] = useState<Combo[]>([]);
  const { dominio } = useParams();
  const [filtro, setFiltro] = useState(1);
  const [cateDeuda, setcateDeuda] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [detalle, setDetalle] = useState<string>("");
  const [detallePago, setDetallePago] = useState<DetPago | null>(null);
  const [showModalPago, setShowModalPago] = useState(false);

  const [detalleDeuda, setDetalleDeuda] = useState<DetDeuda[]>([]);
  const [showModalDeuda, setShowModalDeuda] = useState(false);

  const [detalleProcuracion, setDetalleProcuracion] =
    useState<DetProcuracion | null>();
  const [showModalProcuracion, setShowModalProcuracion] = useState(false);

  const [detallePlan, setDetallePlan] = useState<DetPlanPago | null>();
  const [showModalPlan, setShowModalPlan] = useState(false);

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Ctasctes | null>(null);

  useEffect(() => {
    setShowModal(false);
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/ListarCtacte?legajo= ${elementoIndCom?.legajo}&tipo_consulta=1&cate_deuda_desde=1&cate_deuda_hasta=20`);

      setAutos(response.data);
      console.log(response.data)
      const response2 = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Indycom/ListarCategoriasIyc`
      );
      setCate_deuda(response2.data);
    };

    fetchData();
  }, [dominio]);

  var saldo_actualizado = 0;
  if (autos.length > 0) {
    saldo_actualizado = autos[autos.length - 1].sub_total;
  }
  const deudas = autos.filter(
    (objeto) =>
      objeto.des_movimiento.toLowerCase().includes("Deuda".toLowerCase()) &&
      objeto.pagado == false
  );
  const saldo_original = deudas.reduce((a, b) => a + b.monto_original, 0);
  function currencyFormat(num: number) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    console.log(event.target.value)
    const value = event.target.value;
    setFiltro(Number.parseInt(value));
    var hasta = 0;
    if (cateDeuda == 0) {
      hasta = 20;
    } else {
      hasta = cateDeuda;
    }
    let url =
      `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/ListarCtacte?legajo=` +
      elementoIndCom?.legajo +
      `&tipo_consulta=` +
      value +
      `&cate_deuda_desde=` +
      cateDeuda +
      `&cate_deuda_hasta=` +
      hasta +
      ``;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAutos(data);
      })
      .catch((error) => console.error(error));
  }
  function handledet(tipo_transaccion: number, nro_transaccion: number) {
    const fetchData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/Datos_transaccion?tipo_transaccion=${tipo_transaccion}&nro_transaccion=${nro_transaccion}`);

      setDetalle(response.data);
    };

    fetchData();
    setShowModal(true);
  }
  function handledetPago(nro_cedulon: number, nro_transaccion: number) {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API_IYC}Ctasctes_indycom/DetallePago?nro_cedulon=` +
        nro_cedulon +
        `&nro_transaccion=` +
        nro_transaccion
      );

      setDetallePago(response.data);
    };

    fetchData();
    setShowModalPago(true);
  }
  function handledetDeuda(nro_transaccion: number) {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/DetalleDeuda?nro_transaccion=` +
        nro_transaccion
      );

      setDetalleDeuda(response.data);
    };

    fetchData();
    setShowModalDeuda(true);
  }
  function handledetProcuracion(nro_procuracion: number) {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API_IYC}Ctasctes_indycom/DetalleProcuracion?nro_proc=` +
        nro_procuracion
      );

      setDetalleProcuracion(response.data);
    };

    fetchData();
    setShowModalProcuracion(true);
  }
  function handledetPlan(nro_plan: number) {
    let url =
      `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/DetallePlan?nro_plan=` + nro_plan;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setDetallePlan(data), setShowModalPlan(true);
      })
      .catch((error) => {
        console.error(error)
      });
  }
  function handleSelectChangeTipo(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    setcateDeuda(Number.parseInt(value));
    var hasta = 0;
    if (Number.parseInt(value) == 0) {
      hasta = 20;
    } else {
      hasta = Number.parseInt(value);
    }
    let url =
      `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/ListarCtacte?legajo=` +
      elementoIndCom?.legajo +
      `&tipo_consulta=` +
      filtro +
      `&cate_deuda_desde=` +
      value +
      `&cate_deuda_hasta=` +
      hasta +
      ``;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAutos(data);
      })
      .catch((error) => console.error(error));
  }
  const generatePDF = () => {
    const doc = new jsPDF();

    // Obtén el elemento con el ID "informe"
    const element = divRef.current;
    // Captura todo el contenido del div, incluido el contenido oculto debido al desplazamiento
    if (element != null) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Establece el ancho y alto de la imagen en el PDF para asegurarte de que se muestre completo
        const pdfWidth = 210; // Ancho de la página A4 en mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Agrega la imagen al documento PDF
        doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        doc.save("informe.pdf");
      });
    }
  };
  return (
    <>
      <div style={{ padding: "25px" }}>
        <div style={{ marginBottom: "25px" }}>
          <ModalDetTransaccion
            showModal={showModal}
            setShowModal={setShowModal}
            detalle={detalle}
          ></ModalDetTransaccion>
          <ModalDetPago
            showModal={showModalPago}
            setShowModal={setShowModalPago}
            detalle={detallePago}
          ></ModalDetPago>
          <ModalDetDeuda
            showModal={showModalDeuda}
            setShowModal={setShowModalDeuda}
            detalle={detalleDeuda}
          ></ModalDetDeuda>
          <ModalDetProcuracion
            showModalProc={showModalProcuracion}
            setShowModalProc={setShowModalProcuracion}
            detalle={detalleProcuracion ? detalleProcuracion : null}
          ></ModalDetProcuracion>
          <ModalDetPlan
            showModalPlan={showModalPlan}
            setShowModalPlan={setShowModalPlan}
            detalle={detallePlan ? detallePlan : null}
          ></ModalDetPlan>
          <div className="modal"
            style={{
              display: showOptionsModal ? "block" : "none",
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1000
            }}
          >
            <div className="modal-content"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                minWidth: "300px"
              }}
            >
              <div className="modal-header">
                <h3>Opciones</h3>
                <Button
                  onClick={() => setShowOptionsModal(false)}
                  style={{ float: "right" }}
                >
                  ×
                </Button>
              </div>
              <div className="modal-body">
                <Button
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "10px",
                    padding: "10px"
                  }}
                  onClick={() => {
                    if (selectedTransaction) {
                      handledet(
                        selectedTransaction.tipo_transaccion,
                        selectedTransaction.nro_transaccion
                      );
                      setShowOptionsModal(false);
                    }
                  }}
                >
                  <Lucide icon="FileSearch" className="w-4 h-4 mr-2" />
                  Detalle Transaccion
                </Button>

                {selectedTransaction?.des_movimiento === "Deuda" && (
                  <Button
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      marginBottom: "10px",
                      padding: "10px"
                    }}
                    onClick={() => {
                      if (selectedTransaction) {
                        handledetDeuda(selectedTransaction.nro_transaccion);
                        setShowOptionsModal(false);
                      }
                    }}
                  >
                    <Lucide icon="FileSearch" className="w-4 h-4 mr-2" />
                    Detalle Deuda
                  </Button>
                )}

                {/* Repetir el mismo patrón para los otros botones */}
              </div>
            </div>
          </div>
          <div
            className="grid grid-cols-12 gap-6 mt-5"
            style={{ marginTop: "0px" }}
          >
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <h2>CUENTA CORRIENTE</h2>
              <hr style={{ display: "block" }} />
            </div>
            <div
              className="col-span-12 lg:col-span-6 2xl:col-span-6"
              style={{ textAlign: "right" }}
            >
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="col-span-12 lg:col-span-3 2xl:col-span-3">
              <strong>Tipo de Transacción</strong>
              <FormSelect
                className="mt-2 sm:mr-2"
                aria-label="Default select example"
                onChange={handleSelectChangeTipo}
              >
                {cate_deuda.map((cate, index) => (
                  <option value={cate.value}>{cate.text}</option>
                ))}
              </FormSelect>
            </div>
            <div className="col-span-12 lg:col-span-3 2xl:col-span-3">
              <strong>Filtro</strong>
              <br />
              <FormSelect
                className="mt-2 sm:mr-2"
                onChange={handleSelectChange}
              >
                <option value="1">Cuenta completa</option>
                <option value="2">Solo deudas</option>
              </FormSelect>
            </div>
            <div className="col-span-12 lg:col-span-3 2xl:col-span-3">
              <strong>Saldo Original</strong>
              <FormInput
                style={{
                  marginTop: "8px",
                  fontWeight: "600",
                  color: "rgb(185, 30, 28)",
                }}
                id="regular-form-1"
                type="text"
                value={currencyFormat(saldo_original).toString()}
                disabled
              />
            </div>
            <div className="col-span-12 lg:col-span-3 2xl:col-span-3">
              <strong>Saldo Actualizado</strong>
              <FormInput
                style={{
                  marginTop: "8px",
                  fontWeight: "600",
                  color: "rgb(185, 30, 28)",
                }}
                id="regular-form-1"
                type="text"
                value={currencyFormat(Math.abs(saldo_actualizado)).toString()}
                disabled
              />
            </div>
          </div>
        </div>
        <div
          ref={divRef}
          className="containerctacte box"
          style={{
            backgroundColor: "white",
            paddingTop: "0px",
            height: "400px",
            overflowY: "scroll",
          }}
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-12 2xl:col-span-12">
              <hr />
              <Table style={{ backgroundColor: "white" }}>
                <Table.Thead
                  style={{
                    zIndex: "1",
                    position: "sticky",
                    top: "0",
                    color: "white",
                    backgroundColor: "rgb(22 78 99)",
                  }}
                >
                  <Table.Tr>
                    <Table.Th>Movimiento</Table.Th>
                    <Table.Th>Periodo</Table.Th>
                    <Table.Th>Monto Orig.</Table.Th>
                    <Table.Th>Debe</Table.Th>
                    <Table.Th>Haber</Table.Th>
                    <Table.Th>Sub-Total</Table.Th>
                    <Table.Th>Procuración</Table.Th>
                    <Table.Th>Plan Pago</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody style={{ zIndex: "0" }}>
                  {autos.map((auto, index) => (
                    <Table.Tr key={index}>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                        }}
                        className={classNames({
                          "text-success": auto.des_movimiento == "Pago",
                          "text-danger": auto.des_movimiento == "Deuda",
                        })}
                      >
                        {auto.des_movimiento}
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                        }}
                      >
                        {auto.periodo}
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
                        {currencyFormat(auto.monto_original)}
                      </Table.Td>
                      <Table.Td
                        style={{
                          textAlign: "right",
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                          color: "#B91E1C",
                        }}
                      >
                        {currencyFormat(auto.debe)}
                      </Table.Td>
                      <Table.Td
                        style={{
                          textAlign: "right",
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                          color: "#0D9488",
                        }}
                      >
                        {currencyFormat(auto.haber)}
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          textAlign: "right",
                          border: "none",
                        }}
                        className={classNames({
                          "text-success": auto.sub_total >= 0,
                          "text-danger": auto.sub_total < 0,
                        })}
                      >
                        {currencyFormat(auto.sub_total)}
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                        }}
                      >
                        {auto.nro_procuracion > 0
                          ? auto.nro_procuracion
                          : "---"}
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                        }}
                      >
                        {auto.nro_plan > 0 ? auto.nro_plan : "---"}
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                          textAlign: "right",
                        }}
                      >
                        <Button
                          style={{
                            backgroundColor: auto.sub_total >= 0 ? "#0D9488" : "#c0504e",
                            color: "white",
                            marginRight: "10px",
                            height: "25px",
                          }}
                          onClick={() => {
                            setSelectedTransaction(auto);
                            setShowOptionsModal(true);
                          }}
                        >
                          ...
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CuentaCorriente;
