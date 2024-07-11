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

export const formatDateToISOStringWithMilliseconds = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Añade ceros iniciales si es necesario
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export const devolverFechaConGuiones = (fechaActual: Date) => {
  const anio = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1; // getMonth() devuelve un índice basado en cero, por lo que sumamos 1.
  const dia = fechaActual.getDate();
  const horas = fechaActual.getHours();
  const minutos = fechaActual.getMinutes();
  const segundos = fechaActual.getSeconds();
  const milisegundos = fechaActual.getMilliseconds();

  // Formatear a dos dígitos
  const mesFormateado = mes < 10 ? `0${mes}` : mes;
  const diaFormateado = dia < 10 ? `0${dia}` : dia;
  const horasFormateadas = horas < 10 ? `0${horas}` : horas;
  const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;
  const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;
  // Asegurar que los milisegundos sean siempre tres dígitos
  const milisegundosFormateados = milisegundos.toString().padStart(3, '0');
  console.log(`${anio}-${mesFormateado}-${diaFormateado}T${horasFormateadas}:${minutosFormateados}:${segundosFormateados}.${milisegundosFormateados}Z`);
  return `${anio}-${mesFormateado}-${diaFormateado}T${horasFormateadas}:${minutosFormateados}:${segundosFormateados}.${milisegundosFormateados}Z`;
}

const formatearFecha = (fechaCompleta: string): string => {
  const [fecha, hora] = fechaCompleta.split(" ");
  const [dia, mes, anio] = fecha.split("/");
  const nuevaFecha = `${dia}/${mes}/${anio}`;
  return nuevaFecha;
};

export const devolverVencimiento = (fecha: string) => {
  const fechaFormateada = formatearFecha(fecha);
  const partesFecha = fechaFormateada.split('/');

  // Asegurarse de que partesFecha tiene exactamente 3 partes (día, mes, año)
  if (partesFecha.length !== 3) {
    throw new Error('Formato de fecha incorrecto');
  }

  const dia = partesFecha[0];
  const mes = partesFecha[1];
  const anio = partesFecha[2];

  // Asegurarse de que día y mes sean siempre dos dígitos
  const mesFormateado = mes.length === 1 ? `0${mes}` : mes;
  const diaFormateado = dia.length === 1 ? `0${dia}` : dia;

  return `${anio}-${mesFormateado}-${diaFormateado}T00:00:00.000Z`;
};

const devolverFechaConBarra = (fechaActual: Date) => {
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1;
  const anio = fechaActual.getFullYear();
  const diaFormateado = dia < 10 ? '0' + dia : dia;
  const mesFormateado = mes < 10 ? '0' + mes : mes;
  const fechaActualString = `${diaFormateado}/${mesFormateado}/${anio}`;
  return fechaActualString;
}

export const transformarFechaNuevoFormato = (cadenaFecha: string) => {
  const partes = cadenaFecha.split(' ');
  // Tomar la primera parte que contiene la fecha
  const fechaParte = partes[0];
  // Dividir la fecha en día, mes y año
  const [dia, mes, anio] = fechaParte.split('/');
  // Formatear la fecha como AAAA-MM-DD
  const fechaFormateada = `${anio}-${mes}-${dia}T00:00:00.000Z`;
  return fechaFormateada;

}