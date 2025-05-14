// Importar los componentes necesarios de la biblioteca
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React, { useRef } from "react";
import Barcode from "react-barcode";
import Button from "@mui/material/Button";
import Lucide from "../../base-components/Lucide";
import "../../assets/css/style.css";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import { CabeceraDeCedulon, DetalleCedulon, CedulonImpresion } from "../../interfaces/IndustriaComercio";
import { convertirFecha, fechaActual } from "../../utils/GeneralUtils";
import { set } from "lodash";
import { Planes_Cobro } from "../../interfaces/Planes_Cobro";
import { CheckOut } from "../../interfaces/CheckOut";
import { currencyFormat, selectCalculaMontos } from "../../utils/helper";
import { useCedulonesContext } from "../../context/CedulonesProviders";
import { Box, Container, Paper } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Swal from "sweetalert2";
import Logo from "../../assets/logo2.png"
import "./cedulones.css";

// Crear un componente que representa el documento PDF

const Cedulon = () => {
  const { cedulonParaImpresionProvider } = useCedulonesContext();
  const { nrocedulon } = useParams(); // Obtener el número de cedulón desde los parámetros de la URL
  const [cabecera, setCabecera] = useState<CabeceraDeCedulon>();
  const [detalle, setDetalle] = useState<DetalleCedulon[]>([]);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [interesMoraTotal, setInteresMoraTotal] = useState<number>(0);
  const [descuentoTotal, setDescuentoTotal] = useState<number>(0);
  const [costoFinancieroTotal, setCostoFinancieroTotal] = useState<number>(0);
  const [checkout, setCheckout] = useState<CheckOut>();

  useEffect(() => {
    if (nrocedulon) {
      obtenerCabecera(parseInt(nrocedulon));
      obtenerDetalle(parseInt(nrocedulon));
      console.log(cedulonParaImpresionProvider);
    }
  }, [nrocedulon]);

  const obtenerCabecera = (nrocedulon: number) => {
    const urlApi = `${import.meta.env.VITE_URL_CEDULONES}Comercio/getCabeceraPrintCedulonComercio?nroCedulon=${nrocedulon}`;
    axios
      .get(urlApi)
      .then((response) => {
        setCabecera(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const obtenerDetalle = (nrocedulon: number) => {
    const urlApi = `${import.meta.env.VITE_URL_CEDULONES}Comercio/getDetallePrintCedulonComercio?nroCedulon=${nrocedulon}`;
    axios
      .get(urlApi)
      .then((response) => {
        setDetalle(response.data);
        calcularTotales(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const calcularTotales = (detalles: DetalleCedulon[]) => {
    let subTotal = 0;
    let interesPorMora = 0;
    let montoOriginal = 0;
    let montoPagado = 0;
    let descuentos = 0;
    detalles.forEach((detalle: DetalleCedulon) => {
      subTotal += detalle.montoOriginal;
      interesPorMora += detalle.recargo;
      montoOriginal += detalle.montoOriginal;
      montoPagado += detalle.montoPagado;
      descuentos += detalle.descInteres;
    });
    setSubTotal(subTotal);
    setInteresMoraTotal(interesPorMora);
    setDescuentoTotal(descuentos);
  };

  const divRef = useRef(null);

  // Actualiza el valor del código de barras para usar el número de cedulón
  const barcodeData = nrocedulon || "0000";

  const generatePDF = async () => {
    try {
      const element = divRef.current;
      if (!element) return;

      // Obtener las dimensiones del contenido
      const elementHeight = element.offsetHeight;
      const elementWidth = element.offsetWidth;

      // Crear el canvas con las dimensiones completas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: elementWidth,
        windowHeight: elementHeight,
        scrollY: -window.scrollY,
        onclone: (clonedDocument) => {
          // Agregar estilos personalizados al clon si es necesario
          const customStyles = `
            body {
              background: white;
              margin: 0;
              padding: 0;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
          `;
          const styleElement = clonedDocument.createElement('style');
          styleElement.textContent = customStyles;
          clonedDocument.head.appendChild(styleElement);
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Dimensiones de la página A4 en mm
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calcular las dimensiones de la imagen manteniendo la proporción
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Calcular el número de páginas necesarias
      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;

      // Agregar la primera página
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft >= 0) {
        pdf.addPage();
        position = -pageHeight * page;
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        page++;
      }

      // Guardar el PDF
      pdf.save('cedulon.pdf');

      await Swal.fire({
        title: '¡Éxito!',
        text: 'El PDF se ha descargado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo generar el PDF',
        icon: 'error',
      });
    }
  };

  // También podemos agregar una función auxiliar para mejorar el manejo de páginas
  const splitContentIntoPages = (content: HTMLElement, pageHeight: number) => {
    const contentHeight = content.offsetHeight;
    const pages = Math.ceil(contentHeight / pageHeight);
    return pages;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 15 }}>
      {/* Solo botón de PDF */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'flex-end',
          '@media print': {
            display: 'none'
          }
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PictureAsPdfIcon />}
          onClick={generatePDF}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            boxShadow: 2,
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500
          }}
        >
          Descargar PDF
        </Button>
      </Box>

      {/* Contenedor del cedulón ajustado a A4 */}
      <Paper
        elevation={3}
        sx={{
          backgroundColor: 'white',
          p: 2,
          mx: 'auto',
          width: '210mm', // Ancho A4
          minHeight: '297mm', // Alto A4
          '@media print': {
            boxShadow: 'none',
            p: 0
          }
        }}
      >
        <div
          ref={divRef}
          style={{
            transform: 'scale(0.9)',
            transformOrigin: 'top center',
            width: '100%',
            height: '100%'
          }}
          className="p-5 flex flex-col justify-between h-full"
        >
          {/* Contenido principal */}
          <div className="flex-grow">
            <div
              id="tm_download_section"
              className="bg-white mx-auto max-w-full text-sm"
            >
              <div className="flex flex-col">
                {/* Contenido del cedulón */}
                <div className="flex w-full">
                  <div className="w-3/12">
                    <img src={Logo} alt="Logo" />
                  </div>
                  <div className="w-9/12">
                    <Barcode
                      fontSize={14}
                      width={1.4}
                      height={50}
                      textAlign="center"
                      marginLeft={80}
                      value="05490000000000000082291020208650026052025000000109"
                      format="CODE128"
                    />
                  </div>
                </div>

                <div className="flex bg-gray-100 p-2 mb-2">
                  <div className="w-3/4">
                    <p>Nro. Comprobante: {cabecera?.nroCedulon}</p>
                    <p>Fecha Emisión: {fechaActual()}</p>
                    <p>
                      Fecha Vencimiento:{' '}
                      {cabecera?.vencimiento
                        ? convertirFecha(cabecera.vencimiento)
                        : ''}
                    </p>
                  </div>

                  <div className="text-xl -1/3">
                    Total: {currencyFormat(cedulonParaImpresionProvider?.total || 0)}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  {/* Fila 1 */}
                  <div className="flex">
                    <div className="flex-1">
                      <b className=" font-medium">Contribuyente:</b> {cabecera?.nombre}
                    </div>
                    <div className="flex-1">
                      <b className=" font-medium">Vehículo:</b> {cabecera?.detalle}
                    </div>
                  </div>

                  {/* Fila 2 */}
                  <div className="flex">
                    <div className="flex-1">
                      <b className=" font-medium">CUIT:</b> {cabecera?.cuit}
                    </div>
                    <div className="flex-1">
                      <b className=" font-medium">Legajo:</b> {cabecera?.denominacion}
                    </div>
                  </div>
                </div>

                <div className="mt-3 mb-3">

                  <div className="flex flex-col border border-gray-300 mb-2">
                    {/* Encabezado */}
                    <div className="flex bg-gray-100">
                      <div className="w-1/6 p-2 font-semibold text-gray-700">
                        Periodo
                      </div>
                      <div className="w-4/6 p-2 font-semibold text-gray-700 ">
                        Concepto
                      </div>
                      <div className="w-1/6 p-2 font-semibold text-gray-700 text-right">
                        Sub Total
                      </div>
                    </div>

                    {/* Cuerpo */}
                    {detalle.map((item, index) => (
                      <div
                        key={index}
                        className={`flex ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <div className="w-1/6 p-2 border-t border-gray-300">
                          {item.periodo}
                        </div>
                        <div className="w-4/6 p-2 border-t border-gray-300">
                          {item.concepto}
                        </div>
                        <div className="w-1/6 p-2 border-t border-gray-300 text-right">
                          {currencyFormat(item.montoPagado)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="tm_invoice_footer tm_mb15 tm_m0_md">
                    <div className="tm_left_footer">
                      <p className="font-bold mt-2 text-lg">
                        Cedulon valido solo para pago en caja Municipal
                      </p>
                      <p>
                        Medio de Pago: {cedulonParaImpresionProvider?.tarjetaDeCredito} en {cedulonParaImpresionProvider?.cantCuotas} Cuotas de {currencyFormat(cedulonParaImpresionProvider?.montoCuota || 0)}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      {/* Subtotal */}
                      <div className="flex justify-between items-center">
                        <div className="flex-1 text-gray-700 font-medium">Sub total</div>
                        <div className="flex-1 text-right text-gray-700 font-medium">
                          {currencyFormat(cedulonParaImpresionProvider?.montoOriginal || 0)}
                        </div>
                      </div>

                      {/* Interés Mora */}
                      <div className="flex justify-between items-center">
                        <div className="flex-1 text-gray-700">Interes Mora</div>
                        <div className="flex-1 text-right text-gray-700">
                          {currencyFormat(cedulonParaImpresionProvider?.interesMora || 0)}
                        </div>
                      </div>

                      {/* Descuento */}
                      <div className="flex justify-between items-center">
                        <div className="flex-1 text-gray-700">Descuento</div>
                        <div className="flex-1 text-right text-gray-700">
                          {currencyFormat(cedulonParaImpresionProvider?.descuento || 0)}
                        </div>
                      </div>

                      {/* Costo Financiero */}
                      <div className="flex justify-between items-center">
                        <div className="flex-1 text-gray-700">Costo financiero:</div>
                        <div className="flex-1 text-right text-gray-700">
                          $ {currencyFormat(cedulonParaImpresionProvider?.costoFinanciero || 0)}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center bg-gray-100 border-t border-gray-300 py-2">
                        <div className="flex-1 font-bold text-lg text-gray-800">Total</div>
                        <div className="flex-1 text-right font-bold text-lg text-gray-800">
                          {currencyFormat(cedulonParaImpresionProvider?.total || 0)}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Talonario */}
          <div className="flex text-xs mb-1">
            <div className="w-1/2 pl-2">CUPON MUNICIPALIDAD</div>
            <div className="w-1/2 pl-2">CUPON CONTRIBUYENTE</div>
          </div>
          <div className="mt-auto flex border-t border-l border-r border-b border-solid border-gray-500">
            <div className="flex flex-col w-1/2 border-r border-solid border-gray-500">
              <div className="flex w-full border-b border-solid border-gray-500">
                <img
                  style={{ maxHeight: '50px' }}
                  src={Logo}
                  alt="Logo"
                />
                <div className="flex flex-col justify-center items-center w-full">
                  <p>LIQUIDACIÓN DEUDA</p>
                </div>
              </div>

              <div className="grid grid-cols-2 p-1">
                <div>{cabecera?.nombre}</div>
                <div>{cabecera?.detalle}</div>
                <div>CUIT: {cabecera?.cuit}</div>
                <div>Legajo: {cabecera?.denominacion}</div>
                <div>
                  VENC.:{' '}
                  {cabecera?.vencimiento
                    ? convertirFecha(cabecera.vencimiento)
                    : ''}
                </div>
                <div>
                  TOTAL: {currencyFormat(cabecera?.montoPagar || 0)}
                </div>
              </div>

              <Barcode
                fontSize={14}
                width={1.4}
                height={50}
                textAlign="center"
                marginLeft={80}
                value={barcodeData}
                format="CODE39"
              />
            </div>

            <div className="flex flex-col w-1/2">
              <div className="flex w-full border-b border-solid border-gray-500">
                <img
                  style={{ maxHeight: '50px' }}
                  src={Logo}
                  alt="Logo"
                />
                <div className="flex flex-col justify-center items-center w-full">
                  <p>LIQUIDACIÓN DEUDA</p>
                </div>
              </div>

              <div className="grid grid-cols-2 p-1">
                <div>{cabecera?.nombre}</div>
                <div>{cabecera?.detalle}</div>
                <div>CUIT: {cabecera?.cuit}</div>
                <div>Legajo: {cabecera?.denominacion}</div>
                <div>
                  VENC.:{' '}
                  {cabecera?.vencimiento
                    ? convertirFecha(cabecera.vencimiento)
                    : ''}
                </div>
                <div>
                  TOTAL: {currencyFormat(cabecera?.montoPagar || 0)}
                </div>
                <div>Nro. Cedulón: {cabecera?.nroCedulon}</div>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    </Container >
  );
};

export default Cedulon;
