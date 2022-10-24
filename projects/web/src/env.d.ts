/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LFB_SERVER_URL: string
  readonly VITE_ONLINE_MODE: "true" | "false"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}