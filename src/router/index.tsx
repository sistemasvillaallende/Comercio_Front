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
import ImprimirDeclaracionJurada from '../pages/DeclaracionesJuradas/ImprimirDeclaracionJurada';
import DeclaracionesJuradas from "../pages/DeclaracionesJuradas/DeclaracionesJuradas";
import BajaComercial from "../pages/BajaComercial/BajaComercial";
import Concepto from "../pages/Concepto/Concepto";
import DomicilioPostal from "../pages/DomicilioPostal/DomicilioPostal";

import Sucursales from "../pages/Sucursales/Sucursales";

import Rubros from "../pages/Rubros/Rubros";
import Reliquida from "../pages/IndustriaComercio/Reliquida";

//Componentes
import Header from "../components/Header/index"
import { useEffect } from "react";

const Router = () => {
  const usuarioLogeado = localStorage.getItem("usuarioLogeado");
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
                    <Route path="/:legajo/deudas" element={<Deudas />} />
                    <Route path="/:legajo/bajacomercial" element={<BajaComercial />} />
                    <Route path="/:legajo/concepto" element={<Concepto />} />
                    <Route path="/:legajo/domiciliopostal" element={<DomicilioPostal />} />

                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/*" element={<NotFound />} />
                  <Route path="/Cedulon/:nrocedulon" element={<Cedulon />} />
                  <Route path="/ResumenCuenta" element={<ResumenCuenta />} />
                </Routes>
              </>
            )}
          </IndustriaComercioProvider>
        </CedulonesProvider>
      </UserProvider>
    </>

    // <>
    //   <UserProvider>
    //     <CedulonesProvider>
    //       <IndustriaComercioProvider>
    //         <>
    //           <Header />
    //           <Routes>
    //             <Route path="/" element={<TopMenu />}>
    //               <Route path="/" element={<Inicio />} />
    //               <Route path="/nuevo" element={<Nuevo />} />
    //               <Route path="/:legajo/ver" element={<Ver />} />
    //               <Route path="/:legajo/editar" element={<Editar />} />
    //               <Route path="/:legajo/baseimponible" element={<BasesImponibles />} />

    //               <Route path="/:legajo/iniciarctacte" element={<IniciarCtaCorriente />} />
    //               <Route path="/:legajo/ctacte" element={<CuentaCorriente />} />
    //               <Route path="/:legajo/cancelarctacte" element={<CancelarCtaCte />} />
    //               <Route path="/:legajo/eliminarCancelacion" element={<EliminarCancelacion />} />

    //               <Route path="/Cedulones/" element={<Cedulones />} />
    //               <Route path="/:legajo/informes" element={<Informes />} />
    //               <Route path="/:legajo/deudas" element={<Deudas />} />
    //               <Route path="/:legajo/Contacto" element={<Contacto />} />
    //               <Route path="/ComerciosPorCalle" element={<ComerciosPorCalle />} />

    //               <Route path="/:legajo/declaraciones-juradas" element={<DeclaracionesJuradas />} />
    //               <Route path="/:legajo/declaraciones-juradas/:transaccion" element={<DeclaracionesJuradas />} />
    //               <Route path="/:legajo/imprimir-juradas/:transaccion" element={<ImprimirDeclaracionJurada />} />

    //               <Route path="/:legajo/Rubros" element={<Rubros />} />
    //               <Route path="/:legajo/reliquida" element={<Reliquida />} />

    //             </Route>
    //             <Route path="/login" element={<Login />} />
    //             <Route path="/*" element={<NotFound />} />
    //             <Route path="/Cedulon/:nrocedulon" element={<Cedulon />} />
    //             <Route path="/ResumenCuenta" element={<ResumenCuenta />} />
    //           </Routes>
    //         </>
    //       </IndustriaComercioProvider>
    //     </CedulonesProvider>
    //   </UserProvider>
    // </>
  );
};

export default Router;
