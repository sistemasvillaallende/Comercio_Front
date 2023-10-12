import { useEffect, useState } from 'react'
import { useAutoContext } from "../../context/AutoProvider";
import Table from "../../base-components/Table";
import { Planes } from '../../interfaces/Planes';
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const ContactoPlanes = () => {

  const { vehiculo } = useAutoContext();
  const [contactoPlanes, setContactoPlanes] = useState<Planes[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_URL_AUTO}GetContactoPlanesxDominio?dominio=${vehiculo?.dominio}`;
    axios
      .get(apiUrl)
      .then((response) => {
        setContactoPlanes(response.data);
      })
      .catch((error) => {
        Swal.fire({
          title: 'Sin Información',
          text: "Información, no se encontraron Planes para este dominio.",
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#27a3cf',
        });
        console.log(error);
        navigate(`/auto/${vehiculo?.dominio}/ver`);
      });
  }, [])

  return (
    <div className="conScroll grid grid-cols-12 gap-6 mt-1 ml-2">
      <div className="col-span-12 intro-y lg:col-span-12">
        <div className="grid grid-cols-12 gap-6 mt-1">
          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Contacto Planes</h2>
          </div>
          <div className="col-span-12 intro-y lg:col-span-12">
            <Table className="mt-5">
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">Nro Plan</Table.Th>
                  <Table.Th className="whitespace-nowrap">Fec Plan</Table.Th>
                  <Table.Th className="whitespace-nowrap">Fec Fin</Table.Th>
                  <Table.Th className="whitespace-nowrap">DNI</Table.Th>
                  <Table.Th className="whitespace-nowrap">En caracter de</Table.Th>
                  <Table.Th className="whitespace-nowrap">Calle</Table.Th>
                  <Table.Th className="whitespace-nowrap">Nro</Table.Th>
                  <Table.Th className="whitespace-nowrap">Barrio</Table.Th>
                  <Table.Th className="whitespace-nowrap">Tel</Table.Th>
                  <Table.Th className="whitespace-nowrap">Email</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {contactoPlanes.map((contactoPlanes) => (
                  <Table.Tr>
                    <Table.Td className="whitespace-nowrap">{contactoPlanes?.nro_plan}</Table.Td>
                    <Table.Td className="whitespace-nowrap">{contactoPlanes?.fecha_plan}</Table.Td>
                    <Table.Td className="whitespace-nowrap">{contactoPlanes?.fecha_fin_plan}</Table.Td>
                    <Table.Td className="whitespace-nowrap">{contactoPlanes?.dni_solicitante}</Table.Td>
                    <Table.Td className="whitespace-nowrap">{contactoPlanes?.en_caracter_de_solicitante}</Table.Td>
                    <Table.Td className="whitespace-nowrap">{contactoPlanes?.nom_calle_solicitante}</Table.Td>
                    <Table.Td className="whitespace-nowrap">{contactoPlanes?.nro_dom_solicitante}</Table.Td>
                    <Table.Td className="whitespace-nowrap">{contactoPlanes?.nom_barrio_solicitante}</Table.Td>
                    <Table.Td className="whitespace-nowrap">{contactoPlanes?.celular_solicitante}</Table.Td>
                    <Table.Td className="whitespace-nowrap">{contactoPlanes?.email_solicitante}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactoPlanes