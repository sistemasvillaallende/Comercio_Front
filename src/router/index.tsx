import { Routes, Route, useNavigate } from "react-router-dom";
//Paginas Varis
import Login from "../pages/Users/Login";
import NotFound from "../pages/Errors/NotFound ";

//layouts
import TopMenu from "../layouts/TopMenu";
//Context
import { UserProvider } from "../context/UserProvider";
import { IndustriaComercioProvider } from "../context/IndustriaComercioProvider";
import { CedulonesProvider } from "../context/CedulonesProviders";

//Páginas de Industria y Comercio
import Inicio from "../pages/IndustriaComercio";
import Ver from "../pages/IndustriaComercio/Ver";
import Editar from "../pages/IndustriaComercio/Editar";
import Nuevo from "../pages/IndustriaComercio/Nuevo";
import BasesImponibles from "../pages/BaseImponible";
import ComerciosPorCalle from "../pages/ComerciosPorCalle";
import IniciarCtaCorriente from "../pages/CuentaCorriente/IniciarCtaCorriente";
import CuentaCorriente from "../pages/CuentaCorriente/CuentaCorriente";
import Cedulones from "../pages/Cedulones";
import Informes from "../pages/Informes";
import Deudas from "../pages/Deudas";
import Contacto from "../pages/Contacto";
import ResumenCuenta from "../pages/Informes/ResumenCuenta";
import Cedulon from "../pages/Cedulones/Cedulon";
import CancelarCtaCte from "../pages/CuentaCorriente/CancelarCtaCte";
import EliminarCancelacion from "../pages/CuentaCorriente/EliminarCancelacion";

const Router = () => {
  const usuarioLogeado = sessionStorage.getItem("usuarioLogeado");
  const navigate = useNavigate();

  return (
    <>
      <UserProvider>
        <CedulonesProvider>
          <IndustriaComercioProvider>
            {!usuarioLogeado ? (
              <Routes>
                <Route path="/*" element={<Login />} />
                <Route path="/CIDI/:codigoCIDI" element={<Login />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<TopMenu />}>
                  <Route path="/" element={<Inicio />} />
                  <Route path="/nuevo" element={<Nuevo />} />
                  <Route path="/:legajo/ver" element={<Ver />} />
                  <Route path="/:legajo/editar" element={<Editar />} />
                  <Route path="/:legajo/baseimponible" element={<BasesImponibles />} />

                  <Route path="/:legajo/iniciarctacte" element={<IniciarCtaCorriente />} />
                  <Route path="/:legajo/ctacte" element={<CuentaCorriente />} />
                  <Route path="/:legajo/cancelarctacte" element={<CancelarCtaCte />} />
                  <Route path="/:legajo/eliminarCancelacion" element={<EliminarCancelacion />} />

                  <Route path="/Cedulones/" element={<Cedulones />} />
                  <Route path="/:legajo/informes" element={<Informes />} />
                  <Route path="/:legajo/deudas" element={<Deudas />} />
                  <Route path="/:legajo/Contacto" element={<Contacto />} />
                  <Route path="/ComerciosPorCalle" element={<ComerciosPorCalle />} />

                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<NotFound />} />
                <Route path="/Cedulon/:nrocedulon" element={<Cedulon />} />
                <Route path="/ResumenCuenta" element={<ResumenCuenta />} />
              </Routes>
            )}
          </IndustriaComercioProvider>
        </CedulonesProvider>
      </UserProvider>
    </>
  );
};

export default Router;
