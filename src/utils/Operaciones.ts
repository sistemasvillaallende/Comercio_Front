import React from 'react'

export const formatNumberToARS = (number: number) => {
  const formattedNumber = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(number);

  return formattedNumber;
};

export const formatDateToDDMMYYYY = (isoDate: string): string => {
  const date = new Date(isoDate);
  
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};