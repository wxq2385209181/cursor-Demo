/// <reference types="vite/client" />
/// <reference types="vue/dist/vue.d.ts" />

// Vue 组件类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量类型声明
interface ImportMetaEnv {
    readonly VITE_BASE_URL: string
    readonly VITE_API_URL: string
    readonly VITE_ENV: 'development' | 'test' | 'uat' | 'production'
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 