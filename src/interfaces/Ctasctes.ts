export interface Ctasctes {
  des_movimiento: string;
  periodo: string;
  tipo_transaccion: number;
  nro_transaccion: number;
  fecha_transaccion: Date;
  monto_original: number;
  debe: number;
  haber: number;
  nro_plan: number;
  nro_procuracion: number;
  categoria: string;
  sub_total: number;
  pagado: boolean;
  nro_cedulon: number;
}

export interface Combo {
  value: string;
  text: string;
  campo_enlace: string;
}


export interface DetCedulon {
  nroTran: number;
  periodo: string;
  monto: number;
}

export interface DetPago {
  fecha_movimiento: string;
  nro_transaccion: number;
  nro_cedulon: number;
  monto_pagado: number;
  descripcion: string;
  periodo: string;
  des_tarjeta: string;
  cant_cuotas: number;
  lstDet: DetCedulon[];
}

export interface DetDeuda {
  concepto: string;
  importe: number;
}

export interface DetProcuracion {
  dominio: string;
  nro_procuracion: number;
  descripcion_estado: string;
  nombre_procurador: string;
  saldo: number;
  fecha_comienzo_procuracion: string;
  fecha_comienzo_estado: string;
  fecha_fin_estado: string;
}

export interface Chequera {
  NRO_PLAN: number;
  NRO_CUOTA: number;
  MONTO_ORIGINA: number;
  INTERES_ACUMULADO: number;
  MONTO_ADEUDADO: number;
  VENCIMIENTO: string;
  FECHA_PAGO: string;
  monto_pagado: number;
  vencimiento_original: string;
  monto_a_acreditar: number;
  monto_actualizado: number;
}

export interface DetallePlanPago {
  periodo: string;
  deuda: number;
  pdes_categoria: string;
}

export interface DetPlanPago {
  nro_plan: number;
  monto_original: number;
  descuento: number;
  saldo_financiado: number;
  anticipo: number;
  cantidad_cuotas: number;
  interes: number;
  valor_cuota: number;
  fecha_plan: string;
  fecha_pri_cuota: string;
  imp_total: number;
  imp_pagado: number;
  imp_adeudado: number;
  imp_vencido: number;
  cuotas_pagadas: number;
  cuotas_vencidas: number;
  fecha_ultimo_pago: string;
  procuraciones_incluidas: string;
  lstDetallePlan: DetallePlanPago[];
  lstChequera: Chequera[];
}