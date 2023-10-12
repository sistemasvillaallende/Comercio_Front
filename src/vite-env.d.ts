/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_URL_BASE: string
    readonly VITE_URL_AUTO: string
    readonly VITE_URL_CTACTE: string
    readonly VITE_URL_TARJETAS: string
    readonly VITE_URL_CEDULONES: string
    readonly VITE_URL_API_AUTO: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  