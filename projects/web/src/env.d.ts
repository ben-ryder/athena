/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LFB_API_ENDPOINT: string
  readonly VITE_ONLINE_MODE: "true" | "false"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}