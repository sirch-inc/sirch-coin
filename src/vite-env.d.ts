/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_PROJECT_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_PAGE_TITLE: string
  readonly VITE_BUILD_VERSION: string
  readonly VITE_BUILD_VERSION_VERBOSE: string
  readonly VITE_IS_COMING_SOON: string
  readonly VITE_IS_OFFLINE: string
  readonly VITE_STRIPE_API_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}