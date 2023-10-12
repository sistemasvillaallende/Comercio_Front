import { useState, useEffect } from "react";
import Button from "../../base-components/Button";
import Select from "react-select";
import axios from "axios";
import { Concepto } from "../../interfaces/Vehiculo";

const SelectorDeConceptos = (props: any) => {
  const { setShowModal, concepto, setConcepto } = props;
  const [listaDeConceptos, setListaDeConceptos] = useState<{ value: number; label: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<any>(null);

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_URL_API_AUTO}Conceptos_auto/readConceptos`;
    axios
      .get(apiUrl)
      .then((response) => {
        const conceptosOptions = response.data.map((concepto: Concepto) => ({
          value: concepto.cod_concepto_dominio,
          label: concepto.des_concepto_dominio,
        }));
        setListaDeConceptos(conceptosOptions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const seleccionarConcepto = () => {
    if (selectedOption) {
      const nuevoConcepto = { ...concepto, cod_concepto_dominio: selectedOption.value };
      setConcepto(nuevoConcepto);
      setShowModal(false);
    }
  }


  const cancelar = () => {
    setShowModal(false);
  };

  return (
    <div className="overlay">
      <div className="modal-container">
        <h2>Busqueda de Concepto</h2>
        <hr />
        <Select
          className="seleccionadorCIP"
          options={listaDeConceptos}
          value={selectedOption}
          onChange={setSelectedOption}
          isSearchable={true}
          placeholder="Buscar..."
        />
        <div className="flex w-full justify-end col-span-12 lg:col-span-12 mt-5">
          <div className="col-span-12">
            <Button variant="primary" className="ml-3" onClick={seleccionarConcepto}>
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

export default SelectorDeConceptos;
