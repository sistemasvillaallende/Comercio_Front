import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FormTextarea,
  FormLabel,
  FormInput,
  FormSelect,
} from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useAutoContext } from "../../context/AutoProvider";
import { useUserContext } from "../../context/UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const AutosBaja = () => {
  const { dominio } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const { vehiculo, traerAuto } = useAutoContext();

  const cancelar = () => {
    navigate(-1);
  };

  const [codBaja, setCodBaja] = useState<string>("690");
  const [aPartirDeFecha, setAPartirDeFecha] = useState<string>("");
  const [hastaPeriodo, setHastaPeriodo] = useState<string>("");
  const [hastaFecha, setHastaFecha] = useState<string>("");
  const [codigosDeBaja, setCodigosDeBaja] = useState<any[]>([]);

  const traerCodigosDeBaja = () => {
    const urlApi = `${import.meta.env.VITE_URL_AUTO}Causa_baja_auto`;
    axios.get(urlApi).then((response) => {
      if (response.data) {
        setCodigosDeBaja(response.data);
        const bajaDefault = {
          "value": "690",
          "text": "BAJA POR DEFECTO",
          "campo_enlace": ""
        }
        //agregar al inicio de codigosDeBaja la baja por defecto
        setCodigosDeBaja([bajaDefault, ...response.data]);
      }
    })
  }

  useEffect(() => {
    if (dominio) {
      traerAuto(dominio);
      traerCodigosDeBaja();
    }
  }, [dominio]);

  const formatearFecha = (fecha: string) => {
    const fechaFormateada = fecha.split("-").reverse().join("/");
    return fechaFormateada;
  };

  const darDeBajaAuto = () => {
    const fechaActual = new Date();
    const fechaActualString = fechaActual.toISOString();

    const urlApi = `${import.meta.env.VITE_URL_AUTO
      }Bajalogicavehiculo?cod_baja=${codBaja}&fecha_tramite=${formatearFecha(
        fechaActualString
      )}&dado_baja_por=${user?.userName}&a_partir_de_fecha=${formatearFecha(
        aPartirDeFecha
      )}&hasta_periodo=${hastaPeriodo}&hasta_fecha=${formatearFecha(
        hastaFecha
      )}}`;

    const requestBody = {
      dominio: vehiculo?.dominio,
      marca: vehiculo?.marca,
      modelo: vehiculo?.modelo,
      nacional: vehiculo?.nacional,
      anio: vehiculo?.anio,
      nro_bad: vehiculo?.nro_bad,
      codigo_vehiculo: vehiculo?.codigo_vehiculo,
      peso_cm3: vehiculo?.peso_cm3,
      fecha_cambio_dominio: vehiculo?.fecha_cambio_dominio,
      dominio_anterior: vehiculo?.dominio_anterior,
      fecha_alta: vehiculo?.fecha_alta,
      tipo_alta: vehiculo?.tipo_alta,
      baja: vehiculo?.baja,
      fecha_baja: vehiculo?.fecha_baja,
      tipo_baja: vehiculo?.tipo_baja,
      per_ult: vehiculo?.per_ult,
      codigo_cip: vehiculo?.codigo_cip,
      variante: vehiculo?.variante,
      exento: vehiculo?.exento,
      tributa_minimo: vehiculo?.tributa_minimo,
      nro_motor: vehiculo?.nro_motor,
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
      emite_cedulon: vehiculo?.emite_cedulon,
      cod_registro_auto: vehiculo?.cod_registro_auto,
      responsable: vehiculo?.responsable,
      porcentaje: vehiculo?.porcentaje,
      sexo: vehiculo?.sexo,
      cod_alta: vehiculo?.cod_alta,
      cod_baja: vehiculo?.cod_baja,
      debito_automatico: vehiculo?.debito_automatico,
      nro_secuencia: vehiculo?.nro_secuencia,
      cod_situacion_judicial: vehiculo?.cod_situacion_judicial,
      codigo_cip_ant: vehiculo?.codigo_cip_ant,
      codigo_acara: vehiculo?.codigo_acara,
      nombre: vehiculo?.nombre,
      cod_tipo_documento: vehiculo?.cod_tipo_documento,
      nro_documento: vehiculo?.nro_documento,
      cod_tipo_liquidacion: vehiculo?.cod_tipo_liquidacion,
      clave_pago: vehiculo?.clave_pago,
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
      cuit: vehiculo?.cuit,
      cuit_vecino_digital: vehiculo?.cuit_vecino_digital,
      fecha_vecino_digital: vehiculo?.fecha_vecino_digital,
      con_deuda: vehiculo?.con_deuda,
      saldo_adeudado: vehiculo?.saldo_adeudado,
      fecha_baja_real: vehiculo?.fecha_baja_real,
      fecha_denuncia_vta: vehiculo?.fecha_denuncia_vta,
      objAuditoria: {
        id_auditoria: 0,
        fecha: "",
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
            title: "Vehículo dado de baja",
            text: "El vehículo se dio de baja correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          });
          console.log(response.data);
        } else {
          Swal.fire({
            title: "Error al actualizar",
            text: "El vehículo no se pudo dar de baja",
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
          <div className="grid grid-cols-12 gap-6 mt-3">
            <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
              <h2>Baja de Vehiculo</h2>
              <h2>Dominio: {vehiculo?.dominio}</h2>
            </div>
            <div className="col-span-12 intro-y lg:col-span-4">
              <FormLabel htmlFor="dominio-input" className="sm:w-50">
                Código de baja
              </FormLabel>
              <div className="col-span-12 intro-y lg:col-span-4">
                <FormSelect
                  className="sm:mr-2"
                  value={codBaja}
                  onChange={(e) => setCodBaja(e.target.value)}
                >
                  <option>Seleccionar...</option>
                  {codigosDeBaja.map((codigo) => (
                    <option key={codigo.value} value={codigo.value}>
                      ({codigo.value}) {codigo.text}
                    </option>
                  ))}
                </FormSelect>
              </div>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="dominio-input" className="sm:w-50">
                A partir de la fecha
              </FormLabel>
              <div className="col-span-12 intro-y lg:col-span-4">
                <FormInput
                  type="date"
                  className="sm:mr-2"
                  value={aPartirDeFecha}
                  onChange={(e) => setAPartirDeFecha(e.target.value)}
                />
              </div>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="dominio-input" className="sm:w-50">
                Hasta Periodo
              </FormLabel>
              <div className="col-span-12 intro-y lg:col-span-4">
                <FormInput
                  type="text"
                  className="sm:mr-2"
                  value={hastaPeriodo}
                  onChange={(e) => setHastaPeriodo(e.target.value)}
                  placeholder="AAAA/MM"
                />
              </div>
            </div>
            <div className="col-span-12 intro-y lg:col-span-2">
              <FormLabel htmlFor="dominio-input" className="sm:w-50">
                Hasta Fecha
              </FormLabel>
              <div className="col-span-12 intro-y lg:col-span-4">
                <FormInput
                  type="date"
                  className="sm:mr-2"
                  value={hastaFecha}
                  onChange={(e) => setHastaFecha(e.target.value)}
                />
              </div>
            </div>
            <div className="col-span-12 intro-y lg:col-span-12">
              <Button
                variant="primary"
                className="ml-3"
                onClick={darDeBajaAuto}
              >
                Dar de baja
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

export default AutosBaja;
