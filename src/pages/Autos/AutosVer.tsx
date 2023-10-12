import { useEffect, useState } from "react";
import axios from "axios";
import { useAutoContext } from "../../context/AutoProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUserContext } from "../../context/UserProvider";

const AutosVer = () => {
    const {
        vehiculo,
        tiposDeVehiculos,
        situacionesDeVehiculo,
        verCodigoDeAlta,
        verTipoDeLiquidacion,
    } = useAutoContext();
    const { user } = useUserContext();

    const navigate = useNavigate();

    const [dominioActual, setDominioActual] = useState<string>("");

    const [tipoDeLiquidacion, setTipoDeLiquidacion] = useState<number>(0);

    const [fechaDeAlta, setFechaDeAlta] = useState<string>(
        new Date().toISOString()
    );

    const [fechaVecinoDigital, setFechaVecinoDigital] = useState<Date | null>(
        null
    );

    const [fechaModificacion, setFechaModificacion] = useState<Date | null>(null);

    const [tipoAlta, setTipoAlta] = useState<boolean>(false);
    const [anio, setAnio] = useState<number>(0);
    const [tipoDeVehiculo, setTipoDeVehiculo] = useState<string>("");

    const verTipoDeVehiculo = (tipoVehiculo: string) => {
        const tipoDeVehiculo = tiposDeVehiculos?.find(
            (tipo: any) => tipo.value === tipoVehiculo
        );
        return tipoDeVehiculo?.text;
    }

    const [CIP, setCIP] = useState<string>("");
    const [marca, setMarca] = useState<string>("");
    const [modelo, setModelo] = useState<string>("");
    const [nacional, setNacional] = useState<boolean>(false);
    const [nroMotor, setNroMotor] = useState<string>("");
    const [pesoCm3, setPesoCm3] = useState<number>(0);
    const [propietario, setPropietario] = useState<string>("");
    const [nroBad, setNroBad] = useState<number>(0);
    const [sexo, setSexo] = useState<string>("");
    const [responsable, setResponsable] = useState<string>("");
    const [tipoDeDocumento, setTipoDeDocumento] = useState<number>(0);
    const [nroDeDocumendo, setNroDeDocumendo] = useState<string>("");
    const [cuit, setCuit] = useState<string>("");
    const [cuitVecinoDigital, setCuitVecinoDigital] = useState<string>("");
    const [porcentaje, setPorcentaje] = useState<string>("");
    const [vecinoDigital, setVecinoDigital] = useState<boolean>(false);
    const [situacionDelVehiculo, setSituacionDelVehiculo] = useState<number>(0);
    const [emiteCedulon, setEmiteCedulon] = useState<boolean>(false);
    const [ultimoPeriodoDeLiquidacion, setUltimoPeriodoDeLiquidacion] = useState<string>("");
    const [claveDePago, setClaveDePago] = useState<string>("");
    const [codigoDeAlta, setCodigoDeAlta] = useState<number>(0);
    const [registroAuto, setRegistroAuto] = useState<number>(0);
    const [excento, setExcento] = useState<boolean>(false);
    const [tributaMinimo, setTributaMinimo] = useState<boolean>(false);
    const [debitoAutomatico, setDebitoAutomatico] = useState<boolean>(false);

    const mostrarCodigoDeALta = (codigo: number) => {
        const codigoDeAlta = verCodigoDeAlta().find(
            (tipo: any) => tipo.id === codigo
        );
        return codigoDeAlta?.nombre;
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
    }, []);

    const cancelar = () => {
        navigate(-1);
    };

    const transformarFecha = (fecha: string) => {
        console.log(vehiculo?.fecha_modificacion);
        return fecha ? new Date(fecha).toISOString() : null;
    };



    const mostrarTipoDeLiquidacion = (tipoLiquidacion: number) => {
        const tipoDeLiquidacion = verTipoDeLiquidacion().find(
            (tipo: any) => tipo.id === tipoLiquidacion
        );
        return tipoDeLiquidacion?.nombre;
    }

    const verSituacionesDeVehiculo = (situacion: number) => {
        const situacionEncontrada = situacionesDeVehiculo.find(item => item.value === situacion.toString()) || null;
        if (situacionEncontrada) {
            return situacionEncontrada.text;
        } else {
            return "Desconocida";
        }
    };

    return (
        <>
            <div className="conScroll grid grid-cols-12 gap-6 mt-2 ml-3 mr-4">
                <div className="col-span-12 intro-y lg:col-span-12">
                    <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
                        <h2>Datos del Vehículo</h2>
                    </div>
                    <div className="grid grid-cols-12 gap-6">
                        <div className="cuadroOscuro grid grid-cols-12 gap-6 lg:col-span-12">
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Dominio: <strong>{dominioActual}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Marca: <strong>{marca}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Año: <strong>{anio}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-1">
                                <p>C.I.P.: <strong>{CIP}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Modelo: <strong>{modelo}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-3">
                                <p>Tipo de Vehículo: <strong>{verTipoDeVehiculo(tipoDeVehiculo)}</strong></p>
                            </div>
                        </div>
                        <div className="cuadroOscuro grid grid-cols-12 gap-6 lg:col-span-12">
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Nacional: <strong>{nacional ? "Sí" : "No"}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Normal: <strong>{tipoAlta ? "Si" : "No"}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Fecha de Alta: <strong>{fechaDeAlta.slice(0, 10)}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-3">
                                <p>Nro. Registro del Automotor: <strong>{registroAuto}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-3">
                                <p>Nro. de Motor: <strong>{nroMotor}</strong></p>
                            </div>
                        </div>
                        <div className="cuadroOscuro grid grid-cols-12 gap-6 lg:col-span-12">
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Peso / Cm3: <strong>{pesoCm3}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-3">
                                <p>Código de Alta: <strong>{mostrarCodigoDeALta(codigoDeAlta)}</strong></p>
                            </div>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-12">
                            <h2>Datos del Propietario</h2>
                        </div>
                        <div className="cuadroOscuro grid grid-cols-12 gap-6 lg:col-span-12">
                            <div className="col-span-12 intro-y lg:col-span-3">
                                <p>Propietario: <strong>{propietario}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Nro. Bad: <strong>{nroBad}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-1">
                                <p>Sexo: {sexo}</p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Responsable: <strong>{responsable === "S" ? "Sí" : "No"}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Documento: {nroDeDocumendo}</p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>CUIT: <strong>{cuit}</strong></p>
                            </div>
                        </div>
                        <div className="cuadroOscuro grid grid-cols-12 gap-6 lg:col-span-12">
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>CUIT Vecino Digital: <strong>{cuitVecinoDigital}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Porcentaje: <strong>{porcentaje} %</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Vecino Digital {vecinoDigital ? "Si" : "No"}</p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-4">
                                <p>Situación del Vehículo: <strong>{verSituacionesDeVehiculo(situacionDelVehiculo)}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Tipo de Liquidación: <strong>{mostrarTipoDeLiquidacion(tipoDeLiquidacion)}</strong></p>
                            </div>
                        </div>
                        <div className="cuadroOscuro grid grid-cols-12 gap-6 lg:col-span-12">
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Emite Cedulón: <strong>{emiteCedulon ? "Si" : "No"}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-3">
                                <p>Último Periodo de Liquidación: <strong>{ultimoPeriodoDeLiquidacion}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-4">
                                <p>Clave de Pago: <strong>{claveDePago}</strong></p>
                            </div>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-12">
                            <h2>Situación Tributaria</h2>
                        </div>
                        <div className="cuadroOscuro grid grid-cols-12 gap-6 lg:col-span-12">
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Excento: <strong>{excento ? "Si" : "No"}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Tributa Mínimo: <strong>{tributaMinimo ? "Si" : "No"}</strong></p>
                            </div>
                            <div className="col-span-12 intro-y lg:col-span-2">
                                <p>Debito Automático: <strong>{debitoAutomatico ? "Si" : "No"}</strong></p>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default AutosVer;
