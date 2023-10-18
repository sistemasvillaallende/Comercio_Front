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