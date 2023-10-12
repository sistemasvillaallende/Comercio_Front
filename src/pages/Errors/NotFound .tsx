import errorIllustration from "../../assets/images/error-illustration.svg";

const NotFound = () => {
  return (
    <>
      <div className="py-2">
        <div className="container">
          <div className="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left">
            <div className="-intro-x lg:mr-20">
              <img
                alt="Midone Tailwind HTML Admin Template"
                className="w-[450px] h-48 lg:h-auto"
                src={errorIllustration}
              />
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="font-medium intro-x text-8xl">404</div>
              <div className="mt-5 text-xl font-medium intro-x lg:text-3xl">
                Página no encontrada
              </div>
              <div className="mt-3 text-lg intro-x">
                La página que estás buscando no existe o se ha movido.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
