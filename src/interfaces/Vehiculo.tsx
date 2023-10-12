export interface Vehiculo {
  dominio: string;
  marca: string;
  modelo: string;
  nacional: boolean;
  anio: number;
  nro_bad: number;
  codigo_vehiculo: number;
  peso_cm3: number;
  fecha_cambio_dominio: Date | null;
  dominio_anterior: string;
  fecha_alta: Date;
  tipo_alta: boolean;
  baja: boolean;
  fecha_baja: Date;
  tipo_baja: number;
  per_ult: string;
  codigo_cip: string;
  variante: string;
  exento: boolean;
  tributa_minimo: boolean;
  nro_motor: string;
  cod_barrio_dom_esp: number;
  nom_barrio_dom_esp: string;
  cod_calle_dom_esp: number;
  nom_calle_dom_esp: string;
  nro_dom_esp: number;
  piso_dpto_esp: string;
  ciudad_dom_esp: string;
  provincia_dom_esp: string;
  pais_dom_esp: string;
  cod_postal_dom_esp: string;
  fecha_cambio_domicilio: Date | null;
  fecha_exencion: Date | null;
  fecha_vto_exencion: Date | null;
  causa_exencion: string;
  fecha_ingreso: Date;
  emite_cedulon: boolean;
  cod_registro_auto: number;
  responsable: string;
  porcentaje: string;
  sexo: string;
  cod_alta: number;
  cod_baja: number;
  debito_automatico: boolean;
  nro_secuencia: number;
  cod_situacion_judicial: number;
  codigo_cip_ant: string;
  codigo_acara: string;
  nombre: string;
  cod_tipo_documento: number;
  nro_documento: string;
  cod_tipo_liquidacion: number;
  clave_pago: string;
  monto: number;
  email_envio_cedulon: string;
  telefono: string;
  celular: string;
  fecha_cambio_radicacion: Date | null;
  cedulon_digital: number;
  usuario: string;
  usuariomodifica: string;
  fecha_modificacion: Date;
  clave_pago2: string;
  cuit: string;
  cuit_vecino_digital: string;
  fecha_vecino_digital: Date | null;
  con_deuda: number;
  saldo_adeudado: number;
  fecha_baja_real: Date | null;
  fecha_denuncia_vta: Date | null;
  multas: number;
}
export interface ReLiquidacion {
  tipo_transaccion: number;
  nro_transaccion: number;
  nro_pago_parcial: number;
  dominio: string;
  fecha_transaccion: string;
  periodo: string;
  monto_original: number;
  nro_plan: number | null;
  pagado: boolean;
  debe: number;
  haber: number;
  nro_procuracion: number;
  pago_parcial: boolean;
  vencimiento: string;
  nro_cedulon: number;
  categoria_deuda: number;
  monto_pagado: number;
  recargo: number;
  honorarios: number;
  iva_hons: number;
  tipo_deuda: number;
  decreto: string;
  observaciones: string;
  nro_cedulon_paypertic: number;
  deuda_activa: number;
  des_movimiento: string;
  des_categoria: string;
  deuda: number;
  sel: number;
  costo_financiero: number;
  des_rubro: string;
  cod_tipo_per: number;
  sub_total: number;
}

export interface Valuacion {
  anio: number;
  base_imponible: number;
}

export interface ConceptoDeAuto {
  dominio: string;
  cod_concepto_dominio: number;
  des_concepto_dominio: string;
  porcentaje: number;
  monto: number;
  vencimiento: string;
  nro_decreto: number;
  fecha_alta: string;
  activo: number;
  anio_desde: number;
  anio_hasta: number;
  observaciones: string;
  objAuditoria: {
    id_auditoria: number;
    fecha: string;
    usuario: string;
    proceso: string;
    identificacion: string;
    autorizaciones: string;
    observaciones: string;
    detalle: string;
    ip: string;
  };
}

export interface Concepto {
  cod_concepto_dominio: number;
  des_concepto_dominio: string;
  suma: boolean;
  activo: boolean;
}

