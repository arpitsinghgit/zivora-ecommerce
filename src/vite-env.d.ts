/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INSFORGE_URL: string;
  readonly VITE_INSFORGE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
