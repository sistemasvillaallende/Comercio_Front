import React, { useEffect, useState } from 'react'
import Table from "../../base-components/Table";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import axios from 'axios';
import { Propietario } from '../../interfaces/IndustriaComercio';
import Swal from 'sweetalert2';
import {
  FormSelect,
  FormInput,
  FormLabel,
  FormSwitch,
  InputGroup,
} from "../../base-components/Form";

const SeleccionadorDePropietarios = (props: any) => {

  const [propietarios, setPropietarios] = React.useState<Propietario[]>([]);
  const { setPropietarioSeleccionado, setVentanaPropietario } = props
  const [textoBuscado, setTextoBuscado] = useState<string>("")

  useEffect(() => {
  }, [])

  const obtenerPropietarios = async (texto: string) => {
    if (!texto || texto.trim() === '') {
      Swal.fire({
        title: 'Error',
        text: 'Debe ingresar un nombre o CUIT para buscar',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      return;
    }

    // Usar la URL correcta para los endpoints de Badec
    const badecBaseUrl = import.meta.env.VITE_URL_BADEC || 'http://10.0.0.24/webapicreditos24/Badec/';
    let apiUrl = `${badecBaseUrl}GetBadecByNombre?nombre=${texto}`;
    if (!isNaN(parseFloat(texto)) && isFinite(parseFloat(texto))) {
      apiUrl = `${badecBaseUrl}GetBadecByCuit?cuit=${texto}`;
    }

    console.log('URL de la API:', apiUrl); // Para debugging

    axios
      .get(apiUrl)
      .then((response) => {
        console.log('Respuesta del API Badec:', response.data);
        if (Array.isArray(response.data)) {
          setPropietarios(response.data);
        } else if (response.data) {
          const propietariosArray = [response.data];
          setPropietarios(propietariosArray);
        } else {
          setPropietarios([]);
          Swal.fire({
            title: 'Sin resultados',
            text: 'No se encontraron propietarios con ese criterio',
            icon: 'info',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#27a3cf',
          });
        }
      })
      .catch((error) => {
        setPropietarios([]);
        Swal.fire({
          title: error.response?.status || 'Error',
          text: error.response?.data?.message || error.message || 'Error al buscar propietarios',
          icon: `error`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
        console.log('Error en la búsqueda:', error);
      });
  }

  const seleccionarPropietario = (propietario: Propietario) => {
    console.log('Propietario que se va a seleccionar:', propietario);
    console.log('nro_bad del propietario:', propietario.nro_bad);
    setPropietarioSeleccionado(propietario);
    setVentanaPropietario(false);
  }

  const cancelar = () => {
    setVentanaPropietario(false);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && textoBuscado.trim()) {
      obtenerPropietarios(textoBuscado);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex w-full justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Buscar Propietario (para obtener CUIT)</h2>
            <Button
              variant="danger"
              size="sm"
              onClick={() => cancelar()}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-4">
            <InputGroup>
              <FormInput
                id="formPropietario"
                type="text"
                placeholder='Nombre o CUIT'
                value={textoBuscado}
                onChange={(e) => setTextoBuscado(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-gray-300"
              />
              <InputGroup.Text
                id="input-group-price"
                className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => obtenerPropietarios(textoBuscado)}
              >
                <Lucide icon="Search" className="w-4 h-4" />
              </InputGroup.Text>
            </InputGroup>
          </div>

          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded">
            <Table>
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap text-center">Nro. Bad</Table.Th>
                  <Table.Th className="whitespace-nowrap text-center">CUIT</Table.Th>
                  <Table.Th className="whitespace-nowrap text-center">Nombre</Table.Th>
                  <Table.Th className="whitespace-nowrap text-center">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {propietarios.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4} className="text-center text-gray-500 py-8">
                      {textoBuscado ? 'No se encontraron propietarios' : 'Ingrese un nombre o CUIT para buscar'}
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  propietarios.map((propietario, index) => (
                    <Table.Tr key={index} className="hover:bg-gray-50">
                      <Table.Td className="whitespace-nowrap text-center">{propietario?.nro_bad}</Table.Td>
                      <Table.Td className="whitespace-nowrap text-center">{propietario?.cuit}</Table.Td>
                      <Table.Td className="whitespace-nowrap text-left">
                        {propietario?.nombre}
                      </Table.Td>
                      <Table.Td className="whitespace-nowrap text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => seleccionarPropietario(propietario)}
                          className="hover:bg-blue-600"
                        >
                          <Lucide icon="Check" className="w-4 h-4 mr-1" />
                          Seleccionar
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => cancelar()}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeleccionadorDePropietarios