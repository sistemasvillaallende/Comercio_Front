import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { currencyFormat } from "../../utils/helper";
interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  detalle: DetPago | null;
}
interface DetCedulon {
    nroTran: number;
    periodo: string;
    monto: number;
}
interface DetPago {
  fecha_movimiento: string;
  nro_transaccion: number;
  nro_cedulon: number;
  monto_pagado: number;
  descripcion: string;
  periodo: string;
  des_tarjeta: string;
  cant_cuotas: number;
  lstDet: DetCedulon[];
}

const ModalDetPago = ({ showModal, setShowModal, detalle }: Props) => {
  return (
    <>
      <Dialog style={{ zIndex: "150"}}
        staticBackdrop
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Dialog.Panel
          className="p-10"
          style={{
            padding: "15px",
            marginTop: "25px",
          }}
        >
          <Dialog.Title style={{ borderColor: "#cbd5e1" }}>
            <h2 style={{ fontSize: "16px", width:"100%" }}>
            <span>Detalle Pago Cedulon Nro: </span>                 
            <span style={{ float: "right" }}>{detalle?.nro_cedulon}</span></h2>
          </Dialog.Title>
          <Dialog.Description>
            <p style={{marginBottom: "15px"}}>
              Fecha: <strong>{detalle?.fecha_movimiento}</strong> 
              <span style={{ float: "right" }}>Lugar de Pago:{" "}
              <strong>{detalle?.descripcion}</strong></span>
            </p>
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
                  <Table.Th>Nro. Transaccion</Table.Th>
                  <Table.Th>Periodo</Table.Th>
                  <Table.Th>Monto</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {detalle?.lstDet.map((det, index) => (
                  <Table.Tr key={index}>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "0px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      {det.nroTran}
                    </Table.Td>
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
                        textAlign: "right",
                        paddingTop: "4px",
                        paddingBottom: "0px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      {currencyFormat(det.monto)}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Dialog.Description>
          <Dialog.Footer style={{ textAlign: "center", paddingTop: "25px" }}>
            <Button
              style={{ backgroundColor: "#164e63", borderColor: "#164e63" }}
              type="button"
              variant="primary"
              onClick={() => {
                setShowModal(false);
              }}
              className="w-24"
            >
              Ok
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default ModalDetPago;
