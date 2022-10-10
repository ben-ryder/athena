/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LFB_API_ENDPOINT: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}