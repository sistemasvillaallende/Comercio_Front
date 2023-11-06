import axios from "axios";
import { number, string } from "prop-types";
import React, { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { currencyFormat } from "../../utils/helper";

interface Chequera {
  NRO_PLAN: number;
  NRO_CUOTA: number;
  MONTO_ORIGINA: number;
  INTERES_ACUMULADO: number;
  MONTO_ADEUDADO: number;
  VENCIMIENTO: string;
  FECHA_PAGO: string;
  monto_pagado: number;
  vencimiento_original: string;
  monto_a_acreditar: number;
  monto_actualizado: number;
}
interface DetallePlanPago {
  periodo: string;
  deuda: number;
  pdes_categoria: string;
}
interface DetPlanPago {
  nro_plan: number;
  monto_original: number;
  descuento: number;
  saldo_financiado: number;
  anticipo: number;
  cantidad_cuotas: number;
  interes: number;
  valor_cuota: number;

  fecha_plan: string;
  fecha_pri_cuota: string;
  imp_total: number;
  imp_pagado: number;
  imp_adeudado: number;
  imp_vencido: number;
  cuotas_pagadas: number;
  cuotas_vencidas: number;
  fecha_ultimo_pago: string;

  procuraciones_incluidas: string;
  lstDetallePlan: DetallePlanPago[];
  lstChequera: Chequera[];
}
interface Props {
  showModalPlan: boolean;
  setShowModalPlan: (showModalPlan: boolean) => void;
  detalle: DetPlanPago | null;
}

const ModalDetPlan = ({ showModalPlan, setShowModalPlan, detalle }: Props) => {
  const today = new Date();
  const now = today.getTime();
  const fechaUltimoPago = new Date(
    detalle?.fecha_ultimo_pago ? detalle?.fecha_ultimo_pago : now
  ).getTime();

  var diff = Math.round((now - fechaUltimoPago) / (1000 * 60 * 60 * 24));

  return (
    <>
      <Dialog
        staticBackdrop
        open={showModalPlan}
        onClose={() => {
          setShowModalPlan(false);
        }}
      >
        <Dialog.Panel
          style={{
            padding: "10px",
            marginTop: "15px",
            with: "580px",
            height: "550px",
          }}
        >
          <Dialog.Title style={{ borderColor: "#cbd5e1" }}>
            <div
              className="grid grid-cols-12"
              style={{ width: "100%", height: "60px" }}
            >
              <div className="col-span-12 intro-y lg:col-span-6 content">
                <h2 style={{ fontSize: "16px", width: "100%" }}>
                  <span>Plan Número: {detalle?.nro_plan}</span>
                </h2>
                <p>Incluye Procuraciones: {detalle?.procuraciones_incluidas}</p>
              </div>
              <div className="col-span-12 intro-y lg:col-span-5 content">
                <h2 style={{ fontSize: "16px", width: "100%" }}>
                  <span>Estado: Activo</span>
                </h2>
                <p>Deuda Incluuida</p>
              </div>
              <div className="col-span-12 intro-y lg:col-span-1 content">
                <Button
                  style={{
                    backgroundColor: "#164e63",
                    borderColor: "#164e63",
                    width: "35px",
                    float: "right",
                  }}
                  type="button"
                  variant="primary"
                  onClick={() => {
                    setShowModalPlan(false);
                  }}
                  className="w-24"
                >
                  X
                </Button>
              </div>
            </div>
          </Dialog.Title>
          <Dialog.Description>
            <div
              className="grid grid-cols-12"
              style={{ width: "100%", height: "300px" }}
            >
              <div className="col-span-12 intro-y lg:col-span-6 content gap-6 ">
                <Table style={{ backgroundColor: "white" }}>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Monto Original</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {currencyFormat(
                          detalle?.monto_original ? detalle?.monto_original : 0
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Descuento</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {currencyFormat(
                          detalle?.descuento ? detalle?.descuento : 0
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Saldo a financiar</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {currencyFormat(
                          detalle?.saldo_financiado
                            ? detalle?.saldo_financiado
                            : 0
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Anticipo</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {currencyFormat(
                          detalle?.anticipo ? detalle?.anticipo : 0
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Interes Mensual</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {currencyFormat(
                          detalle?.interes ? detalle?.interes : 0
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Monto Cuota</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {currencyFormat(
                          detalle?.valor_cuota ? detalle?.valor_cuota : 0
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Cant. Cuotas</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {detalle?.cantidad_cuotas}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Cuotas Pagadas</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {detalle?.cuotas_pagadas}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr
                      style={{ backgroundColor: "#164e63", color: "white" }}
                    >
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Importe Pagado</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {currencyFormat(
                          detalle?.imp_pagado ? detalle?.imp_pagado : 0
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr style={{ backgroundColor: "#164e63", color: "white" }}>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Importe Vencido</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {currencyFormat(
                          detalle?.imp_vencido ? detalle?.imp_vencido : 0
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr style={{ backgroundColor: "#164e63", color: "white" }}>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Cuotas Vencidas</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {detalle?.cuotas_vencidas}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr style={{ backgroundColor: "#164e63", color: "white" }}>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Fecha Ultimo Pago</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {detalle?.fecha_ultimo_pago}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr style={{ backgroundColor: "#164e63", color: "white" }}>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        <strong>Dias de Mora</strong>
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontSize: "13px",
                          paddingLeft: "5px",
                        }}
                      >
                        {diff}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
              <div className="col-span-12 intro-y lg:col-span-6 gap-6 content">
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
                  <Table.Th>Periodo</Table.Th>
                  <Table.Th>Deuda</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {detalle?.lstDetallePlan.map((det, index) => (
                  <Table.Tr key={index}>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "0px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      {det.periodo}
                    </Table.Td>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "0px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      {currencyFormat(det.deuda)}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
                </Table>
              </div>
            </div>
          </Dialog.Description>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default ModalDetPlan;
