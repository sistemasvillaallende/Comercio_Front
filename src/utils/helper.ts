import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useState } from "react";
import { parseColor } from "tailwindcss/lib/util/color";
import { CheckOut } from "../interfaces/CheckOut";
import { LstDeuda } from "../interfaces/LstDeuda";
import { Planes_Cobro } from "../interfaces/Planes_Cobro";
import { RootState } from "../stores/store";

dayjs.extend(duration);

const cutText = (text: string, length: number) => {
  if (text.split(" ").length > 1) {
    const string = text.substring(0, length);
    const splitText = string.split(" ");
    splitText.pop();
    return splitText.join(" ") + "...";
  } else {
    return text;
  }
};

const formatDate = (date: string, format: string) => {
  return dayjs(date).format(format);
};

const capitalizeFirstLetter = (string: string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return "";
  }
};

const onlyNumber = (string: string) => {
  if (string) {
    return string.replace(/\D/g, "");
  } else {
    return "";
  }
};

const formatCurrency = (number: number) => {
  if (number) {
    const formattedNumber = number.toString().replace(/\D/g, "");
    const rest = formattedNumber.length % 3;
    let currency = formattedNumber.substr(0, rest);
    const thousand = formattedNumber.substr(rest).match(/\d{3}/g);
    let separator;

    if (thousand) {
      separator = rest ? "." : "";
      currency += separator + thousand.join(".");
    }

    return currency;
  } else {
    return "";
  }
};
const currencyFormat = (num: number) => {
  return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
const timeAgo = (time: string) => {
  const date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " "));
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  const dayDiff = Math.floor(diff / 86400);

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return dayjs(time).format("MMMM DD, YYYY");
  }

  return (
    (dayDiff === 0 &&
      ((diff < 60 && "just now") ||
        (diff < 120 && "1 minute ago") ||
        (diff < 3600 && Math.floor(diff / 60) + " minutes ago") ||
        (diff < 7200 && "1 hour ago") ||
        (diff < 86400 && Math.floor(diff / 3600) + " hours ago"))) ||
    (dayDiff === 1 && "Yesterday") ||
    (dayDiff < 7 && dayDiff + " days ago") ||
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + " weeks ago")
  );
};

const diffTimeByNow = (time: string) => {
  const startDate = dayjs(dayjs().format("YYYY-MM-DD HH:mm:ss").toString());
  const endDate = dayjs(dayjs(time).format("YYYY-MM-DD HH:mm:ss").toString());

  const duration = dayjs.duration(endDate.diff(startDate));
  const milliseconds = Math.floor(duration.asMilliseconds());

  const days = Math.round(milliseconds / 86400000);
  const hours = Math.round((milliseconds % 86400000) / 3600000);
  let minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000);
  const seconds = Math.round(
    (((milliseconds % 86400000) % 3600000) % 60000) / 1000
  );

  if (seconds < 30 && seconds >= 0) {
    minutes += 1;
  }

  return {
    days: days.toString().length < 2 ? "0" + days : days,
    hours: hours.toString().length < 2 ? "0" + hours : hours,
    minutes: minutes.toString().length < 2 ? "0" + minutes : minutes,
    seconds: seconds.toString().length < 2 ? "0" + seconds : seconds,
  };
};

const isset = (obj: object | string) => {
  if (obj !== null && obj !== undefined) {
    if (typeof obj === "object" || Array.isArray(obj)) {
      return Object.keys(obj).length;
    } else {
      return obj.toString().length;
    }
  }

  return false;
};

const toRaw = (obj: object) => {
  return JSON.parse(JSON.stringify(obj));
};

const randomNumbers = (from: number, to: number, length: number) => {
  const numbers = [0];
  for (let i = 1; i < length; i++) {
    numbers.push(Math.ceil(Math.random() * (from - to) + to));
  }

  return numbers;
};

const toRGB = (value: string) => {
  return parseColor(value).color.join(" ");
};

const stringToHTML = (arg: string) => {
  const parser = new DOMParser(),
    DOM = parser.parseFromString(arg, "text/html");
  return DOM.body.childNodes[0] as HTMLElement;
};

