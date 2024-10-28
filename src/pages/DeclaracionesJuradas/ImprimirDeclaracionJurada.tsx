import { useEffect, useState } from "react";
import axios from "axios";
import banner from "../../assets/ddjj/banner.jpeg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { ImpresionDDJJ } from "../../interfaces/Comercio";
import { formatDate } from "../../utils/helper";

const ImprimirDeclaracionJurada = () => {
  const navigate = useNavigate();
  const { legajo, transaccion } = useParams<{ legajo: string; transaccion: string }>();
  const [impresionDDJJ, setImpresionDDJJ] = useState<ImpresionDDJJ | null>(null);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Indycom/ImprimirDDJJ?legajo=${legajo}&nro_transaccion=${transaccion}`);
      setImpresionDDJJ(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de la declaración jurada:", error);
    }
  };

  const fecha = new Date();

  const downloadPDF = () => {
    const input = document.getElementById("declaracion-jurada");
    const button = document.getElementById("download-button");
    const printButton = document.getElementById("print-button");
    if (input && button && printButton) {
      button.style.display = "none"; // Hide the button
      printButton.style.display = "none"; // Hide the print button
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth() - 30; // 15px padding on each side
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 15, 15, pdfWidth, pdfHeight);
        pdf.save("declaracion_jurada.pdf");
        button.style.display = "block"; // Show the button again
        printButton.style.display = "block"; // Show the print button again
      });
    }
  };

  const printDocument = () => {
    const input = document.getElementById("libredeuda");
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
                       <html>
              <head>
                <title>Print Libre Deuda</title>
                <style>
                  body {
                    margin: 0;
                    display: flex;
                    justify-content: flex-start; 
                    align-items: flex-start; 
                    height: 100vh;
                    background-color: white;
                  }
                  img {
                    width: 100%; 
                    height: auto;
                  }
                </style>
              </head>
              <body>
                <img src="${imgData}" onload="window.print();" />
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      });
    }
  };

  const formatearFecha = (fecha: Date) => {
    const fechaFormateada = `${fecha.getDate().toString().padStart(2, "0")}/${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${fecha.getFullYear()}`;
    return fechaFormateada;
  };

  const totalImporte = impresionDDJJ?.rubros.reduce((total, rubro) => total + rubro.importe, 0) || 0;

  return (
    <>
      <div className="conScroll grid grid-cols-12 gap-6 mt-12 ml-3 mr-4">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="w-[1000px] p-4" id="declaracion-jurada">
            <div className="flex justify-end no-print">
              <Box component="form" sx={{ mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
                <Button variant="contained" color="info" onClick={downloadPDF} id="download-button">
                  Descargar PDF
                </Button>
                <Button variant="contained" color="info" onClick={printDocument} id="print-button">
                  Imprimir
                </Button>
              </Box>
            </div>
            <div id="libredeuda" className="bg-white w-full z-50">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img src={banner} alt="Logo Villa Allende" />
                </div>
                <div className="text-sm text-right">
                  <p>Fecha Impresión: {formatearFecha(fecha)}</p>
                  <p>DDJJ N° {impresionDDJJ?.nro_transaccion}</p>
                </div>
              </div>

              {/* Title Box */}
              <div className="border border-gray-400 p-4 text-center mb-6">
                <p className="font-medium">DECLARACION JURADA DE INGRESOS BRUTOS</p>
                <p>QUE INCIDEN SOBRE LA ACTIVIDAD</p>
                <p>COMERCIAL, INDUSTRIAL Y DE SERVICIO</p>
              </div>

              {/* Info Section */}
              <div className="space-y-1 text-sm mb-6">
                <p>
                  LEGAJO: {impresionDDJJ?.legajo} PERÍODO: {impresionDDJJ?.periodo} VENCIMIENTO:{" "}
                  {impresionDDJJ?.vencimiento ? formatearFecha(new Date(impresionDDJJ.vencimiento)) : "N/A"}
                </p>
                <p className="font-medium">{impresionDDJJ?.nom_calle}</p>
                <p>{impresionDDJJ?.nom_barrio}</p>
                <p>
                  {impresionDDJJ?.ciudad} {impresionDDJJ?.provincia} ING. BRUTOS N°: C.U.I.T. N°: {impresionDDJJ?.cuit}
                </p>
              </div>

              {/* Table */}
              <div className="mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-2 text-left">RUBRO-SUB</th>
                      <th className="border border-gray-400 p-2 text-left">CONCEPTO</th>
                      <th className="border border-gray-400 p-2 text-right">BASE IMP/CANT.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impresionDDJJ?.rubros.map((rubro, index) => (
                      <tr key={index}>
                        <td className="border border-gray-400 p-2">{rubro.cod_rubro}</td>
                        <td className="border border-gray-400 p-2">{rubro.concepto}</td>
                        <td className="border border-gray-400 p-2 text-right">
                          {rubro.importe.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-medium">
                      <td className="border border-gray-400 p-2" colSpan={2}>
                        Total Rubros
                      </td>
                      <td className="border border-gray-400 p-2 text-right">
                        {totalImporte.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Declaration Text */}
              <div className="text-xs mb-6">
                <p>
                  DECLARO BAJO JURAMENTO QUE LOS DATOS AQUÍ INFORMADOS SON FIEL EXPRESIÓN DE LA VERDAD ME NOTIFICO DE LA
                  APLICACIÓN DE LA MULTA CORRESPONDIENTE
                </p>
                <p>EN CASO DE NO PRESENTARSE DENTRO DE LOS 5 DÍAS POSTERIORES A SU VENCIMIENTO LA PRESENTE DECLARACIÓN JURADA</p>
              </div>

              {/* Footer */}
              <div className="text-sm">
                <p className="mb-4">
                  {impresionDDJJ?.ciudad}, {formatearFecha(fecha)}
                </p>
                <div className="flex gap-12">
                  <div>
                    <p>Firma: ________________________________</p>
                    <p>DNI: _________________________________</p>
                  </div>
                  <div>
                    <p>Aclaración: ____________________________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImprimirDeclaracionJurada;