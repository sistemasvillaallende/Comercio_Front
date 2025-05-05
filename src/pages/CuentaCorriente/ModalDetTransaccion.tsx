import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  detalle: string;
}
interface DetTransaccion {
  tipo_movimiento: string;
  periodo: string;
  categoria_deuda: string;
  pago_parcial: string;
  nro_transaccion: string;
}
const ModalDetTransaccion = ({ showModal, setShowModal, detalle }: Props) => {
  return (
    <>
      <Dialog
        staticBackdrop
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Dialog.Panel className="p-10" style={{ paddingTop: "10px", paddingBottom: "10px", marginTop: "40px" }}>
          <Dialog.Title style={{ borderColor: "#cbd5e1" }}>
            <h2>
              Detalle Transacción
            </h2>
          </Dialog.Title>
          <Dialog.Description>
            <div dangerouslySetInnerHTML={{ __html: detalle }} />
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

export default ModalDetTransaccion;
