import { useState, useEffect } from "react";
import illustrationUrl from "../../assets/logo.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { useUserContext } from "../../context/UserProvider";
import Cargando from "../Recursos/Cargando";


type UserType = {
  userName: string;
  token: string;
  nombre: string;
  apellido: string;
} | null;

const Login = () => {
  const { user, handleLogin, error } = useUserContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Inustria y Comercio";
    const usuarioLogeado = sessionStorage.getItem("usuarioLogeado");
    if (usuarioLogeado) {
      window.location.href = "/";
    }
  }, []);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    await handleLogin(username, password);
    setIsLoading(false);
  };

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
                <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                  <form>
                    <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                      Iniciar sesión
                    </h2>
                    <div className="mt-8 intro-x">
                      <FormInput
                        type="text"
                        className="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                        placeholder="Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <FormInput
                        type="password"
                        className="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {error && (
                      <div className="text-center mt-4">
                        <span className="text-red-500">{error}</span>
                      </div>
                    )}
                    <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                      <Button
                        variant="primary"
                        className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3 sombra"
                        onClick={onSubmit}
                      >
                        Ingresar
                      </Button>
                    </div>
                  </form>
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
