import { useEffect, useState } from "react";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import { ElementoIndustriaComercio } from "../../interfaces/IndustriaComercio";
import { convertirFecha, fechaActual, convertirFechaNuevo } from "../../utils/GeneralUtils";
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


const Nuevo = () => {

  const [ventanaPropietario, setVentanaPropietario] = useState<boolean>(false);
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState<Propietario | null>(null);

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
    setElementoIndCom
  } = useIndustriaComercioContext();
  const [elementoIndustriaComercio, setElementoIndustriaComercio] = useState<ElementoIndustriaComercio>();

  const { user } = useUserContext();

  const navigate = useNavigate();

  const [nroBad, setNroBad] = useState<number | null>(null);

  // Estados para manejar errores de validación
  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  // Función para limpiar error de un campo específico
  const limpiarError = (campo: string) => {
    if (errores[campo]) {
      setErrores(prev => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[campo];
        return nuevosErrores;
      });
    }
  };

  // Debug del estado nroBad
  useEffect(() => {
    console.log('nroBad cambió a:', nroBad);
  }, [nroBad]);
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
  const [nroCuit, setNroCuit] = useState<string>("");
  const [transporte, setTransporte] = useState<boolean>(false);
  const [fechaAlta, setFechaAlta] = useState<string>(fechaActual());
  const [nomCalle, setNomCalle] = useState<string>("");
  const [pisoDptoEsp, setPisoDptoEsp] = useState<string>("");
  const [localEsp, setLocalEsp] = useState<string>("0");
  const [nomBarrioDomEsp, setNomBarrioDomEsp] = useState<string>("Cordoba");
  const [emiteCedulon, setEmiteCedulon] = useState<boolean>(false);
  const [codSituacionJudicial, setCodSituacionJudicial] = useState<number | null>(1);
  const [ocupacionVereda, setOcupacionVereda] = useState<boolean>(false);
  const [codZonaLiquidacion, setCodZonaLiquidacion] = useState<string>("1");
  const [fechaDdjjAnual, setFechaDdjjAnual] = useState<string>("");
  const [codCaracter, setCodCaracter] = useState<number | null>(0);
  const [categoriaIva, setCategoriaIva] = useState<number>(1);
  const [vtoInscripcion, setVtoInscripcion] = useState<string>("");
  const [observacionesAuditoria, setObservacionesAuditoria] = useState<string>("");
  const [fechaAuditoria, setFechaAuditoria] = useState<string>("");
  const [ciudad, setCiudad] = useState<string>("Córdoba");

  useEffect(() => {
    if (elementoIndCom) {
      setElementoIndustriaComercio(undefined);
    }

    if (propietarioSeleccionado) {
      console.log('Propietario seleccionado:', propietarioSeleccionado);
      console.log('nro_bad del propietario:', propietarioSeleccionado.nro_bad);
      setNroBad(propietarioSeleccionado.nro_bad || 0);
      setNroCuit(propietarioSeleccionado.cuit || "0");
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

  const validarCampos = () => {
    const nuevosErrores: { [key: string]: string } = {};

    // Validaciones de campos requeridos básicos
    if (!desCom) nuevosErrores.desCom = "La descripción es requerida";
    if (!nomFantasia) nuevosErrores.nomFantasia = "El nombre de fantasía es requerido";
    if (!nomCalle) nuevosErrores.nomCalle = "El nombre de la calle es requerido";
    if (!nroDom) nuevosErrores.nroDom = "El número de domicilio es requerido";
    if (!ciudad) nuevosErrores.ciudad = "La ciudad es requerida";
    if (!priPeriodo) nuevosErrores.priPeriodo = "El primer período es requerido";
    if (!nroExpMesaEnt) nuevosErrores.nroExpMesaEnt = "El número de expediente es requerido";
    if (!fechaAlta) nuevosErrores.fechaAlta = "La fecha de alta es requerida";
    if (!localEsp) nuevosErrores.localEsp = "El número de local es requerido";
    if (!nomBarrioDomEsp) nuevosErrores.nomBarrioDomEsp = "El barrio es requerido";
    if (!tipoLiquidacionElemento) nuevosErrores.tipoLiquidacionElemento = "El tipo de liquidación es requerido";
    if (!nroCuit) nuevosErrores.nroCuit = "El CUIT es requerido";
    if (!fechaInicio) nuevosErrores.fechaInicio = "La fecha de inicio es requerida";
    if (!fechaHab) nuevosErrores.fechaHab = "La fecha de habilitación es requerida";
    if (!vtoInscripcion) nuevosErrores.vtoInscripcion = "El vencimiento de inscripción es requerido";

    // Validar formato del primer período
    if (priPeriodo && !/^\d{4}\/\d{2}$/.test(priPeriodo.trim())) {
      nuevosErrores.priPeriodo = "El formato debe ser YYYY/MM (ej: 2025/01)";
    }

    // Validar formato del último período si está presente
    if (perUlt && !/^\d{4}\/\d{2}$/.test(perUlt.trim())) {
      nuevosErrores.perUlt = "El formato debe ser YYYY/MM (ej: 2025/01)";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const actualizarIyC = (auditoria: String) => {
    const urlApi = `${import.meta.env.VITE_URL_BASE || 'http://10.0.0.24/webapiiyc24/'}Indycom/InsertDatosGeneral`;
    console.log('URL de la API:', urlApi); // Para debugging

    // Validar campos antes de enviar
    if (!validarCampos()) {
      return;
    }

    const fechaActual = new Date().toISOString();
    const requestBody = {
      "legajo": 0, // El legajo se genera automáticamente en el servidor
      "nro_bad": nroBad || 0,
      "nro_contrib": nroBad || 0,
      "des_com": desCom || "",
      "nom_fantasia": nomFantasia || "",
      "cod_calle": 421,
      "nro_dom": nroDom || 0,
      "cod_barrio": 10,
      "cod_tipo_per": 1,
      "cod_zona": "", // String vacío según el JSON que funciona
      "pri_periodo": priPeriodo ? `${priPeriodo} ` : "", // Agregar espacio al final
      "tipo_liquidacion": tipoLiquidacionElemento || 1,
      "dado_baja": dadoBaja || false,
      "fecha_baja": fechaBaja ? convertirFechaNuevo(fechaBaja) : null,
      "exento": exento || false,
      "per_ult": perUlt || (priPeriodo ? `${priPeriodo.slice(0, 4)}/${String(parseInt(priPeriodo.slice(5, 7)) + 3).padStart(2, '0')}` : ""),
      "fecha_inicio": fechaInicio ? convertirFechaNuevo(fechaInicio) : null,
      "fecha_hab": fechaHab ? convertirFechaNuevo(fechaHab) : null,
      "nro_res": "string",
      "nro_exp_mesa_ent": nroExpMesaEnt || "",
      "nro_ing_bruto": nroCuit || "",
      "nro_cuit": nroCuit || "",
      "transporte": transporte || false,
      "fecha_alta": fechaAlta ? convertirFechaNuevo(fechaAlta) : fechaActual,
      "nom_calle": nomCalle || "",
      "nom_barrio": nomBarrioDomEsp || "Cordoba",
      "ciudad": ciudad || "Córdoba",
      "provincia": "Cordoba",
      "pais": "ARG",
      "cod_postal": "5105",
      "cod_calle_dom_esp": 123,
      "nom_calle_dom_esp": nomCalle || "",
      "nro_dom_esp": nroDom || 0,
      "piso_dpto_esp": pisoDptoEsp || "",
      "local_esp": localEsp || "0",
      "cod_barrio_dom_esp": 10,
      "nom_barrio_dom_esp": nomBarrioDomEsp || "Cordoba",
      "ciudad_dom_esp": ciudad || "Córdoba",
      "provincia_dom_esp": "Cordoba",
      "pais_dom_esp": "Arg", // Cambiar de "ARG" a "Arg"
      "cod_postal_dom_esp": "5105",
      "emite_cedulon": emiteCedulon || false,
      "cod_situacion_judicial": codSituacionJudicial || 1,
      "telefono1": "string",
      "telefono2": "string",
      "celular1": "string",
      "celular2": "string",
      "ocupacion_vereda": ocupacionVereda || false,
      "cod_zona_liquidacion": codZonaLiquidacion || "1",
      "email_envio_cedulon": "",
      "telefono": "string",
      "celular": "string",
      "es_agencia": 0,
      "nro_local": localEsp || "0",
      "piso_dpto": pisoDptoEsp || "string",
      "cod_cond_ante_iva": categoriaIva || 1,
      "cod_caracter": codCaracter || 0, // Cambiar de 1 a 0
      "categoria_iva": "F",
      "otra_entidad": "string",
      "convenio_uni": 0,
      "cod_nueva_zona": "Z",
      "vto_inscripcion": vtoInscripcion ? convertirFechaNuevo(vtoInscripcion) : null,
      "objAuditoria": {
        "id_auditoria": 0,
        "fecha": fechaActual,
        "usuario": user?.userName || "Sistema",
        "proceso": "CREAR_COMERCIO",
        "identificacion": desCom || "",
        "autorizaciones": auditoria || "",
        "observaciones": auditoria || "",
        "detalle": `Creación de comercio: ${desCom}`,
        "ip": "127.0.0.1"
      }
    };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2)); // Para debugging

    axios
      .post(urlApi, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then((response) => {
        if (response.data) {
          console.log('Respuesta del servidor:', response.data);
          const legajoGenerado = response.data.legajo || response.data.id || 'N/A';

          Swal.fire({
            title: "¡Comercio creado exitosamente!",
            text: `Se creó correctamente el comercio "${nomFantasia}" con legajo ${legajoGenerado}`,
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Ver Comercio",
            cancelButtonText: "Ir al Listado",
            confirmButtonColor: "#27a3cf",
            cancelButtonColor: "#6c757d",
          }).then((result) => {
            if (result.isConfirmed) {
              // Navegar al comercio recién creado usando el legajo generado
              navigate(`/${legajoGenerado}/ver`);
            } else if (result.isDismissed || result.isDenied) {
              // Navegar al listado de comercios
              navigate(`/`);
            }
          });
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
        console.error('Error al crear comercio:', error);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Response headers:', error.response?.headers);

        let errorMessage = "Hubo un problema al realizar la solicitud.";

        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = `Error del servidor: ${JSON.stringify(error.response.data)}`;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });
      });
  };

  return (
    <>

      {ventanaPropietario && (
        <SeleccionadorDePropietarios {...{ setPropietarioSeleccionado, setVentanaPropietario }} />
      )}

      <div className="conScroll grid grid-cols-12 gap-6 mt-2 ml-3 mr-4 p-4">
        <div className="col-span-12 intro-y lg:col-span-12">

          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Nuevo Comercio o Industria</h2>
          </div>

          <div className="grid grid-cols-12 gap-6 mt-3">

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Nro. Expediente</FormLabel>
              <FormInput
                id="formExpediente"
                type="text"
                value={nroExpMesaEnt}
                onChange={(e) => {
                  setNroExpMesaEnt(e.target.value);
                  limpiarError('nroExpMesaEnt');
                }}
                className={errores.nroExpMesaEnt ? 'border-red-500' : ''}
                required
              />
              {errores.nroExpMesaEnt && <div className="text-red-500 text-sm mt-1">{errores.nroExpMesaEnt}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formFechaDeAlta">Fecha de Alta</FormLabel>
              <FormInput
                type="date"
                id="formFechaDeAlta"
                value={fechaAlta.slice(0, 10)}
                onChange={(e) => {
                  setFechaAlta(e.target.value);
                  limpiarError('fechaAlta');
                }}
                className={errores.fechaAlta ? 'border-red-500' : ''}
                required
              />
              {errores.fechaAlta && <div className="text-red-500 text-sm mt-1">{errores.fechaAlta}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Nombre de Fantasía</FormLabel>
              <FormInput
                id="formNOmbreDeFantasia"
                type="text"
                value={nomFantasia}
                onChange={(e) => {
                  setNomFantasia(e.target.value);
                  limpiarError('nomFantasia');
                }}
                className={errores.nomFantasia ? 'border-red-500' : ''}
                required
              />
              {errores.nomFantasia && <div className="text-red-500 text-sm mt-1">{errores.nomFantasia}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Descripcion</FormLabel>
              <FormInput
                id="formDescripcion"
                type="text"
                value={desCom}
                onChange={(e) => {
                  setDesCom(e.target.value);
                  limpiarError('desCom');
                }}
                className={errores.desCom ? 'border-red-500' : ''}
                required
              />
              {errores.desCom && <div className="text-red-500 text-sm mt-1">{errores.desCom}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Badec (opcional)</FormLabel>
              <InputGroup>
                <FormInput
                  id="formPropietario"
                  type="text"
                  value={nroBad?.toString() || ''}
                  readOnly
                  placeholder="Buscar propietario para obtener CUIT"
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
                onChange={(e) => {
                  setNomCalle(e.target.value);
                  limpiarError('nomCalle');
                }}
                className={errores.nomCalle ? 'border-red-500' : ''}
                required
              />
              {errores.nomCalle && <div className="text-red-500 text-sm mt-1">{errores.nomCalle}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-1">
              <FormLabel htmlFor="formMarca">Nro. Dom</FormLabel>
              <FormInput
                id="formNroDom"
                type="number"
                value={nroDom ?? ''}
                onChange={(e) => {
                  setNroDom(Number(e.target.value));
                  limpiarError('nroDom');
                }}
                className={errores.nroDom ? 'border-red-500' : ''}
                required
              />
              {errores.nroDom && <div className="text-red-500 text-sm mt-1">{errores.nroDom}</div>}
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
                onChange={(e) => {
                  setLocalEsp(e.target.value);
                  limpiarError('localEsp');
                }}
                className={errores.localEsp ? 'border-red-500' : ''}
                required
              />
              {errores.localEsp && <div className="text-red-500 text-sm mt-1">{errores.localEsp}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Barrio</FormLabel>
              <FormInput
                id="formBarrio"
                type="text"
                value={nomBarrioDomEsp}
                onChange={(e) => {
                  setNomBarrioDomEsp(e.target.value);
                  limpiarError('nomBarrioDomEsp');
                }}
                className={errores.nomBarrioDomEsp ? 'border-red-500' : ''}
                required
              />
              {errores.nomBarrioDomEsp && <div className="text-red-500 text-sm mt-1">{errores.nomBarrioDomEsp}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Zona</FormLabel>
              <FormSelect
                id="formTipoLiquidacion"
                value={codZona}
                onChange={(e) => setCodZona(e.target.value)}
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
                onChange={(e) => {
                  setCiudad(e.target.value);
                  limpiarError('ciudad');
                }}
                className={errores.ciudad ? 'border-red-500' : ''}
                required
              />
              {errores.ciudad && <div className="text-red-500 text-sm mt-1">{errores.ciudad}</div>}
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
                onChange={(e) => {
                  setPriPeriodo(e.target.value);
                  limpiarError('priPeriodo');
                }}
                className={errores.priPeriodo ? 'border-red-500' : ''}
                placeholder="YYYY/MM (ej: 2025/01)"
                required
              />
              {errores.priPeriodo && <div className="text-red-500 text-sm mt-1">{errores.priPeriodo}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Ultimo Periodo</FormLabel>
              <FormInput
                id="formUltimoPeriodo"
                type="text"
                value={perUlt}
                onChange={(e) => {
                  setPerUlt(e.target.value);
                  limpiarError('perUlt');
                }}
                className={errores.perUlt ? 'border-red-500' : ''}
                placeholder="YYYY/MM (opcional)"
              />
              {errores.perUlt && <div className="text-red-500 text-sm mt-1">{errores.perUlt}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-4">
              <FormLabel htmlFor="formMarca">Tipo de Liquidación</FormLabel>
              <FormSelect
                id="formTipoLiquidacion"
                value={tipoLiquidacionElemento?.toString() ?? ''}
                onChange={(e) => {
                  setTipoLiquidacionElemento(Number(e.target.value));
                  limpiarError('tipoLiquidacionElemento');
                }}
                className={errores.tipoLiquidacionElemento ? 'border-red-500' : ''}
                required
              >
                <option value="">Seleccione un tipo de liquidación</option>
                {listadoTipoLiquidacion?.map((tipo) => (
                  <option key={tipo.cod_tipo_liq} value={tipo.cod_tipo_liq}>
                    {tipo.descripcion_tipo_liq}
                  </option>
                ))}
              </FormSelect>
              {errores.tipoLiquidacionElemento && <div className="text-red-500 text-sm mt-1">{errores.tipoLiquidacionElemento}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">CUIT</FormLabel>
              <FormInput
                id="formCUIT"
                type="text"
                value={nroCuit}
                onChange={(e) => {
                  setNroCuit(e.target.value);
                  limpiarError('nroCuit');
                }}
                className={errores.nroCuit ? 'border-red-500' : ''}
                required
              />
              {errores.nroCuit && <div className="text-red-500 text-sm mt-1">{errores.nroCuit}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">CUIT VD</FormLabel>
              <FormInput
                id="formCUIT"
                type="text"
                value={nroCuit}
                onChange={(e) => setNroCuit(e.target.value)}
                required
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
                onChange={(e) => {
                  setCodCaracter(Number(e.target.value));
                  limpiarError('codCaracter');
                }}
                className={errores.codCaracter ? 'border-red-500' : ''}
                required
              >
                <option value="">Seleccione un Caracter de la Entidad</option>
                {listadoTipoDeEntidad?.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.text}
                  </option>
                ))}
              </FormSelect>
              {errores.codCaracter && <div className="text-red-500 text-sm mt-1">{errores.codCaracter}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-4">
              <FormLabel htmlFor="formMarca">Condición Frente al IVA</FormLabel>
              <FormSelect
                id="formTipoLiquidacion"
                value={categoriaIva}
                onChange={(e) => {
                  setCategoriaIva(parseInt(e.target.value));
                  limpiarError('categoriaIva');
                }}
                className={errores.categoriaIva ? 'border-red-500' : ''}
                required
              >
                <option value="">Seleccione una Condición Frente al IVA</option>
                {listadoTipoCondicionIVA?.map((tipo) => (
                  <option key={tipo.cod_cond_ante_iva} value={tipo.cod_cond_ante_iva}>
                    {tipo.des_cond_ante_iva}
                  </option>
                ))}
              </FormSelect>
              {errores.categoriaIva && <div className="text-red-500 text-sm mt-1">{errores.categoriaIva}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formMarca">Ingresos Brutos</FormLabel>
              <FormInput
                id="formIngresosBrutos"
                type="text"
                value={nroCuit}
                onChange={(e) => setNroCuit(e.target.value)}
                required
              />
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formFechaInicio">Fecha Inicio</FormLabel>
              <FormInput
                type="date"
                id="formFechaInicio"
                value={fechaInicio.slice(0, 10)}
                onChange={(e) => {
                  setFechaInicio(e.target.value);
                  limpiarError('fechaInicio');
                }}
                className={errores.fechaInicio ? 'border-red-500' : ''}
                required
              />
              {errores.fechaInicio && <div className="text-red-500 text-sm mt-1">{errores.fechaInicio}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formFechaHabilitacion">Fecha Habilitación</FormLabel>
              <FormInput
                type="date"
                id="formFechaHabilitacion"
                value={fechaHab.slice(0, 10)}
                onChange={(e) => {
                  setFechaHab(e.target.value);
                  limpiarError('fechaHab');
                }}
                className={errores.fechaHab ? 'border-red-500' : ''}
                required
              />
              {errores.fechaHab && <div className="text-red-500 text-sm mt-1">{errores.fechaHab}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formvtoInscripcion">Vto. Inscrip</FormLabel>
              <FormInput
                type="date"
                id="formvtoInscripcion"
                value={vtoInscripcion.slice(0, 10)}
                onChange={(e) => {
                  setVtoInscripcion(e.target.value);
                  limpiarError('vtoInscripcion');
                }}
                className={errores.vtoInscripcion ? 'border-red-500' : ''}
                required
              />
              {errores.vtoInscripcion && <div className="text-red-500 text-sm mt-1">{errores.vtoInscripcion}</div>}
            </div>

            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="formvtofechaBaja">Fecha Baja</FormLabel>
              <FormInput
                type="date"
                id="formvtofechaBaja"
                value={fechaBaja.slice(0, 10)}
                onChange={(e) => setFechaBaja(e.target.value)}
                required
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
                onChange={(e) => {
                  setCodSituacionJudicial(parseInt(e.target.value));
                  limpiarError('codSituacionJudicial');
                }}
                className={errores.codSituacionJudicial ? 'border-red-500' : ''}
                required
              >
                <option value="">Seleccione una Situación Comercio</option>
                {listadoSituacionJudicial?.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.text}
                  </option>
                ))}
              </FormSelect>
              {errores.codSituacionJudicial && <div className="text-red-500 text-sm mt-1">{errores.codSituacionJudicial}</div>}
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

          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12 mt-5 mb-5">
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
              <Button variant="secondary" className="ml-3" onClick={() => navigate(`/`)}>
                Cancelar
              </Button>
            </div>

          </div>
        </div>
      </div >
    </>
  )
}

export default Nuevo