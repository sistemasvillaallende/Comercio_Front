// Importar los componentes necesarios de la biblioteca
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React, { useRef } from "react";
import Barcode from "react-barcode";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import "../../assets/css/style.css";
// Crear un componente que representa el documento PDF

const CeduloAuto = () => {
  const divRef = useRef(null);
  const barcodeData = "05490000000000000072080590007574010092023000000103";
  const barcodeData2 = "*C07208059*";
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
                  <div className="tm_invoice_left" style={{ width: "40%" }}>
                    <div style={{ float: "left" }}>
                      <img
                        style={{ maxHeight: "80px" }}
                        src="https://vecino.villaallende.gov.ar/Autos/Assets/Escudo.png"
                        alt="Logo"
                      />
                    </div>
                    <div style={{ paddingTop: "2px", marginLeft: "60px" }}>
                      <p style={{ fontSize: "12px", fontWeight: "600" }}>
                        MUNICIPALIDAD DE VILLA ALLENDE <br/>
                        Tel.: 03543-439280 <br/>
                        informes@villaallende.gov.ar <br/>
                        Subsistema Automotor
                      </p>
                    </div>
                  </div>
                  <div className="tm_invoice_right" style={{textAlign: "center"}}>
                    <h2>Resumen de Cuenta</h2>
                    <h2>Todos los Periodos</h2>
                  </div>
                  <div
                    style={{ width: "52%" }}
                    className="tm_shape_bg tm_accent_bg_10 tm_border tm_accent_border_20"
                  ></div>
                </div>
                <div className="tm_invoice_info tm_mb30 tm_align_center">
                  <div className="tm_invoice_info_left tm_mb20_md">
                    <p className="tm_mb0">
                      Nro. Comprobante:{" "}
                      <b className="tm_primary_color">7208059</b>
                      <br />
                      Fecha Emisión:{" "}
                      <b className="tm_primary_color">05/09/2023</b>
                      <br />
                      Fecha Vencimiento:{" "}
                      <b className="tm_primary_color">10/09/2023</b>
                    </p>
                  </div>
                  <div className="tm_invoice_info_right">
                    <div className="tm_border tm_accent_border_20 tm_radius_0 tm_accent_bg_10 tm_curve_35 tm_text_center">
                      <div>
                        <b className="tm_accent_color tm_f26 tm_medium tm_body_lineheight">
                          Total: $757,40
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
                              VELEZ SPITALE IGNACIO MARTIN
                            </td>
                            <td className="tm_width_6 tm_border_top_0 tm_border_left tm_accent_border_20">
                              <b className="tm_primary_color tm_medium">
                                Vehiculo:{" "}
                              </b>{" "}
                              PEUGEOT 307 XS 1.6
                            </td>
                          </tr>
                          <tr>
                            <td className="tm_width_6 tm_accent_border_20">
                              <b className="tm_primary_color tm_medium">
                                CUIT:{" "}
                              </b>
                              23-27173499-9
                            </td>
                            <td className="tm_width_6 tm_border_left tm_accent_border_20">
                              <b className="tm_primary_color tm_medium">
                                Dominio:{" "}
                              </b>
                              FKQ208
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
                          <tr>
                            <td className="tm_width_1 tm_accent_border_20">
                              2022/01
                            </td>
                            <td className="tm_width_3 tm_accent_border_20">
                              IMPUESTO AL AUTOMOTOR
                            </td>
                            <td className="tm_width_1 tm_accent_border_20 tm_text_right">
                              $ 757,40
                            </td>
                          </tr>
                          <tr>
                            <td className="tm_width_1 tm_accent_border_20">
                              2022/02
                            </td>
                            <td className="tm_width_3 tm_accent_border_20">
                              IMPUESTO AL AUTOMOTOR
                            </td>
                            <td className="tm_width_1 tm_accent_border_20 tm_text_right">
                              $600
                            </td>
                          </tr>
                          <tr>
                            <td className="tm_width_1 tm_accent_border_20">
                              2022/03
                            </td>
                            <td className="tm_width_3 tm_accent_border_20">
                              IMPUESTO AL AUTOMOTOR
                            </td>
                            <td className="tm_width_1 tm_accent_border_20 tm_text_right">
                              $200
                            </td>
                          </tr>
                          <tr>
                            <td className="tm_width_1 tm_accent_border_20">
                              2022/03
                            </td>
                            <td className="tm_width_3 tm_accent_border_20">
                              IMPUESTO AL AUTOMOTOR
                            </td>
                            <td className="tm_width_1 tm_accent_border_20 tm_text_right">
                              $100
                            </td>
                          </tr>
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
                        Tarjeta de Credito - Mastercad Cordobesa
                        <br />
                        en 6 Cuotas de $ 219,50
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
                              $350.00
                            </td>
                          </tr>
                          <tr>
                            <td className="tm_width_3 tm_primary_color tm_border_none tm_pt0">
                              Interes Mora
                            </td>
                            <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">
                              $ 574,00
                            </td>
                          </tr>
                          <tr>
                            <td className="tm_width_3 tm_primary_color tm_border_none tm_pt0">
                              Descuento
                            </td>
                            <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">
                              $ 114,80
                            </td>
                          </tr>
                          <tr>
                            <td className="tm_width_3 tm_primary_color tm_border_none tm_pt0">
                              Costo financiero:
                            </td>
                            <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">
                              $ 444,82
                            </td>
                          </tr>
                          <tr className="tm_accent_border_20 tm_border">
                            <td className="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_accent_bg_10">
                              Total{" "}
                            </td>
                            <td className="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_text_right tm_accent_bg_10">
                              $ 1.317,02
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
                          VELEZ SPITALE IGNACIO MARTIN
                        </td>
                        <td className="tm_width_3 tm_border_left tm_accent_border_20">
                          PEUGEOT 307 XS 1.6
                        </td>
                        <td className="tm_width_3 tm_border_left tm_accent_border_20">
                          VELEZ SPITALE IGNACIO MARTIN
                        </td>
                        <td className="tm_width_3 tm_border_right tm_border_left tm_accent_border_20">
                          PEUGEOT 307 XS 1.6
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ paddingTop: "0" }}
                          className="tm_width_3 tm_border_left tm_border_top_0"
                        >
                          CUIT: 23-27.173.499-9
                        </td>
                        <td
                          style={{ paddingTop: "0" }}
                          className="tm_width_3 tm_border_left tm_border_top_0"
                        >
                          Dominio: FKQ208
                        </td>
                        <td
                          style={{ paddingTop: "0" }}
                          className="tm_width_3 tm_border_top_0 tm_border_left tm_accent_border_20"
                        >
                          CUIT: 23-27.173.499-9
                        </td>
                        <td
                          style={{ paddingTop: "0" }}
                          className="tm_width_3 tm_border_top_0 tm_border_left tm_border_right tm_accent_border_20"
                        >
                          Dominio: FKQ208
                        </td>
                      </tr>
                      <tr>
                        <td className="tm_width_3 tm_border_left tm_border_top_0">
                          VENC.: 10/09/2023
                        </td>
                        <td className="tm_width_3 tm_border_left tm_border_top_0">
                          TOTAL: $ 1.317,02
                        </td>
                        <td className="tm_width_3 tm_border_top_0 tm_border_left tm_accent_border_20">
                          VENC.: 10/09/2023
                        </td>
                        <td className="tm_width_3 tm_border_top_0 tm_border_left tm_border_right tm_accent_border_20">
                          TOTAL: $ 1.317,02
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
export default CeduloAuto;
