import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getSecureItem, setSecureItem } from "../modules/secureStorage"
import { UserType } from "../types/user";


type UserContextType = {
  user: UserType;
  error: string | null;
  setUser: (user: UserType) => void;
  handleLogout: () => void;
  menuItems: MenuItem[];
  handleLoginCIDI: (codigoCIDI: String) => void;
};

type MenuItem = {
  texto: string;
  url: string;
  icono: string;
};

const userContext = createContext<UserContextType>({
  user: null,
  error: null,
  setUser: () => { },
  handleLogout: () => { },
  menuItems: [],
  handleLoginCIDI: () => { },
});

export function useUserContext() {
  return useContext(userContext);
}



export function UserProvider({ children }: any) {
  const [user, setUser] = useState<UserType>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { texto: "Inicio", url: "/", icono: "ArrowRightCircle" },
    { texto: "Editar", url: "/editar", icono: "Pencil" },
    { texto: "Ver", url: "/editar", icono: "Pencil" },
  ];

  const handleLoginCIDI = async (codigoCIDI: String) => {
    console.log("codigoCIDI: ", codigoCIDI)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_LOGINCIDI}UsuarioCIDI/ObtenerUsuarioCIDI2?Hash=${codigoCIDI}`
      );
      if (response.data) {
        const user = response.data;
        if (user.empleado == "N" || !user.empleado) {
          console.log("NO EMPLEADO: ", user.empleado)
        } else {
          const username = JSON.parse(response.data.empleado).nombre
          setUser({
            userName: username,
            nombre: user.nombre,
            apellido: user.apellido
          });
        }
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    }
    catch (error) {
      console.error("Error al validar el usuario:", error);
      setError("Usuario o contraseña incorrectos");
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("usuarioLogeado");
    setUser(null);
    navigate("/");
    localStorage.clear()
  };

  useEffect(() => {
    if (user) {
      setSecureItem("usuarioLogeado", user);
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    const user = getSecureItem("usuarioLogeado");
  }, []);

  return (
    <userContext.Provider
      value={{
        user,
        error,
        setUser,
        handleLogout,
        menuItems,
        handleLoginCIDI
      }}
    >
      {children}
    </userContext.Provider>
  );
}
