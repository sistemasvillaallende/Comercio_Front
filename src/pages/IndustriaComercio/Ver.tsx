import { useEffect, useState } from "react";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import { ElementoIndustriaComercio } from "../../interfaces/IndustriaComercio";
import { convertirFecha } from "../../utils/GeneralUtils";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ver = () => {
  const { elementoIndCom, tipoLiquidacion, tipoCondicionIVA, situacionJudicial, tipoDeEntidad, traerElemento } = useIndustriaComercioContext();
  const [elementoIndustriaComercio, setElementoIndustriaComercio] = useState<ElementoIndustriaComercio>();
  const { legajo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (legajo !== elementoIndCom?.legajo.toString()) {
      buscarElemento(legajo || "");
    } else {
      setElementoIndustriaComercio(elementoIndCom || undefined);
    }
  }, [elementoIndCom, legajo]);

  useEffect(() => {
    traerElemento(legajo?.toString() ?? '');
  }, [])

  const buscarElemento = async (legajo: string) => {
    const URL = `${import.meta.env.VITE_URL_BASE}Indycom/GetIndycomPaginado?buscarPor=legajo&strParametro=${legajo}&pagina=1&registros_por_pagina=5`;
    const response = await fetch(URL);
    const data = await response.json();
    setElementoIndustriaComercio(data.resultado[0]);
    traerElemento(legajo.toString());

    if (data.resultado.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Al parecer no hay datos para mostrar, por favor intente con otros parámetros.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      navigate(`/`);
    }
  }


  return (
    <div className="paginas">
      <div className="conScroll grid grid-cols-12 gap-6 mt-2 ml-3 mr-4 p-2">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Datos del Comercio o Industria</h2>
          </div>
          <div className="flex flex-wrap">

            <div className="cuadroInformacion">
              <div className="elementCuadro">
                <p>Legajo: <strong>{elementoIndustriaComercio?.legajo}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Nro. Expediente: <strong>{elementoIndustriaComercio?.nro_exp_mesa_ent}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Fecha Alta: <strong>{elementoIndustriaComercio?.fecha_alta && convertirFecha(elementoIndustriaComercio?.fecha_alta)}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Nombre de Fantasía: <strong>{elementoIndustriaComercio?.nom_fantasia}</strong></p>
              </div>
            </div>

            <div className="cuadroInformacion">
              <div className="elementCuadro">
                <p>Descripcion: <strong>{elementoIndustriaComercio?.des_com}</strong></p>
              </div>
              <div className="elementCuadro">
                <p> Badec: <strong>{elementoIndustriaComercio?.nro_bad}</strong></p>
              </div>
            </div>

            <div className="col-span-12 intro-y lg:col-span-12">
              <h2>Datos del Domicilio</h2>
            </div>

            <div className="cuadroInformacion">
              <div className="elementCuadro">
                <p>Calle: <strong>{elementoIndustriaComercio?.nom_calle.trim()}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Nro. Dom: <strong>{elementoIndustriaComercio?.nro_dom}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Piso: {elementoIndustriaComercio?.piso_dpto_esp}</p>
              </div>
              <div className="elementCuadro">
                <p>Nro. Local: <strong>{elementoIndustriaComercio?.nro_local}</strong></p>
              </div>
            </div>

            <div className="cuadroInformacion">
              <div className="elementCuadro">
                <p>Barrio: <strong>{elementoIndustriaComercio?.nom_barrio_dom_esp.trim()}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Zona: <strong>{elementoIndustriaComercio?.cod_zona}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Zona Liq.<strong>{elementoIndustriaComercio?.cod_zona_liquidacion}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Ciudad:<strong>{elementoIndustriaComercio?.ciudad.trim()}</strong></p>
              </div>
            </div>

            <div className="col-span-12 intro-y lg:col-span-12">
              <h2>Datos de Liquidación</h2>
            </div>

            <div className="cuadroInformacion">
              <div className="elementCuadro">
                <p>Tipo de Liquidación: <strong>{tipoLiquidacion?.descripcion_tipo_liq}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Primer Periodo: <strong>{elementoIndustriaComercio?.pri_periodo}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Último Periodo.<strong>{elementoIndustriaComercio?.per_ult}</strong></p>
              </div>
            </div>

            <div className="cuadroInformacion">
              <div className="elementCuadro">
                <p>CUIT: <strong>{elementoIndustriaComercio?.nro_cuit}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>CUIT VD: <strong>{elementoIndustriaComercio?.cuit_vecino_digital}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Transporte: <strong>{elementoIndustriaComercio?.transporte ? "Si" : "No"}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Exento: <strong>{elementoIndustriaComercio?.exento ? "Si" : "No"}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Caracter de la Entidad: <strong>{tipoDeEntidad?.text ? tipoDeEntidad?.text : "No definido"}</strong></p>
              </div>
            </div>

            <div className="cuadroInformacion">
              <div className="elementCuadro">
                <p>Condición Frente al IVA: <strong>{tipoCondicionIVA?.des_cond_ante_iva}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Ingresos Brutos: <strong>{elementoIndustriaComercio?.nro_ing_bruto}</strong></p>
              </div>
            </div>

            <div className="cuadroInformacion">
              <div className="elementCuadro">
                <p>Fecha Inicio: <strong>{elementoIndustriaComercio?.fecha_inicio && convertirFecha(elementoIndustriaComercio?.fecha_inicio)}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Fecha Habilitación: <strong>{elementoIndustriaComercio?.fecha_hab && convertirFecha(elementoIndustriaComercio?.fecha_hab)}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Vto. Inscrip: <strong>{elementoIndustriaComercio?.vto_inscripcion && convertirFecha(elementoIndustriaComercio?.vto_inscripcion)}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Fecha Baja: <strong>{elementoIndustriaComercio?.fecha_baja && convertirFecha(elementoIndustriaComercio?.fecha_baja)}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Baja: <strong>{elementoIndustriaComercio?.dado_baja ? "Si" : "No"}</strong></p>
              </div>
            </div>

            <div className="cuadroInformacion">
              <div className="elementCuadro">
                <p>Situación Comercio: <strong>{situacionJudicial?.text}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Fecha DDJJ: <strong>{elementoIndustriaComercio?.fecha_ddjj_anual && convertirFecha(elementoIndustriaComercio?.fecha_ddjj_anual)}</strong></p>
              </div>
            </div>

            <div className="col-span-12 intro-y lg:col-span-12">
              <h2>Entrega Cedulón</h2>
            </div>

            <div className="cuadroInformacion">
              <div className="elementCuadro">
                <p>Emite Cedulón: <strong>{elementoIndustriaComercio?.emite_cedulon ? "Si" : "No"}</strong></p>
              </div>
              <div className="elementCuadro">
                <p>Vereda Ocupad: <strong>{elementoIndustriaComercio?.ocupacion_vereda ? "Si" : "No"}</strong></p>
              </div>
            </div>

          </div>
        </div>
      </div >
    </div>
  )
}

export default ver