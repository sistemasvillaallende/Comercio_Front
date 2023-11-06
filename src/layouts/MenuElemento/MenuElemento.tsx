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
                to="nuevo"
                className="flex items-center px-3 py-2 font-medium rounded-md"
              >
                <Lucide icon="PlusSquare" className="w-4 h-4 mr-2" /> Nuevo
              </Link>

              <Link
                to={`${elementoIndCom?.legajo}/ver`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="Eye" className="w-4 h-4 mr-2" /> Ver Datos
              </Link>

              <Link
                to={`${elementoIndCom?.legajo}/editar`}
                className="flex items-center px-3 py-2 font-medium rounded-md"
              >
                <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Editar
              </Link>

              <Link
                to={`${elementoIndCom?.legajo}/baseimponible`}
                className="flex items-center px-3 py-2 font-medium rounded-md"
              >
                <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" /> Bases Imponibles
              </Link>

              <Link
                to={`${elementoIndCom?.legajo}/iniciarctacte`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" /> Inicia Cta. Cte.
              </Link>

              <Link
                to={`${elementoIndCom?.legajo}/ctacte`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" /> Cuenta Corriente
              </Link>
              <Link
                to={`${elementoIndCom?.legajo}/cancelarctacte`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" /> Cancelar Cta.Cte.
              </Link>

              <Link
                to={`${elementoIndCom?.legajo}/eliminarCancelacion`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" /> Eliminar Cancelación
              </Link>

              <Link
                to={`Cedulones`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" /> Cedulones
              </Link>

              <Link
                to={`${elementoIndCom?.legajo}/informes`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" /> Informes
              </Link>

              <Link
                to={`${elementoIndCom?.legajo}/contacto`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" /> Datos de Contacto
              </Link>

              <Link
                to={`comerciosPorCalle`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" /> Comercios por Calle
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
              <br />
              INDUSTRIA Y COMERCIO
            </h2>
            <div className="pt-1 mt-2 text-white border-t border-white/10 dark:border-darkmode-400">
              <Link
                to="nuevoVehiculo"
                className="flex items-center px-3 py-2 font-medium rounded-md"
              >
                <Lucide
                  icon="PlusSquare"
                  className="w-4 h-4 mr-2"
                /> Nuevo
              </Link>

              <Link
                to={`ComerciosPorCalle`}
                className="flex items-center px-3 py-2 mt-2 rounded-md"
              >
                <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" /> Comercios por Calle
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
