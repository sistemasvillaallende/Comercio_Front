import React from 'react'
import InformeDeDeuda from './InformeDeDeuda';
import Button from "../../base-components/Button";
import {
  FormInline,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";

const Informes = () => {

  return (
    <div className='paginas'>
      <div className="conScroll grid grid-cols-12 gap-6 mt-2 ml-3 mr-4">
        <div className="col-span-12 intro-y lg:col-span-12">

          <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
            <h2>Informe</h2>
          </div>
          <InformeDeDeuda />
        </div>
      </div>
    </div>
  )
}

export default Informes