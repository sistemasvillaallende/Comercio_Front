/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_URL_BASE: string
    readonly VITE_URL_API_IYC: string
    readonly VITE_URL_TARJETAS: string
    readonly VITE_URL_CTACTE: string
    readonly VITE_URL_API_IYC_CEDULONES: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  