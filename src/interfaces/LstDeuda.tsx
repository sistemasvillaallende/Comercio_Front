export interface LstDeuda {
    periodo: string;
    monto_original: number;
    debe: number;
    vencimiento: string;
    desCategoria: string;
    pagado: number;
    nroTtransaccion: number;
    categoriaDeuda: number;
    nro_cedulon_paypertic: number;
    recargo: number;
    pago_parcial: boolean;
    pago_a_cuenta: number;
    nro_proc: number;
  }