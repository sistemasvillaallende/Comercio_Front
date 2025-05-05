import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { currencyFormat } from "../../utils/helper";
interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  detalle: DetDeuda[];
}
interface DetDeuda {
  concepto: string;
  importe: number;
}
const ModalDetDeuda = ({ showModal, setShowModal, detalle }: Props) => {
  return (
    <>
      <Dialog
        staticBackdrop
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Dialog.Panel className="p-10" style={{ padding: "10px", marginTop: "40px" }}>
          <Dialog.Title style={{ borderColor: "#cbd5e1" }}>
            <h2>
              Detalle Deuda
            </h2>
          </Dialog.Title>
          <Dialog.Description>
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
                  <Table.Th>Concepto</Table.Th>
                  <Table.Th>Importe</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {detalle.map((det, index) => (
                  <Table.Tr key={index}>
                    <Table.Td
                      style={{
                        paddingTop: "8px",
                        paddingBottom: "0px",
                        fontSize: "14px",
                        border: "none",
                      }}
                    >
                      {det.concepto}
                    </Table.Td>
                    <Table.Td
                      style={{
                        textAlign: "right",
                        paddingTop: "8px",
                        paddingBottom: "0px",
                        fontSize: "14px",
                        border: "none",
                      }}
                    >
                      {currencyFormat(det.importe)}
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

export default ModalDetDeuda;
