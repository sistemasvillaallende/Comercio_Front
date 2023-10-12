export interface Planes_Cobro {
    cod_plan: number;
    subsistema: number;
    cod_tarjeta: number;
    cod_paypertic: number;
    descripcion: string;
    con_dto_interes: number;
    ali_dto_interes: number;
    con_costo_financiero: number;
    ali_costo_financiero: number;
    suma_descadic: boolean;
    valor_min_cuota: number;
    cant_cuotas: number;
    activo_windows: number;
    activo_web: boolean;
    con_dto_obras: number;
    promotionCode: string;
    ali_prescripto: number;
    desc_capital: number;
    ali_obras: number;
  }