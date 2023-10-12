import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Planes_Cobro } from "../interfaces/Planes_Cobro";
import { LstDeuda } from "../interfaces/LstDeuda";
import { CheckOut } from "../interfaces/CheckOut";

interface CheckOutState {
    plan_cobro: Planes_Cobro,
    lstDeudaSeleccionada: LstDeuda[],
    checkOut: CheckOut,
}

const initialState: CheckOutState = {
    plan_cobro: {
        cod_plan: 0,
        subsistema: 0,
        cod_tarjeta: 0,
        cod_paypertic: 0,
        descripcion: '',
        con_dto_interes: 0,
        ali_dto_interes: 0,
        con_costo_financiero: 0,
        ali_costo_financiero: 0,
        suma_descadic: false,
        valor_min_cuota: 0,
        cant_cuotas: 0,
        activo_windows: 0,
        activo_web: false,
        con_dto_obras: 0,
        promotionCode: '',
        ali_prescripto: 0,
        desc_capital: 0,
        ali_obras: 0,
    },
    lstDeudaSeleccionada: [{
        periodo: '',
        monto_original: 0,
        debe: 0,
        vencimiento: '',
        desCategoria: '',
        pagado: 0,
        nroTtransaccion: 0,
        categoriaDeuda: 0,
        nro_cedulon_paypertic: 0,
        recargo: 0,
        pago_parcial: false,
        pago_a_cuenta: 0,
    }],
    checkOut: {
        monto_original: 0,
        credito: 0,
        interes_mora: 0,
        descuento: 0,
        costo_financiero: 0,
        cantidad_cuota: 0,
        monto_cuota: 0,
        total: 0,
    }
}

export const CheckOutSlice = createSlice({
    name: 'CheckOut',
    initialState,
    reducers: {
        setPlanCobro(state, action: PayloadAction<Planes_Cobro>) {
            state.plan_cobro = action.payload;
        },
        setLstDeudaSeleccionada(state, action: PayloadAction<LstDeuda[]>) {
            state.lstDeudaSeleccionada = action.payload;
        },
        setCheckOut(state, action: PayloadAction<
            {
                monto_original: number,
                credito: number,
                interes_mora: number,
                descuento: number,
                costo_financiero: number,
                cantidad_cuota: number,
                monto_cuota: number,
                total: number,
            }>) {

            state.checkOut = action.payload;
        },
        setMontoOriginal(state, action: PayloadAction<number>) {
            state.checkOut.monto_original = action.payload;
        },
        setCredito(state, action: PayloadAction<number>) {
            state.checkOut.credito = action.payload;
        },
        setInteresMora(state, action: PayloadAction<number>) {
            state.checkOut.credito = action.payload;
        },
        setDescuento(state, action: PayloadAction<number>) {
            state.checkOut.descuento = action.payload;
        },
        setCantidadCuota(state, action: PayloadAction<number>) {
            state.checkOut.cantidad_cuota = action.payload;
        },
        setCostoMontoCouta(state, action: PayloadAction<number>) {
            state.checkOut.monto_cuota = action.payload;
        },
        setTotal(state, action: PayloadAction<number>) {
            state.checkOut.total = action.payload;
        },
    }
});
export const { setPlanCobro, setLstDeudaSeleccionada, setCheckOut, setMontoOriginal, setCredito,
    setInteresMora, setDescuento, setCantidadCuota, setCostoMontoCouta, setTotal } =
    CheckOutSlice.actions;

export const selectPlanCobro = (state: RootState) => state.checkOut.plan_cobro;
export const selectMontoOriginal = (state: RootState) => state.checkOut.checkOut.monto_original;
export const selectLstDeudaSeleccioanada = (state: RootState) => state.checkOut.lstDeudaSeleccionada;
export const selectCheckOut = (state: RootState) => state.checkOut.checkOut;




export default CheckOutSlice.reducer;