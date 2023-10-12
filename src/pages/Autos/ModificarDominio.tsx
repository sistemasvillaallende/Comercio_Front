import { useState } from "react";
import Swal from "sweetalert2";
import { FormTextarea, FormLabel, FormInput } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useAutoContext } from "../../context/AutoProvider";
import { useUserContext } from "../../context/UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ModificarDominio = () => {
  const { vehiculo, traerAuto } = useAutoContext();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [nuevoDominio, setNuevoDominio] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");

  const cambiarDominio = (event: any) => {
    setNuevoDominio(event.target.value);
  };

  const cambiarObservaciones = (event: any) => {
    setObservaciones(event.target.value);
  };

  const guardarDominio = () => {
    if (!nuevoDominio) {
      Swal.fire({
        title: "Error",
        text: "Por favor ingresa un nuevo dominio.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
      return;
    }

    const apiUrl = `${
      import.meta.env.VITE_URL_AUTO
    }Confirma_Cambio_dominio?nuevo_dominio=${nuevoDominio}&dominio_ant=${
      vehiculo?.dominio
    }&usuario=${user?.userName}&observaciones=${observaciones}`;

    axios
      .post(apiUrl)
      .then((response) => {
        Swal.fire({
          title: "Dominio modificado",
          text: "El dominio se modificó correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });
        traerAuto(nuevoDominio);
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "Error",
          text: "Hubo un error al modificar el dominio.",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });
      });
  };

  const cancelar = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="conScroll grid grid-cols-12 gap-6 mt-5 ml-5 mr-4">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="grid grid-cols-12 gap-6 mt-3">
            <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
              <h2>Modificar Dominio:</h2>
              <h2>Dominio: {vehiculo?.dominio}</h2>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="dominio-input" className="sm:w-50">
                Nuevo dominio:
              </FormLabel>
              <div className="col-span-12 intro-y lg:col-span-4">
                <FormInput
                  id="dominio-input"
                  type="text"
                  value={nuevoDominio}
                  onChange={cambiarDominio}
                />
              </div>
            </div>
            <div className="col-span-12 intro-y lg:col-span-6">
              <FormLabel htmlFor="observaciones-textarea" className="sm:w-50">
                Observaciones:
              </FormLabel>
              <div className="col-span-12 intro-y lg:col-span-4">
                <FormTextarea
                  id="observaciones-textarea"
                  value={observaciones}
                  onChange={cambiarObservaciones}
                  rows={3}
                />
              </div>
            </div>
            <div className="col-span-12 intro-y lg:col-span-12">
              <Button
                variant="primary"
                className="ml-3"
                onClick={guardarDominio}
              >
                Modificar Dominio
              </Button>

              <Button variant="secondary" className="ml-3" onClick={cancelar}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModificarDominio;
