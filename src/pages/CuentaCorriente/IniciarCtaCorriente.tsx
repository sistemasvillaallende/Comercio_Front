import { useState, useEffect, ChangeEvent } from "react";
import Swal from "sweetalert2";
import {
  FormTextarea,
  FormLabel,
  FormInput,
  FormSelect,
} from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import { useUserContext } from "../../context/UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Cargando from "../Recursos/Cargando";
import {
  transformarFechaNuevoFormato,
  devolverFechaConGuiones,
  devolverVencimiento,
  devolverFechaConBarra
} from "../../utils/IycUtils";

interface Periodo {
  periodo: string;
  [key: string]: any;
}

const IniciarCtaCorriente = () => {
  const { dominio } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState<boolean>(false);

  const { elementoIndCom, traerElemento } = useIndustriaComercioContext();

  const [periodosExistentes, setPeriodosExistentes] = useState<Periodo[]>([]);
  const [periodosIncluidos, setPeriodosIncluidos] = useState<Periodo[]>([]);
  const [periodosSeleccionadosExistentes, setPeriodosSeleccionadosExistentes] =
    useState<string[]>([]);
  const [periodosSeleccionadosIncluidos, setPeriodosSeleccionadosIncluidos] =
    useState<string[]>([]);

  const moverPeriodoExistentesAIncluidos = () => {
    const nuevosPeriodosIncluidos = periodosExistentes.filter((periodo) =>
      periodosSeleccionadosExistentes.includes(periodo.periodo)
    );
    setPeriodosExistentes(
      periodosExistentes.filter(
        (periodo) => !periodosSeleccionadosExistentes.includes(periodo.periodo)
      )
    );
    setPeriodosIncluidos([...periodosIncluidos, ...nuevosPeriodosIncluidos]);
  };

  const moverPeriodoIncluidosAExistentes = () => {
    const nuevosPeriodosExistentes = periodosIncluidos.filter((periodo) =>
      periodosSeleccionadosIncluidos.includes(periodo.periodo)
    );
    setPeriodosIncluidos(
      periodosIncluidos.filter(
        (periodo) => !periodosSeleccionadosIncluidos.includes(periodo.periodo)
      )
    );
    setPeriodosExistentes([...periodosExistentes, ...nuevosPeriodosExistentes]);
  };

  const moverTodosExistentesAIncluidos = () => {
    setPeriodosIncluidos([...periodosIncluidos, ...periodosExistentes]);
    setPeriodosExistentes([]);
  };

  const moverTodosIncluidosAExistentes = () => {
    setPeriodosExistentes([...periodosExistentes, ...periodosIncluidos]);
    setPeriodosIncluidos([]);
  };

  const traerPeriodos = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/IniciarCtacte?legajo=${elementoIndCom?.legajo}`;
      const response = await axios.get(apiUrl);
      setPeriodosExistentes(response.data);
      setCargando(true);
      console.log(response.data)
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudieron traer los periodos",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
    }
  };

  useEffect(() => {
    traerPeriodos();
  }, []);

  const cancelar = () => {
    navigate(-1);
  };



  // Ejemplo de uso
  const cadenaFecha = "30/04/2021 12:00:00 a.m.";
  const fechaTransformada = transformarFechaNuevoFormato(cadenaFecha);

  const iniciarCtaCte = () => {
    const fechaActual = new Date();
    const lstCtasTes = periodosIncluidos.map((periodo) => {
      return {
        "tipo_transaccion": 1,
        "nro_transaccion": 1234,
        "nro_pago_parcial": 0,
        "legajo": 0,
        "fecha_transaccion": devolverFechaConGuiones(fechaActual),
        "periodo": periodo.periodo,
        "monto_original": 0,
        "nro_plan": 0,
        "pagado": true,
        "debe": 0,
        "haber": 0,
        "nro_procuracion": 0,
        "pago_parcial": true,
        "vencimiento": devolverVencimiento(periodo.vencimiento),
        "nro_cedulon": 0,
        "declaracion_jurada": true,
        "liquidacion_especial": true,
        "cod_cate_deuda": 0,
        "monto_pagado": 0,
        "recargo": 0,
        "honorarios": 0,
        "iva_hons": 0,
        "tipo_deuda": 0,
        "decreto": "string",
        "observaciones": "string",
        "nro_cedulon_paypertic": 0,
        "des_movimiento": "string",
        "des_categoria": "string",
        "deuda": 0,
        "sel": 0,
        "costo_financiero": 0,
        "des_rubro": "string",
        "cod_tipo_per": 0,
        "sub_total": 0
      }
    });

    const consulta =
    {
      "legajo": elementoIndCom?.legajo,
      "lstCtasTes": lstCtasTes,
      "auditoria": {
        "id_auditoria": 0,
        "fecha": devolverFechaConGuiones(fechaActual),
        "usuario": user?.userName,
        "proceso": "string",
        "identificacion": "string",
        "autorizaciones": "string",
        "observaciones": "Iniciar Cuenta Corriente",
        "detalle": "string",
        "ip": "string"
      }
    }
    console.log(consulta)
    const urlApi = `${import.meta.env.VITE_URL_BASE}Ctasctes_indycom/Confirma_iniciar_ctacte`;
    axios.post(urlApi, consulta)
      .then((response) => {
        if (response.data) {
          Swal.fire({
            title: "Éxito",
            text: "Se inició la cuenta corriente correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          });
          navigate(-1);
        } else {
          Swal.fire({
            title: "Error",
            text: "No se pudo iniciar la cuenta corriente",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: `Error: ${error.response.status}`,
          text: `${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });
        console.log(error);
      });
  }

  const handleChangeExistentes = (event: ChangeEvent<HTMLSelectElement>) => {
    setPeriodosSeleccionadosExistentes(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
  };

  const handleChangeIncluidos = (event: ChangeEvent<HTMLSelectElement>) => {
    setPeriodosSeleccionadosIncluidos(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
  };

  const formatearFecha = (fechaCompleta: string): string => {
    const [fecha, hora] = fechaCompleta.split(" ");
    const [dia, mes, anio] = fecha.split("/");
    const nuevaFecha = `${dia} / ${mes} / ${anio}`;
    return nuevaFecha;
  };

  return (
    <>
      <div className="conScroll grid grid-cols-12 gap-6 mt-5 ml-5 mr-4">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="grid grid-cols-12 gap-6 mt-3">
            <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
              <h2>Iniciar Cuenta Corriente</h2>
              <h2>Legajo: {elementoIndCom?.legajo}</h2>
            </div>
            {!cargando && (
              <Cargando mensaje="cargando los periodos" />
            )}
            {cargando && (
              <>
                <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-6">
                  <div className="col-span-12 intro-y lg:col-span-2">
                    <div className="col-span-12 intro-y lg:col-span-4">
                      <FormLabel htmlFor="dominio-input" className="sm:w-50">
                        Periodos Existentes
                      </FormLabel>
                      <div className="col-span-12 intro-y lg:col-span-2">
                        <select
                          multiple={true}
                          onChange={handleChangeExistentes}
                          value={periodosSeleccionadosExistentes}
                          className="selectorDePeriodos"
                        >
                          {periodosExistentes.map((periodo: Periodo) => (
                            <option
                              key={periodo.periodo}
                              value={periodo.periodo}
                            >
                              {periodo.periodo}
                              {" - "}
                              {formatearFecha(periodo.vencimiento)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 intro-y lg:col-span-2 mt-7">
                    <Button
                      variant="primary"
                      className="ml-3 mb-2"
                      onClick={moverPeriodoExistentesAIncluidos}
                    >
                      {">"}
                    </Button>
                    <br />
                    <Button
                      variant="primary"
                      className="ml-3 mb-2"
                      onClick={moverPeriodoIncluidosAExistentes}
                    >
                      {"<"}
                    </Button>
                    <br />
                    <Button
                      variant="primary"
                      className="ml-3 mb-2"
                      onClick={moverTodosExistentesAIncluidos}
                    >
                      {">>"}
                    </Button>
                    <br />
                    <Button
                      variant="primary"
                      className="ml-3"
                      onClick={moverTodosIncluidosAExistentes}
                    >
                      {"<<"}
                    </Button>
                  </div>
                  <div className="col-span-12 intro-y lg:col-span-4">
                    <div className="col-span-12 intro-y lg:col-span-2">
                      <FormLabel htmlFor="dominio-input" className="sm:w-50">
                        Periodos Incluidos
                      </FormLabel>
                      <div className="col-span-12 intro-y lg:col-span-4">
                        <select
                          multiple={true}
                          onChange={handleChangeIncluidos}
                          value={periodosSeleccionadosIncluidos}
                          className="selectorDePeriodos"
                        >
                          {periodosIncluidos.map((periodo: Periodo) => (
                            <option
                              key={periodo.periodo}
                              value={periodo.periodo}
                            >
                              {periodo.periodo}
                              {" - "}
                              {formatearFecha(periodo.vencimiento)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 intro-y lg:col-span-12">
                  <Button
                    variant="primary"
                    className="ml-3"
                    onClick={iniciarCtaCte}
                  >
                    Confirmar
                  </Button>
                  <Button
                    variant="secondary"
                    className="ml-3"
                    onClick={cancelar}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IniciarCtaCorriente;
