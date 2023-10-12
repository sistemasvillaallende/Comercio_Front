export interface Planes {
  nro_plan: number;
  fecha_plan: string;
  fecha_fin_plan: string | null;
  dominio: string;
  nombre_solicitante: string | null;
  dni_solicitante: string | null;
  en_caracter_de_solicitante: string | null;
  nom_calle_solicitante: string | null;
  nro_dom_solicitante: string | null;
  nom_barrio_solicitante: string | null;
  piso_dpto_solicitante: string | null;
  localidad_solicitante: string | null;
  celular_solicitante: string | null;
  email_solicitante: string | null;
}
