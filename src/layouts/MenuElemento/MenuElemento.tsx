import Lucide from "../../base-components/Lucide";
import imagenComercio from "../../assets/IconoComercio.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";

const MenuElemento = () => {
  const { elementoIndCom, traerElemento } = useIndustriaComercioContext();
  const navigate = useNavigate();

  if (elementoIndCom) {
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
                src={imagenComercio}
              />
              {elementoIndCom?.nom_fantasia.trim()}
            </h2>
            <hr />
            <p style={{ color: "white", marginTop: "10px" }}>
              CUIT: {elementoIndCom?.nro_cuit}
            </p>
            <div className="pt-1 mt-2 text-white border-t border-white/10 dark:border-darkmode-400">
              <Link
                to={`iyc/${elementoIndCom?.legajo}/ver`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="Eye" className="w-4 h-4 mr-2" /> Ver Datos
              </Link>
              <Link
                to={`iyc/${elementoIndCom?.legajo}/editar`}
                className="flex items-center px-3 py-2 font-medium rounded-md"
              >
                <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Editar
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
                src={imagenComercio}
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

export default MenuElemento;
