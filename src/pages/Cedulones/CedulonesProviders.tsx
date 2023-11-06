import { createContext, useContext, useState, useEffect } from "react";
import { LstDeuda } from "../../interfaces/LstDeuda";
import { Planes_Cobro } from "../../interfaces/Planes_Cobro";
import { Tarjetas } from "../../interfaces/Tarjetas";
import { CheckOut } from "../../interfaces/CheckOut";
import { CedulonImpresion } from "../../interfaces/IndustriaComercio";


type CedulonesContextType = {
  //En grilla deuda
  deuda: LstDeuda[] | null;
  deudaSeleccionada: LstDeuda[] | null;
  setDeuda: (LstDeuda: LstDeuda[]) => void;
  setDeudaSelecionada: (LstDeuda: LstDeuda[]) => void;
  planesCobro: Planes_Cobro[] | null;
  setPlanesCobros: (lstPlanesCobro: Planes_Cobro[]) => void;
  planCobro: Planes_Cobro | null;
  setPlanCobro: (planCobro: Planes_Cobro) => void;
  checkOut: CheckOut | null;
  calculoMontos: () => void;
  setDescripcionPlanes: () => void;
  setCedulonParaImpresion: (cedulon: CedulonImpresion) => void;
  cedulonParaImpresion: CedulonImpresion | null;
};

const cedulonesContext = createContext<CedulonesContextType>({
  deuda: null,
  setDeuda: () => [],
  deudaSeleccionada: null,
  setDeudaSelecionada: () => [],
  planesCobro: null,
  setPlanesCobros: () => [],
  planCobro: null,
  setPlanCobro: () => { },
  checkOut: null,
  calculoMontos: () => { },
  setDescripcionPlanes: () => { },
  setCedulonParaImpresion: () => { },
  cedulonParaImpresion: null,
});

export function useCedulonesContext() {
  return useContext(cedulonesContext);
}

export function CedulonesProvider({ children }: any) {
  const [deuda, setDeuda] = useState<LstDeuda[]>([]);
  const [deudaSeleccionada, setDeudaSelecionada] = useState<LstDeuda[]>([]);
  const [planCobro, setPlanCobro] = useState<Planes_Cobro | null>(null);
  const [planesCobro, setPlanesCobros] = useState<Planes_Cobro[] | null>(null);
  const [checkOut, setCheckOut] = useState<CheckOut | null>(null);
  const [tarjetas, setTarjetas] = useState<Tarjetas[]>([]);
  const [cedulonParaImpresion, setCedulonParaImpresion] = useState<CedulonImpresion | null>(null);

  function calculoMontos() {
    setCheckOut({
      monto_original: 0,
      credito: 0,
      interes_mora: 0,
      descuento: 0,
      costo_financiero: 0,
      cantidad_cuota: 0,
      monto_cuota: 0,
      total: 0,
    });
    var descuento: number = 0;
    var costo_financiero: number = 0;
    var total: number = 0;

    deudaSeleccionada.forEach((element) => {
      if (planCobro?.con_dto_interes == 1) {
        if (planCobro?.ali_dto_interes > 0) {
          if (element.pago_parcial) {
            if (element.pago_a_cuenta < element.recargo) {
              descuento =
                descuento -
                (((element.recargo - element.pago_a_cuenta) *
                  planCobro.ali_dto_interes) /
                  100,
                  2);

              total = total + (element.debe - descuento);
            }
          } else {
            descuento =
              descuento + (element.recargo * planCobro?.ali_dto_interes) / 100;
            total = total + (element.debe - descuento);
          }
        }
      }
      if (planCobro?.con_costo_financiero == 1) {
        if (planCobro?.ali_costo_financiero > 0) {
          costo_financiero =
            costo_financiero +
            (element.debe * planCobro?.ali_costo_financiero) / 100;
          total = total + (element.debe + costo_financiero);
        }
      }
    });
    var monto_cuota: number = 0;
    if (planCobro) {
      monto_cuota = deudaSeleccionada.reduce(
        (a, b) => a + b.debe / planCobro?.cant_cuotas,
        0
      );
    }
    setCheckOut({
      monto_original: deudaSeleccionada.reduce(
        (a, b) => a + b.monto_original,
        0
      ),
      credito: deudaSeleccionada.reduce((a, b) => a + b.pago_a_cuenta, 0),
      interes_mora: deudaSeleccionada.reduce((a, b) => a + b.recargo, 0),
      descuento: descuento,
      costo_financiero: costo_financiero,
      cantidad_cuota: 0,
      monto_cuota: monto_cuota,
      total: deudaSeleccionada.reduce((a, b) => a + b.debe, 0),
    });
  }
  function setDescripcionPlanes() {
    var planes_con_descripcion: Planes_Cobro[] | null;
    planes_con_descripcion = planesCobro ? planesCobro : null;
    planesCobro?.forEach((element) => {
      if (element.con_dto_interes == 1) {
        if (element.ali_dto_interes != 0) {
          element.descripcion +=
            " Con descuento del " +
            element.ali_dto_interes +
            "% sobre intereses por mora";
        }
      }
      element.descripcion +=
        " - (Costo financiero " + element.ali_costo_financiero + "%)";
      //planes_con_descripcion.push(element);
      if (element.valor_min_cuota > 0) {
        const sum = deudaSeleccionada.reduce(
          (prev, next) => prev + next.debe,
          0
        );
        if (element.valor_min_cuota > sum) {
          if (planes_con_descripcion) {
            planes_con_descripcion = planes_con_descripcion?.filter(
              (a) => a.cod_plan == element.cod_plan
            );
          }
        }
      }
    });
    //if(planes_con_descripcion)
    setPlanesCobros(planes_con_descripcion);
    if (planes_con_descripcion) {
      setPlanCobro(planes_con_descripcion[0]);
    }
  }

  useEffect(() => { }, []);

  return (
    <cedulonesContext.Provider
      value={{
        deuda,
        setDeuda,
        deudaSeleccionada,
        setDeudaSelecionada,
        planCobro,
        setPlanCobro,
        planesCobro,
        setPlanesCobros,
        checkOut,
        calculoMontos,
        setDescripcionPlanes,
        setCedulonParaImpresion,
        cedulonParaImpresion
      }}
    >
      {children}
    </cedulonesContext.Provider>
  );
}
