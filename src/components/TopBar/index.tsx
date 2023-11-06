import { useEffect, useState } from "react";
import Lucide from "../../base-components/Lucide";
import logoUrl from "../../assets/logo.png";
import Breadcrumb from "../../base-components/Breadcrumb";
import { Menu } from "../../base-components/Headless";
import _ from "lodash";
import clsx from "clsx";
import { useUserContext } from "../../context/UserProvider";
import avatarUser from "../../assets/avatarUser.svg";
import TituloTopBar from "./TituloTopBar";

function Main(props: { layout?: "side-menu" | "simple-menu" | "top-menu" }) {
  const [searchDropdown, setSearchDropdown] = useState(false);
  const showSearchDropdown = () => {
    setSearchDropdown(true);
  };
  const hideSearchDropdown = () => {
    setSearchDropdown(false);
  };

  const { handleLogout, user, setUser } = useUserContext();

  useEffect(() => {
    const usuarioLogeado = sessionStorage.getItem("usuarioLogeado");
    if (usuarioLogeado) {
      setUser(JSON.parse(usuarioLogeado));
    }
  }, []);

  return (
    <>
      <div className="new_topbar" style={{ height: "90px" }}>
        <div
          className="grid grid-cols-12"
          style={{
            boxShadow: "0px 7px 5px -2px rgba(73,73,73,0.75)",
            height: "90px",
          }}
        >
          <div
            className="col-span-12 lg:col-span-3 2xl:col-span-3"
            style={{
              height: "90px",
            }}
          >
            {/* BEGIN: Breadcrumb */}
            <Breadcrumb
              light
              className={clsx([
                "h-[180px] md:ml-10 md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
                props.layout != "top-menu" && "md:pl-6",
                props.layout == "top-menu" && "md:pl-10",
              ])}
            >
              <Breadcrumb.Link
                to="/"
                className="logo_topbar"
                style={{
                  width: "240px",
                  height: "64px",
                  position: "absolute",
                  left: "auto",
                  top: "20px",
                }}
              >
                <img
                  alt="Logo"
                  src={logoUrl}
                  style={{ height: "50px", width: "auto" }}
                />
                <span
                  className={clsx([
                    "ml-3 text-lg text-white",
                    props.layout == "side-menu" && "hidden xl:block",
                    props.layout == "simple-menu" && "hidden",
                  ])}
                ></span>
              </Breadcrumb.Link>
            </Breadcrumb>
            {/* END: Breadcrumb */}
          </div>
          <div
            className="col-span-12 lg:col-span-6 2xl:col-span-6"
            style={{
              height: "90px",
              textAlign: "center"
            }}
          >
            <TituloTopBar />
          </div>
          <div
            className="col-span-12 lg:col-span-3 2xl:col-span-3"
            style={{
              height: "90px",
            }}
          >
            {/* BEGIN: Account Menu */}
            <Menu
              className="menu_topbar"
              style={{ justifyContent: "right", backgroundColor: "inherit" }}
            >
              <div className="superposicion">
                <Menu.Button>
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2 xl:col-span-1">
                    <Lucide icon="User" className="block mx-auto" />
                    <div className="mt-2 text-xs text-center">{user ? `${user.userName}` : `cargando...`}</div>
                  </div>
                </Menu.Button>
                <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
                  <Menu.Item className="hover:bg-white/5" onClick={handleLogout}>
                    <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Salir
                  </Menu.Item>
                </Menu.Items>
              </div>
            </Menu>
            {/* END: Account Menu */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
