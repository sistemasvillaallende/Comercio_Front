import Button from "../../base-components/Button";
import Table from "../../base-components/Table";

interface Vehiculo {
  dominio: string;
  marca: string;
  modelo: string;
  nacional: boolean;
  anio: number;
  nro_bad: number;
  codigo_vehiculo: number;
  peso_cm3: number;
  fecha_cambio_dominio: Date | null;
  dominio_anterior: string;
  fecha_alta: Date;
  tipo_alta: boolean;
  baja: boolean;
  fecha_baja: Date | null;
  tipo_baja: number;
  per_ult: string;
  codigo_cip: string;
  variante: string;
  exento: boolean;
  tributa_minimo: boolean;
  nro_motor: string;
  cod_barrio_dom_esp: number;
  nom_barrio_dom_esp: string;
  cod_calle_dom_esp: number;
  nom_calle_dom_esp: string;
  nro_dom_esp: number;
  piso_dpto_esp: string;
  ciudad_dom_esp: string;
  provincia_dom_esp: string;
  pais_dom_esp: string;
  cod_postal_dom_esp: string;
  fecha_cambio_domicilio: Date | null;
  fecha_exencion: Date | null;
  fecha_vto_exencion: Date | null;
  causa_exencion: string;
  fecha_ingreso: Date;
  emite_cedulon: boolean;
  cod_registro_auto: number;
  responsable: string;
  porcentaje: string;
  sexo: string;
  cod_alta: number;
  cod_baja: number;
  debito_automatico: boolean;
  nro_secuencia: number;
  cod_situacion_judicial: number;
  codigo_cip_ant: string;
  codigo_acara: string;
  nombre: string;
  cod_tipo_documento: number;
  nro_documento: string;
  cod_tipo_liquidacion: number;
  clave_pago: string;
  monto: number;
  email_envio_cedulon: string;
  telefono: string;
  celular: string;
  fecha_cambio_radicacion: Date | null;
  cedulon_digital: number;
  usuario: string;
  usuariomodifica: string;
  fecha_modificacion: Date | null;
  clave_pago2: string;
  cuit: string;
  cuit_vecino_digital: string;
  fecha_vecino_digital: Date | null;
  con_deuda: number;
  saldo_adeudado: number;
  fecha_baja_real: Date | null;
  fecha_denuncia_vta: Date | null;
}

const AutoSeleccionado = (props: any) => {
  const { show, setShow, vehiculo } = props;

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <div className="conScroll overlay">
        <div className="modal-container">
          <div className="header">
            <h2>Datos del Automotor</h2>
          </div>
          <div className="overflow-x-auto">
            <p>
              <strong>Características del Vehículo</strong>
            </p>
            <Table className="tabla">
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">Dominio</Table.Th>
                  <Table.Th className="whitespace-nowrap">Año</Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Tipo de Vehículo
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">CIP</Table.Th>
                  <Table.Th className="whitespace-nowrap">Marca</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>{vehiculo.dominio}</Table.Td>
                  <Table.Td>{vehiculo.anio}</Table.Td>
                  <Table.Td>{vehiculo.tipo}</Table.Td>
                  <Table.Td>{vehiculo.codigo_cip}</Table.Td>
                  <Table.Td>{vehiculo.marca}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
            <Table className="tabla">
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">
                    Nro de Motor
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">Peso (cm3)</Table.Th>
                  <Table.Th className="whitespace-nowrap">Nacional</Table.Th>
                  <Table.Th className="whitespace-nowrap">Valor</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>{vehiculo.nro_motor}</Table.Td>
                  <Table.Td>{vehiculo.peso_cm3}</Table.Td>
                  <Table.Td>{vehiculo.nacional ? "Sí" : "No"}</Table.Td>
                  <Table.Td>{vehiculo.valor}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
          <div className="overflow-x-auto">
            <p>
              <strong>Datos del Propietario</strong>
            </p>
            <Table>
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">Propietario</Table.Th>
                  <Table.Th className="whitespace-nowrap">Número</Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Persona Jurídica
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">Responsable</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>{vehiculo.nombre}</Table.Td>
                  <Table.Td>{vehiculo.nro_bad}</Table.Td>
                  <Table.Td>{vehiculo.persona_juridica}</Table.Td>
                  <Table.Td>{vehiculo.responsable}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
            <Table>
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">
                    Tipo de Documento
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Número de Documento
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Número de CUIT
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    CUIT Vecino Digital
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Porcentaje (%)
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>{vehiculo.tipo_documento}</Table.Td>
                  <Table.Td>{vehiculo.nro_documento}</Table.Td>
                  <Table.Td>{vehiculo.cuit}</Table.Td>
                  <Table.Td>{vehiculo.cuit_vecino_digital}</Table.Td>
                  <Table.Td>{vehiculo.porcentaje}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
            <Table>
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">
                    Situación del Vehículo
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Tipo de Liquidación
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Último Período de Liquidación
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Emite Cédulon
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Clave de Pago
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>{vehiculo.situacion_vehiculo}</Table.Td>
                  <Table.Td>{vehiculo.tipo_liquidacion}</Table.Td>
                  <Table.Td>{vehiculo.emite_cedulon ? "Sí" : "No"}</Table.Td>
                  <Table.Td>{vehiculo.ultimo_periodo_liquidacion}</Table.Td>
                  <Table.Td>{vehiculo.clave_pago}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
          <div className="overflow-x-auto">
            <p>
              <strong>Otros Datos</strong>
            </p>
            <Table>
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">
                    Código de Alta
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Fecha de Alta
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">Normal</Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Nro de Registro Automotor
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap">
                    Sit. Tributaria
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>{vehiculo.cod_alta}</Table.Td>
                  <Table.Td>{vehiculo.fecha_alta}</Table.Td>
                  <Table.Td>{vehiculo.normal}</Table.Td>
                  <Table.Td>{vehiculo.nro_registro_automotor}</Table.Td>
                  <Table.Td>{vehiculo.situacion_tributaria}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
          <div className="botones">
            <Button variant="primary" className="ml-4 mt-5 mr-3">
              Descargar
            </Button>
            <Button variant="outline-primary" className="ml-4 mt-5 mr-3">
              Imprimir
            </Button>
            <Button variant="primary" className="ml-4 mt-5 mr-3">
              Modificar
            </Button>
            <Button
              variant="secondary"
              className="ml-4 mt-5 mr-3"
              onClick={handleClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AutoSeleccionado;
