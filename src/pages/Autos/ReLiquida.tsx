import { useEffect, useState } from 'react'
import { useAutoContext } from "../../context/AutoProvider";
import Table from "../../base-components/Table";
import { ReLiquidacion } from '../../interfaces/Vehiculo';
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserProvider";
import { formatNumberToARS, formatDateToDDMMYYYY } from "../../utils/Operaciones";

const ReLiquida = () => {
  const { vehiculo } = useAutoContext();
  const [reLiquidaciones, setReLiquidaciones] = useState<ReLiquidacion[]>([]);
  const [reLiquidacionesSeleccionadas, setReLiquidacionesSeleccionadas] = useState<ReLiquidacion[]>([]);
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    const dominioSinEspacios = vehiculo?.dominio.trim();
    const apiUrl = `${import.meta.env.VITE_URL_CTACTE}Listar_periodos_a_reliquidar?dominio=${dominioSinEspacios}`
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

  const handleRecalcularDeuda = (auditoria: String) => {
    console.log(reLiquidacionesSeleccionadas)
    const dominioSinEspacios = vehiculo?.dominio.trim();
    const consulta = {
      "dominio": dominioSinEspacios,
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
    console.log(consulta)
    const apiUrl = `${import.meta.env.VITE_URL_CTACTE}Confirma_reliquidacion`;
    axios.post(apiUrl, consulta).then((response) => {
      Swal.fire({
        title: 'Deuda Recalculada',
        text: "Deuda Recalculada Correctamente.",
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      setReLiquidacionesSeleccionadas([]);
      const dominioSinEspacios = vehiculo?.dominio.trim();
      navigate(`/auto/${dominioSinEspacios}/ver`);
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
      handleRecalcularDeuda(value);
    }
  }

  const handleCancelar = () => {
    setReLiquidacionesSeleccionadas([]);
    const dominioSinEspacios = vehiculo?.dominio.trim();
    navigate(`/auto/${dominioSinEspacios}/ver`);
  }

  return (
    <>
      <div className="conScroll grid grid-cols-12 gap-6 mt-5 ml-5 mr-4 sinAnimaciones">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2> Reliquidación de Deuda </h2>
          </div>
          <div className="grid grid-cols-12 gap-6 mt-3">
            {/** INICIO TABLA 1 */}
            <div className="col-span-12 intro-y lg:col-span-6">
              <div className="text-lg font-medium text-primary">
                Deudas del Vehículo
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
                      <Table.Th>Monto</Table.Th>
                      <Table.Th>Debe</Table.Th>
                      <Table.Th>Vto.</Table.Th>
                      <Table.Th>Tipo</Table.Th>
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
                        <Table.Td>{formatNumberToARS(liquidacion?.monto_original)}</Table.Td>
                        <Table.Td>{formatNumberToARS(liquidacion?.debe)}</Table.Td>
                        <Table.Td>{formatDateToDDMMYYYY(liquidacion?.vencimiento)}</Table.Td>
                        <Table.Td>{liquidacion?.tipo_deuda}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </div>
            {/** FIN TABLA 1 */}

            {/** INICIO TABLA 2 */}
            <div className="col-span-12 intro-y lg:col-span-6 mr-2">
              <div className="text-lg font-medium text-primary">
                Deudas que se recalculan
              </div>
              <div className="cabeceraTable">
                <Table>
                  <Table.Thead variant="dark">
                    <Table.Tr>
                      <Table.Th></Table.Th>
                      <Table.Th>Periodo</Table.Th>
                      <Table.Th>Monto</Table.Th>
                      <Table.Th>Debe</Table.Th>
                      <Table.Th>Vto.</Table.Th>
                      <Table.Th>Tipo</Table.Th>
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
                        <Table.Td>{formatNumberToARS(liquidacion?.monto_original)}</Table.Td>
                        <Table.Td>{formatNumberToARS(liquidacion?.debe)}</Table.Td>
                        <Table.Td>{formatDateToDDMMYYYY(liquidacion?.vencimiento)}</Table.Td>
                        <Table.Td>{liquidacion?.tipo_deuda}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </div>
            {/** FIN TABLA 1 */}
            <div className="col-span-12 intro-y lg:col-span-6 mr-2">
              <Button
                variant="primary"
                className="ml-3 mt-3"
                onClick={handleAuditoria}
              >
                Confirmar
              </Button>
              <Button
                variant="secondary"
                className="ml-3 mt-3"
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

export default ReLiquida