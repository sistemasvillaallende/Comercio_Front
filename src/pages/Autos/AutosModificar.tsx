import { useEffect, useState } from "react";
import axios from "axios";
import {
  FormSelect,
  FormInput,
  FormLabel,
  FormSwitch,
  InputGroup,
} from "../../base-components/Form";
import { useAutoContext } from "../../context/AutoProvider";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUserContext } from "../../context/UserProvider";
import Lucide from "../../base-components/Lucide";
import CodigoCIP from "./CodigoCIP";

const AutosModificar = () => {
  const {
    vehiculo,
    tiposDeVehiculos,
    tiposDeDocumentos,
    situacionesDeVehiculo,
    verCodigoDeAlta,
    verSexo,
    verTipoDeLiquidacion,
    verNroRegistroDelAutomotor,
    traerAuto,
  } = useAutoContext();
  const { user } = useUserContext();

  const navigate = useNavigate();

  const [dominioActual, setDominioActual] = useState<string>("");

  const [tipoDeLiquidacion, setTipoDeLiquidacion] = useState<number>(0);
  const cambiarTiposDeLiquidacion = (event: any) => {
    setTipoDeLiquidacion(event.target.value);
  };

  const [fechaDeAlta, setFechaDeAlta] = useState<string>(
    new Date().toISOString()
  );

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
    if (marca && anio) {
      setVentanaCIP(true);
    } else {
      Swal.fire({
        title: "Error",
        text: "Por favor ingresa la marca y el año del vehículo.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
    }
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
    Swal.fire({
      title: "Vecino Digital",
      text: "No se puede modificar el campo de Vecino Digital",
      icon: "warning",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#27a3cf",
    });
  };

  const [porcentaje, setPorcentaje] = useState<string>("");
  const cambiarPorcentaje = (event: any) => {
    setPorcentaje(event.target.value);
  };

  const [vecinoDigital, setVecinoDigital] = useState<boolean>(false);
  const cambiarVecinoDigital = (event: any) => {
    Swal.fire({
      title: "Vecino Digital",
      text: "No se puede modificar el campo de Vecino Digital",
      icon: "warning",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#27a3cf",
    });
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

  useEffect(() => {
    if (vehiculo) {
      setDominioActual(vehiculo.dominio);
      setAnio(vehiculo.anio);
      setTipoDeVehiculo(vehiculo.codigo_vehiculo.toString());
      setCIP(vehiculo.codigo_cip);
      setMarca(vehiculo.marca);
      setModelo(vehiculo.modelo);
      setNacional(vehiculo.nacional);
      setNroMotor(vehiculo.nro_motor);
      setPesoCm3(vehiculo.peso_cm3);
      setPropietario(vehiculo.nombre);
      setNroBad(vehiculo.nro_bad);
      setSexo(vehiculo.sexo);
      setResponsable(vehiculo.responsable);
      setTipoDeDocumento(vehiculo.cod_tipo_documento);
      setNroDeDocumendo(vehiculo.nro_documento);
      setCuit(vehiculo.cuit);
      setCuitVecinoDigital(vehiculo.cuit_vecino_digital);
      setPorcentaje(vehiculo.porcentaje);
      setSituacionDelVehiculo(vehiculo.cod_situacion_judicial);
      setTipoDeLiquidacion(vehiculo.cod_tipo_liquidacion);
      setEmiteCedulon(vehiculo.emite_cedulon);
      setUltimoPeriodoDeLiquidacion(vehiculo.per_ult);
      setCodigoDeAlta(vehiculo.cod_alta);
      setClaveDePago(vehiculo.clave_pago);
      setFechaDeAlta(new Date(vehiculo.fecha_alta).toISOString());
      setRegistroAuto(vehiculo.cod_registro_auto);
      setExcento(vehiculo.exento);
      setTributaMinimo(vehiculo.tributa_minimo);
      setDebitoAutomatico(vehiculo.debito_automatico);
      setFechaVecinoDigital(
        vehiculo.fecha_vecino_digital
          ? new Date(vehiculo.fecha_vecino_digital)
          : null
      );
      setFechaModificacion(new Date(vehiculo.fecha_modificacion));
      setTipoAlta(vehiculo.tipo_alta);
    }
  }, [vehiculo]);

  const cancelar = () => {
    const dominioSinEspacios = vehiculo?.dominio.trim();
    navigate(`/auto/${dominioSinEspacios}/ver`);
  };

  const transformarFecha = (fecha: string) => {
    console.log(vehiculo?.fecha_modificacion);
    return fecha ? new Date(fecha).toISOString() : null;
  };

  const handleAuditoria = async () => {
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
      actualizarVehiculo(value);
    }
  }


  const actualizarVehiculo = (auditoria: String) => {
    const urlApi = `${import.meta.env.VITE_URL_AUTO}UpdateVehiculo?usuario=${user?.userName}`;
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
      fecha_cambio_dominio: vehiculo?.fecha_cambio_dominio,
      dominio_anterior: vehiculo?.dominio_anterior,
      fecha_alta: fechaDeAlta,
      tipo_alta: tipoAlta,
      baja: vehiculo?.baja,
      fecha_baja: vehiculo?.fecha_baja,
      tipo_baja: vehiculo?.tipo_baja,
      per_ult: ultimoPeriodoDeLiquidacion,
      codigo_cip: CIP,
      variante: vehiculo?.variante,
      exento: excento,
      tributa_minimo: tributaMinimo,
      nro_motor: nroMotor,
      cod_barrio_dom_esp: vehiculo?.cod_barrio_dom_esp,
      nom_barrio_dom_esp: vehiculo?.nom_barrio_dom_esp,
      cod_calle_dom_esp: vehiculo?.cod_calle_dom_esp,
      nom_calle_dom_esp: vehiculo?.nom_calle_dom_esp,
      nro_dom_esp: vehiculo?.nro_dom_esp,
      piso_dpto_esp: vehiculo?.piso_dpto_esp,
      ciudad_dom_esp: vehiculo?.ciudad_dom_esp,
      provincia_dom_esp: vehiculo?.provincia_dom_esp,
      pais_dom_esp: vehiculo?.pais_dom_esp,
      cod_postal_dom_esp: vehiculo?.cod_postal_dom_esp,
      fecha_cambio_domicilio: vehiculo?.fecha_cambio_domicilio,
      fecha_exencion: vehiculo?.fecha_exencion,
      fecha_vto_exencion: vehiculo?.fecha_vto_exencion,
      causa_exencion: vehiculo?.causa_exencion,
      fecha_ingreso: vehiculo?.fecha_ingreso,
      emite_cedulon: emiteCedulon,
      cod_registro_auto: registroAuto,
      responsable: responsable,
      porcentaje: porcentaje,
      sexo: sexo,
      cod_alta: codigoDeAlta,
      cod_baja: vehiculo?.cod_baja,
      debito_automatico: debitoAutomatico,
      nro_secuencia: vehiculo?.nro_secuencia,
      cod_situacion_judicial: situacionDelVehiculo,
      codigo_cip_ant: vehiculo?.codigo_cip_ant,
      codigo_acara: vehiculo?.codigo_acara,
      nombre: propietario,
      cod_tipo_documento: tipoDeDocumento,
      nro_documento: nroDeDocumendo,
      cod_tipo_liquidacion: tipoDeLiquidacion,
      clave_pago: claveDePago,
      monto: vehiculo?.monto,
      email_envio_cedulon: vehiculo?.email_envio_cedulon,
      telefono: vehiculo?.telefono,
      celular: vehiculo?.celular,
      fecha_cambio_radicacion: vehiculo?.fecha_cambio_radicacion,
      cedulon_digital: vehiculo?.cedulon_digital,
      usuario: vehiculo?.usuario,
      usuariomodifica: user?.userName || "",
      fecha_modificacion: fechaActual.toISOString(),
      clave_pago2: vehiculo?.clave_pago2,
      cuit: cuit,
      cuit_vecino_digital: vehiculo?.cuit_vecino_digital,
      fecha_vecino_digital: fechaVecinoDigital,
      con_deuda: vehiculo?.con_deuda,
      saldo_adeudado: vehiculo?.saldo_adeudado,
      fecha_baja_real: vehiculo?.fecha_baja_real,
      fecha_denuncia_vta: vehiculo?.fecha_denuncia_vta,
      objAuditoria: {
        id_auditoria: 0,
        fecha: fechaActual.toISOString(),
        usuario: user?.userName || "",
        proceso: "MODIFICAR VEHÍCULO",
        identificacion: "",
        autorizaciones: "",
        observaciones: auditoria,
        detalle: "",
        ip: "",
      },
    };
    console.log(requestBody);
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
      <div className="conScroll grid grid-cols-12 gap-6 mt-5 ml-5 mr-4 sinAnimaciones">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Datos del Vehículo</h2>
            <h2>Dominio: {vehiculo?.dominio}</h2>
          </div>
          <div className="grid grid-cols-12 gap-6 mt-3">
            <div className="col-span-12 intro-y lg:col-span-2 mr-2">
              <FormLabel htmlFor="fomrDominio">Dominio</FormLabel>
              <FormInput
                id="fomrDominio"
                type="text"
                value={dominioActual}
                disabled
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
                  disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formNroBad">Nro. Bad.</FormLabel>
              <FormInput
                id="formNroBad"
                type="number"
                value={nroBad}
                onChange={cambiarNroBad}
                disabled
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
                disabled
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
                disabled
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
                Nro. de Documento
              </FormLabel>
              <FormInput
                id="formNroDeDocumendo"
                type="number"
                value={nroDeDocumendo}
                onChange={cambiarNroDeDocumendo}
                disabled
              />
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formCUIT">CUIT</FormLabel>
              <FormInput
                id="formCUIT"
                type="number"
                value={cuit}
                onChange={cambiarCuit}
                disabled
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
                disabled
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
                  disabled
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
                disabled
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
                  disabled
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
                disabled
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
                  disabled
                />
              </FormSwitch>
            </div>
          </div>
          <br />
          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12 mt-5 mb-5">
            <div className="col-span-12 intro-y lg:col-span-4">
              <p>
                Dado de alta por <strong>{vehiculo?.usuario}</strong> {" | "}
                {vehiculo?.usuariomodifica !== ""
                  ? `Modificado por ${vehiculo?.usuariomodifica
                  } el ${fechaModificacion?.toLocaleDateString()}`
                  : `Modificado el ${fechaModificacion?.toLocaleDateString()}`}
              </p>
              <p>
                <strong>Fecha Vecino Digital:</strong>
                {fechaVecinoDigital?.toLocaleDateString()}
              </p>
            </div>
            <div className="col-span-12 intro-y lg:col-span-3">
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
  );
};

export default AutosModificar;
