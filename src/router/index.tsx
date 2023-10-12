import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
//Paginas
import { defineConfig } from "vite";
import Login from "../pages/Users/Login";
import NotFound from "../pages/Errors/NotFound ";
import Autos from "../pages/Autos/Autos";
import AutosModificar from "../pages/Autos/AutosModificar";
import CuentaCorriente from "../pages/CtasCtes/CuentaCorriente";
import Cedulones from "../pages/Cedulones/index";
import ModificarDominio from "../pages/Autos/ModificarDominio";
import NuevoVehiculo from "../pages/Autos/NuevoVehiculo";
import AutosBaja from "../pages/Autos/AutosBaja";
import IniciarCtaCorriente from "../pages/Autos/IniciarCtaCorriente";
import ContactoPlanes from "../pages/Autos/ContactoPlanes";
import ValuacionHistorica from "../pages/Autos/ValuacionHistorica";
import ReLiquida from "../pages/Autos/ReLiquida";
import CancelarCtaCte from "../pages/CtasCtes/CancelarCtaCte";
import EliminarCancelacion from "../pages/CtasCtes/EliminarCancelacion";
import Conceptos from "../pages/Conceptos";
//import Informes from "../pages/Informes";
//import MyDocument from "../pages/Informes"
import AutosVer from "../pages/Autos/AutosVer";
//layouts
import TopMenu from "../layouts/TopMenu";
//Context
import { UserProvider } from "../context/UserProvider";
import { AutoProvider } from "../context/AutoProvider";

import ResumenCuenta from "../pages/Informes/ResumenCuenta";
import CedulonAuto from "../pages/Cedulones/CedulonAuto";

const Router = () => {
  const usuarioLogeado = sessionStorage.getItem("usuarioLogeado");
  const navigate = useNavigate();

  return (
    <>
      <UserProvider>
        <AutoProvider>
          {!usuarioLogeado ? (
            <Routes>
              <Route path="/*" element={<Login />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<TopMenu />}>
                <Route path="/" element={<Autos />} />
                <Route
                  path="/:buscarPorURL/:parametroURL"
                  element={<Autos />}
                />
                <Route path="/nuevoVehiculo" element={<NuevoVehiculo />} />
                <Route
                  path="/auto/:dominio/editar"
                  element={<AutosModificar />}
                />
                <Route
                  path="/auto/:dominio/ver"
                  element={<AutosVer />}
                />
                <Route path="/auto/:dominio/baja" element={<AutosBaja />} />
                <Route
                  path="/auto/:dominio/modificarDominio"
                  element={<ModificarDominio />}
                />
                <Route
                  path="/auto/:dominio/iniciarctacte"
                  element={<IniciarCtaCorriente />}
                />
                <Route
                  path="/auto/:dominio/contactoPlanes"
                  element={<ContactoPlanes />}
                />
                <Route
                  path="/auto/:dominio/valuacionHistorica"
                  element={<ValuacionHistorica />}
                />
                <Route
                  path="/auto/:dominio/reliquida"
                  element={<ReLiquida />}
                />
                <Route
                  path="/CtasCtes/:dominio/cancelarctacte"
                  element={<CancelarCtaCte />}
                />
                <Route
                  path="/CtasCtes/:dominio/eliminarCancelacion"
                  element={<EliminarCancelacion />}
                />
                <Route path="/auto/:dominio/conceptos" element={<Conceptos />} />
                <Route path="/autos/:pagina/" element={<Autos />} />
                <Route path="/CtasCtes/:dominio/" element={<CuentaCorriente />} />
                <Route path="/Cedulones/" element={<Cedulones />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<NotFound />} />
              <Route path="/CedulonAuto" element={<CedulonAuto />} />
              <Route path="/ResumenCuenta" element={<ResumenCuenta />} />

            </Routes>
          )}
        </AutoProvider>
      </UserProvider>
    </>
  );
};

export default Router;
