import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Páginas Varias
import Login from "../pages/Users/Login";
import NotFound from "../pages/Errors/NotFound";

// Layouts
import TopMenu from "../layouts/TopMenu";

// Context
import { UserProvider } from "../context/UserProvider";
import { IndustriaComercioProvider } from "../context/IndustriaComercioProvider";
import { CedulonesProvider } from "../context/CedulonesProviders";

// Páginas de Industria y Comercio
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
import ImprimirDeclaracionJurada from '../pages/DeclaracionesJuradas/ImprimirDeclaracionJurada';
import DeclaracionesJuradas from "../pages/DeclaracionesJuradas/DeclaracionesJuradas";
import BajaComercial from "../pages/BajaComercial/BajaComercial";
import Concepto from "../pages/Concepto/Concepto";
import DomicilioPostal from "../pages/DomicilioPostal/DomicilioPostal";
import Sucursales from "../pages/Sucursales/Sucursales";
import Rubros from "../pages/Rubros/Rubros";
import Reliquida from "../pages/IndustriaComercio/Reliquida";

// Componentes
import Header from "../components/Header/index";
import { useUserContext } from "../context/UserProvider"; // Asumiendo que tienes un contexto de usuario
import { parseCIDICookie } from "../utils/cookieParser"; // Asumiendo que tienes una función para parsear cookies

const RouterContent = () => {
  const { user, setUser } = useUserContext();

  useEffect(() => {
    const parsedUser = parseCIDICookie();
    if (parsedUser) {
      setUser(parsedUser);
    }
  }, []);

  // Si no hay usuario, renderizamos NotFound directamente
  if (!user) {
    return <NotFound />;
  }

  return (
    <>
      <Header />
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
          <Route path="/:legajo/declaraciones-juradas" element={<DeclaracionesJuradas />} />
          <Route path="/:legajo/declaraciones-juradas/:transaccion" element={<DeclaracionesJuradas />} />
          <Route path="/:legajo/imprimir-juradas/:transaccion" element={<ImprimirDeclaracionJurada />} />
          <Route path="/:legajo/Rubros" element={<Rubros />} />
          <Route path="/:legajo/reliquida" element={<Reliquida />} />
          <Route path="/:legajo/sucursales" element={<Sucursales />} />
          <Route path="/:legajo/bajacomercial" element={<BajaComercial />} />
          <Route path="/:legajo/concepto" element={<Concepto />} />
          <Route path="/:legajo/domiciliopostal" element={<DomicilioPostal />} />
        </Route>
        <Route path="/Cedulon/:nrocedulon" element={<Cedulon />} />
        <Route path="/ResumenCuenta" element={<ResumenCuenta />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const Router = () => {
  return (
    <UserProvider>
      <CedulonesProvider>
        <IndustriaComercioProvider>
          <RouterContent />
        </IndustriaComercioProvider>
      </CedulonesProvider>
    </UserProvider>
  );
};

export default Router;
