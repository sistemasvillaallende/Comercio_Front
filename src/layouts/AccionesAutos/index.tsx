import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectTopMenu } from "../../stores/topMenuSlice";
import { useAppSelector } from "../../stores/hooks";
import _ from "lodash";

import Lucide from "../../base-components/Lucide";
import clsx from "clsx";
import TopBar from "../../components/TopBar";
import MobileMenu from "../../components/MobileMenu";
import { FormattedMenu, linkTo } from "./Acciones-menu";

function Main() {
  const location = useLocation();
  const topMenuStore = useAppSelector(selectTopMenu);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(location.pathname.toLowerCase().indexOf('CtasCtes'.toLowerCase()) !== -1){
      setShow(false);
    }
    else{
      setShow(true);
    }
  }, [topMenuStore, location.pathname]);

  return (
    <div className="py-5 md:py-0" style={{ backgroundColor: "white" }}>
      <MobileMenu />
      <TopBar layout="top-menu" />
      <div
        style={{
          marginLeft: "50px",
          marginRight: "50px",
          padding: "25px",
          backgroundColor: "#f1f5f8",
        }}
        className={clsx([
          "max-w-full md:max-w-none rounded-[30px] md:rounded-[35px_35px_0_0] px-4 md:px-[22px] min-w-0 min-h-screen bg-slate-100 flex-1 pb-10 mt-5 relative dark:bg-darkmode-700",
          "before:content-[''] before:w-full before:h-px before:block",
        ])}
      >
        <Outlet />
      </div>
      {/* END: Content */}
    </div>
  );
}

function MenuLink(props: {
  className?: string;
  menu: FormattedMenu;
  level: "first" | "second" | "third";
}) {
  const navigate = useNavigate();
  return (
    <a
      href={props.menu.subMenu ? "#" : props.menu.pathname}
      className={clsx([
        "h-[55px] flex items-center px-5 mr-1 text-slate-600 relative rounded-full xl:rounded-xl",
        {
          "mt-[3px]": props.level == "first",
          "bg-slate-100 text-primary dark:bg-darkmode-700":
            props.level == "first" && props.menu.active,
          "before:content-[''] before:hidden xl:before:block before:inset-0 before:rounded-xl before:absolute before:border-b-[3px] before:border-solid before:border-black/[0.08] dark:before:border-black/[0.08] before:dark:bg-darkmode-700":
            props.level == "first" && props.menu.active,
          "after:content-[''] after:w-[20px] after:h-[80px] after:bg-menu-active after:bg-no-repeat after:bg-cover after:absolute after:left-0 after:right-0 after:bottom-0 after:mx-auto after:transform after:rotate-90 after:hidden xl:after:block after:dark:bg-menu-active-dark":
            props.level == "first" && props.menu.active,
          "px-0 mr-0": props.level != "first",

          // Animation
          "after:opacity-0 after:-mb-[74px] after:animate-[0.3s_ease-in-out_1s_active-top-menu-chevron] after:animate-fill-mode-forwards":
            props.level == "first" && props.menu.active,
        },
        props.className,
      ])}
      onClick={(event) => {
        event.preventDefault();
        linkTo(props.menu, navigate);
      }}
    >
      <div
        className={clsx([
          "z-10 dark:text-slate-400",
          props.level == "first" && "-mt-[3px]",
          props.level == "first" &&
            props.menu.active &&
            "dark:text-white text-primary xl:text-primary",
        ])}
      >
        <Lucide icon={props.menu.icon} />
      </div>
      <div
        className={clsx([
          "ml-3 flex items-center whitespace-nowrap z-10 dark:text-slate-400",
          props.level == "first" && "-mt-[3px]",
          props.level == "first" &&
            props.menu.active &&
            "font-medium dark:text-white text-slate-800 xl:text-primary",
          props.level != "first" && "w-full",
        ])}
      >
        {props.menu.title}
        {props.menu.subMenu && (
          <Lucide
            icon="ChevronDown"
            className={clsx([
              "hidden transition ease-in duration-100 w-4 h-4 xl:block",
              props.level == "first" && "ml-2",
              props.level != "first" && "ml-auto",
            ])}
          />
        )}
      </div>
    </a>
  );
}

export default Main;
