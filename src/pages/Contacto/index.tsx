import { useState, useEffect } from 'react'
import { Badec } from '../../interfaces/IndustriaComercio'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Contacto = () => {

  const [contacto, setContacto] = useState<Badec>();
  const navigate = useNavigate();

  useEffect(() => {
    buscarElemento(`20225378232`);
  }, []);

  const buscarElemento = async (cuit: string) => {
    const URL = `${import.meta.env.VITE_URL_BASE}Indycom/GetBadecByCuit?cuit=${cuit}`;
    const response = await fetch(URL);
    const data = await response.json();
    setContacto(data[0]);
    console.log(data[0])
    if (data.resultado.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Al parecer no hay datos para mostrar, por favor intente con otros parámetros.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      navigate(`-1`);
    }
  }

  return (
    <>
      <div className="conScroll flex flex-col gap-6 mt-2 ml-3 mr-4 p-4">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <h2>Datos de Contacto</h2>
        </div>

        <div className="flex flex-col gap-6">

          <div className="cuadroOscuro flex flex-col lg:flex-row gap-6">
            <div className="flex-1 lg:flex-none lg:w-1/6">
              <p>Nro Bad: <strong>{contacto?.nro_bad}</strong></p>
            </div>
            <div className="flex-1 lg:flex-none lg:w-1/3">
              <p>Nombre: <strong>{contacto?.nombre}</strong></p>
            </div>
          </div>

          <div className="cuadroOscuro flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <p>Dirección: <strong>{contacto?.nombre_calle} {contacto?.nro_dom}, {contacto?.localidad}, {contacto?.provincia}</strong></p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Contacto