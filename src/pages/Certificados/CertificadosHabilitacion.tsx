import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DataTable, { TableColumn } from "react-data-table-component";
import Swal from "sweetalert2";
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import Lucide from "../../base-components/Lucide";
import logo2 from "../../assets/logo2.png";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";

interface CertificadoPrincipal {
  certificado: string;
  anioCertificado: number;
  legajo: number;
  codRubro: number;
  desCom: string;
  emision: string;
  vtoCertificado: string;
  url: string;
  qr: string;
}

interface CertificadoSucursal {
  certificado: string;
  anioCertificado: number;
  legajo: number;
  nroSucursal: number;
  codRubro: number;
  desCom: string;
  emision: string;
  vtoCertificado: string;
  url: string;
  qr: string;
}

const CertificadosHabilitacion = () => {
  const { legajo } = useParams<{ legajo: string }>();
  const { elementoIndCom } = useIndustriaComercioContext();
  const [certificadosPrincipal, setCertificadosPrincipal] = useState<CertificadoPrincipal[]>([]);
  const [certificadosSucursal, setCertificadosSucursal] = useState<CertificadoSucursal[]>([]);
  const [cargandoPrincipal, setCargandoPrincipal] = useState<boolean>(true);
  const [cargandoSucursal, setCargandoSucursal] = useState<boolean>(true);

  const generarPDFCertificado = async (certificado: CertificadoPrincipal | CertificadoSucursal, esSucursal: boolean = false) => {
    try {
      // Obtener datos completos del certificado desde el endpoint
      let datosCertificado: any = null;
      let datosComercio: any = null;

      try {
        // Obtener datos del certificado
        const endpointCertificado = esSucursal
          ? `http://10.0.0.24/webapiiyc24/Certificado_habilitacion/GetSucursalByLegajo?legajo=${certificado.legajo}`
          : `http://10.0.0.24/webapiiyc24/Certificado_habilitacion/GetPrincipalByLegajo?legajo=${certificado.legajo}`;

        const responseCertificado = await axios.get(endpointCertificado);
        const datosCert = responseCertificado.data;

        // Buscar el certificado específico en la respuesta
        if (Array.isArray(datosCert)) {
          datosCertificado = datosCert.find(cert => cert.certificado === certificado.certificado);
        } else {
          datosCertificado = datosCert;
        }

        // Obtener datos completos del comercio
        const endpointComercio = `${import.meta.env.VITE_URL_BASE}Indycom/GetIndycomPaginado?buscarPor=legajo&strParametro=${certificado.legajo}&pagina=1&registros_por_pagina=1`;
        const responseComercio = await axios.get(endpointComercio);

        if (responseComercio.data && responseComercio.data.resultado && responseComercio.data.resultado.length > 0) {
          datosComercio = responseComercio.data.resultado[0];
        }

      } catch (error) {
        console.warn('No se pudieron obtener datos del certificado o comercio:', error);
        datosCertificado = certificado; // Usar los datos básicos como fallback
      }

      // Si no se obtuvieron datos, usar valores por defecto
      if (!datosCertificado) {
        datosCertificado = certificado;
      }

      // Crear el PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Añadir logo de la municipalidad con proporciones correctas
      try {
        const logoImg = new Image();
        logoImg.src = logo2;
        await new Promise((resolve) => {
          logoImg.onload = resolve;
        });

        // Mantener proporciones del logo - asumiendo que es más ancho que alto
        const logoWidth = 40;
        const logoHeight = 25; // Ajustar según la proporción real del logo
        pdf.addImage(logoImg, 'PNG', 20, 15, logoWidth, logoHeight);
      } catch (error) {
        console.warn('No se pudo cargar el logo:', error);
      }

      // Título principal - posicionado al lado del logo
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('CERTIFICADO DE HABILITACIÓN COMERCIAL', 70, 25);

      // Estado - con mejor posicionamiento
      pdf.setFontSize(12);
      pdf.setTextColor(0, 128, 0); // Verde
      pdf.setFont('helvetica', 'bold');
      pdf.text('Estado: CERTIFICADO VIGENTE', 70, 35);

      // Línea separadora
      pdf.setDrawColor(0, 0, 0);
      pdf.line(20, 50, 190, 50);

      // Información del comercio - con mejor espaciado
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0); // Negro
      pdf.setFont('helvetica', 'normal');

      let yPosition = 65;
      const lineHeight = 10;
      const labelWidth = 80;

      // Datos básicos usando datos obtenidos del endpoint
      pdf.setFont('helvetica', 'bold');
      pdf.text('Legajo:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(datosCertificado.legajo.toString(), 20 + labelWidth, yPosition);

      yPosition += lineHeight;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Nombre de Fantasía:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      const nombreFantasia = datosComercio?.nom_fantasia || '-';
      pdf.text(nombreFantasia, 20 + labelWidth, yPosition);

      yPosition += lineHeight;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Titular:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      const titular = datosComercio?.titular || '-';
      pdf.text(titular, 20 + labelWidth, yPosition);

      yPosition += lineHeight;
      pdf.setFont('helvetica', 'bold');
      pdf.text('CUIT:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      const cuit = datosComercio?.nro_cuit || '-';
      pdf.text(cuit, 20 + labelWidth, yPosition);

      yPosition += lineHeight;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Domicilio Comercial:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      const domicilio = datosComercio?.nom_calle
        ? `${datosComercio.nom_calle} ${datosComercio.nro_dom || ''}.`
        : '-.';
      pdf.text(domicilio, 20 + labelWidth, yPosition);

      if (esSucursal) {
        yPosition += lineHeight;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Número de Sucursal:', 20, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text((datosCertificado.nroSucursal || (certificado as CertificadoSucursal).nroSucursal).toString(), 20 + labelWidth, yPosition);
      }

      yPosition += lineHeight;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Descripción Comercial:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(datosCertificado.desCom || certificado.desCom, 20 + labelWidth, yPosition);

      // Espacio adicional antes de los datos del certificado
      yPosition += lineHeight * 1.5;

      pdf.setFont('helvetica', 'bold');
      pdf.text('N° de Resolución de Habilitación:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text('095/2025', 20 + labelWidth, yPosition);

      yPosition += lineHeight;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Certificado de Habilitación:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(datosCertificado.certificado || certificado.certificado, 20 + labelWidth, yPosition);

      yPosition += lineHeight;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Fecha de Emisión:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(datosCertificado.emision || certificado.emision, 20 + labelWidth, yPosition);

      yPosition += lineHeight;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Vencimiento de la Habilitación:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(datosCertificado.vtoCertificado || certificado.vtoCertificado, 20 + labelWidth, yPosition);

      // Generar código QR en una posición que no interfiera
      const qrData = datosCertificado?.qr || certificado.qr;
      const urlData = datosCertificado?.url || certificado.url;

      if (qrData && urlData) {
        const qrUrl = `${urlData}qr=${qrData}`;
        try {
          const qrCodeDataURL = await QRCode.toDataURL(qrUrl, {
            width: 150,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });

          // Posicionar QR en la parte inferior derecha
          const qrSize = 35;
          const qrX = 150;
          const qrY = yPosition + 20;

          pdf.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);

          // Texto explicativo del QR - debajo del código
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.text('Escanee para verificar', qrX, qrY + qrSize + 8, { align: 'left' });
          pdf.text('la autenticidad', qrX, qrY + qrSize + 15, { align: 'left' });
        } catch (error) {
          console.warn('Error al generar QR:', error);
        }
      }

      // Línea separadora inferior
      pdf.setDrawColor(0, 0, 0);
      pdf.line(20, 260, 190, 260);

      // Pie de página
      pdf.setFontSize(9);
      pdf.setTextColor(128, 128, 128);
      pdf.setFont('helvetica', 'normal');
      const fechaActual = new Date().toLocaleDateString('es-AR');
      pdf.text(`Documento generado el ${fechaActual}`, 105, 275, { align: 'center' });

      // Descargar el PDF
      const legajoArchivo = datosCertificado?.legajo || certificado.legajo;
      const certificadoArchivo = datosCertificado?.certificado || certificado.certificado;
      const nombreArchivo = `Certificado_Habilitacion_${legajoArchivo}_${certificadoArchivo.replace(/\//g, '_')}.pdf`;
      pdf.save(nombreArchivo);

      Swal.fire({
        title: "¡Éxito!",
        text: "Certificado descargado correctamente",
        icon: "success",
        confirmButtonColor: "#27a3cf",
      });

    } catch (error) {
      console.error('Error al generar PDF:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudo generar el certificado PDF",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
    }
  }; useEffect(() => {
    const fetchCertificadosPrincipal = async () => {
      if (!legajo) return;

      try {
        const response = await axios.get<CertificadoPrincipal[]>(
          `http://10.0.0.24/webapiiyc24/Certificado_habilitacion/GetPrincipalByLegajo?legajo=${legajo}`
        );
        setCertificadosPrincipal(response.data);
      } catch (error) {
        console.error("Error al cargar certificados principales:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los certificados principales.",
          icon: "error",
          confirmButtonColor: "#27a3cf",
        });
      } finally {
        setCargandoPrincipal(false);
      }
    };

    const fetchCertificadosSucursal = async () => {
      if (!legajo) return;

      try {
        const response = await axios.get<CertificadoSucursal[]>(
          `http://10.0.0.24/webapiiyc24/Certificado_habilitacion/GetSucursalByLegajo?legajo=${legajo}`
        );
        setCertificadosSucursal(response.data);
      } catch (error) {
        console.error("Error al cargar certificados de sucursales:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los certificados de sucursales.",
          icon: "error",
          confirmButtonColor: "#27a3cf",
        });
      } finally {
        setCargandoSucursal(false);
      }
    };

    fetchCertificadosPrincipal();
    fetchCertificadosSucursal();
  }, [legajo]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return dateString;
  };

  const columnasPrincipal: TableColumn<CertificadoPrincipal>[] = [
    {
      name: 'Certificado',
      selector: row => row.certificado,
      sortable: true,
      maxWidth: "150px"
    },
    {
      name: 'Año',
      selector: row => row.anioCertificado,
      sortable: true,
      maxWidth: "100px"
    },
    {
      name: 'Descripción Comercial',
      selector: row => row.desCom,
      sortable: true,
    },
    {
      name: 'Emisión',
      selector: row => formatDate(row.emision),
      sortable: true,
      maxWidth: "120px"
    },
    {
      name: 'Vencimiento',
      selector: row => formatDate(row.vtoCertificado),
      sortable: true,
      maxWidth: "120px"
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <button
          className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => generarPDFCertificado(row, false)}
        >
          <Lucide icon="Download" className="w-4 h-4 mr-1" />
          Descargar
        </button>
      ),
      maxWidth: "120px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  const columnasSucursal: TableColumn<CertificadoSucursal>[] = [
    {
      name: 'Certificado',
      selector: row => row.certificado,
      sortable: true,
      maxWidth: "150px"
    },
    {
      name: 'Año',
      selector: row => row.anioCertificado,
      sortable: true,
      maxWidth: "100px"
    },
    {
      name: 'Sucursal',
      selector: row => row.nroSucursal,
      sortable: true,
      maxWidth: "100px"
    },
    {
      name: 'Descripción Comercial',
      selector: row => row.desCom,
      sortable: true,
    },
    {
      name: 'Emisión',
      selector: row => formatDate(row.emision),
      sortable: true,
      maxWidth: "120px"
    },
    {
      name: 'Vencimiento',
      selector: row => formatDate(row.vtoCertificado),
      sortable: true,
      maxWidth: "120px"
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <button
          className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => generarPDFCertificado(row, true)}
        >
          <Lucide icon="Download" className="w-4 h-4 mr-1" />
          Descargar
        </button>
      ),
      maxWidth: "120px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white pt-5">
      <div className="pl-4 pr-4">
        <h1 className="text-2xl font-bold mb-6">Certificados de Habilitación</h1>

        {/* Certificados Principales */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Certificados Principales</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <DataTable
              columns={columnasPrincipal}
              data={certificadosPrincipal}
              pagination
              highlightOnHover
              striped
              fixedHeader
              progressPending={cargandoPrincipal}
              progressComponent={<h2>Cargando certificados principales...</h2>}
              noDataComponent={
                <div className="p-4 text-gray-500">
                  No se encontraron certificados principales para este comercio
                </div>
              }
            />
          </div>
        </div>

        {/* Certificados de Sucursales */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Certificados de Sucursales</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <DataTable
              columns={columnasSucursal}
              data={certificadosSucursal}
              pagination
              highlightOnHover
              striped
              fixedHeader
              progressPending={cargandoSucursal}
              progressComponent={<h2>Cargando certificados de sucursales...</h2>}
              noDataComponent={
                <div className="p-4 text-gray-500">
                  No se encontraron certificados de sucursales para este comercio
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificadosHabilitacion;
