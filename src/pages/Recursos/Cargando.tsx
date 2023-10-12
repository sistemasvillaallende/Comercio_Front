import LoadingIcon from "../../base-components/LoadingIcon";
import Mensaje from "../../types/mensaje";

const Cargando = (props: Mensaje) => {
  const mensaje = props.mensaje || "Cargando...";
  return (
    <div className="precarga">
      <div className="flex flex-col items-center justify-end col-span-6 sm:col-span-3 xl:col-span-2">
        <LoadingIcon icon="oval" className="w-8 h-8" />
        <div className="mt-2 text-xs text-center">{mensaje}</div>
      </div>
    </div>
  )
}

export default Cargando