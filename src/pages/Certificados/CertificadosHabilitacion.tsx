import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DataTable, { TableColumn } from "react-data-table-component";
import Swal from "sweetalert2";
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import Lucide from "../../base-components/Lucide";
import logoMuni from "../../assets/logosecgob.png";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import { useUserContext } from "../../context/UserProvider";

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

interface Sucursal {
  legajo: number;
  nro_sucursal: number;
  des_com: string;
  nom_fantasia: string;
  cod_calle: number;
  nom_calle: string;
  nro_dom: number;
  cod_barrio: number;
  nom_barrio: string;
  ciudad: string;
  provincia: string;
  pais: string;
  cod_postal: string;
  nro_res: string;
  fecha_inicio: string;
  fecha_Baja: string | null;
  fecha_hab: string;
  dado_baja: boolean;
  nro_exp_mesa_ent: string;
  fecha_alta: string;
  cod_zona: string;
  nro_local: string;
  piso_dpto: string;
  vto_inscripcion: string;
}

interface FormularioCertificado {
  legajo: number;
  rubro: string;
  cod_rubro: number;
  nro_sucursal: number;
  titular: string;
  domicilio: string;
  vencimiento: string;
  observaciones: string;
}

const CertificadosHabilitacion = () => {
  const { legajo } = useParams<{ legajo: string }>();
  const { elementoIndCom } = useIndustriaComercioContext();
  const { user } = useUserContext();
  const [certificadosPrincipal, setCertificadosPrincipal] = useState<CertificadoPrincipal[]>([]);
  const [certificadosSucursal, setCertificadosSucursal] = useState<CertificadoSucursal[]>([]);
  const [cargandoPrincipal, setCargandoPrincipal] = useState<boolean>(true);
  const [cargandoSucursal, setCargandoSucursal] = useState<boolean>(true);

  // Estados para el modal de emitir certificado
  const [modalEmitir, setModalEmitir] = useState(false);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loadingSucursales, setLoadingSucursales] = useState(false);
  const [formulario, setFormulario] = useState<FormularioCertificado>({
    legajo: 0,
    rubro: "",
    cod_rubro: 0,
    nro_sucursal: 0,
    titular: "",
    domicilio: "",
    vencimiento: "",
    observaciones: ""
  });

  const generarPDFCertificado = async (certificado: CertificadoPrincipal | CertificadoSucursal, esSucursal: boolean = false) => {
    try {
      // Obtener datos completos del certificado desde el endpoint
      let datosCertificado: any = null;
      let datosComercio: any = null;

      try {
        // Obtener datos del certificado
        const endpointCertificado = esSucursal
          ? `${import.meta.env.VITE_URL_BASE}Certificado_habilitacion/GetCertificadoPrincipal?legajo=${certificado.legajo}`
          : `${import.meta.env.VITE_URL_BASE}Certificado_habilitacion/GetCertificadoPrincipal?legajo=${certificado.legajo}`;

        console.log('Endpoint certificado:', endpointCertificado);
        const responseCertificado = await axios.get(endpointCertificado);
        const datosCert = responseCertificado.data;
        console.log('Respuesta certificado:', datosCert);

        // Buscar el certificado específico en la respuesta
        if (Array.isArray(datosCert)) {
          datosCertificado = datosCert.find(cert => cert.certificado === certificado.certificado);
        } else {
          datosCertificado = datosCert;
        }

        console.log('Datos certificado seleccionado:', datosCertificado);

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

      // Crear el PDF en formato horizontal
      const pdf = new jsPDF({
        orientation: 'landscape', // Cambiar a horizontal
        unit: 'mm',
        format: 'a4'
      });

      // Generar código QR primero para posicionarlo en la esquina superior derecha
      const qrData = datosCertificado?.qr || certificado.qr;
      const urlData = datosCertificado?.url || certificado.url;
      let qrCodeDataURL = null;

      if (qrData && urlData) {
        const qrUrl = `${urlData}qr=${qrData}`;
        try {
          qrCodeDataURL = await QRCode.toDataURL(qrUrl, {
            width: 120,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        } catch (error) {
          console.warn('Error al generar QR:', error);
        }
      }

      // Añadir borde amarillo alrededor de toda la página
      pdf.setDrawColor(255, 215, 0); // Color amarillo
      pdf.setLineWidth(2);
      pdf.rect(5, 5, 287, 200); // Rectángulo que cubre casi toda la página A4 horizontal

      // Posicionar QR en la esquina superior derecha
      if (qrCodeDataURL) {
        const qrSize = 30;
        const qrX = 250; // Esquina superior derecha
        const qrY = 15;
        pdf.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
      }

      // Añadir logo centrado en la parte superior
      try {
        const logoImg = new Image();
        logoImg.src = logoMuni;
        await new Promise((resolve) => {
          logoImg.onload = resolve;
        });

        // Logo centrado en la parte superior
        const logoWidth = 100;
        const logoHeight = 28;
        const logoX = (297 - logoWidth) / 2; // Centrado horizontalmente
        pdf.addImage(logoImg, 'JPEG', logoX, 15, logoWidth, logoHeight);
      } catch (error) {
        console.warn('No se pudo cargar el logo:', error);
      }

      // Título principal debajo del logo
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('DIRECCIÓN DE HABILITACIÓN DE COMERCIOS', 148, 55, { align: 'center' });
      pdf.text('ESPECTÁCULOS PÚBLICOS Y CARTELERÍA', 148, 65, { align: 'center' });

      // Línea separadora
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(30, 75, 267, 75);

      // Datos del comercio centrados
      let yPosition = 90;
      const lineHeight = 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);

      // Nombre de Fantasía
      const nombreFantasia = datosCertificado?.nom_fantasia || datosComercio?.nom_fantasia || '-';
      pdf.text(`NOMBRE DE FANTASÍA: ${nombreFantasia}`, 148, yPosition, { align: 'center' });

      yPosition += lineHeight;
      // Titular
      let titular = 'No especificado';
      if (datosCertificado?.nombre || datosCertificado?.apellido) {
        const nombre = (datosCertificado.nombre || '').trim();
        const apellido = (datosCertificado.apellido || '').trim();

        if (nombre && apellido) {
          titular = `${nombre} ${apellido}`;
        } else if (nombre) {
          titular = nombre;
        } else if (apellido) {
          titular = apellido;
        }
      }
      pdf.text(`TITULAR: ${titular}`, 148, yPosition, { align: 'center' });

      yPosition += lineHeight;
      // Domicilio
      const domicilio = datosCertificado?.nombre_calle && datosCertificado?.nro_domicilio
        ? `${datosCertificado.nombre_calle} ${datosCertificado.nro_domicilio}`
        : datosComercio?.nom_calle
          ? `${datosComercio.nom_calle} ${datosComercio.nro_dom || ''}`
          : '-';
      pdf.text(`DOMICILIO: ${domicilio}`, 148, yPosition, { align: 'center' });

      yPosition += lineHeight;
      // Rubro
      const rubro = datosCertificado.desCom || certificado.desCom;
      pdf.text(`RUBRO: ${rubro}`, 148, yPosition, { align: 'center' });

      yPosition += lineHeight;
      // Legajo
      pdf.text(`LEGAJO: ${datosCertificado.legajo}`, 148, yPosition, { align: 'center' });

      // Línea separadora
      yPosition += 20;
      pdf.setDrawColor(0, 0, 0);
      pdf.line(30, yPosition, 267, yPosition);

      // VENCIMIENTO - grande como el título
      yPosition += 15;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('VENCIMIENTO', 148, yPosition, { align: 'center' });

      yPosition += 12;
      pdf.setFontSize(16);
      pdf.setTextColor(255, 0, 0); // Rojo para destacar
      const fechaVencimiento = datosCertificado.vtoCertificado || certificado.vtoCertificado;
      pdf.text(fechaVencimiento, 148, yPosition, { align: 'center' });

      // Textos en las esquinas inferiores
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);

      // Esquina inferior izquierda
      pdf.text('CERTIFICADO DE HABILITACIÓN', 30, 185);

      // Esquina inferior derecha
      pdf.text('DEBE QUEDAR EXHIBIDA EN LUGAR VISIBLE', 267, 185, { align: 'right' });

      // Pie de página - ajustado para formato horizontal
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.setFont('helvetica', 'normal');
      const fechaActual = new Date().toLocaleDateString('es-AR');
      pdf.text(`Documento generado el ${fechaActual}`, 148, 190, { align: 'center' });

      // Información de la municipalidad en el pie
      pdf.setFontSize(9);
      pdf.text('Ciudad de Villa Allende - Córdoba', 148, 198, { align: 'center' });

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
  };

  // Función para cargar sucursales
  const cargarSucursales = async () => {
    if (!legajo) return;

    setLoadingSucursales(true);
    try {
      const response = await axios.get<Sucursal[]>(
        `${import.meta.env.VITE_URL_BASE}Indycom/GetSucurales?legajo=${legajo}`
      );
      setSucursales(response.data);
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las sucursales.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
    } finally {
      setLoadingSucursales(false);
    }
  };

  // Función para abrir modal de emitir certificado
  const abrirModalEmitir = async () => {
    if (!elementoIndCom || !legajo) {
      Swal.fire({
        title: "Error",
        text: "No se pudo obtener la información del comercio.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
      return;
    }

    await cargarSucursales();

    setFormulario({
      legajo: parseInt(legajo),
      rubro: elementoIndCom.des_com || "",
      cod_rubro: 0,
      nro_sucursal: 0,
      titular: "No especificado",
      domicilio: `${elementoIndCom.nom_calle || ""} ${elementoIndCom.nro_dom || ""}`.trim(),
      vencimiento: "",
      observaciones: ""
    });

    setModalEmitir(true);
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (field: keyof FormularioCertificado, value: string | number) => {
    setFormulario(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para manejar cambio de sucursal
  const handleSucursalChange = (nroSucursal: number) => {
    const sucursalSeleccionada = sucursales.find(s => s.nro_sucursal === nroSucursal);

    setFormulario(prev => ({
      ...prev,
      nro_sucursal: nroSucursal,
      rubro: sucursalSeleccionada?.des_com || elementoIndCom?.des_com || prev.rubro,
      domicilio: sucursalSeleccionada
        ? `${sucursalSeleccionada.nom_calle} ${sucursalSeleccionada.nro_dom}`.trim()
        : `${elementoIndCom?.nom_calle || ""} ${elementoIndCom?.nro_dom || ""}`.trim()
    }));
  };

  // Función para emitir certificado
  const emitirCertificado = async () => {
    // Validaciones
    if (!formulario.rubro.trim()) {
      Swal.fire({
        title: "Error",
        text: "El rubro es obligatorio.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
      return;
    }

    if (!formulario.domicilio.trim()) {
      Swal.fire({
        title: "Error",
        text: "El domicilio es obligatorio.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
      return;
    }

    if (!formulario.vencimiento) {
      Swal.fire({
        title: "Error",
        text: "La fecha de vencimiento es obligatoria.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
      return;
    }

    if (!formulario.observaciones.trim()) {
      Swal.fire({
        title: "Error",
        text: "Las observaciones son obligatorias.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
      return;
    }

    // Preparar datos para envío
    const fechaVencimiento = new Date(formulario.vencimiento);
    const fechaActual = new Date();

    const datosCertificado = {
      legajo: formulario.legajo,
      rubro: formulario.rubro,
      cod_rubro: formulario.cod_rubro,
      nro_sucursal: formulario.nro_sucursal,
      titular: formulario.titular,
      domicilio: formulario.domicilio,
      vecimiento: fechaVencimiento.toISOString(), // Formato requerido
      auditoria: {
        id_auditoria: 0,
        fecha: fechaActual.toISOString(),
        usuario: user?.userName || "Usuario Desconocido",
        proceso: "Emisión de Certificado de Habilitación",
        identificacion: `Legajo: ${formulario.legajo}, Sucursal: ${formulario.nro_sucursal}`,
        autorizaciones: user?.userName || "Sin autorización",
        observaciones: formulario.observaciones,
        detalle: `Certificado emitido para ${formulario.titular} - ${formulario.rubro}`,
        ip: "192.168.1.1" // En producción, obtener IP real
      }
    };

    try {
      // Mostrar datos en consola (para pruebas)
      console.log("=== DATOS DEL CERTIFICADO A EMITIR ===");
      console.log(JSON.stringify(datosCertificado, null, 2));

      const response = await axios.post(
        `${import.meta.env.VITE_URL_BASE}Certificado_habilitacion/InsertHabilitacionComercio`,
        datosCertificado
      );

      console.log("=== RESPUESTA DEL SERVIDOR ===");
      console.log(JSON.stringify(response.data, null, 2));

      Swal.fire({
        title: "¡Éxito!",
        text: "El certificado de habilitación ha sido emitido correctamente.",
        icon: "success",
        confirmButtonColor: "#27a3cf",
      });

      setModalEmitir(false);

      // Recargar certificados
      const fetchCertificadosPrincipal = async () => {
        if (!legajo) return;
        try {
          const response = await axios.get<CertificadoPrincipal[]>(
            `${import.meta.env.VITE_URL_BASE}Certificado_habilitacion/GetPrincipalByLegajo?legajo=${legajo}`
          );
          setCertificadosPrincipal(response.data);
        } catch (error) {
          console.error("Error al recargar certificados principales:", error);
        }
      };

      const fetchCertificadosSucursal = async () => {
        if (!legajo) return;
        try {
          const response = await axios.get<CertificadoSucursal[]>(
            `${import.meta.env.VITE_URL_BASE}Certificado_habilitacion/GetSucursalByLegajo?legajo=${legajo}`
          );
          setCertificadosSucursal(response.data);
        } catch (error) {
          console.error("Error al recargar certificados de sucursales:", error);
        }
      };

      fetchCertificadosPrincipal();
      fetchCertificadosSucursal();

    } catch (error) {
      console.error("Error al emitir certificado:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo emitir el certificado. Intente nuevamente.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
    }
  };

  useEffect(() => {
    const fetchCertificadosPrincipal = async () => {
      if (!legajo) return;

      try {
        const response = await axios.get<CertificadoPrincipal[]>(
          `${import.meta.env.VITE_URL_BASE}Certificado_habilitacion/GetPrincipalByLegajo?legajo=${legajo}`
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
          `${import.meta.env.VITE_URL_BASE}Certificado_habilitacion/GetSucursalByLegajo?legajo=${legajo}`
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

  const isCertificadoVencido = (fechaVencimiento: string) => {
    if (!fechaVencimiento) return false;

    // Convertir la fecha de vencimiento a formato Date
    const [dia, mes, anio] = fechaVencimiento.split('/');
    const fechaVto = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));

    // Obtener la fecha actual sin hora
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    return fechaVto < fechaActual;
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
      cell: (row) => {
        if (isCertificadoVencido(row.vtoCertificado)) {
          return (
            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded border border-red-300">
              VENCIDO
            </span>
          );
        }

        return (
          <button
            className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => generarPDFCertificado(row, false)}
          >
            <Lucide icon="Download" className="w-4 h-4 mr-1" />
            Descargar
          </button>
        );
      },
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
      cell: (row) => {
        if (isCertificadoVencido(row.vtoCertificado)) {
          return (
            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded border border-red-300">
              VENCIDO
            </span>
          );
        }

        return (
          <button
            className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => generarPDFCertificado(row, true)}
          >
            <Lucide icon="Download" className="w-4 h-4 mr-1" />
            Descargar
          </button>
        );
      },
      maxWidth: "120px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white pt-5">
      <div className="pl-4 pr-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Certificados de Habilitación - Legajo {legajo}
          </h1>
          <button
            onClick={abrirModalEmitir}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Lucide icon="Plus" className="w-4 h-4 mr-2" />
            Emitir Certificado
          </button>
        </div>

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

      {/* Modal para emitir certificado */}
      {modalEmitir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Emitir Certificado de Habilitación</h2>
              <button
                onClick={() => setModalEmitir(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Lucide icon="X" className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Legajo (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Legajo
                </label>
                <input
                  type="number"
                  value={formulario.legajo}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              {/* Sucursal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sucursal
                </label>
                <select
                  value={formulario.nro_sucursal}
                  onChange={(e) => handleSucursalChange(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loadingSucursales}
                >
                  <option value={0}>Casa Central</option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.nro_sucursal} value={sucursal.nro_sucursal}>
                      Sucursal {sucursal.nro_sucursal} - {sucursal.nom_fantasia}
                    </option>
                  ))}
                </select>
                {loadingSucursales && (
                  <p className="text-sm text-gray-500 mt-1">Cargando sucursales...</p>
                )}
              </div>

              {/* Rubro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rubro *
                </label>
                <input
                  type="text"
                  value={formulario.rubro}
                  onChange={(e) => handleInputChange('rubro', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingrese el rubro"
                />
              </div>

              {/* Domicilio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domicilio *
                </label>
                <input
                  type="text"
                  value={formulario.domicilio}
                  onChange={(e) => handleInputChange('domicilio', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dirección del comercio"
                />
              </div>

              {/* Fecha de Vencimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  value={formulario.vencimiento}
                  onChange={(e) => handleInputChange('vencimiento', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones de Auditoría *
                </label>
                <textarea
                  value={formulario.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingrese las observaciones para la auditoría"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setModalEmitir(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={emitirCertificado}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Emitir Certificado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificadosHabilitacion;
