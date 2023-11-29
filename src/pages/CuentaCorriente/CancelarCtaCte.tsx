import { useEffect, useState } from 'react'
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import Table from "../../base-components/Table";
import { ReLiquidacion } from '../../interfaces/IndustriaComercio';
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserProvider";
import { formatNumberToARS, formatDateToDDMMYYYY } from "../../utils/Operaciones";
import {
  FormSelect,
  FormLabel,
  FormInline,
} from "../../base-components/Form";

const CancelarCtaCte = () => {
  const { elementoIndCom } = useIndustriaComercioContext();
  const [reLiquidaciones, setReLiquidaciones] = useState<ReLiquidacion[]>([]);
  const [reLiquidacionesSeleccionadas, setReLiquidacionesSeleccionadas] = useState<ReLiquidacion[]>([]);
  const [motivo, setMotivo] = useState<number>(0);
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_URL_API_IYC}Ctasctes_indycom/Listar_periodos_a_cancelar?legajo=${elementoIndCom?.legajo}`
    axios.get(apiUrl).then((response) => {
      setReLiquidaciones(response.data);
    }).catch((error) => {
      Swal.fire({
        title: `${error.response.data.message}`,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
    });
  }, [])

  const handleSeleccionar = (e: ReLiquidacion) => {
    const reLiquidacionSeleccionada = reLiquidacionesSeleccionadas.find((reLiquidacion) => reLiquidacion.periodo === e.periodo);
    if (reLiquidacionSeleccionada) {
      const reLiquidacionesFiltradas = reLiquidacionesSeleccionadas.filter((reLiquidacion) => reLiquidacion.periodo !== e.periodo);
      setReLiquidacionesSeleccionadas(reLiquidacionesFiltradas);
    } else {
      setReLiquidacionesSeleccionadas([...reLiquidacionesSeleccionadas, e]);
    }
  }

  const handleSeleccionarTodo = () => {
    if (reLiquidacionesSeleccionadas.length === reLiquidaciones.length) {
      setReLiquidacionesSeleccionadas([]);
    } else {
      setReLiquidacionesSeleccionadas([...reLiquidaciones]);
    }
  }

  const verFechaActual = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Sumamos 1 ya que en JavaScript los meses comienzan en 0
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    return formattedDate;
  }

  const handleCancelarCtaCte = (auditoria: String) => {

    const consulta = {
      "legajo": elementoIndCom?.legajo,
      "lstCtasTes": reLiquidacionesSeleccionadas,
      "auditoria": {
        "id_auditoria": 0,
        "fecha": verFechaActual(),
        "usuario": user?.userName,
        "proceso": "Reliquidación de deuda",
        "identificacion": "string",
        "autorizaciones": "string",
        "observaciones": auditoria,
        "detalle": "string",
        "ip": "string"
      }
    }

    const apiUrl = `${import.meta.env.VITE_URL_API_IYC}Ctasctes_indycom/Confirma_cancelacion_ctasctes?tipo_transaccion=${motivo}`;
    axios.post(apiUrl, consulta).then((response) => {
      Swal.fire({
        title: 'Cancelación realizada',
        text: "Se ha cancelado correctamente los periodos seleccionados.",
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      setReLiquidacionesSeleccionadas([]);
      navigate(`/${elementoIndCom?.legajo}/ver`);
    }).catch((error) => {
      Swal.fire({
        title: `${error.response.status}: ${error.response.statusText}`,
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      console.log(error);
    });
  }

  const handleAuditoria = async () => {
    if (motivo === 0) {
      Swal.fire({
        title: 'Debe seleccionar un motivo',
        icon: 'warning',
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
      handleCancelarCtaCte(value);
    }
  }

  const handleCancelar = () => {
    setReLiquidacionesSeleccionadas([]);

    navigate(`/${elementoIndCom?.legajo}/ver`);
  }

  const sumarMontosSeleccionados = () => {
    const total = reLiquidacionesSeleccionadas.reduce((accumulator, liquidacion) => {
      return accumulator + liquidacion.monto_original;
    }, 0);

    return total;
  }

  return (
    <>
      <div className="conScroll grid grid-cols-12 gap-6 mt-5 ml-5 mr-4 sinAnimaciones">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2> Cancelación especial de periodos de Cuenta Corriente </h2>
          </div>
          <div className="grid grid-cols-12 gap-6 mt-3">
            {/** INICIO TABLA 1 */}
            <div className="col-span-12 intro-y lg:col-span-4">
              <div className="text-lg font-medium text-primary">
                Periodos disponibles
              </div>
              <div className="cabeceraTable">
                <Table>
                  <Table.Thead variant="dark">
                    <Table.Tr>
                      <Table.Th>
                        <Lucide
                          icon="CheckSquare"
                          className="w-5 h-5"
                          onClick={() => handleSeleccionarTodo()}
                          style={{ cursor: "pointer" }}
                        />
                      </Table.Th>
                      <Table.Th>Periodo</Table.Th>
                      <Table.Th className='text-center'>Monto</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                </Table>
              </div>
              <div className='conScrollInicio cuadroDeudas'>
                <Table>
                  <Table.Tbody>
                    {reLiquidaciones.map((liquidacion, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>
                          <label>
                            <input
                              type="checkbox"
                              onChange={() => handleSeleccionar(liquidacion)}
                              checked={reLiquidacionesSeleccionadas.includes(liquidacion)}
                            />
                          </label>
                        </Table.Td>
                        <Table.Td>{liquidacion?.periodo}</Table.Td>
                        <Table.Td className='text-right'>{formatNumberToARS(liquidacion?.monto_original)}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </div>
            {/** FIN TABLA 1 */}

            {/** INICIO TABLA 2 */}
            <div className="col-span-12 intro-y lg:col-span-4 mr-2">
              <div className="text-lg font-medium text-primary">
                Periodos a Cancelar
              </div>
              <div className="cabeceraTable">
                <Table>
                  <Table.Thead variant="dark">
                    <Table.Tr>
                      <Table.Th></Table.Th>
                      <Table.Th>Periodo</Table.Th>
                      <Table.Th className='text-center'>Monto</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                </Table>
              </div>
              <div className='conScrollInicio cuadroDeudas'>
                <Table>
                  <Table.Tbody>
                    {reLiquidacionesSeleccionadas.map((liquidacion, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>
                          <label>
                            <input
                              type="checkbox"
                              onChange={() => handleSeleccionar(liquidacion)}
                              checked={reLiquidacionesSeleccionadas.includes(liquidacion)}
                            />
                          </label>
                        </Table.Td>
                        <Table.Td>{liquidacion?.periodo}</Table.Td>
                        <Table.Td className='text-right'>{formatNumberToARS(liquidacion?.monto_original)}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
              <div className="mt-3 flex w-full justify-between text-lg font-medium text-primary text-right">
                <span>Total:</span>
                <span>{formatNumberToARS(sumarMontosSeleccionados())}</span>
              </div>
            </div>
            {/** FIN TABLA 1 */}
            <div className="col-span-12 intro-y lg:col-span-3"></div>
            <div className="col-span-12 intro-y lg:col-span-4">
              <FormInline>
                <FormLabel
                  htmlFor="horizontal-form-1"
                >
                  Motivo:
                </FormLabel>
                <FormSelect
                  className="sm:mt-2 sm:mr-2"
                  aria-label=".form-select-lg example"
                  onChange={(e) => setMotivo(Number(e.target.value))}
                >
                  <option>Seleccione un motivo</option>
                  <option value={7}>Cancelación Operativa</option>
                  <option value={8}>Decreto/Resolución</option>
                </FormSelect>
              </FormInline>
            </div>
            <div className="col-span-12 intro-y lg:col-span-6 mr-2 mt-2">
              <Button
                variant="primary"
                className="ml-3"
                onClick={handleAuditoria}
              >
                Confirmar
              </Button>
              <Button
                variant="secondary"
                className="ml-3"
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CancelarCtaCte