import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface TopMenuState {
  menu: Array<Menu>;
}

const initialState: TopMenuState = {
  menu: [
    {
      icon: "ChevronDown",
      title: "Informes",
      subMenu: [
        {
          icon: "Printer",
          pathname: "/top-menu/dashboard-overview-1",
          title: "Resumen de cuenta",
        },
        {
          icon: "Printer",
          pathname: "/top-menu/dashboard-overview-2",
          title: "Resumne Cta. Monto Orig.",
        },
        {
          icon: "Printer",
          pathname: "/top-menu/dashboard-overview-3",
          title: "Resumen Judicial",
        },
        {
          icon: "Printer",
          pathname: "/top-menu/dashboard-overview-4",
          title: "Resumen según decreto",
        },
        {
          icon: "Printer",
          pathname: "/top-menu/dashboard-overview-4",
          title: "Informe de Pagos",
        },        
      ],
    },
    {
      icon: "Calculator",
      pathname: "/top-menu/chart",
      title: "Simulación descuentos",
    },
    {
        icon: "ChevronsLeft",
        pathname: "/",
        title: "Simulación descuentos",
      },    
  ],
};

export const menuctasctesAutos = createSlice({
  name: "topMenu",
  initialState,
  reducers: {},
});

export const selectTopMenu = (state: RootState) => state.topMenu.menu;

export default menuctasctesAutos.reducer;
