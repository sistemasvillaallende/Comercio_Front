import React from "react";

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
  const fecha = new Date(cadenaFecha);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia} ${mes}, ${anio}`;
}

export const convertirFechaNuevo = (cadenaFecha:string)=> {
  // Crear un objeto Date desde la cadena de fecha
  const fecha = new Date(cadenaFecha);

  // Obtener los componentes de fecha
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');

  // Obtener los componentes de tiempo
  const hours = String(fecha.getHours()).padStart(2, '0');
  const minutes = String(fecha.getMinutes()).padStart(2, '0');
  const seconds = String(fecha.getSeconds()).padStart(2, '0');
  const milliseconds = fecha.getMilliseconds();

  // Formatear la fecha en el nuevo formato
  const fechaFormateada = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

  return fechaFormateada;
}