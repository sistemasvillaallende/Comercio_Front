import React from "react";

export   const getSituacion = (codSituacionJudicial: number) => {
  switch (codSituacionJudicial) {
    case 1:
      return "Normal";
    case 2:
      return "Judicial";
    case 3:
      return "Administrativa prejudicial";
    case 4:
      return "Administrativa judicializada";
    default:
      return "Desconocido";
  }
};

export const getUltimoPeriodo = (perUlt: any) => {
  if (perUlt) {
    if (perUlt.match(/^\d{4}\/\d{2}$/)) {
      const [anio, mes] = perUlt.split("/");
      return `${mes}/${anio}`;
    } else {
      return perUlt;
    }
  } else {
    return "N/A";
  }
};

export const convertirFecha = (cadenaFecha: string) => {
  const fecha = new Date(cadenaFecha);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

export const fechaActual = () => {
  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
  const anio = fecha.getFullYear();
  return `${anio}-${mes}-${dia}`;
}

export const convertirFechaReglones = (cadenaFecha: string) => {
  const fecha = new Date(cadenaFecha);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
  const anio = fecha.getFullYear();
  return `${anio}-${mes}-${dia}`;
}

export const convertirFechaTexto = (cadenaFecha: string) => {
  //convertit en formato 11 Oct, 2023
  const fecha = new Date(cadenaFecha);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia} ${mes}, ${anio}`;
}