const slideUp = (
  el: HTMLElement,
  duration = 300,
  callback = (el: HTMLElement) => { }
) => {
  el.style.transitionProperty = "height, margin, padding";
  el.style.transitionDuration = duration + "ms";
  el.style.height = el.offsetHeight + "px";
  el.offsetHeight;
  el.style.overflow = "hidden";
  el.style.height = "0";
  el.style.paddingTop = "0";
  el.style.paddingBottom = "0";
  el.style.marginTop = "0";
  el.style.marginBottom = "0";
  window.setTimeout(() => {
    el.style.display = "none";
    el.style.removeProperty("height");
    el.style.removeProperty("padding-top");
    el.style.removeProperty("padding-bottom");
    el.style.removeProperty("margin-top");
    el.style.removeProperty("margin-bottom");
    el.style.removeProperty("overflow");
    el.style.removeProperty("transition-duration");
    el.style.removeProperty("transition-property");
    callback(el);
  }, duration);
};

const slideDown = (
  el: HTMLElement,
  duration = 300,
  callback = (el: HTMLElement) => { }
) => {
  el.style.removeProperty("display");
  let display = window.getComputedStyle(el).display;
  if (display === "none") display = "block";
  el.style.display = display;
  let height = el.offsetHeight;
  el.style.overflow = "hidden";
  el.style.height = "0";
  el.style.paddingTop = "0";
  el.style.paddingBottom = "0";
  el.style.marginTop = "0";
  el.style.marginBottom = "0";
  el.offsetHeight;
  el.style.transitionProperty = "height, margin, padding";
  el.style.transitionDuration = duration + "ms";
  el.style.height = height + "px";
  el.style.removeProperty("padding-top");
  el.style.removeProperty("padding-bottom");
  el.style.removeProperty("margin-top");
  el.style.removeProperty("margin-bottom");
  window.setTimeout(() => {
    el.style.removeProperty("height");
    el.style.removeProperty("overflow");
    el.style.removeProperty("transition-duration");
    el.style.removeProperty("transition-property");
    callback(el);
  }, duration);
};

export const selectCalculaMontos = (lstDeudaSeleccionada: LstDeuda[], plan_cobro: Planes_Cobro) => {
  var descuento: number = 0;
  var costo_financiero: number = 0;
  var total: number = 0;
  if (lstDeudaSeleccionada) {
    lstDeudaSeleccionada.forEach((element) => {
      if (plan_cobro?.con_dto_interes == 1) {
        if (plan_cobro.ali_dto_interes > 0) {
          if (element.pago_parcial) {
            if (element.pago_a_cuenta < element.recargo) {
              descuento =
                descuento -
                (((element.recargo - element.pago_a_cuenta) *
                  plan_cobro.ali_dto_interes) /
                  100,
                  2);

              total = total + (element.debe - descuento);
            }
          } else {
            descuento =
              descuento + (element.recargo * plan_cobro?.ali_dto_interes) / 100;
            total = total + (element.debe - descuento);
          }
        }
      }
      if (plan_cobro?.con_costo_financiero == 1) {
        if (plan_cobro?.ali_costo_financiero > 0) {
          costo_financiero =
            costo_financiero +
            (element.debe * plan_cobro?.ali_costo_financiero) / 100;
          total = total + (element.debe + costo_financiero);
        }
      }
    });
    var monto_cuota: number = 0;
    var cant_cuotas: number = 1;
    var credito: number = 0;
    var interes_mora: number = 0;
    var total: number = 0;
    var monto_original: number = 0;
    if (plan_cobro) {
      cant_cuotas = plan_cobro?.cant_cuotas;
      credito = lstDeudaSeleccionada.reduce((a, b) => a + b.pago_a_cuenta, 0);
      interes_mora = lstDeudaSeleccionada.reduce((a, b) => a + b.recargo, 0);
      monto_original = lstDeudaSeleccionada.reduce((a, b) => a + b.monto_original, 0);
      total = monto_original - credito + interes_mora - descuento + costo_financiero;
      monto_cuota = total / cant_cuotas;
    }
    return {
      monto_original: monto_original,
      credito: credito,
      interes_mora: interes_mora,
      descuento: descuento,
      costo_financiero: costo_financiero,
      cantidad_cuota: cant_cuotas,
      monto_cuota: monto_cuota,
      total: total,
    };
  }
  else{
    return {
      monto_original: 0,
      credito: 0,
      interes_mora: 0,
      descuento: 0,
      costo_financiero: 0,
      cantidad_cuota: 0,
      monto_cuota: 0,
      total: 0,
    };   
  }
}

export {
  cutText,
  formatDate,
  capitalizeFirstLetter,
  onlyNumber,
  formatCurrency,
  currencyFormat,
  timeAgo,
  diffTimeByNow,
  isset,
  toRaw,
  randomNumbers,
  toRGB,
  stringToHTML,
  slideUp,
  slideDown,
};
