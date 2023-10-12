import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Vehiculo } from "../interfaces/Vehiculo";
import { SituacionesDeVehiculos } from "../interfaces/SituacionesDeVehiculos";
import { TiposDeVehiculos } from "../interfaces/TiposDeVehiculos";
import { TiposDeDocumentos } from "../interfaces/TiposDeDocumentos";

type AutoContextType = {
  vehiculo: Vehiculo | null;
  traerAuto: (dominio: string) => void;
  setVehiculo: (vehiculo: Vehiculo) => void;
  tiposDeDocumentos: TiposDeDocumentos | null;
  situacionesDeVehiculo: SituacionesDeVehiculos | null;
  verCodigoDeAlta: () => any;
  verSexo: () => any;
  verTipoDeLiquidacion: () => any;
  verNroRegistroDelAutomotor: () => any;
  tiposDeVehiculos: TiposDeVehiculos | null;
};

const autoContext = createContext<AutoContextType>({
  vehiculo: null,
  traerAuto: () => {},
  setVehiculo: () => {},
  tiposDeDocumentos: null,
  situacionesDeVehiculo: null,
  verCodigoDeAlta: () => {},
  verSexo: () => {},
  verTipoDeLiquidacion: () => {},
  verNroRegistroDelAutomotor: () => {},
  tiposDeVehiculos: null,
});

export function useAutoContext() {
  return useContext(autoContext);
}

const verCodigoDeAlta = () => {
  return [
    { id: 301, nombre: "Alta 0 Km" },
    { id: 351, nombre: "Alta por Cmbio Radic." },
  ];
};

const verSexo = () => {
  return [
    { id: "M", nombre: "Masculino" },
    { id: "F", nombre: "Femenino" },
    { id: "J", nombre: "Persona Jurídica" },
  ];
};

const verTipoDeLiquidacion = () => {
  return [
    { id: 1, nombre: "Mensual" },
    { id: 5, nombre: "Semestral" },
    { id: 6, nombre: "Bimestral" },
  ];
};

const verNroRegistroDelAutomotor = () => {
  return [
    { id: 1, nombre: "1" },
    { id: 2, nombre: "2" },
  ];
};

export function AutoProvider({ children }: any) {
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [situacionesDeVehiculo, setSituacionDelVehiculo] =
    useState<SituacionesDeVehiculos | null>(null);
  const [tiposDeVehiculos, setTiposDeVehiculos] =
    useState<TiposDeVehiculos | null>(null);
  const [tiposDeDocumentos, setTiposDeDocumentos] =
    useState<TiposDeDocumentos | null>(null);

  const traerAuto = async (dominio: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_AUTO}GetAutoByDominio?dominio=${dominio}`
      );
      setVehiculo(response.data);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al buscar el Vehículo",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
    }
  };

  const traerSitiaciones = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_AUTO}Situacion_judicial`
      );
      setSituacionDelVehiculo(response.data);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al traer las situaciones judiciales",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
      console.log(error);
    }
  };

  const traerTiposDeVehiculos = async () => {
    try {
      const responde = await axios.get(
        `${import.meta.env.VITE_URL_AUTO}Tipos_vehiculos`
      );
      setTiposDeVehiculos(responde.data);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al traer los tipos de vehiculos",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
      console.log(error);
    }
  };

  const traerTiposDeDocumentos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_AUTO}Tipos_documentos`
      );
      setTiposDeDocumentos(response.data);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al traer los tipos de documentos",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    traerSitiaciones();
    traerTiposDeVehiculos();
    traerTiposDeDocumentos();
  }, []);

  return (
    <autoContext.Provider
      value={{
        traerAuto,
        tiposDeVehiculos,
        tiposDeDocumentos,
        vehiculo,
        setVehiculo,
        situacionesDeVehiculo,
        verCodigoDeAlta,
        verSexo,
        verTipoDeLiquidacion,
        verNroRegistroDelAutomotor,
      }}
    >
      {children}
    </autoContext.Provider>
  );
}
