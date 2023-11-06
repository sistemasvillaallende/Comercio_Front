import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ElementoIndustriaComercio,
  TiposLiqIyc,
  CondicionesDeIVA,
  SituacionesJudiciales,
  TipoDeEntidad,
  Zonas
} from "../interfaces/IndustriaComercio";

type IndustriaComercioContextType = {
  elementoIndCom: ElementoIndustriaComercio | null;
  setElementoIndCom: (industriaComercio: ElementoIndustriaComercio | null) => void;
  traerElemento: (legajo: string) => void;
  tipoLiquidacion?: TiposLiqIyc;
  tipoCondicionIVA?: CondicionesDeIVA;
  situacionJudicial?: SituacionesJudiciales;
  tipoDeEntidad?: TipoDeEntidad;
  listadoTipoLiquidacion: TiposLiqIyc[];
  listadoTipoDeEntidad: TipoDeEntidad[];
  listadoTipoCondicionIVA: CondicionesDeIVA[];
  listadoSituacionJudicial: SituacionesJudiciales[];
  listadoZonas: Zonas[];
};

const IndustriaComercioContext = createContext<IndustriaComercioContextType>({
  elementoIndCom: null,
  setElementoIndCom: () => { },
  traerElemento: () => { },
  tipoLiquidacion: undefined,
  tipoCondicionIVA: undefined,
  situacionJudicial: undefined,
  tipoDeEntidad: undefined,
  listadoTipoLiquidacion: [],
  listadoTipoDeEntidad: [],
  listadoTipoCondicionIVA: [],
  listadoSituacionJudicial: [],
  listadoZonas: []
});

export function useIndustriaComercioContext() {
  return useContext(IndustriaComercioContext);
}

export function IndustriaComercioProvider({ children }: any) {
  const [elementoIndCom, setElementoIndCom] = useState<ElementoIndustriaComercio | null>(null);
  const [tipoLiquidacion, setTipoLiquidacion] = useState<TiposLiqIyc>();
  const [tipoCondicionIVA, setTipoCondicionIVA] = useState<CondicionesDeIVA>();
  const [listadoTipoCondicionIVA, setListadoTipoCondicionIVA] = useState<CondicionesDeIVA[]>([]);
  const [situacionJudicial, setSituacionJudicial] = useState<SituacionesJudiciales>();
  const [listadoSituacionJudicial, setListadoSituacionJudicial] = useState<SituacionesJudiciales[]>([]);
  const [tipoDeEntidad, setTipoDeEntidad] = useState<TipoDeEntidad>();
  const [listadoTipoLiquidacion, setListadoTipoLiquidacion] = useState<TiposLiqIyc[]>([]);
  const [listadoTipoDeEntidad, setListadoTipoDeEntidad] = useState<TipoDeEntidad[]>([]);
  const [listadoZonas, setListadoZonas] = useState<Zonas[]>([]);

  const traerElemento = async (legajo: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API_IYC}Indycom/GetIndycomPaginado?buscarPor=legajo&strParametro=${legajo}&pagina=1&registros_por_pagina=10`
      );
      if (response.data.resultado.length > 0) {
        setElementoIndCom(response.data.resultado[0]);
        traerTipoLiquidacion(response.data.resultado[0].tipo_liquidacion);
        traerTipoCondicionIVA(response.data.resultado[0].tipo_cond_iva);
        traerSituacionJudicial(response.data.resultado[0].cod_situacion_judicial);
        traerCaracterDeLaEntidad(response.data.resultado[0].cod_caracter);
        traerListaDeZonzas();
      } else {
        setElementoIndCom(null);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al buscar el Elemento",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
    }
  };

  const traerTipoLiquidacion = async (tipo: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API_IYC}Indycom/Tipos_liq_iyc`
      );
      const tipoLiquidacion = response.data.find((tipoLiq: TiposLiqIyc) => tipoLiq.cod_tipo_liq === tipo);
      setTipoLiquidacion(tipoLiquidacion)
      setListadoTipoLiquidacion(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const traerTipoCondicionIVA = async (tipo: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API_IYC}Indycom/Tipos_iva`
      );
      const codCondAnteIVA = response.data.find((tipoIVA: any) => tipoIVA.cod_tipo_iva === tipo);
      setTipoCondicionIVA(codCondAnteIVA)
      setListadoTipoCondicionIVA(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const traerSituacionJudicial = async (codigo: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API_IYC}Indycom/Situacion_judicial`
      );
      const situacionJudicialCodigo = response.data.find((item: SituacionesJudiciales) => Number(item.value) === codigo);
      setSituacionJudicial(situacionJudicialCodigo)
      setListadoSituacionJudicial(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const traerCaracterDeLaEntidad = async (codigo: number) => {
    try {
      const codigoString = codigo.toString();
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API_IYC}Indycom/Tipos_entidad`
      );
      const tipoDeEntidadCodigo = response.data.find((item: TipoDeEntidad) => item.value === codigoString);
      setTipoDeEntidad(tipoDeEntidadCodigo);
      setListadoTipoDeEntidad(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const traerListaDeZonzas = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API_IYC}Indycom/Zonasiyc`
      );
      setListadoZonas(response.data);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <IndustriaComercioContext.Provider
      value={{
        elementoIndCom,
        setElementoIndCom,
        traerElemento,
        tipoLiquidacion,
        tipoCondicionIVA,
        situacionJudicial,
        tipoDeEntidad,
        listadoTipoLiquidacion,
        listadoTipoDeEntidad,
        listadoTipoCondicionIVA,
        listadoSituacionJudicial,
        listadoZonas
      }}>
      {children}
    </IndustriaComercioContext.Provider>
  );
}
