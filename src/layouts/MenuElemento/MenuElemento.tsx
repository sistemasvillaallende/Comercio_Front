import Lucide from "../../base-components/Lucide";
import imagenComercio from "../../assets/IconoComercio.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import '../../assets/css/components/_Sidebar.css';

const MenuElemento = () => {
  const { elementoIndCom, traerElemento } = useIndustriaComercioContext();
  const navigate = useNavigate();

  if (elementoIndCom) {
    return (
      <>
        <nav className="sidebar">
          <h2><Lucide icon="Factory" className="w-4 h-4 mr-2" style={{
            height: '40px', width: '40px',
            color: 'hsla(0, 0%, 13%, 1)'
          }} />
            <span style={{ paddingTop: '10px', paddingLeft: '0px' }}>Leg. {elementoIndCom.legajo}</span> </h2>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="nuevo">Nuevo</Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/ver`}
              >
                Ver Datos
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/editar`}
              >
                Editar
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/baseimponible`}
              >
                Bases Imponibles
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/iniciarctacte`}
              >
                Inicia Cta. Cte.
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/ctacte`}
              >
                Cuenta Corriente
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/cancelarctacte`}
              >
                Cancelar Cta.Cte.
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/eliminarCancelacion`}
              >
                Eliminar Cancelación
              </Link>
            </li>
            <li>
              <Link
                to={`Cedulones`}
              >
                Cedulones
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/reliquida`}
              >
                Reliquida
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/informes`}
              >
                Informes
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/contacto`}
              >
                Datos de Contacto
              </Link>
            </li>
            <li>
              <Link
                to={`comerciosPorCalle`}
              >
                Comercios por Calle
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/declaraciones-juradas`}
              >
                Declaraciones Juradas
              </Link>
            </li>
            <li>
              <Link
                to={`${elementoIndCom?.legajo}/rubros`}
              >
                Rubros
              </Link>
            </li>
          </ul>
        </nav>
      </>
    );
  }
};

export default MenuElemento;
