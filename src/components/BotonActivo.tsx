import React from 'react'
import { Link } from 'react-router-dom'

interface BotonActivoProps {
  to: string;
  texto: string;
}

const BotonActivo: React.FC<BotonActivoProps> = ({ to, texto }) => {
  return (
    <>
      <Link
        to={to}
        className="ml-5 inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {texto}
      </Link>
    </>
  )
}

export default BotonActivo