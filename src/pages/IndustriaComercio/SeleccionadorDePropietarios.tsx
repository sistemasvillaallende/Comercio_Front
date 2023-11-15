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
    let apiUrl = `${import.meta.env.VITE_URL_AUTO}GetBadecByNombre?nombre=${texto}`;
    if (!isNaN(parseFloat(texto)) && isFinite(parseFloat(texto))) {
      apiUrl = `${import.meta.env.VITE_URL_AUTO}GetBadecByCuit?cuit=${texto}`;
    }
    axios
      .get(apiUrl)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPropietarios(response.data);
        } else {
          const propietariosArray = [response.data];
          setPropietarios(propietariosArray);
        }
      })
      .catch((error) => {
        Swal.fire({
          title: error.code,
          text: error.message,
          icon: `error`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
        console.log(error);
      });
  }

  const seleccionarPropietario = (propietario: Propietario) => {
    setPropietarioSeleccionado(propietario);
    setVentanaPropietario(false);
  }

  const cancelar = () => {
    setVentanaPropietario(false);
  }

  return (
    <div className="overlay">
      <div className="modal-container">

        <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">

          <h2>Buscar Propietario</h2>

          <div>
            <Button
              variant="danger"
              style={{ cursor: "pointer" }}
              onClick={() => cancelar()}
            >
              <Lucide icon="X" className="w-3 h-3" />
            </Button>
          </div>

        </div>

        <div className="col-span-12 intro-y lg:col-span-5 mb-4">
          <InputGroup>
            <FormInput
              id="formPropietario"
              type="text"
              placeholder='Nombre o CUIT'
              value={textoBuscado}
              onChange={(e) => setTextoBuscado(e.target.value)}
            />
            <InputGroup.Text
              id="input-group-price"
              className="cursor-pointer"
              onClick={() => obtenerPropietarios(textoBuscado)}
            >
              <Lucide icon="Search" className="w-4 h-4" />
            </InputGroup.Text>
          </InputGroup>
        </div>

        <div className="conScroll">
          <Table className="tablaPropietario">
            <Table.Thead variant="light">
              <Table.Tr>
                <Table.Th className="whitespace-nowrap text-center">Nro. Bad</Table.Th>
                <Table.Th className="whitespace-nowrap text-center">CUIT</Table.Th>
                <Table.Th className="whitespace-nowrap text-center">Nombre</Table.Th>
                <Table.Th className="whitespace-nowrap text-center"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {propietarios.map((propietario, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="whitespace-nowrap text-center">{propietario?.nro_bad}</Table.Td>
                  <Table.Td className="whitespace-nowrap text-center">{propietario?.cuit}</Table.Td>
                  <Table.Td className="whitespace-nowrap text-left">
                    {propietario?.nombre}
                  </Table.Td>
                  <Table.Td className="whitespace-nowrap text-center">
                    <Button
                      variant="linkedin"
                      style={{ cursor: "pointer" }}
                      onClick={() => seleccionarPropietario(propietario)}
                    >

                      <Lucide icon="Plus" className="w-3 h-3" />
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </div >
  )
}

export default SeleccionadorDePropietarios