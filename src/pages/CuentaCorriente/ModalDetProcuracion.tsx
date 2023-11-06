import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { currencyFormat } from "../../utils/helper";

interface DetProcuracion {
    dominio: string;
    nro_procuracion: number;
    descripcion_estado: string;
    nombre_procurador: string;
    saldo: number;
    fecha_comienzo_procuracion: string;
    fecha_comienzo_estado: string;
    fecha_fin_estado: string;
}

interface Props {
  showModalProc: boolean;
  setShowModalProc: (showModalProc: boolean) => void;
  detalle: DetProcuracion | null;
}


const ModalDetProcuracion = ({ showModalProc, setShowModalProc, detalle }: Props) => {
  return (
    <>
      <Dialog
        staticBackdrop
        open={showModalProc}
        onClose={() => {
          setShowModalProc(false);
        }}
      >
        <Dialog.Panel
          className="p-10"
          style={{
            padding: "15px",
            with: "560px",
            marginTop: "25px",
            
          }}
        >
          <Dialog.Title style={{ borderColor: "#cbd5e1" }}>
            <h2 style={{ fontSize: "16px", width:"100%" }}>
            <span>Procuración Nro: </span>                 
            <span style={{ float: "right" }}>{detalle?.nro_procuracion}</span></h2>
          </Dialog.Title>
          <Dialog.Description>
            <Table style={{ backgroundColor: "white" }}>
              <Table.Tbody>
                  <Table.Tr>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      Importe Procurado:
                    </Table.Td>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      {currencyFormat(detalle?.saldo ? detalle.saldo : 0)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      Estado:
                    </Table.Td>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                    {detalle?.descripcion_estado}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      Fecha Inicio Estado:
                    </Table.Td>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      {detalle?.fecha_comienzo_estado}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      Fecha Fin Estado:
                    </Table.Td>
                    <Table.Td
                      style={{
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        fontSize: "13px",
                        border: "none",
                      }}
                    >
                      {detalle?.fecha_fin_estado}
                    </Table.Td>
                  </Table.Tr>                                                      
              </Table.Tbody>
            </Table>
          </Dialog.Description>
          <Dialog.Footer style={{ textAlign: "center", paddingTop: "25px" }}>
            <Button
              style={{ backgroundColor: "#164e63", borderColor: "#164e63" }}
              type="button"
              variant="primary"
              onClick={() => {
                setShowModalProc(false);
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

export default ModalDetProcuracion;
