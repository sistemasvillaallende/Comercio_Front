import Lucide from "../../base-components/Lucide";
import imageAuto from "../../assets/IconoAuto.svg";
import { useAutoContext } from "../../context/AutoProvider";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MenuAutos = () => {
  const { vehiculo, traerAuto } = useAutoContext();
  const navigate = useNavigate();


  if (vehiculo) {
    return (
      <>
        <div
          className="col-span-12 lg:col-span-2 2xl:col-span-2 containerctacte menu-auto"
          style={{ overflowY: "scroll", backgroundColor: "#164e63" }}
        >
          {/* BEGIN: Inbox Menu */}
          <div
            className="p-2 mt-6 intro-y box"
            style={{
              backgroundColor: "#164e63",
              marginTop: "0",
              borderRadius: "0",
            }}
          >
            <h2 style={{ color: "white" }}>
              <img
                style={{
                  height: "30px",
                  width: "auto",
                  display: "initial",
                  maxWidth: "30%",
                  marginRight: "15px",
                }}
                alt="Midone Tailwind HTML Admin Template"
                src={imageAuto}
              />
              {vehiculo?.dominio}
            </h2>
            <hr />
            <p style={{ color: "white", marginTop: "10px" }}>
              {vehiculo?.nombre}
            </p>
            <div className="pt-1 mt-2 text-white border-t border-white/10 dark:border-darkmode-400">
              <Link
                to={`auto/${vehiculo?.dominio.trim()}/ver`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="Eye" className="w-4 h-4 mr-2" /> Ver Datos
              </Link>
              <Link
                to="nuevoVehiculo"
                className="flex items-center px-3 py-2 font-medium rounded-md"
              >
                <Lucide icon="PlusSquare" className="w-4 h-4 mr-2" /> Nuevo
              </Link>
              <Link
                to={`auto/${vehiculo?.dominio.trim()}/editar`}
                className="flex items-center px-3 py-2 font-medium rounded-md"
              >
                <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Modificar
              </Link>
              <Link
                to={`auto/${vehiculo?.dominio.trim()}/iniciarctacte`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="FilePlus" className="w-4 h-4 mr-2" /> Inicia Cta.
                Cte.
              </Link>
              <a
                href={"/Autos/#/ctasCtes/" + vehiculo?.dominio}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="DollarSign" className="w-4 h-4 mr-2" /> Cuenta
                Corriente
              </a>
              <Link
                to={`CtasCtes/${vehiculo?.dominio.trim()}/cancelarctacte`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="ThumbsUp" className="w-4 h-4 mr-2" /> Cancelar Cta.Cte.
              </Link>
              <Link
                to={`CtasCtes/${vehiculo?.dominio.trim()}/eliminarCancelacion`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="Slash" className="w-4 h-4 mr-2" /> Eliminar Cancelación
              </Link>
              <a
                href={"/Autos/#/Cedulones/"}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Cedulones
              </a>
              <Link
                to={`auto/${vehiculo?.dominio.trim()}/modificarDominio`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="RefreshCcw" className="w-4 h-4 mr-2" /> Modificar
                Dominio
              </Link>
              <Link
                to={`auto/${vehiculo?.dominio.trim()}/baja`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="Trash" className="w-4 h-4 mr-2" /> Baja de
                Vehículo
              </Link>
              <Link
                to={`auto/${vehiculo?.dominio.trim()}/contactoPlanes`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="Folder" className="w-4 h-4 mr-2" /> Contacto Planes
              </Link>
              <Link
                to={`auto/${vehiculo?.dominio.trim()}/valuacionHistorica`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="Calendar" className="w-4 h-4 mr-2" /> Valuación Historica
              </Link>
              <Link
                to={`auto/${vehiculo?.dominio.trim()}/reliquida`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="Rewind" className="w-4 h-4 mr-2" /> ReLiquida
              </Link>
              <Link
                to={`auto/${vehiculo?.dominio.trim()}/conceptos`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="Tag" className="w-4 h-4 mr-2" /> Conceptos
              </Link>
            </div>
          </div>
          {/* END: Inbox Menu */}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          className="col-span-12 lg:col-span-2 2xl:col-span-2 containerctacte menu-auto"
          style={{ overflowY: "scroll", backgroundColor: "#164e63" }}
        >
          {/* BEGIN: Inbox Menu */}
          <div
            className="p-2 mt-6 intro-y box"
            style={{
              backgroundColor: "#164e63",
              marginTop: "0",
              borderRadius: "0",
            }}
          >
            <h2 style={{ color: "white" }}>
              <img
                style={{
                  height: "30px",
                  width: "auto",
                  display: "initial",
                  maxWidth: "30%",
                  marginRight: "15px",
                }}
                alt="Midone Tailwind HTML Admin Template"
                src={imageAuto}
              />
              AUTOMOTORES
            </h2>
            <div className="pt-1 mt-2 text-white border-t border-white/10 dark:border-darkmode-400">
              <Link
                to="nuevoVehiculo"
                className="flex items-center px-3 py-2 font-medium rounded-md"
              >
                <Lucide icon="PlusSquare" className="w-4 h-4 mr-2" /> Nuevo
              </Link>
            </div>
          </div>
          {/* END: Inbox Menu */}
        </div>
      </>
    );
  }
};

export default MenuAutos;
