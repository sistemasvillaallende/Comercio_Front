/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_URL_BASE: string
    readonly VITE_URL_API_IYC: string
    readonly VITE_URL_TARJETAS: string
    readonly VITE_URL_API_IYC_CEDULONES: string
    readonly VITE_URL_AUTO: string
    readonly VITE_URL_LOGINCIDI: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  