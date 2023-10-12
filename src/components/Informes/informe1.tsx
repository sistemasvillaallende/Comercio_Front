import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ReportToPDF() {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Obtén el elemento con el ID "informe"
    const element = document.getElementById("informe");
    if (element != null) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        doc.addImage(imgData, "PNG", 10, 10, 190, 0);
        doc.save("informe.pdf");
      });
    }
  };

  return (
    <div>
      {/* Aquí colocas tu contenido */}
      <div id="informe">
        <h1>Informe PDF</h1>
        <p>Este es un informe en PDF generado desde HTML.</p>
        {/* Agrega tu contenido adicional, como tablas, gráficos, etc. */}
      </div>
      <button onClick={generatePDF}>Generar PDF</button>
    </div>
  );
}

export default ReportToPDF;
