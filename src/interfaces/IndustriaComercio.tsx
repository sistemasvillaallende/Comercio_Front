export interface ElementoIndustriaComercio {
  legajo: number;
  nro_bad: number;
  nro_contrib: number;
  des_com: string;
  nom_fantasia: string;
  cod_calle: number;
  nro_dom: number;
  cod_barrio: number;
  cod_tipo_per: number;
  cod_zona: string;
  pri_periodo: string;
  tipo_liquidacion: number;
  dado_baja: boolean;
  fecha_baja: string;
  exento: boolean;
  vencimiento_eximido: string;
  per_ult: string;
  fecha_inicio: string;
  fecha_hab: string;
  nro_res: string;
  nro_exp_mesa_ent: string;
  nro_ing_bruto: string;
  nro_cuit: string;
  transporte: boolean;
  fecha_alta: string;
  nom_calle: string;
  nom_barrio: string;
  ciudad: string;
  provincia: string;
  pais: string;
  cod_postal: string;
  cod_calle_dom_esp: number;
  nom_calle_dom_esp: string;
  nro_dom_esp: number;
  piso_dpto_esp: string;
  local_esp: string;
  cod_barrio_dom_esp: number;
  nom_barrio_dom_esp: string;
  ciudad_dom_esp: string;
  provincia_dom_esp: string;
  pais_dom_esp: string;
  cod_postal_dom_esp: string;
  fecha_cambio_domicilio: string;
  emite_cedulon: boolean;
  cod_situacion_judicial: number;
  telefono1: string;
  telefono2: string;
  celular1: string;
  celular2: string;
  ocupacion_vereda: boolean;
  con_sucursal: boolean;
  nro_sucursal: number;
  es_transferido: boolean;
  con_ddjj_anual: boolean;
  cod_zona_liquidacion: string;
  debito_automatico: boolean;
  clave_pago: string;
  fecha_ddjj_anual: string;
  email_envio_cedulon: string;
  telefono: string;
  celular: string;
  reempadronamiento: boolean;
  empadronado: number;
  fecha_empadronado: string;
  es_agencia: number;
  clave_gestion: string;
  nro_local: string;
  cedulon_digital: number;
  piso_dpto: string;
  cod_cond_ante_iva: number;
  cod_caracter: number;
  categoria_iva: string;
  otra_entidad: string;
  convenio_uni: number;
  cod_nueva_zona: string;
  fecha_vecino_digital: string;
  cuit_vecino_digital: string;
  vto_inscripcion: string;
  titular: string;
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

export interface TiposLiqIyc {
  cod_tipo_liq: number;
  descripcion_tipo_liq: string;
}

export interface CondicionesDeIVA {
  cod_cond_ante_iva: number;
  des_cond_ante_iva: string;
  alicuota: number;
}

export interface SituacionesJudiciales {
  value: string;
  text: string;
  campo_enlace: string;
}

export interface TipoDeEntidad {
  value: string;
  text: string;
  campo_enlace: string;
}

export interface Zonas {
  "value": string;
  "text": string;
  "campo_enlace": string;
}

export interface BaseImponible {
  legajo: number;
  periodo: string;
  nro_transaccion: number;
  anio: number;
  fecha_presentacion_ddjj: string;
  cod_rubro: number;
  concepto: string;
  monto_original: number;
  debe: number;
  cantidad: number;
  importe: number;
  alicuota_oim: number;
  alicuota_sys: number;
  minimo_oim: number;
  minimo_sys: number;
  incluido_en_oim: number;
}

export interface InterfaceComerciosPorCalle {
  legajo: number;
  nombre: string;
  cod_rubro: number;
  concepto: string;
  nom_calle: string;
  nro_dom: string;
  nom_bario: string;
  telefono: string;
  celular: string;
  email: string;
  nom_fantasia: string;
  des_cond_ante_iva: string;
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

export interface CabeceraDeCedulon {
  nroCedulon: number;
  denominacion: string;
  detalle: string;
  nombre: string;
  vencimiento: string;
  montoPagar: number;
  cuit: string;
  codigo_barra: string;
}

export interface VCedulon {
  deudaOriginal: number;
  intereses: number;
  nro_cedulon_paypertic: number;
  pago_parcial: boolean;
  pago_a_cuenta: number;
  nro_transaccion: number;
  periodo: string;
  importe: number;
  fecha_vencimiento: string;
  categoria_deuda: number;
}

export interface DetalleCedulon {
  periodo: string;
  concepto: string;
  montoPagado: number;
  montoOriginal: number;
  recargo: number;
  descInteres: number;
  saldoFavor: number;
  nro_transaccion: number;
}

export interface CedulonImpresion {
  tarjetaDeCredito: string;
  cantCuotas: number;
  montoCuota: number;
  montoOriginal: number;
  credito: number;
  interesMora: number;
  descuento: number;
  costoFinanciero: number;
  total: number;
}

export interface InformeCompleto {
  vencimiento: Date;
  nro_transaccion: number;
  tipo_transaccion: number;
  des_transaccion: string;
  categoria: string;
  periodo: string;
  debe: number;
  haber: number;
  nro_plan: number;
  nro_procuracion: number;
  des_categoria: string;
  des_movimiento: string;
}

export interface CategoriasDeuda {
  value: string;
  text: string;
  campo_enlace: string;
}

export interface Badec {
  nro_bad: number;
  interno: boolean;
  persona: boolean;
  contribuyente: boolean;
  tipo_instit: string;
  nombre: string;
  tip_doc: string;
  nro_doc: string;
  cod_calle: number;
  nro_dom: number;
  cod_barrio: number;
  cod_postal: number;
  localidad: string;
  provincia: string;
  pais: string;
  cod_nivel_vida: number;
  cod_vip: number;
  codigo_actividad: number;
  telefono: string;
  e_mail: string;
  nro_contrib: number;
  piso_dpto: string;
  nombre_calle: string;
  nombre_barrio: string;
  titulo: string;
  cuit: string;
  sexo: string;
  fecha_alta: string;
  id_tip_doc: number;
  cod_postal_arg: string;
  celular: string;
  usuario: string;
  subsistema: string;
  cuit_afip: number;
  ciudadano_digital: boolean;
  fecha_nacimiento: string;
}
