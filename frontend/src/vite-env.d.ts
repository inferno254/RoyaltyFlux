/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_AVALANCHE_RPC: string;
  readonly VITE_CHAIN_ID: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_PINATA_GATEWAY: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
