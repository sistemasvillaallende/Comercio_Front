import { useState, useEffect, ChangeEvent } from "react";
import Swal from "sweetalert2";
import {
  FormTextarea,
  FormLabel,
  FormInput,
  FormSelect,
} from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useAutoContext } from "../../context/AutoProvider";
import { useUserContext } from "../../context/UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Cargando from "../Recursos/Cargando";

interface Periodo {
  periodo: string;
  [key: string]: any;
}

const IniciarCtaCorriente = () => {
  const { dominio } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState<boolean>(false);

  const { vehiculo, traerAuto } = useAutoContext();

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
      const apiUrl = `${import.meta.env.VITE_URL_CTACTE}IniciarCtacte?dominio=${vehiculo?.dominio}`;
      const response = await axios.get(apiUrl);
      setPeriodosExistentes(response.data);
      setCargando(true);
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

  const devolverFechaActual = () => {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    const diaFormateado = dia < 10 ? '0' + dia : dia;
    const mesFormateado = mes < 10 ? '0' + mes : mes;
    const fechaActualString = `${diaFormateado}/${mesFormateado}/${anio}`;
    return fechaActualString;
  }

  const devolverVencimiento = (fecha: string) => {
    const fechaFormateada = formatearFecha(fecha)
    const dia = fechaFormateada.split('/')[0];
    const mes = fechaFormateada.split('/')[1];
    const anio = fechaFormateada.split('/')[2];
    return `${anio}-${mes}-${dia}T00:00:00.000Z`
  }

  const iniciarCtaCte = () => {
    const fechaActual = new Date();
    const lstCtasTes = periodosIncluidos.map((periodo) => {
      return {
        "tipo_transaccion": 0,
        "nro_transaccion": 0,
        "nro_pago_parcial": 0,
        "dominio": "string",
        "fecha_transaccion": fechaActual.toISOString(),
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
        "categoria_deuda": 0,
        "monto_pagado": 0,
        "recargo": 0,
        "honorarios": 0,
        "iva_hons": 0,
        "tipo_deuda": 0,
        "decreto": "",
        "observaciones": "",
        "nro_cedulon_paypertic": 0,
        "deuda_activa": 0,
        "des_movimiento": "",
        "des_categoria": "",
        "deuda": 0,
        "sel": 0,
        "costo_financiero": 0,
        "des_rubro": "",
        "cod_tipo_per": 0,
        "sub_total": 0
      }
    });

    const consulta =
    {
      "dominio": vehiculo?.dominio,
      "lstCtasTes": lstCtasTes,
      "auditoria": {
        "id_auditoria": 0,
        "fecha": devolverFechaActual(),
        "usuario": "prueba",
        "proceso": "",
        "identificacion": "",
        "autorizaciones": "",
        "observaciones": "",
        "detalle": "",
        "ip": ""
      }
    }
    console.log(consulta)
    const urlApi = `${import.meta.env.VITE_URL_CTACTE}Confirma_iniciar_ctacte`;
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
          title: "Error 500",
          text: "No se pudo iniciar la cuenta corriente por un error interno en el servidor",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });
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
    const nuevaFecha = `${dia}/${mes}/${anio}`;
    return nuevaFecha;
  };

  return (
    <>
      <div className="conScroll grid grid-cols-12 gap-6 mt-5 ml-5 mr-4">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="grid grid-cols-12 gap-6 mt-3">
            <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
              <h2>Iniciar Cuenta Corriente</h2>
              <h2>Dominio: {vehiculo?.dominio}</h2>
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
