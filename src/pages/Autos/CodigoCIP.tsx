import { useState, useEffect } from "react";
import Button from "../../base-components/Button";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";

const CodigoCIP = (props: any) => {
  const { marca, anio, setVentanaCIP, setCIP } = props;

  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [options, setOptions] = useState<any>([]);

  const buscarOpciones = async () => {
    const apiUrl = `${import.meta.env.VITE_URL_AUTO
      }CodigosCipByMarcaAnio?marca=${marca}&anio=${anio}`;
    const response = await axios.get(apiUrl);
    const opciones = response.data.map((opcion: any) => {
      return {
        value: opcion.codigo_cip,
        label: `${opcion.marca} (${opcion.tipo})`,
      };
    });

    setOptions(opciones);
  };

  useEffect(() => {
    buscarOpciones();
  }, [marca, anio]);

  const seleccionarCIP = () => {
    if (selectedOption) {
      setVentanaCIP(false);
      setCIP(selectedOption.value);
    } else {
      Swal.fire({
        title: "Error",
        text: "Por favor selecciona un código CIP.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
    }
  };

  const cancelar = () => {
    setVentanaCIP(false);
  };

  return (
    <div className="overlay">
      <div className="modal-container">
        <h2>Seleccione el Código C.I.P.</h2>
        <hr />
        <p>
          {marca} - Año: {anio}
        </p>
        <Select
          className="seleccionadorCIP"
          options={options}
          value={selectedOption}
          onChange={(option: any) => setSelectedOption(option)}
          isSearchable={true}
          placeholder="Buscar..."
        />
        <div className="flex w-full justify-end col-span-12 lg:col-span-12 mt-5">
          <div className="col-span-12">
            <Button variant="primary" className="ml-3" onClick={seleccionarCIP}>
              Seleccionar
            </Button>
            <Button variant="secondary" className="ml-3" onClick={cancelar}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodigoCIP;
