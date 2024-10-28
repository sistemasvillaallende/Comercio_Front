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