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

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "Activity",
      pathname: "/",
      title: "Automorores",
    },
    {
      icon: "Activity",
      title: "Automorores",
    },
    {
      icon: "Activity",
      title: "Automorores",
    },
    {
      icon: "Activity",
      title: "Automorores4",
    },
    {
      icon: "Activity",
      title: "Automorores",
    },
    {
      icon: "Activity",
      title: "Automorores",
    },                    
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;