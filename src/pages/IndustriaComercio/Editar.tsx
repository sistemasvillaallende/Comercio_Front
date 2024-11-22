import { useEffect, useState } from "react";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import { ElementoIndustriaComercio } from "../../interfaces/IndustriaComercio";
import { convertirFecha, fechaActual } from "../../utils/GeneralUtils";
import { cond, set } from "lodash";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FormSelect,
  FormInput,
  FormLabel,
  FormSwitch,
  InputGroup,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserProvider";

import SeleccionadorDePropietarios from "./SeleccionadorDePropietarios";
import { Propietario } from '../../interfaces/IndustriaComercio';


const Editar = () => {
  const {
    elementoIndCom,
    tipoLiquidacion,
    tipoCondicionIVA,
    situacionJudicial,
    tipoDeEntidad,
    listadoTipoLiquidacion,
    listadoTipoDeEntidad,
    listadoTipoCondicionIVA,
    listadoSituacionJudicial,
    listadoZonas,
    traerElemento
  } = useIndustriaComercioContext();

  const [ventanaPropietario, setVentanaPropietario] = useState<boolean>(false);
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState<Propietario | null>(null);

  const [elementoIndustriaComercio, setElementoIndustriaComercio] = useState<ElementoIndustriaComercio>();

  const { user } = useUserContext();

  const navigate = useNavigate();

  const [legajo, setLegajo] = useState<number | null>(null);
  const [nroBad, setNroBad] = useState<number | null>(null);
  const [desCom, setDesCom] = useState<string>("");
  const [nomFantasia, setNomFantasia] = useState<string>("");
  const [nroDom, setNroDom] = useState<number | null>(null);
  const [codZona, setCodZona] = useState<string>("");
  const [priPeriodo, setPriPeriodo] = useState<string>("");
  const [tipoLiquidacionElemento, setTipoLiquidacionElemento] = useState<number | null>(null);
  const [dadoBaja, setDadoBaja] = useState<boolean>(false);
  const [fechaBaja, setFechaBaja] = useState<string>("");
  const [exento, setExento] = useState<boolean>(false);
  const [perUlt, setPerUlt] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaHab, setFechaHab] = useState<string>("");
  const [nroExpMesaEnt, setNroExpMesaEnt] = useState<string>("");
  const [nroIngBruto, setNroIngBruto] = useState<string>("");
  const [nroCuit, setNroCuit] = useState<string>("");
  const [transporte, setTransporte] = useState<boolean>(false);
  const [fechaAlta, setFechaAlta] = useState<string>("");
  const [nomCalle, setNomCalle] = useState<string>("");
  const [pisoDptoEsp, setPisoDptoEsp] = useState<string>("");
  const [localEsp, setLocalEsp] = useState<string>("");
  const [nomBarrioDomEsp, setNomBarrioDomEsp] = useState<string>("");
  const [emiteCedulon, setEmiteCedulon] = useState<boolean>(false);
  const [codSituacionJudicial, setCodSituacionJudicial] = useState<number | null>(null);
  const [ocupacionVereda, setOcupacionVereda] = useState<boolean>(false);
  const [codZonaLiquidacion, setCodZonaLiquidacion] = useState<string>("");
  const [fechaDdjjAnual, setFechaDdjjAnual] = useState<string>("");
  const [codCaracter, setCodCaracter] = useState<number | null>(null);
  const [categoriaIva, setCategoriaIva] = useState<number>(0);
  const [cuitVecinoDigital, setCuitVecinoDigital] = useState<string>("");
  const [vtoInscripcion, setVtoInscripcion] = useState<string>("");
  const [observacionesAuditoria, setObservacionesAuditoria] = useState<string>("");
  const [fechaAuditoria, setFechaAuditoria] = useState<string>("");
  const [ciudad, setCiudad] = useState<string>("");
  const [codCalle, setCodCalle] = useState<number>(0);

  useEffect(() => {
    if (elementoIndCom) {
      setCodCalle(elementoIndCom.cod_calle);
      setElementoIndustriaComercio(elementoIndCom);
      setLegajo(elementoIndCom.legajo);
      setNroExpMesaEnt(elementoIndCom.nro_exp_mesa_ent);
      setFechaAlta(elementoIndCom.fecha_alta);
      setNomFantasia(elementoIndCom.nom_fantasia);
      setDesCom(elementoIndCom.des_com);
      setNroBad(elementoIndCom.nro_bad);
      setNroDom(elementoIndCom.nro_dom);
      setCodZona(elementoIndCom.cod_zona);
      setPriPeriodo(elementoIndCom.pri_periodo);
      setTipoLiquidacionElemento(elementoIndCom.tipo_liquidacion);
      setDadoBaja(elementoIndCom.dado_baja);
      setFechaBaja(elementoIndCom.fecha_baja);
      setExento(elementoIndCom.exento);
      setPerUlt(elementoIndCom.per_ult);
      setFechaInicio(elementoIndCom.fecha_inicio);
      setFechaHab(elementoIndCom.fecha_hab);
      setNroExpMesaEnt(elementoIndCom.nro_exp_mesa_ent);
      setNroIngBruto(elementoIndCom.nro_ing_bruto);
      setNroCuit(elementoIndCom.nro_cuit);
      setNomCalle(elementoIndCom.nom_calle);
      setPisoDptoEsp(elementoIndCom.piso_dpto_esp);
      setLocalEsp(elementoIndCom.local_esp);
      setNomBarrioDomEsp(elementoIndCom.nom_barrio_dom_esp);
      setCodZona(elementoIndCom.cod_zona);
      setCodZonaLiquidacion(elementoIndCom.cod_zona_liquidacion);
      setCiudad(elementoIndCom.ciudad);
      setPriPeriodo(elementoIndCom.pri_periodo);
      setPerUlt(elementoIndCom.per_ult);
      setNroCuit(elementoIndCom.nro_cuit);
      setCuitVecinoDigital(elementoIndCom.cuit_vecino_digital);
      setTransporte(elementoIndCom.transporte);
      setExento(elementoIndCom.exento);
      setCodCaracter(elementoIndCom.cod_caracter);
      setCategoriaIva(elementoIndCom.cod_cond_ante_iva);
      setNroIngBruto(elementoIndCom.nro_ing_bruto);
      setFechaInicio(elementoIndCom.fecha_inicio);
      setFechaHab(elementoIndCom.fecha_hab);
      setVtoInscripcion(elementoIndCom.vto_inscripcion);
      setFechaBaja(elementoIndCom.fecha_baja);
      setDadoBaja(elementoIndCom.dado_baja);
      setCodSituacionJudicial(elementoIndCom.cod_situacion_judicial);
      setFechaDdjjAnual(elementoIndCom.fecha_ddjj_anual);
      setEmiteCedulon(elementoIndCom.emite_cedulon);
      setOcupacionVereda(elementoIndCom.ocupacion_vereda);
    }
  }, [elementoIndCom]);

  useEffect(() => {
    if (propietarioSeleccionado) {
      setNroBad(propietarioSeleccionado?.nro_bad || 0)
      setNroCuit(propietarioSeleccionado?.cuit || "0")
      setNroIngBruto(propietarioSeleccionado?.cuit || "0")
      setCuitVecinoDigital(propietarioSeleccionado?.cuit || "0")
    }
  }, [propietarioSeleccionado]);

  const handleAuditoria = async () => {
    const { value } = await Swal.fire({
      title: 'Autorización',
      input: 'textarea',
      inputPlaceholder: 'Observaciones',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: "#27a3cf",
      inputValidator: (value: any) => {
        if (!value) {
          return 'Debes ingresar un texto para continuar';
        }
      },
    });

    if (value) {
      actualizarIyC(value);
    }
  }

  const actualizarIyC = (auditoria: String) => {
    const urlApi = `${import.meta.env.VITE_URL_BASE}Indycom/UpdateDatosGenerales`;
    const fechaActual = new Date();
    const requestBody = {
      "legajo": legajo,
      "nro_bad": nroBad,
      "nro_contrib": 0,
      "des_com": desCom,
      "nom_fantasia": nomFantasia,
      "cod_calle": codCalle,
      "nro_dom": nroDom,
      "cod_barrio": 10,
      "cod_tipo_per": 1,
      "cod_zona": codZona,
      "pri_periodo": priPeriodo,
      "tipo_liquidacion": tipoLiquidacionElemento,
      "dado_baja": dadoBaja,
      "fecha_baja": fechaBaja,
      "exento": exento,
      "vencimiento_eximido": "2023-10-11T14:49:04.2638915-03:00",
      "per_ult": perUlt,
      "fecha_inicio": fechaInicio,
      "fecha_hab": fechaHab,
      "nro_res": "",
      "nro_exp_mesa_ent": nroExpMesaEnt,
      "nro_ing_bruto": nroIngBruto,
      "nro_cuit": nroCuit,
      "transporte": transporte,
      "fecha_alta": fechaAlta,
      "nom_calle": nomCalle,
      "nom_barrio": nomBarrioDomEsp,
      "ciudad": ciudad,
      "provincia": "CORDOBA                                 ",
      "pais": "ARGENTINA                               ",
      "cod_postal": "5105",
      "cod_calle_dom_esp": nroDom,
      "nom_calle_dom_esp": nomCalle,
      "nro_dom_esp": nroDom,
      "piso_dpto_esp": pisoDptoEsp,
      "local_esp": localEsp,
      "cod_barrio_dom_esp": 10,
      "nom_barrio_dom_esp": nomBarrioDomEsp,
      "ciudad_dom_esp": ciudad,
      "provincia_dom_esp": "CORDOBA                                 ",
      "pais_dom_esp": "ARGENTINA                               ",
      "cod_postal_dom_esp": "5105",
      "fecha_cambio_domicilio": "2022-07-15T09:21:39",
      "emite_cedulon": emiteCedulon,
      "cod_situacion_judicial": codSituacionJudicial?.toString(),
      "telefono1": "",
      "telefono2": "",
      "celular1": "",
      "celular2": "",
      "ocupacion_vereda": ocupacionVereda,
      "con_sucursal": false,
      "nro_sucursal": 0,
      "es_transferido": false,
      "con_ddjj_anual": false,
      "cod_zona_liquidacion": codZonaLiquidacion,
      "debito_automatico": false,
      "clave_pago": "0000000011013142973",
      "fecha_ddjj_anual": fechaDdjjAnual,
      "email_envio_cedulon": "jessicacba@live.com.ar",
      "telefono": "",
      "celular": "351-2199425",
      "reempadronamiento": true,
      "empadronado": 0,
      "fecha_empadronado": "2023-10-11T14:49:04.2638926-03:00",
      "es_agencia": 0,
      "clave_gestion": "OS5034AD",
      "nro_local": localEsp,
      "cedulon_digital": 0,
      "piso_dpto": pisoDptoEsp,
      "cod_cond_ante_iva": categoriaIva,
      "cod_caracter": codCaracter,
      "categoria_iva": "I",
      "otra_entidad": "",
      "convenio_uni": 0,
      "cod_nueva_zona": "1 ",
      "fecha_vecino_digital": "2023-10-11T14:49:04.2638929-03:00",
      "cuit_vecino_digital": nroCuit,
      "vto_inscripcion": vtoInscripcion,
      "titular": "",
      "objAuditoria": {
        "id_auditoria": 0,
        "fecha": fechaActual,
        "usuario": user?.userName,
        "proceso": "",
        "identificacion": "",
        "autorizaciones": "",
        "observaciones": "",
        "detalle": "",
        "ip": ""
      }
    };

    axios
      .post(urlApi, requestBody)
      .then((response) => {
        if (response.data) {
          Swal.fire({
            title: "Actualizado",
            text: "Se actualizó correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          });
          navigate(`/${legajo}/ver`);
        } else {
          Swal.fire({
            title: "Error al actualizar",
            text: "No se pudo actualizar",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al realizar la solicitud.",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });
      });
  };

  const cancelar = () => {
    navigate(`/${legajo}/ver`);
  };

  return (
    <>

      {ventanaPropietario && (
        <SeleccionadorDePropietarios {...{ setPropietarioSeleccionado, setVentanaPropietario }} />
      )}

      <div className="paginas conScroll grid grid-cols-12 gap-6 mt-2 ml-3 mr-4 p-4">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Datos del Comercio o Industria</h2>
          </div>
          <div className="grid grid-cols-12 gap-6 mt-3">

            <div className="col-span-12 intro-y lg:col-span-2 mr-2">
              <FormLabel htmlFor="fomrDominio">Legajo</FormLabel>
              <FormInput
                id="forLegajo"
                type="text"
                value={legajo?.toString() ?? ''}
                disabled
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Nro. Expediente</FormLabel>
              <FormInput
                id="formExpediente"
                type="text"
                value={nroExpMesaEnt}
                onChange={(e) => setNroExpMesaEnt(e.target.value)}
                disabled
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formFechaDeAlta">Fecha de Alta</FormLabel>
              <FormInput
                type="date"
                id="formFechaDeAlta"
                value={fechaAlta.slice(0, 10)}
                onChange={(e) => setFechaAlta(e.target.value)}
                disabled
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Nombre de Fantasía</FormLabel>
              <FormInput
                id="formNOmbreDeFantasia"
                type="text"
                value={nomFantasia}
                onChange={(e) => setNomFantasia(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Descripcion</FormLabel>
              <FormInput
                id="formDescripcion"
                type="text"
                value={desCom}
                onChange={(e) => setDesCom(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Badec</FormLabel>
              <InputGroup>
                <FormInput
                  id="formPropietario"
                  type="text"
                  value={nroBad ?? ''}
                  readOnly
                />
                <InputGroup.Text
                  id="input-group-price"
                  className="cursor-pointer"
                  onClick={() => setVentanaPropietario(true)}
                >
                  <Lucide icon="Search" className="w-4 h-4" />
                </InputGroup.Text>
              </InputGroup>
            </div>

            <div className="col-span-12 intro-y lg:col-span-12">
              <h2>Datos del Domicilio</h2>
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Calle</FormLabel>
              <FormInput
                id="formCalle"
                type="text"
                value={nomCalle}
                onChange={(e) => setNomCalle(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-1">
              <FormLabel htmlFor="formMarca">Nro. Dom</FormLabel>
              <FormInput
                id="formNroDom"
                type="number"
                value={nroDom ?? ''}
                onChange={(e) => setNroDom(Number(e.target.value))}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-1">
              <FormLabel htmlFor="formMarca">Piso</FormLabel>
              <FormInput
                id="formPiso"
                type="text"
                value={pisoDptoEsp}
                onChange={(e) => setPisoDptoEsp(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Nro. Local</FormLabel>
              <FormInput
                id="formNroLocal"
                type="text"
                value={localEsp}
                onChange={(e) => setLocalEsp(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Barrio</FormLabel>
              <FormInput
                id="formBarrio"
                type="text"
                value={nomBarrioDomEsp}
                onChange={(e) => setNomBarrioDomEsp(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Zona</FormLabel>
              <FormSelect
                id="formTipoLiquidacion"
                value={codZona}
                onChange={(e) => {
                  setCodZona(e.target.value)
                }}
              >
                {listadoZonas?.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.value}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Ciudad</FormLabel>
              <FormInput
                id="formCiudad"
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-12">
              <h2>Datos de Liquidación</h2>
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Primer Periodo</FormLabel>
              <FormInput
                id="formPrimerPeriodo"
                type="text"
                value={priPeriodo}
                onChange={(e) => setPriPeriodo(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Ultimo Periodo</FormLabel>
              <FormInput
                id="formUltimoPeriodo"
                type="text"
                value={perUlt}
                onChange={(e) => setPerUlt(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-4">
              <FormLabel htmlFor="formMarca">Tipo de Liquidación</FormLabel>
              <FormSelect
                id="formTipoLiquidacion"
                value={tipoLiquidacionElemento?.toString() ?? ''}
                onChange={(e) => setTipoLiquidacionElemento(Number(e.target.value))}
              >
                <option value="">Seleccione un tipo de liquidación</option>
                {listadoTipoLiquidacion?.map((tipo) => (
                  <option key={tipo.cod_tipo_liq} value={tipo.cod_tipo_liq}>
                    {tipo.descripcion_tipo_liq}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">CUIT</FormLabel>
              <FormInput
                id="formCUIT"
                type="text"
                value={nroCuit}
                onChange={(e) => setNroCuit(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">CUIT VD</FormLabel>
              <FormInput
                id="formCUIT"
                type="text"
                value={cuitVecinoDigital}
                onChange={(e) => setCuitVecinoDigital(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formTransporte">Transporte</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="formTransporte"
                  type="checkbox"
                  checked={transporte}
                  onChange={(e) => setTransporte(e.target.checked)}
                />
              </FormSwitch>
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formResponsable">Exento</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="formExento"
                  type="checkbox"
                  checked={exento}
                  onChange={(e) => setExento(e.target.checked)}
                />
              </FormSwitch>
            </div>

            <div className="col-span-12 intro-y lg:col-span-4">
              <FormLabel htmlFor="formMarca">Caracter de la Entidad</FormLabel>
              <FormSelect
                id="formTipoLiquidacion"
                value={codCaracter?.toString() ?? ''}
                onChange={(e) => setCodCaracter(Number(e.target.value))}
              >
                <option value="">Seleccione un Caracter de la Entidad</option>
                {listadoTipoDeEntidad?.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.text}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="col-span-12 intro-y lg:col-span-4">
              <FormLabel htmlFor="formMarca">Condición Frente al IVA</FormLabel>
              <FormSelect
                id="formTipoLiquidacion"
                value={categoriaIva}
                onChange={(e) => setCategoriaIva(parseInt(e.target.value))}
              >
                <option value="">Seleccione una Condición Frente al IVA</option>
                {listadoTipoCondicionIVA?.map((tipo) => (
                  <option key={tipo.cod_cond_ante_iva} value={tipo.cod_cond_ante_iva}>
                    {tipo.des_cond_ante_iva}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Ingresos Brutos</FormLabel>
              <FormInput
                id="formIngresosBrutos"
                type="text"
                value={nroIngBruto}
                onChange={(e) => setNroIngBruto(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formFechaInicio">Fecha Inicio</FormLabel>
              <FormInput
                type="date"
                id="formFechaInicio"
                value={fechaInicio.slice(0, 10)}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formFechaHabilitacion">Fecha Habilitación</FormLabel>
              <FormInput
                type="date"
                id="formFechaHabilitacion"
                value={fechaHab.slice(0, 10)}
                onChange={(e) => setFechaHab(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formvtoInscripcion">Vto. Inscrip</FormLabel>
              <FormInput
                type="date"
                id="formvtoInscripcion"
                value={vtoInscripcion.slice(0, 10)}
                onChange={(e) => setVtoInscripcion(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formvtofechaBaja">Fecha Baja</FormLabel>
              <FormInput
                type="date"
                id="formvtofechaBaja"
                value={fechaBaja.slice(0, 10)}
                onChange={(e) => setFechaBaja(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formDadoBaja">Baja</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="formDadoBaja"
                  type="checkbox"
                  checked={dadoBaja}
                  onChange={(e) => setDadoBaja(e.target.checked)}
                />
              </FormSwitch>
            </div>

            <div className="col-span-12 intro-y lg:col-span-4">
              <FormLabel htmlFor="formSituacionJudicial">Situación Comercio</FormLabel>
              <FormSelect
                id="formSituacionJudicial"
                value={codSituacionJudicial?.toString() ?? ''}
                onChange={(e) => setCodSituacionJudicial(parseInt(e.target.value))}
              >
                <option value="">Seleccione una Situación Comercio</option>
                {listadoSituacionJudicial?.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.text}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formvtofechaDDJJ">Fecha DDJJ</FormLabel>
              <FormInput
                type="date"
                id="formvtofechaDDJJ"
                value={fechaDdjjAnual.slice(0, 10)}
                onChange={(e) => setFechaDdjjAnual(e.target.value)}
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-12">
              <h2>Entrega Cedulón</h2>
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formEmiteCedulon">Emite Cedulón</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="formEmiteCedulon"
                  type="checkbox"
                  checked={emiteCedulon}
                  onChange={(e) => setEmiteCedulon(e.target.checked)}
                />
              </FormSwitch>
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formVeredaOcupad">Vereda Ocupad</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="formVeredaOcupad"
                  type="checkbox"
                  checked={ocupacionVereda}
                  onChange={(e) => setOcupacionVereda(e.target.checked)}
                />
              </FormSwitch>
            </div>

          </div>

          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12 mt-5 mb-20">
            <div className="col-span-12 intro-y lg:col-span-6">
              Usuario: {user?.userName}
            </div>
            <div className="col-span-12 intro-y lg:col-span-6">
              <Button
                variant="primary"
                className="ml-3"
                onClick={handleAuditoria}
              >
                Guardar
              </Button>
              <Button variant="secondary" className="ml-3" onClick={cancelar}>
                Cancelar
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Editar