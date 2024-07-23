import { useState, useEffect } from "react";
import illustrationUrl from "../../assets/logo.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { useUserContext } from "../../context/UserProvider";
import Cargando from "../Recursos/Cargando";
import { useParams, useSearchParams } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import logocidi from "../../assets/images/logocidi.png"
import logo from "../../assets/images/logo.png"

const Login = () => {
  const { user, error, handleLoginCIDI } = useUserContext();
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

  //let [searchParams, setSearchParams] = useSearchParams();
  //let codigoCIDI = searchParams.get('cidi');

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
      <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-secondary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-secondary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-secondary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            {/* BEGIN: Login Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <div className="my-auto">
                <img alt="Logo Villa Allende" className="w-1/2 -mt-16 -intro-x" src={logo} />
              </div>
            </div>
            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none w-3/4 lg:w-2/4 xl:w-auto">
                <div className="mt-8 intro-x">
                  <h2 className="text-1xl intro-x xl:text-2xl xl:text-left">
                    <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                      <h2 style={{ textAlign: 'center' }}><a href={urlCIDI} style={{ display: 'ruby', width: '100%' }}>
                        <img src={logocidi} alt="logo" style={{ height: '90px' }} /></a></h2>
                    </div>
                  </h2>
                  <h3>
                    {error && (
                      <p className="my-5">

                      </p>
                    )}
                  </h3>
                </div>
              </div>
            </div>
            {/* END: Login Form */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

