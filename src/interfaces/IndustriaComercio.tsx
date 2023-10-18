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


