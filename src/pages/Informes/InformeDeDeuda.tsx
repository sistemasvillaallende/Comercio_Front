import React, { useEffect } from 'react'
import Table from "../../base-components/Table";
import axios from "axios";
import Swal from "sweetalert2";
import { InformeCompleto } from '../../interfaces/IndustriaComercio';
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormInline,
  FormSelect,
} from "../../base-components/Form";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import { currencyFormat } from '../../utils/helper';
import Cargando from '../Recursos/Cargando';
import { CategoriasDeuda } from '../../interfaces/IndustriaComercio';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import _, { head, set } from 'lodash';
import { useUserContext } from '../../context/UserProvider';
import Lucide from "../../base-components/Lucide";
import Logo from "../../assets/logo.png";

const InformeDeDeuda = () => {

  const { user } = useUserContext();

  const [informeCompleto, setInformeCompleto] = React.useState<InformeCompleto[]>([]);
  const [periodo, setPeriodo] = React.useState<string>("");
  const { elementoIndCom } = useIndustriaComercioContext();
  const [mostrarTabla, setMostrarTabla] = React.useState<boolean>(false);
  const [cargando, setCargando] = React.useState<boolean>(false);
  const [categoriasDeudaAuto, setCategoriasDeudaAuto] = React.useState<CategoriasDeuda[]>([]);
  const [categoriaDeuda, setCategoriaDeuda] = React.useState<any>();
  const [tipoDeInforme, setTipoDeInforme] = React.useState<string>("1");

  const [btnImprimir, setBtnImprimir] = React.useState<boolean>(false);


  useEffect(() => {
    conseguirListaCategoriasDeudaAuto();
  }, [])

  const handleAuditoria = async () => {
    if (periodo === "") {
      Swal.fire({
        title: 'Error',
        text: 'Debes ingresar un periodo para continuar.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      return;
    }
    if (validarFormatoPeriodo(periodo) === false) {
      Swal.fire({
        title: 'Error',
        text: 'Debes ingresar un periodo con el formato AAAA/MM para continuar.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      return;
    }
    const { value } = await Swal.fire({
      title: 'Autorización',
      input: 'textarea',
      inputPlaceholder: 'Observaciones',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: "#27a3cf",
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar un texto para continuar';
        }
      },
    });

    if (value) {
      handleInformeCompleto(elementoIndCom?.legajo, periodo, categoriaDeuda, value);
    }
  }

  const handleInformeCompleto = async (legajo: any, periodo: string, categoriaDeuda: string, observaciones: string) => {

    try {
      setCargando(true);
      const bodyConsulta = {
        "id_auditoria": 0,
        "fecha": "string",
        "usuario": "string",
        "proceso": "string",
        "identificacion": "string",
        "autorizaciones": "string",
        "observaciones": observaciones,
        "detalle": "string",
        "ip": "string"
      }

      let deudaDesde = categoriaDeuda;
      let deudaHasta = categoriaDeuda;

      if (tipoDeInforme) {
        deudaDesde = '1';
        deudaHasta = '50';
      }

      if (tipoDeInforme === '1') {
        deudaDesde = '1';
        deudaHasta = '50';
      }

      if (tipoDeInforme === '2') {
        deudaDesde = categoriaDeuda;
        deudaHasta = categoriaDeuda;
      }

      if (categoriaDeuda === '0') {
        deudaDesde = '1';
        deudaHasta = '50';
      }

      const URL = `${import.meta.env.VITE_URL_API_IYC}Ctasctes_indycom/ListarCtacte?legajo=${legajo}&tipo_consulta=${tipoDeInforme}&cate_deuda_desde=${deudaDesde}&cate_deuda_hasta=${deudaHasta}`

      const response = await axios.get(URL);
      setInformeCompleto(response.data);
      setMostrarTabla(true);
      setCargando(false);
      setBtnImprimir(true);
      console.log(response)
      if (response.data === "") {
        Swal.fire({
          title: 'Error',
          text: 'Al parecer no hay datos para mostrar, por favor intente con otros parámetros.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
      }
      setMostrarTabla(true);
      setCargando(false);

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Al parecer hay un error al cargar los datos, por favor intente nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      setCargando(false);
    }

  };

  const validarFormatoPeriodo = (periodo: string) => {
    const formatoRegex = /^\d{4}\/\d{2}$/;
    if (formatoRegex.test(periodo)) {
      return true;
    } else {
      return false;
    }
  }

  const conseguirListaCategoriasDeudaAuto = async () => {
    try {
      const URL = `${import.meta.env.VITE_URL_API_IYC}Indycom/ListarCategoriasIyc`;
      const response = await axios.get(URL);
      setCategoriasDeudaAuto(response.data);
    } catch (error) {
      console.log(error)
    }
  }

  const handleImprimir = () => {
    const doc = new jsPDF();
    doc.setFontSize(8);
    doc.addImage(Logo, 'PNG', 15, 10, 50, 13);
    doc.text(`INFORME COMPLETO DE AUTOMOTORES`, 70, 15);
    const fecha = new Date();
    const fechaActual = fecha.toLocaleDateString();
    doc.text(`DOMINIO: ${elementoIndCom?.legajo}`, 70, 19);
    doc.text(`CONTRIBUYENTE: ${elementoIndCom?.nom_fantasia}`, 70, 23);

    const columns = ['#', 'Concepto', 'Categoria', 'Periodo', 'Debe', 'Haber', 'Plan de Pago', 'Nro. Proc.'];
    const body = informeCompleto.map((item, index) => [
      index + 1,
      item.des_movimiento,
      item.des_categoria,
      item.periodo,
      currencyFormat(item.debe),
      currencyFormat(item.haber),
      item.nro_plan,
      item.nro_procuracion
    ]);

    //totales
    const debe = _.sumBy(informeCompleto, 'debe');
    const haber = _.sumBy(informeCompleto, 'haber');
    const totalDebe = debe;
    const totalHaber = haber;
    const totalGeneral = debe - haber;
    // totalOIM es el 2% del Total General
    const totalOIM = (debe - haber) * 0.02;
    const saldo = totalGeneral + totalOIM;

    body.push(['', '', '', 'Parcial :', currencyFormat(totalDebe), currencyFormat(totalHaber), '', '']);
    body.push(['', '', '', '', '', 'TOTAL:', currencyFormat(totalGeneral)]);
    body.push(['', '', '', '', '', 'O.I.M.:', currencyFormat(totalOIM)]);
    body.push(['', '', '', '', '', 'SALDO:', currencyFormat(saldo)]);


    autoTable(doc, {
      startY: 30,
      head: [columns],
      body: body
    })

    // información del usuario que imprimió el informe

    const nombreUsuario = user?.userName;
    const fechaImpresion = fecha.toLocaleDateString();
    const horaImpresion = fecha.toLocaleTimeString();

    doc.text(`Usuario: ${nombreUsuario}`, 15, 280);
    doc.text(`Fecha: ${fechaImpresion}`, 15, 284);
    doc.text(`Hora: ${horaImpresion}`, 15, 288);

    doc.save(`informe_de_deuda_${elementoIndCom?.legajo}_${fechaActual}.pdf`);
  }

  return (
    <>
      <div className="flex flex-col items-center mt-4">
        <FormInline>
          <FormLabel
            htmlFor="horizontal-form-1"
            className="sm:w-20"
          >
            Periodo
          </FormLabel>
          <FormInput
            id="horizontal-form-1"
            type="text"
            placeholder="AAAA/MM"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />

          <FormLabel
            htmlFor="horizontal-form-1"
            className="sm:w-10"
          >
            Tipo
          </FormLabel>
          <FormSelect
            className="sm:mr-1"
            aria-label="Default select example"
            value={tipoDeInforme}
            onChange={(e) => setTipoDeInforme(e.target.value)}
          >
            <option value="1">Todos</option>
            <option value="2">Deudas</option>
          </FormSelect>

          {tipoDeInforme === '2' && (
            <>
              <FormLabel
                htmlFor="horizontal-form-1"
                className="sm:w-20"
              >
                Categoria
              </FormLabel>
              <FormSelect
                className="sm:mr-2"
                aria-label="Default select example"
                value={categoriaDeuda}
                onChange={(e) => setCategoriaDeuda(e.target.value)}
              >
                <option>seleccionar categoria</option>
                {Array.isArray(categoriasDeudaAuto) &&
                  categoriasDeudaAuto.map((tipo: any) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.text}
                    </option>
                  ))}
              </FormSelect>
            </>
          )}

          <Button
            variant="primary"
            className='ml-3'
            onClick={handleAuditoria}
          >
            <Lucide icon="Filter" className="w-4 h-4 mr-1" />
            Filtrar
          </Button>
          {btnImprimir && (
            <>
              <Button variant="soft-warning" className="ml-3" onClick={handleImprimir}>
                <Lucide icon="DownloadCloud" className="w-4 h-4 mr-1" />
                PDF
              </Button>
            </>
          )}
        </FormInline>
      </div>


      <div className="overflow-x-auto mt-3">
        {cargando && <Cargando mensaje="cargando" />}
        {mostrarTabla && (
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                  Nro. Transac.
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-left">
                  Concepto
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-left">
                  Categoria
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                  Periodo
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-right">
                  Debe
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-right">
                  Haber
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                  Plan de Pago
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                  Nro. Proc.
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {informeCompleto.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="border-b-0 whitespace-nowrap text-center">
                    {item.nro_transaccion}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-left">
                    {item.des_movimiento}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-left">
                    {item.des_categoria}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-center">
                    {item.periodo}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-right">
                    {currencyFormat(item.debe)}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-right">
                    {currencyFormat(item.haber)}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-center">
                    {item.nro_plan}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-center">
                    {item.nro_procuracion}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </div>
    </>
  )
}

export default InformeDeDeuda