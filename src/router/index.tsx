import { Routes, Route, useNavigate } from "react-router-dom";
//Paginas Varis
import Login from "../pages/Users/Login";
import NotFound from "../pages/Errors/NotFound ";

//layouts
import TopMenu from "../layouts/TopMenu";
//Context
import { UserProvider } from "../context/UserProvider";
import { IndustriaComercioProvider } from "../context/IndustriaComercioProvider";

//Páginas de Industria y Comercio
import Inicio from "../pages/IndustriaComercio";
import Ver from "../pages/IndustriaComercio/Ver";
import Editar from "../pages/IndustriaComercio/Editar";

import ResumenCuenta from "../pages/Informes/ResumenCuenta";
import CedulonAuto from "../pages/Cedulones/CedulonAuto";

const Router = () => {
  const usuarioLogeado = sessionStorage.getItem("usuarioLogeado");
  const navigate = useNavigate();

  return (
    <>
      <UserProvider>
        <IndustriaComercioProvider>
          {!usuarioLogeado ? (
            <Routes>
              <Route path="/*" element={<Login />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<TopMenu />}>
                <Route path="/" element={<Inicio />} />
                <Route path="/iyc/:legajo/ver" element={<Ver />} />
                <Route path="/iyc/:legajo/editar" element={<Editar />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<NotFound />} />
              <Route path="/CedulonAuto" element={<CedulonAuto />} />
              <Route path="/ResumenCuenta" element={<ResumenCuenta />} />

            </Routes>
          )}
        </IndustriaComercioProvider>
      </UserProvider>
    </>
  );
};

export default Router;
