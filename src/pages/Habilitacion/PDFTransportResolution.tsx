import jsPDF from 'jspdf';
import logoMuni from "../../assets/logosecgob.png";
import { ResolutionData, CommerceData } from './PDFRegularResolution';

export const generateTransportResolutionPDF = async (
  resolutionData: ResolutionData,
  commerceData?: CommerceData
) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add logo
    try {
      const logoImg = new Image();
      logoImg.src = logoMuni;
      await new Promise((resolve) => {
        logoImg.onload = resolve;
      });

      const logoWidth = 60;
      const logoHeight = 17;
      const logoX = (210 - logoWidth) / 2;
      pdf.addImage(logoImg, 'JPEG', logoX, 15, logoWidth, logoHeight);
    } catch (error) {
      console.warn('No se pudo cargar el logo:', error);
    }

    let yPosition = 45;

    // Title
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('RESOLUCIÓN DE HABILITACIÓN DE TRANSPORTE', 105, yPosition, { align: 'center' });

    yPosition += 20;

    // VISTO section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('VISTO:', 20, yPosition);

    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    const nombre = commerceData?.nombre || 'NOMBRE NO ESPECIFICADO';
    const apellido = commerceData?.apellido || 'APELLIDO NO ESPECIFICADO';
    const rubro = commerceData?.des_com || 'RUBRO NO ESPECIFICADO';
    const fechaAlta = new Date(resolutionData.fecha_alta || resolutionData.fecha_inspeccion).toLocaleDateString('es-AR');
    const nroExpediente = resolutionData.nro_expediente_mesa_ent || 'N° EXPEDIENTE NO ESPECIFICADO';
    const marcaVehiculo = commerceData?.marca_vehiculo || 'MARCA NO ESPECIFICADA';
    const modeloVehiculo = commerceData?.modelo_vehiculo || 'MODELO NO ESPECIFICADO';
    const anioVehiculo = commerceData?.anio_vehiculo || 'AÑO NO ESPECIFICADO';
    const dominioVehiculo = commerceData?.dominio_vehiculo || 'DOMINIO NO ESPECIFICADO';

    const vistoText = `La nota de fecha ${fechaAlta} en expediente ${nroExpediente}, presentada por ${nombre} ${apellido} solicitando autorización para la explotación de ${rubro} y la habilitación a tal efecto del vehículo marca: ${marcaVehiculo} ${modeloVehiculo} / ${anioVehiculo} dominio: ${dominioVehiculo}.`;

    const vistoLines = pdf.splitTextToSize(vistoText, 170);
    pdf.text(vistoLines, 20, yPosition);
    yPosition += vistoLines.length * 6 + 10;

    // Y CONSIDERANDO section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Y CONSIDERANDO:', 20, yPosition);

    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    const fechaHab = new Date(resolutionData.fecha_hab).toLocaleDateString('es-AR');

    const considerandoText1 = `que se ha verificado en fecha ${fechaHab} que el solicitante cuenta con los requisitos necesarios para el servicio de transporte.`;
    const considerando1Lines = pdf.splitTextToSize(considerandoText1, 170);
    pdf.text(considerando1Lines, 20, yPosition);
    yPosition += considerando1Lines.length * 6 + 5;

    const considerandoText2 = 'que ha cumplido con las normativas vigentes para servicios de transporte municipal.';
    const considerando2Lines = pdf.splitTextToSize(considerandoText2, 170);
    pdf.text(considerando2Lines, 20, yPosition);
    yPosition += considerando2Lines.length * 6 + 15;

    // RESUELVE section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('EL DEPARTAMENTO EJECUTIVO DE LA MUNICIPALIDAD DE VILLA ALLENDE', 105, yPosition, { align: 'center' });

    yPosition += 15;
    pdf.text('RESUELVE', 105, yPosition, { align: 'center' });

    yPosition += 15;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    const cuitCuil = commerceData?.cuit_cuil || commerceData?.cuit_cuil || 'CUIT/CUIL NO ESPECIFICADO';
    const nombreContribuyente = `${nombre} ${apellido}`;

    const art1Text = `ART. 1º: Habilitar al Sr/a: ${nombreContribuyente} CUIT/CUIL: ${cuitCuil} a prestar ${rubro}, autorizando a este efecto el vehículo marca: ${marcaVehiculo} ${modeloVehiculo} / ${anioVehiculo} dominio: ${dominioVehiculo}.`;
    const art1Lines = pdf.splitTextToSize(art1Text, 170);
    pdf.text(art1Lines, 20, yPosition);
    yPosition += art1Lines.length * 6 + 10;

    const art2Text = 'Art 2º: La presente habilitación debe ser exhibida en lugar visible del vehículo.';
    const art2Lines = pdf.splitTextToSize(art2Text, 170);
    pdf.text(art2Lines, 20, yPosition);
    yPosition += art2Lines.length * 6 + 5;

    const art3Text = 'Art 3º: Comuníquese al interesado y archívese.';
    pdf.text(art3Text, 20, yPosition);
    yPosition += 20;

    // Resolution details
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(`RESOLUCIÓN: ${resolutionData.nro_res}.`, 20, yPosition);
    yPosition += 8;
    pdf.text(`INSCRIPCIÓN MUNICIPAL Nº: ${resolutionData.legajo}.`, 20, yPosition);

    // Save PDF
    const fileName = `Resolucion_Transporte_${resolutionData.legajo}_${resolutionData.nro_res.replace(/\//g, '_')}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating transport PDF:', error);
    throw error;
  }
};