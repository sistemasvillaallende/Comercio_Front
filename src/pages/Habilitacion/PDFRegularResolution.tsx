import jsPDF from 'jspdf';
import logoMuni from "../../assets/logosecgob.png";

export interface ResolutionData {
  legajo: number;
  nro_sucursal: number;
  nro_item: number;
  nro_res: string;
  fecha_inspeccion: string;
  fecha_hab: string;
  transporte: boolean;
  usuario: string;
  fecha: string;
}

export interface CommerceData {
  titular?: string;
  nombre?: string;
  apellido?: string;
  cuit_cuil?: string;
  nom_fantasia?: string;
  nom_calle?: string;
  nro_dom?: number;
  nom_barrio?: string;
  des_com?: string;
}

export const generateRegularResolutionPDF = async (
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
    pdf.text('RESOLUCIÓN DE HABILITACIÓN DE NEGOCIOS Y CONTROL DE ALIMENTOS', 105, yPosition, { align: 'center' });

    yPosition += 20;

    // VISTO section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('VISTO:', 20, yPosition);

    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    const titular = commerceData?.titular || 'TITULAR NO ESPECIFICADO';

    const rubro = commerceData?.des_com || 'RUBRO NO ESPECIFICADO';
    const domicilio = commerceData?.nom_calle && commerceData?.nro_dom ?
      `${commerceData.nom_calle} ${commerceData.nro_dom}` :
      'DOMICILIO NO ESPECIFICADO';
    const barrio = commerceData?.nom_barrio || 'BARRIO NO ESPECIFICADO';

    const fechaInspeccion = new Date(resolutionData.fecha_inspeccion).toLocaleDateString('es-AR');

    const vistoText = `La nota de fecha 22.03.2018 en expediente 13363/2018, presentada por ${titular} solicitando autorización para la apertura de un comercio/industria que funcionará bajo el rubro: ${rubro}, ubicado en calle ${domicilio} de barrio ${barrio} de esta ciudad.`;

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

    const considerandoText1 = `que surge de acta de fecha ${fechaHab} el local de referencia cuenta con las condiciones higiénicas y sanitarias para ser habilitado.`;
    const considerando1Lines = pdf.splitTextToSize(considerandoText1, 170);
    pdf.text(considerando1Lines, 20, yPosition);
    yPosition += considerando1Lines.length * 6 + 5;

    const considerandoText2 = 'que ha dado cumplimiento a los requisitos previstos en C.T.M. (art 144).';
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

    const cuitCuil = commerceData?.cuit_cuil || 'CUIT/CUIL NO ESPECIFICADO';

    const art1Text = `Art 1º: OTORGAR la habilitación solicitada por: ${titular} CUIT/CUIL: ${cuitCuil}, registrando lo resuelto en la oficina de Comercio e Industria.`;
    const art1Lines = pdf.splitTextToSize(art1Text, 170);
    pdf.text(art1Lines, 20, yPosition);
    yPosition += art1Lines.length * 6 + 10;

    const art2Text = 'Art 2º: Comuníquese al interesado y archívese.';
    pdf.text(art2Text, 20, yPosition);
    yPosition += 20;

    // Resolution details
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(`RESOLUCIÓN: ${resolutionData.nro_res}.`, 20, yPosition);
    yPosition += 8;
    pdf.text(`INSCRIPCIÓN MUNICIPAL N.º: ${resolutionData.legajo}.`, 20, yPosition);

    // Save PDF
    const fileName = `Resolucion_${resolutionData.legajo}_${resolutionData.nro_res.replace(/\//g, '_')}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};