/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OS_MAPS_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
