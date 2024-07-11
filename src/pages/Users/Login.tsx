import { useState, useEffect } from "react";
import illustrationUrl from "../../assets/logo.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { useUserContext } from "../../context/UserProvider";
import Cargando from "../Recursos/Cargando";
import { useParams } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import logo from "../../assets/images/logocidi.png"

const Login = () => {
  const { user, handleLogin, error, handleLoginCIDI } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Industria y Comercio";
    const usuarioLogeado = sessionStorage.getItem("usuarioLogeado");
    if (usuarioLogeado) {
      window.location.href = "/";
    }
  }, []);

  const urlCIDI = `${import.meta.env.VITE_URL_CIDI}`;

  const { codigoCIDI } = useParams();

  const onSubmitCIDI = async () => {
    if (!codigoCIDI) return;
    setIsLoading(true);
    await handleLoginCIDI(codigoCIDI as String);
    setIsLoading(false);
  }

  useEffect(() => {
    onSubmitCIDI();
  }, [codigoCIDI]);

  return (
    <>
      {isLoading ? (
        <Cargando mensaje="Cargando interfaz" />
      ) : (
        <div
          className={clsx([
            "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
            "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
            "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
          ])}
        >
          <div className="container relative z-10 sm:px-10">
            <div className="block grid-cols-2 gap-4 xl:grid">
              {/* BEGIN: Login Info */}
              <div className="flex-col hidden min-h-screen xl:flex">
                <div className="my-auto">
                  <img
                    alt="Midone Tailwind HTML Admin Template"
                    className="w-1/2 -mt-16 -intro-x"
                    src={illustrationUrl}
                  />
                </div>
              </div>
              {/* END: Login Info */}
              {/* BEGIN: Login Form */}
              <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
                <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none w-3/4 lg:w-2/4 xl:w-auto">
                  <div className="mt-8 intro-x">
                    <h2 className="text-1xl intro-x xl:text-2xl xl:text-left">
                      <a href={urlCIDI} rel="noopener noreferrer">
                        <img src={logo} alt="logo cidi" className="w-1/3 -mt-16 -intro-x" />
                      </a>
                    </h2>
                  </div>
                </div>
              </div>
              {/* END: Login Form */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
