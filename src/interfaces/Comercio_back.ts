export interface DDJJ {
  periodo: string;
  monto_original: number;
  vencimiento: string;
  categoria: string;
  ddjj: {
    nro_transaccion: number;
    legajo: number;
    periodo: string;
    completa: boolean;
    fecha_presentacion_ddjj: string;
    presentacion_web: number;
    cod_zona: string;
    cod_tipo_per: number;
  };
}

export interface RubroDeclaracion {
  periodo: string;
  concepto: string;
  nro_transaccion: number;
  rdji: {
    nro_transaccion: number;
    cod_rubro: number;
    cantidad: number;
    importe: number;
  };
}

export interface ImpresionDDJJ {
  vencimiento: string;
  nro_transaccion: number;
  periodo: string;
  legajo: number;
  cuit: string;
  nom_calle: string;
  nom_barrio: string;
  ciudad: string;
  provincia: string;
  rubros: {
    cod_rubro: number;
    importe: number;
    concepto: string;
  }[];
}
export interface PeriodoReliquida {
  tipo_transaccion: number;
  nro_transaccion: number;
  nro_pago_parcial: number;
  legajo: number;
  fecha_transaccion: string;
  periodo: string;
  monto_original: number;
  nro_plan: number;
  pagado: boolean;
  debe: number;
  haber: number;
  nro_procuracion: number;
  pago_parcial: boolean;
  vencimiento: string;
  nro_cedulon: number;
  declaracion_jurada: boolean;
  liquidacion_especial: boolean;
  cod_cate_deuda: number;
  monto_pagado: number;
  recargo: number;
  honorarios: number;
  iva_hons: number;
  tipo_deuda: number;
  decreto: string;
  observaciones: string;
  nro_cedulon_paypertic: number;
  des_movimiento: string;
  des_categoria: string;
  deuda: number;
  sel: number;
  costo_financiero: number;
  des_rubro: string;
  cod_tipo_per: number;
  sub_total: number;
  deuda_activa: number;
  tipo?: string; // Para mostrar en la tabla
} 