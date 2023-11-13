// Importar los componentes necesarios de la biblioteca
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React, { useRef } from "react";
import Barcode from "react-barcode";
import Button from "../../base-components/Button";
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
    const urlApi = `${import.meta.env.VITE_URL_API_IYC_CEDULONES}getCabeceraPrintCedulonComercio?nroCedulon=${nrocedulon}`;
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
    const urlApi = `${import.meta.env.VITE_URL_API_IYC_CEDULONES}getDetallePrintCedulonComercio?nroCedulon=${nrocedulon}`;
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
  const generatePDF = () => {
    const doc = new jsPDF();

    // Obtén el elemento con el ID "informe"
    const element = divRef.current;
    // Captura todo el contenido del div, incluido el contenido oculto debido al desplazamiento
    if (element != null) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Establece el ancho y alto de la imagen en el PDF para asegurarte de que se muestre completo
        const pdfWidth = 210; // Ancho de la página A4 en mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Agrega la imagen al documento PDF
        doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        doc.save("informe.pdf");
      });
    }
  };


  return (
    <>
      <div ref={divRef}>
        <div className="tm_container">
          <div className="tm_invoice_wrap">
            <div
              className="tm_invoice tm_style2 tm_type1 tm_accent_border tm_radius_0 tm_small_border"
              id="tm_download_section"
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
    </>
  );
};
export default Cedulon;
