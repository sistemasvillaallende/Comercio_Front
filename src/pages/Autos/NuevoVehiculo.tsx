import React, { useEffect, useState } from "react";
import axios from "axios";
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
import Swal from "sweetalert2";
import { useAutoContext } from "../../context/AutoProvider";
import CodigoCIP from "./CodigoCIP";
import { useUserContext } from "../../context/UserProvider";

const NuevoVehiculo = () => {
  const {
    tiposDeVehiculos,
    tiposDeDocumentos,
    situacionesDeVehiculo,
    verCodigoDeAlta,
    verSexo,
    verTipoDeLiquidacion,
    verNroRegistroDelAutomotor,
  } = useAutoContext();

  const navigate = useNavigate();
  const { user } = useUserContext();
  const handleModificarDominio = () => {
    const dominioSinEspacios = dominioActual.replace(/\s/g, "");
    navigate(`/auto/${dominioSinEspacios}/modificarDominio`);
  };

  const [dominioActual, setDominioActual] = useState<string>("");
  const cambiarDominioActual = (event: any) => {
    setDominioActual(event.target.value);
  };

  const [tipoDeLiquidacion, setTipoDeLiquidacion] = useState<number>(0);
  const cambiarTiposDeLiquidacion = (event: any) => {
    setTipoDeLiquidacion(event.target.value);
  };

  const [fechaDeAlta, setFechaDeAlta] = useState<string>(
    new Date().toISOString()
  );

  const cambiarFechaDeAlta = (event: any) => {
    setFechaDeAlta(event.target.value);
  };

  const [fechaVecinoDigital, setFechaVecinoDigital] = useState<Date | null>(
    null
  );

  const [fechaModificacion, setFechaModificacion] = useState<Date | null>(null);

  const [tipoAlta, setTipoAlta] = useState<boolean>(false);
  const cambiarTipoAlta = (event: any) => {
    setTipoAlta(event.target.checked);
  };

  const [anio, setAnio] = useState<number>(0);
  const cambiarAnio = (event: any) => {
    setAnio(event.target.value);
  };

  const [tipoDeVehiculo, setTipoDeVehiculo] = useState<string>("");
  const cambiarTipoDeVehiculo = (event: any) => {
    setTipoDeVehiculo(event.target.value);
  };

  const [CIP, setCIP] = useState<string>("");
  const [ventanaCIP, setVentanaCIP] = useState<boolean>(false);
  const cambiarCIP = (event: any) => {
    setCIP(event.target.value);
  };

  const seleccionarCIP = () => {
    setVentanaCIP(true);
  };

  const [marca, setMarca] = useState<string>("");
  const cambiarMarca = (event: any) => {
    setMarca(event.target.value);
  };

  const [modelo, setModelo] = useState<string>("");
  const cambiarModelo = (event: any) => {
    setModelo(event.target.value);
  };

  const [nacional, setNacional] = useState<boolean>(false);
  const cambiarNacional = (event: any) => {
    setNacional(event.target.checked);
  };

  const [nroMotor, setNroMotor] = useState<string>("");
  const cambiarNroMotor = (event: any) => {
    setNroMotor(event.target.value);
  };

  const [pesoCm3, setPesoCm3] = useState<number>(0);
  const cambiarPesoCm3 = (event: any) => {
    setPesoCm3(event.target.value);
  };

  const [propietario, setPropietario] = useState<string>("");
  const cambiarPropietario = (event: any) => {
    setPropietario(event.target.value);
  };

  const [nroBad, setNroBad] = useState<number>(0);
  const cambiarNroBad = (event: any) => {
    setNroBad(event.target.value);
  };

  const [sexo, setSexo] = useState<string>("");
  const cambiarSexo = (event: any) => {
    setSexo(event.target.value);
  };

  const [responsable, setResponsable] = useState<string>("");
  const cambiarResponsable = (event: any) => {
    //Si es true, es "S", si es false, es ""
    setResponsable(event.target.checked ? "S" : "");
  };

  const [tipoDeDocumento, setTipoDeDocumento] = useState<number>(0);
  const cambiarTipoDeDocumento = (event: any) => {
    setTipoDeDocumento(event.target.value);
  };

  const [nroDeDocumendo, setNroDeDocumendo] = useState<string>("");
  const cambiarNroDeDocumendo = (event: any) => {
    setNroDeDocumendo(event.target.value);
  };

  const [cuit, setCuit] = useState<string>("");
  const cambiarCuit = (event: any) => {
    setCuit(event.target.value);
  };

  const [cuitVecinoDigital, setCuitVecinoDigital] = useState<string>("");
  const cambiarCuitVecinoDigital = (event: any) => {
    setCuitVecinoDigital(event.target.value);
  };

  const [porcentaje, setPorcentaje] = useState<string>("");
  const cambiarPorcentaje = (event: any) => {
    setPorcentaje(event.target.value);
  };

  const [vecinoDigital, setVecinoDigital] = useState<boolean>(false);
  const cambiarVecinoDigital = (event: any) => {
    setVecinoDigital(event.target.checked);
  };

  const [situacionDelVehiculo, setSituacionDelVehiculo] = useState<number>(0);
  const cambiarSituacionDelVehiculo = (event: any) => {
    setSituacionDelVehiculo(event.target.value);
  };

  const [emiteCedulon, setEmiteCedulon] = useState<boolean>(false);
  const cambiarEmiteCedulon = (event: any) => {
    setEmiteCedulon(event.target.checked);
  };

  const [ultimoPeriodoDeLiquidacion, setUltimoPeriodoDeLiquidacion] =
    useState<string>("");
  const cambiarUltimoPeriodoDeLiquidacion = (event: any) => {
    setUltimoPeriodoDeLiquidacion(event.target.value);
  };

  const [claveDePago, setClaveDePago] = useState<string>("");
  const cambiarClaveDePago = (event: any) => {
    setClaveDePago(event.target.value);
  };

  const [codigoDeAlta, setCodigoDeAlta] = useState<number>(0);
  const cambiarCodigoDeAlta = (event: any) => {
    setCodigoDeAlta(event.target.value);
  };

  const [registroAuto, setRegistroAuto] = useState<number>(0);
  const cambiarRegistroAuto = (event: any) => {
    setRegistroAuto(event.target.value);
  };

  const cambiarFechaParaGuardar = (event: any) => {
    const fechaObj = new Date(event.target.value);
    const anio = fechaObj.getFullYear();
    const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
    const dia = String(fechaObj.getDate()).padStart(2, "0");
    const horas = String(fechaObj.getHours()).padStart(2, "0");
    const minutos = String(fechaObj.getMinutes()).padStart(2, "0");
    const segundos = String(fechaObj.getSeconds()).padStart(2, "0");
    const milisegundos = String(fechaObj.getMilliseconds()).padStart(1, "0");
    setFechaDeAlta(
      `${anio}-${mes}-${dia}T${horas}:${minutos}:${segundos}.${milisegundos}`
    );
  };

  const [excento, setExcento] = useState<boolean>(false);
  const cambiarExcento = (event: any) => {
    setExcento(event.target.checked);
  };

  const [tributaMinimo, setTributaMinimo] = useState<boolean>(false);
  const cambiarTributaMinimo = (event: any) => {
    setTributaMinimo(event.target.checked);
  };

  const [debitoAutomatico, setDebitoAutomatico] = useState<boolean>(false);
  const cambiarDebitoAutomatico = (event: any) => {
    setDebitoAutomatico(event.target.checked);
  };

  const cancelar = () => {
    navigate(-1);
  };

  const nuevoVehiculo = async () => {
    const urlApi = `${import.meta.env.VITE_URL_AUTO}NuevoVehiculo`;
    const fechaActual = new Date();
    const requestBody = {
      dominio: dominioActual,
      marca: marca,
      modelo: modelo,
      nacional: nacional,
      anio: anio,
      nro_bad: nroBad,
      codigo_vehiculo: tipoDeVehiculo,
      peso_cm3: pesoCm3,
      fecha_cambio_dominio: null,
      dominio_anterior: "",
      fecha_alta: fechaDeAlta,
      tipo_alta: tipoAlta,
      baja: false,
      fecha_baja: null,
      tipo_baja: 0,
      per_ult: ultimoPeriodoDeLiquidacion,
      codigo_cip: CIP,
      variante: "0       ",
      exento: excento,
      tributa_minimo: tributaMinimo,
      nro_motor: nroMotor,
      cod_barrio_dom_esp: 0,
      nom_barrio_dom_esp: "",
      cod_calle_dom_esp: 0,
      nom_calle_dom_esp: "",
      nro_dom_esp: 0,
      piso_dpto_esp: "",
      ciudad_dom_esp: "VILLA ALLENDE",
      provincia_dom_esp: "CORDOBA",
      pais_dom_esp: "ARGENTINA",
      cod_postal_dom_esp: "5105",
      fecha_cambio_domicilio: null,
      fecha_exencion: null,
      fecha_vto_exencion: null,
      causa_exencion: "",
      fecha_ingreso: fechaActual,
      emite_cedulon: emiteCedulon,
      cod_registro_auto: registroAuto,
      responsable: responsable,
      porcentaje: porcentaje,
      sexo: sexo,
      cod_alta: codigoDeAlta,
      cod_baja: 0,
      debito_automatico: debitoAutomatico,
      nro_secuencia: 0,
      cod_situacion_judicial: situacionDelVehiculo,
      codigo_cip_ant: "",
      codigo_acara: "",
      nombre: propietario,
      cod_tipo_documento: tipoDeDocumento,
      nro_documento: nroDeDocumendo,
      cod_tipo_liquidacion: tipoDeLiquidacion,
      clave_pago: claveDePago,
      monto: 0,
      email_envio_cedulon: "",
      telefono: "",
      celular: "",
      fecha_cambio_radicacion: null,
      cedulon_digital: 1,
      usuario: user?.userName || "",
      usuariomodifica: user?.userName || "",
      fecha_modificacion: fechaActual,
      clave_pago2: "",
      cuit: cuit,
      cuit_vecino_digital: "",
      fecha_vecino_digital: null,
      con_deuda: 0,
      saldo_adeudado: 0.0,
      fecha_baja_real: null,
      fecha_denuncia_vta: null,
      objAuditoria: {
        id_auditoria: 0,
        fecha: "26/07/2023",
        usuario: "",
        proceso: "",
        identificacion: "",
        autorizaciones: "",
        observaciones: "",
        detalle: "",
        ip: "",
      },
    };
    axios
      .post(urlApi, requestBody)
      .then((response) => {
        if (response.data) {
          Swal.fire({
            title: "Vehículo actualizado",
            text: "El vehículo se actualizó correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          });
          console.log(response.data);
        } else {
          Swal.fire({
            title: "Error al actualizar",
            text: "El vehículo no se pudo actualizar",
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

  return (
    <>
      <div className="conScroll grid grid-cols-12 gap-6 mt-5 ml-5 mr-4">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Datos del Vehículo</h2>
          </div>
          <div className="grid grid-cols-12 gap-6 mt-3">
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="fomrDominio">Dominio</FormLabel>
              <FormInput
                id="fomrDominio"
                type="text"
                value={dominioActual}
                onChange={cambiarDominioActual}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-5">
              <FormLabel htmlFor="formMarca">Marca</FormLabel>
              <FormInput
                id="formMarca"
                type="text"
                value={marca}
                onChange={cambiarMarca}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formAnio">Año</FormLabel>
              <FormInput
                id="formAnio"
                type="number"
                value={anio}
                onChange={cambiarAnio}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-3">
              <FormLabel htmlFor="forCIP">C.I.P.</FormLabel>
              <InputGroup>
                <FormInput
                  id="forCIP"
                  type="text"
                  value={CIP}
                  onChange={cambiarCIP}
                />
                <InputGroup.Text
                  id="input-group-price"
                  className="cursor-pointer"
                  onClick={seleccionarCIP}
                >
                  <Lucide icon="Search" className="w-4 h-4" />
                </InputGroup.Text>
              </InputGroup>
            </div>
            {ventanaCIP && (
              <CodigoCIP {...{ marca, anio, setVentanaCIP, setCIP }} />
            )}
            <div className="col-span-12 intro-y lg:col-span-5">
              <FormLabel htmlFor="formModelo">Modelo</FormLabel>
              <FormInput
                id="formModelo"
                type="text"
                value={modelo}
                onChange={cambiarModelo}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-5">
              <FormLabel htmlFor="regular-form-1">Tipo de Vehículo</FormLabel>
              <FormSelect
                className="sm:mr-2"
                aria-label="Default select example"
                value={tipoDeVehiculo}
                onChange={cambiarTipoDeVehiculo}
              >
                {Array.isArray(tiposDeVehiculos) &&
                  tiposDeVehiculos.map((tipo: any) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.text}
                    </option>
                  ))}
              </FormSelect>
            </div>
            <div className="col-span-12 intro-y lg:col-span-1">
              <FormLabel htmlFor="formNacional">Nacional</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="formNacional"
                  type="checkbox"
                  checked={nacional}
                  onChange={cambiarNacional}
                />
              </FormSwitch>
            </div>
            <div className="col-span-12 intro-y lg:col-span-1">
              <FormLabel htmlFor="formTipoAlta">Normal</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="formTipoAlta"
                  type="checkbox"
                  checked={tipoAlta}
                  onChange={cambiarTipoAlta}
                />
              </FormSwitch>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formFechaDeAlta">Fecha de Alta</FormLabel>
              <FormInput
                type="date"
                id="formFechaDeAlta"
                value={fechaDeAlta.slice(0, 10)}
                onChange={cambiarFechaParaGuardar}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-3">
              <FormLabel htmlFor="nroRegistroDelAutomotor">
                Nro. Registro del Automotor
              </FormLabel>
              <FormSelect
                className="sm:mr-2"
                id="nroRegistroDelAutomotor"
                aria-label="Default select example"
                value={registroAuto}
                onChange={cambiarRegistroAuto}
              >
                {verNroRegistroDelAutomotor().map((tipo: any) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="col-span-12 intro-y lg:col-span-4">
              <FormLabel htmlFor="formNroMotor">Nro. de Motor</FormLabel>
              <FormInput
                id="formNroMotor"
                type="text"
                value={nroMotor}
                onChange={cambiarNroMotor}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="regular-form-1">Peso / Cm3</FormLabel>
              <FormInput
                id="regular-form-1"
                type="number"
                value={!isNaN(pesoCm3) ? pesoCm3 : ""}
                onChange={cambiarPesoCm3}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-3">
              <FormLabel htmlFor="formCodigoDeAlta">Codigo de Alta</FormLabel>
              <FormSelect
                className="sm:mr-2"
                aria-label="Default select example"
                id="formCodigoDeAlta"
                value={codigoDeAlta}
                onChange={cambiarCodigoDeAlta}
              >
                {verCodigoDeAlta().map((tipo: any) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="col-span-12 intro-y lg:col-span-12">
              <h2>Datos del Propietario</h2>
            </div>
            <div className="col-span-12 intro-y lg:col-span-5">
              <FormLabel htmlFor="formPropietario">Propietario</FormLabel>
              <FormInput
                id="formPropietario"
                type="text"
                value={propietario}
                onChange={cambiarPropietario}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formNroBad">Nro bad</FormLabel>
              <FormInput
                id="formNroBad"
                type="number"
                value={nroBad}
                onChange={cambiarNroBad}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formSexo">Sexo</FormLabel>
              <FormSelect
                className="sm:mr-2"
                aria-label="Default select example"
                id="formSexo"
                value={sexo}
                onChange={cambiarSexo}
              >
                {verSexo().map((tipo: any) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formResponsable">Responsable</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="formResponsable"
                  type="checkbox"
                  checked={responsable === "S"}
                  onChange={cambiarResponsable}
                />
              </FormSwitch>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formTipoDeDocumento">
                Tipo de documento
              </FormLabel>
              <FormSelect
                className="sm:mr-2"
                aria-label="Default select example"
                id="formTipoDeDocumento"
                value={tipoDeDocumento}
                onChange={cambiarTipoDeDocumento}
              >
                {Array.isArray(tiposDeDocumentos) &&
                  tiposDeDocumentos.map((tipo: any) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.text}
                    </option>
                  ))}
              </FormSelect>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formNroDeDocumendo">
                Nro de Documento
              </FormLabel>
              <FormInput
                id="formNroDeDocumendo"
                type="number"
                value={nroDeDocumendo}
                onChange={cambiarNroDeDocumendo}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formCUIT">CUIT</FormLabel>
              <FormInput
                id="formCUIT"
                type="number"
                value={cuit}
                onChange={cambiarCuit}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formCuitVecinoDigital">
                CUIT vecino Digital
              </FormLabel>
              <FormInput
                id="formCuitVecinoDigital"
                type="number"
                value={cuitVecinoDigital}
                onChange={cambiarCuitVecinoDigital}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formPorcentaje">Porcentaje %</FormLabel>
              <FormInput
                id="formPorcentaje"
                type="number"
                value={parseFloat(porcentaje)}
                onChange={cambiarPorcentaje}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="regular-form-1">Vecino Digital</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="checkbox-switch-7"
                  type="checkbox"
                  checked={vecinoDigital}
                  onChange={cambiarVecinoDigital}
                />
              </FormSwitch>
            </div>
            <div className="col-span-12 intro-y lg:col-span-4">
              <FormLabel htmlFor="formSituacionDelVehiculo">
                Situación del Vehículo
              </FormLabel>
              <FormSelect
                className="sm:mr-2"
                aria-label="Default select example"
                id="formSituacionDelVehiculo"
                value={situacionDelVehiculo}
                onChange={cambiarSituacionDelVehiculo}
              >
                {Array.isArray(situacionesDeVehiculo) &&
                  situacionesDeVehiculo?.map((tipo: any) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.text}
                    </option>
                  ))}
              </FormSelect>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formTipoDeLiquidacion">
                Tipo de Liquidación
              </FormLabel>
              <FormSelect
                className="sm:mr-2"
                aria-label="Default select example"
                id="formTipoDeLiquidacion"
                value={tipoDeLiquidacion}
                onChange={cambiarTiposDeLiquidacion}
              >
                {verTipoDeLiquidacion().map((tipo: any) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="FormEmiteCedulon">Emite Cedulón</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="FormEmiteCedulon"
                  type="checkbox"
                  checked={emiteCedulon}
                  onChange={cambiarEmiteCedulon}
                />
              </FormSwitch>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formUltimoPeriodoDeLiquidacion">
                Último Periodo de Liquidación
              </FormLabel>
              <FormInput
                id="formUltimoPeriodoDeLiquidacion"
                type="text"
                value={ultimoPeriodoDeLiquidacion}
                onChange={cambiarUltimoPeriodoDeLiquidacion}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-4">
              <FormLabel htmlFor="formClaveDePago">Clave de Pago</FormLabel>
              <FormInput
                id="formClaveDePago"
                type="number"
                value={claveDePago}
                onChange={cambiarClaveDePago}
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-12">
              <h2>Situación Tributaria</h2>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="regular-form-1">Excento</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="checkbox-switch-7"
                  type="checkbox"
                  checked={excento}
                  onChange={cambiarExcento}
                />
              </FormSwitch>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="regular-form-1">Tributa Mínimo</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="checkbox-switch-7"
                  type="checkbox"
                  checked={tributaMinimo}
                  onChange={cambiarTributaMinimo}
                />
              </FormSwitch>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="regular-form-1">Debito Automático</FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="checkbox-switch-7"
                  type="checkbox"
                  checked={debitoAutomatico}
                  onChange={cambiarDebitoAutomatico}
                />
              </FormSwitch>
            </div>
          </div>
          <br />
          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12 mt-5 mb-5">
            <div className="col-span-12 intro-y lg:col-span-3">
              <Button
                variant="primary"
                className="ml-3"
                onClick={nuevoVehiculo}
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
  );
};

export default NuevoVehiculo;
