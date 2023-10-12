import { VCtasctes } from "./VCtasctes";

export interface CreateCedulones {
  nroCedulon: number;
  dominio: string;
  vencimiento: string;
  monto_cedulon: number;
  nroProc: number;
  listaDeuda: VCtasctes[];
}
