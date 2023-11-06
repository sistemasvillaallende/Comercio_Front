import React from 'react'
import Table from "../../base-components/Table";
import { currencyFormat } from '../../utils/helper';
import { InformeCompleto } from '../../interfaces/Vehiculo';

const TablaInforme = (props: any) => {
  const informeCompleto = props;
  return (
    <>
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
              #
            </Table.Th>
            <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
              Concepto
            </Table.Th>
            <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
              Periodo
            </Table.Th>
            <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-right">
              Debe
            </Table.Th>
            <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-right">
              Haber
            </Table.Th>
            <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
              Plan de Pago
            </Table.Th>
            <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
              Nro. Proc.
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {informeCompleto.map((item: any, index: any) => (
            <Table.Tr key={index}>
              <Table.Td>{index + 1}</Table.Td>
              <Table.Td className="border-b-0 whitespace-nowrap text-center">
                {item.des_transaccion}
              </Table.Td>
              <Table.Td className="border-b-0 whitespace-nowrap text-center">
                {item.periodo}
              </Table.Td>
              <Table.Td className="border-b-0 whitespace-nowrap text-right">
                {currencyFormat(item.debe)}
              </Table.Td>
              <Table.Td className="border-b-0 whitespace-nowrap text-right">
                {currencyFormat(item.haber)}
              </Table.Td>
              <Table.Td className="border-b-0 whitespace-nowrap text-center">
                {item.nro_plan}
              </Table.Td>
              <Table.Td className="border-b-0 whitespace-nowrap text-center">
                {item.nro_procuracion}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}

export default TablaInforme