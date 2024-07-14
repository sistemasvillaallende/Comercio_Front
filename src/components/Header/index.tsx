import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Lucide from "../../base-components/Lucide"
import { Menu, Popover } from "../../base-components/Headless"
import _ from "lodash"
import clsx from "clsx"
import logo from "../../assets/images/LogoPablo.png"
import logoNoTexto from "../../assets/icons/logo-notexto.svg"
import mail from "../../assets/icons/mail.svg"
import { useUserContext } from "../../context/UserProvider"
import { capitalizeFirstLetter } from "../../utils/helper"
import placeholderProfile from "../../assets/images/placeholders/Usuario.png"
import { getSecureItem } from "../../modules/secureStorage"

function Main(props: { layout?: "side-menu" | "simple-menu" | "top-menu" }) {
  const [searchDropdown, setSearchDropdown] = useState(false)
  const showSearchDropdown = () => {
    setSearchDropdown(true)
  }
  const hideSearchDropdown = () => {
    setSearchDropdown(false)
  }
  let path: string = location.hash && (location.hash?.split("/").at(2) as string)
  if (path?.includes("?")) path = path.split("?")?.[0]
  if (location?.hash?.includes("id=")) path = location.hash.split("id=")?.[1]
  if (path === "") path = "inicio"
  if (path === undefined) path = "pagina-no-encontrada"
  const { handleLogout, user, setUser } = useUserContext()
  const navigate = useNavigate()

  const headerTitle: any = {
    inicio: { title: "Inicio", icon: "Home" },
    notificaciones: { title: "Notificaciones", icon: "Bell" },
    procuracion: { title: "", icon: "" },
    nuevasemisiones: { title: "", icon: "" },
    "pagina-no-encontrada": { title: "Página no encontrada", icon: "Warning" },
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("usuarioLogeado")
    if (isLoggedIn) {
      const parsedUser = getSecureItem("usuarioLogeado")
      if (parsedUser) {
        setUser(parsedUser)
      }
    }
  }, [])

  return (
    <>
      <div
        style={{ height: "110px", marginBottom: "-10px" }}
        className={clsx([
          "hidden md:block h-[70px] md:h-[125px] lg:h-[191px] z-[51] border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:sticky md:inset-x-0 md:top-0 sm:px-8 md:px-10",
          props.layout == "top-menu" && "dark:md:from-darkmode-800",
        ])}
      >
        <div className="flex justify-between items-center h-full" style={{
          height: '90px'
        }}>
          {/* BEGIN: Logo */}
          <Link
            style={{ width: "33%" }}
            to="/"
            className={clsx([
              "-intro-x hidden md:flex w-[20%]",
              props.layout == "side-menu" && "w-[20%]",
              props.layout == "simple-menu" && "xl:w-auto",
              props.layout == "top-menu" && "w-auto",
            ])}
          >
            <img
              alt="logo Villa Allende"
              style={{ height: "60px", width: "auto" }}
              src={innerWidth > 1024 ? logo : logoNoTexto}
            />
          </Link>
          {/* END: Logo */}
          {/* BEGIN: Title */}

          <div style={{ width: "33%", fontSize: "24px", display: 'ruby', textAlign: 'center' }}
            className="flex items-center text-primary font-semibold drop-shadow-[1px_1px_2px_#00000025]">

            <span style={{ textDecoration: 'overline', paddingTop: '10px', lineHeight: '20px' }}>Industria y Comercio</span>
          </div>
          <div style={{ width: "33%" }} className="flex justify-around items-center md:w-[290px] md:h-[69px] lg:w-[352px] lg:h-[80px] rounded-l-[20px]">
            <Menu style=
              {{
                height: "60px", border: "solid lightgray", borderRadius: "15px", verticalAlign: "middle", alignItems: "center",
                display: 'inline-grid', textAlign: 'center', position: 'absolute', right: '4%'
              }}>
              <Menu.Button className="flex align-center w-100 h-100 intro-x">
                <img
                  style={{
                    width: "35px", height: "35px", marginLeft: '15px'
                  }}
                  alt="Perfil de Usuario"
                  src={user?.img ? user.img : placeholderProfile}
                />
                <p style={{ lineHeight: "15px", color: "gray", paddingTop: "0px", display: "inline-grid", marginBottom: "0" }}>
                  <strong>{user ? `${user.apellido}` : `cargando...`}</strong>
                  <span>{user ? `${user.nombre}` : `cargando...`}</span>
                </p>
                <h3 className="text-primary text-center self-center mr-5 ml-3 text-xl font-bold">

                </h3>
              </Menu.Button>
              <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
                <Menu.Header className="font-normal">
                  <div className="font-medium">{user && `${user.nombre} ${user.apellido}`}</div>
                  <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                    {user && capitalizeFirstLetter(user.userName)}
                  </div>
                </Menu.Header>
                {user && user?.administrador === true && (
                  <Menu.Item
                    className="hover:bg-white/5"
                    onClick={() => navigate("/seleccionar-oficina/")}
                  >
                    <Lucide icon="LogOut" className="w-4 h-4 mr-2" /> Cambiar de oficina
                  </Menu.Item>
                )}
                <Menu.Divider className="bg-white/[0.08]" />
                <Menu.Item className="hover:bg-white/5" onClick={handleLogout}>
                  <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Cerrar Sesión
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>

          {/* END: Account Menu */}
        </div>
        <div className="container-fluid" style={{ left: '0', right: '0', height: '12px', position: 'absolute', background: "linear-gradient(87deg, rgb(148 23 23) 0%, rgba(255,35,0,1) 41%, rgb(255 233 0) 79%)" }}>
          <div className="row">
            <div className="col-md-12" style={{ paddingTop: "15px" }}>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Main
