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

// Crear un componente que representa el documento PDF

const Cedulon = () => {
  const { cedulonParaImpresionProvider } = useCedulonesContext();

  const { nrocedulon } = useParams();
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
      console.log(cedulonParaImpresionProvider)
    }
  }, [nrocedulon]);


  const obtenerCabecera = (nrocedulon: number) => {
    const urlApi = `${import.meta.env.VITE_URL_CEDULONES}Comercio/getCabeceraPrintCedulonComercio?nroCedulon=${nrocedulon}`;
    axios
      .get(urlApi)
      .then((response) => {
        setCabecera(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
  }


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

  }

  const divRef = useRef(null);
  const barcodeData = cabecera?.codigo_barra || "0000";
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
        onclone: (document) => {
          // Asegurar que los estilos se apliquen en el clon
          const styles = document.createElement('style');
          styles.textContent = style.textContent;
          document.head.appendChild(styles);
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
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
        showConfirmButton: false
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

  // Y actualizar los estilos para manejar mejor los saltos de página
  const style = document.createElement('style');
  style.textContent += `
    /* Estilos para manejo de páginas */
    @media print {
      .page-break {
        page-break-before: always;
      }
      
      table {
        page-break-inside: auto;
      }
      
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      
      thead {
        display: table-header-group;
      }
      
      tfoot {
        display: table-footer-group;
      }
    }
  `;

  document.head.appendChild(style);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        >
          <div className="tm_container">
            <div className="tm_invoice_wrap">
              <div
                className="tm_invoice tm_style2 tm_type1 tm_accent_border tm_radius_0 tm_small_border"
                id="tm_download_section"
                style={{
                  backgroundColor: 'white',
                  margin: '0 auto',
                  maxWidth: '100%',
                  fontSize: '12px' // Reducir tamaño de fuente base
                }}
              >
                <div className="tm_invoice_in">
                  <div className="tm_invoice_head tm_mb20 tm_m0_md">
                    <div className="tm_invoice_left">
                      <div className="tm_logo">
                        <img
                          style={{ maxHeight: "80px" }}
                          src="https://vecino.villaallende.gov.ar/App_Themes/NuevaWeb/img/LogoVertical2.png"
                          alt="Logo"
                        />
                      </div>
                    </div>
                    <div className="tm_invoice_right">
                      <Barcode
                        fontSize={14}
                        width={1.4}
                        height={50}
                        textAlign={"center"}
                        marginLeft={80}
                        value={barcodeData}
                        format="CODE128"
                      />
                    </div>
                    <div className="tm_shape_bg tm_accent_bg_10 tm_border tm_accent_border_20"></div>
                  </div>
                  <div className="tm_invoice_info tm_mb30 tm_align_center">
                    <div className="tm_invoice_info_left tm_mb20_md">
                      <p className="tm_mb0">
                        Nro. Comprobante:{" "}
                        <b className="tm_primary_color">{cabecera?.nroCedulon}</b>
                        <br />
                        Fecha Emisión:{" "}
                        <b className="tm_primary_color">{fechaActual()}</b>
                        <br />
                        Fecha Vencimiento:{" "}
                        <b className="tm_primary_color">{cabecera?.vencimiento ? convertirFecha(cabecera.vencimiento) : ""}</b>
                      </p>
                    </div>
                    <div className="tm_invoice_info_right">
                      <div className="tm_border tm_accent_border_20 tm_radius_0 tm_accent_bg_10 tm_curve_35 tm_text_center">
                        <div>
                          <b className="tm_accent_color tm_f26 tm_medium tm_body_lineheight">
                            Total: {currencyFormat(cabecera?.montoPagar || 0)}
                          </b>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="tm_f16 tm_section_heading tm_accent_border_20 tm_mb0">
                    <span className="tm_accent_bg_10 tm_radius_0 tm_curve_35 tm_border tm_accent_border_20 tm_border_bottom_0 tm_accent_color">
                      <span>Impuesto al Automotor</span>
                    </span>
                  </h2>
                  <div className="tm_table tm_style1 tm_mb30">
                    <div className="tm_border  tm_accent_border_20 tm_border_top_0">
                      <div className="tm_table_responsive">
                        <table>
                          <tbody>
                            <tr>
                              <td className="tm_width_6 tm_border_top_0">
                                <b className="tm_primary_color tm_medium">
                                  Contribuyente:{" "}
                                </b>
                                {cabecera?.nombre}
                              </td>
                              <td className="tm_width_6 tm_border_top_0 tm_border_left tm_accent_border_20">
                                <b className="tm_primary_color tm_medium">
                                  Vehiculo:{" "}
                                </b>{" "}
                                {cabecera?.detalle}
                              </td>
                            </tr>
                            <tr>
                              <td className="tm_width_6 tm_accent_border_20">
                                <b className="tm_primary_color tm_medium">
                                  CUIT:{" "}
                                </b>
                                {cabecera?.cuit}
                              </td>
                              <td className="tm_width_6 tm_border_left tm_accent_border_20">
                                <b className="tm_primary_color tm_medium">
                                  Dominio:{" "}
                                </b>
                                {cabecera?.denominacion}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="tm_table tm_style1">
                    <div className="tm_border tm_accent_border_20">
                      <div className="tm_table_responsive">
                        <table>
                          <thead>
                            <tr>
                              <th className="tm_width_1 tm_semi_bold tm_accent_color tm_accent_bg_10">
                                Periodo
                              </th>
                              <th className="tm_width_3 tm_semi_bold tm_accent_color tm_accent_bg_10">
                                Concepto
                              </th>
                              <th className="tm_width_1 tm_semi_bold tm_accent_color tm_accent_bg_10 tm_text_right">
                                Sub Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {detalle.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td className="tm_width_1 tm_accent_border_20">
                                    {item.periodo}
                                  </td>
                                  <td className="tm_width_3 tm_accent_border_20">
                                    {item.concepto}
                                  </td>
                                  <td className="tm_width_1 tm_accent_border_20 tm_text_right">
                                    {currencyFormat(item.montoPagado)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="tm_invoice_footer tm_mb15 tm_m0_md">
                      <div className="tm_left_footer">
                        <p className="tm_mb2">
                          <b
                            className="tm_primary_color"
                            style={{ fontSize: "16px" }}
                          >
                            Cedulon valido solo para pago en caja Municipal
                          </b>
                        </p>
                        <p
                          className="tm_m0"
                          style={{ fontSize: "14px", marginTop: "10px" }}
                        >
                          Medio de Pago <br />
                          {cedulonParaImpresionProvider?.tarjetaDeCredito}
                          <br />
                          en {cedulonParaImpresionProvider?.cantCuotas} Cuotas de {currencyFormat(cedulonParaImpresionProvider?.montoCuota || 0)}
                        </p>
                      </div>
                      <div className="tm_right_footer">
                        <table className="tm_mb15 tm_m0_md">
                          <tbody>
                            <tr>
                              <td className="tm_width_3 tm_primary_color tm_border_none tm_medium">
                                Sub total
                              </td>
                              <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_medium">
                                {currencyFormat(cedulonParaImpresionProvider?.montoOriginal || 0)}
                              </td>
                            </tr>
                            <tr>
                              <td className="tm_width_3 tm_primary_color tm_border_none tm_pt0">
                                Interes Mora
                              </td>
                              <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">
                                {currencyFormat(cedulonParaImpresionProvider?.interesMora || 0)}
                              </td>
                            </tr>
                            <tr>
                              <td className="tm_width_3 tm_primary_color tm_border_none tm_pt0">
                                Descuento
                              </td>
                              <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">
                                {currencyFormat(cedulonParaImpresionProvider?.descuento || 0)}
                              </td>
                            </tr>
                            <tr>
                              <td className="tm_width_3 tm_primary_color tm_border_none tm_pt0">
                                Costo financiero:
                              </td>
                              <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">
                                $ {currencyFormat(cedulonParaImpresionProvider?.costoFinanciero || 0)}
                              </td>
                            </tr>
                            <tr className="tm_accent_border_20 tm_border">
                              <td className="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_accent_bg_10">
                                Total{" "}
                              </td>
                              <td className="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_text_right tm_accent_bg_10">
                                {currencyFormat(cedulonParaImpresionProvider?.total || 0)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="tm_bottom_invoice tm_accent_border_20">
                    <table>
                      <tbody>
                        <tr>
                          <td className="tm_width_3 tm_border_top_0 tm_border_left tm_accent_border_20">
                            <div className="tm_logo">
                              <img
                                style={{ maxHeight: "50px" }}
                                src="https://vecino.villaallende.gov.ar/App_Themes/NuevaWeb/img/LogoVertical2.png"
                                alt="Logo"
                              />
                            </div>
                          </td>
                          <td className="tm_width_3 tm_border_top_0">
                            <b className="tm_primary_color tm_medium">
                              CUPON MUNICIPALIDAD <br />
                              IMPUESTO AL AUTOMOTOR
                            </b>
                          </td>
                          <td className="tm_width_3 tm_border_top_0 tm_border_left tm_accent_border_20">
                            <div className="tm_logo">
                              <img
                                style={{ maxHeight: "50px" }}
                                src="https://vecino.villaallende.gov.ar/App_Themes/NuevaWeb/img/LogoVertical2.png"
                                alt="Logo"
                              />
                            </div>
                          </td>
                          <td className="tm_width_3 tm_border_top_0 tm_border_right tm_accent_border_20">
                            <b className="tm_primary_color tm_medium">
                              CUPON MUNICIPALIDAD <br />
                              IMPUESTO AL AUTOMOTOR
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td className="tm_width_3 tm_border_left tm_accent_border_20">
                            {cabecera?.nombre}
                          </td>
                          <td className="tm_width_3 tm_border_left tm_accent_border_20">
                            {cabecera?.detalle}
                          </td>
                          <td className="tm_width_3 tm_border_left tm_accent_border_20">
                            {cabecera?.nombre}
                          </td>
                          <td className="tm_width_3 tm_border_right tm_border_left tm_accent_border_20">
                            {cabecera?.detalle}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ paddingTop: "0" }}
                            className="tm_width_3 tm_border_left tm_border_top_0"
                          >
                            CUIT: {cabecera?.cuit}
                          </td>
                          <td
                            style={{ paddingTop: "0" }}
                            className="tm_width_3 tm_border_left tm_border_top_0"
                          >
                            Dominio: {cabecera?.denominacion}
                          </td>
                          <td
                            style={{ paddingTop: "0" }}
                            className="tm_width_3 tm_border_top_0 tm_border_left tm_accent_border_20"
                          >
                            CUIT: {cabecera?.cuit}
                          </td>
                          <td
                            style={{ paddingTop: "0" }}
                            className="tm_width_3 tm_border_top_0 tm_border_left tm_border_right tm_accent_border_20"
                          >
                            Dominio: {cabecera?.denominacion}
                          </td>
                        </tr>
                        <tr>
                          <td className="tm_width_3 tm_border_left tm_border_top_0">
                            VENC.: {cabecera?.vencimiento ? convertirFecha(cabecera.vencimiento) : ""}
                          </td>
                          <td className="tm_width_3 tm_border_left tm_border_top_0">
                            TOTAL: {currencyFormat(cabecera?.montoPagar || 0)}

                          </td>
                          <td className="tm_width_3 tm_border_top_0 tm_border_left tm_accent_border_20">
                            VENC.: {cabecera?.vencimiento ? convertirFecha(cabecera.vencimiento) : ""}
                          </td>
                          <td className="tm_width_3 tm_border_top_0 tm_border_left tm_border_right tm_accent_border_20">
                            TOTAL: {currencyFormat(cabecera?.montoPagar || 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    </Container>
  );
};

// Estilos actualizados para A4
const style = document.createElement('style');
style.textContent = `
  @media print {
    body {
      background: white;
      margin: 0;
      padding: 0;
    }
    
    @page {
      size: A4;
      margin: 10mm;
    }
  }
  
  .tm_container {
    background-color: white;
    width: 100%;
  }

  .tm_invoice {
    background-color: white;
    padding: 20px;
    position: relative;
  }

  /* Estilos para la cabecera */
  .tm_invoice_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #eee;
  }

  /* Estilos para las tablas */
  .tm_table {
    width: 100%;
    margin: 15px 0;
  }

  .tm_table table {
    width: 100%;
    border-collapse: collapse;
  }

  .tm_table th {
    background-color: #f8f9fa;
    font-weight: bold;
    padding: 10px;
    border: 1px solid #dee2e6;
  }

  .tm_table td {
    padding: 8px;
    border: 1px solid #dee2e6;
  }

  /* Estilos para el pie de página con líneas punteadas */
  .tm_bottom_invoice {
    margin-top: 30px;
    border-top: 2px solid #eee;
    position: relative;
  }

  .tm_bottom_invoice table {
    width: 100%;
    border-collapse: collapse;
  }

  .tm_bottom_invoice td {
    padding: 10px;
    border: 1px solid #dee2e6;
  }

  /* Eliminar las líneas punteadas verticales para separar los cupones */
  .tm_bottom_invoice:before,
  .tm_bottom_invoice:after {
    content: none;
  }

  .tm_bottom_invoice:before {
    left: 50%;
  }

  .tm_bottom_invoice:after {
    left: 25%;
  }

  /* Eliminar tercera línea vertical */
  .tm_bottom_invoice .vertical-line {
    display: none;
  }

  /* Estilos para montos y totales */
  .tm_text_right {
    text-align: right;
  }

  .tm_primary_color {
    color: #2196f3;
  }

  .tm_accent_color {
    color: #1976d2;
  }

  .tm_accent_bg_10 {
    background-color: #f8f9fa;
  }

  /* Estilos para el código de barras */
  .tm_invoice_right {
    text-align: right;
  }

  /* Ajustes de tipografía */
  .tm_f26 {
    font-size: 22px;
    font-weight: bold;
  }

  .tm_f16 {
    font-size: 16px;
  }

  .tm_medium {
    font-weight: 500;
  }

  /* Ajustes de espaciado */
  .tm_mb20 {
    margin-bottom: 20px;
  }

  .tm_mb30 {
    margin-bottom: 30px;
  }

  /* Estilos para los bordes */
  .tm_border {
    border: 1px solid #dee2e6;
  }

  .tm_radius_0 {
    border-radius: 8px;
  }

  /* Estilos para la información del cedulón */
  .tm_invoice_info {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }

  .tm_invoice_info_left {
    flex: 1;
  }

  .tm_invoice_info_right {
    flex: 1;
    text-align: right;
  }

  /* Estilo para el total */
  .tm_invoice_total {
    font-size: 24px;
    font-weight: bold;
    color: #1976d2;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    text-align: right;
  }

  /* Ajustes para impresión */
  @media print {
    .tm_invoice {
      padding: 0;
    }

    .tm_bottom_invoice:before,
    .tm_bottom_invoice:after,
    .tm_bottom_invoice .vertical-line {
      border-left: 2px dashed #999 !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
`;

document.head.appendChild(style);

export default Cedulon;
