import { ConceptoDeAuto, Concepto } from '../../interfaces/Vehiculo';
import { useState, useEffect } from 'react';
import Litepicker from "../../base-components/Litepicker";
import {
  FormInput,
  FormLabel,
} from "../../base-components/Form";
import Lucide from '../../base-components/Lucide';
import axios from 'axios';
import Button from "../../base-components/Button";
import Swal from "sweetalert2";
import Select from "react-select";
import { useAutoContext } from '../../context/AutoProvider';
import { useUserContext } from '../../context/UserProvider';
import { fechaActual, convertirFechaReglones, convertirFechaTexto } from '../../utils/AutosUtils';

const EditarConcepto = (props: any) => {
  const { vehiculo } = useAutoContext();
  const { user } = useUserContext();
  const { concepto, setConcepto, obtenerConceptosPorAuto } = props;
  const [descripcionConceptoDominio, setDescripcionConceptoDominio] = useState<string>();
  const [porcentaje, setPorcentaje] = useState<number>();
  const [vencimiento, setVencimiento] = useState("");
  const [monto, setMonto] = useState<number>();
  const [nro_decreto, setNro_decreto] = useState<number>();
  const [listaDeConceptos, setListaDeConceptos] = useState<{ value: number; label: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [codConceptoDominio, setCodConceptoDominio] = useState<number>();

  useEffect(() => {
    setDescripcionConceptoDominio(concepto?.des_concepto_dominio);
    setPorcentaje(concepto?.porcentaje);
    setVencimiento(concepto?.vencimiento);
    setMonto(concepto?.monto);
    setNro_decreto(concepto?.nro_decreto);
    setCodConceptoDominio(concepto?.cod_concepto_dominio);
    setVencimiento(convertirFechaTexto(concepto?.vencimiento as string));

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

  }, [concepto])

  const handleChangePorcentaje = (e: any) => {
    setPorcentaje(e.target.value);
  }

  const handleChangeVencimiento = (e: any) => {
    console.log(e)
    setVencimiento(e);
  }

  const handleChangeMonto = (e: any) => {
    setMonto(e.target.value);
  }

  const handleChangeNro_decreto = (e: any) => {
    setNro_decreto(e.target.value);
  }

  const handleCancelar = () => {
    setConcepto(undefined)
  }

  const cambiarConcepto = () => {
    console.log('cambiar concepto')
  }

  const handleAuditoria = async () => {
    const { value } = await Swal.fire({
      title: 'Autorización',
      input: 'textarea',
      inputPlaceholder: 'Observaciones',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: "#27a3cf",
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar un texto para continuar';
        }
      },
    });

    if (value) {
      handleGuardarConcepto(value);
    }
  }

  const handleGuardarConcepto = (auditoria: string) => {
    const apiUrl = `${import.meta.env.VITE_URL_API_AUTO}Conceptos_auto/UpdateConcepto?usuario=${user?.userName}`;
    const matriculaSinEspacios = vehiculo?.dominio?.replace(/\s/g, '');
    const vencimientoFecha = convertirFechaReglones(vencimiento as string)
    const data = {
      "dominio": matriculaSinEspacios,
      "cod_concepto_dominio": codConceptoDominio,
      "porcentaje": porcentaje,
      "monto": monto,
      "vencimiento": vencimientoFecha,
      "nro_decreto": nro_decreto,
      "fecha_alta": "2023-10-04",
      "activo": 0,
      "anio_desde": 0,
      "anio_hasta": 0,
      "observaciones": "string",
      "objAuditoria": {
        "id_auditoria": 0,
        "fecha": fechaActual(),
        "usuario": "string",
        "proceso": "string",
        "identificacion": "string",
        "autorizaciones": "string",
        "observaciones": auditoria,
        "detalle": "string",
        "ip": "string"
      }
    }
    console.log(data)
    axios
      .post(apiUrl, data)
      .then((response) => {
        Swal.fire({
          title: `Concepto editado correctamente`,
          icon: `success`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
        setConcepto(undefined);
        obtenerConceptosPorAuto();
        console.log(response.data);
      })
      .catch((error) => {
        Swal.fire({
          title: error.code,
          text: error.message,
          icon: `error`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
        console.log(error);
      });
  }

  return (
    <>
      <div className="overlayConcepto">
        <div className="modalContainerConcepto">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 intro-y lg:col-span-12">
              <FormLabel htmlFor="seleccionadorConcepto">EDITAR CONCEPTO</FormLabel>
              <Select
                className="seleccionadorConcepto"
                options={listaDeConceptos}
                value={selectedOption}
                onChange={setSelectedOption}
                isSearchable={true}
                placeholder={descripcionConceptoDominio}
                isDisabled={true}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-5">
              <FormLabel htmlFor="formMarca">Porcentaje</FormLabel>
              <FormInput
                id="formPorcentaje"
                type="number"
                value={porcentaje}
                onChange={handleChangePorcentaje}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-7">
              <FormLabel htmlFor="formAnio">Vencimiento</FormLabel>
              <Litepicker
                value={vencimiento}
                onChange={handleChangeVencimiento}
                options={{
                  autoApply: false,
                  showWeekNumbers: true,
                  dropdowns: {
                    minYear: 1990,
                    maxYear: null,
                    months: true,
                    years: true,
                  },
                }}
                className="pl-12"
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-6">
              <FormLabel htmlFor="fomrDominio">Monto</FormLabel>
              <FormInput
                id="fomrMonto"
                type="number"
                value={monto}
                onChange={handleChangeMonto}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-6">
              <FormLabel htmlFor="fomrDominio">Decreto</FormLabel>
              <FormInput
                id="fomrDecreto"
                type="number"
                value={nro_decreto}
                onChange={handleChangeNro_decreto}
              />
            </div>
            <Button variant="primary" className="mt-2 mb-3 lg:col-span-6" onClick={() => handleAuditoria()}>
              <Lucide icon="Save" className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button variant="warning" className="mt-2 mb-3 lg:col-span-6" onClick={() => handleCancelar()}>
              <Lucide icon="X" className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditarConcepto