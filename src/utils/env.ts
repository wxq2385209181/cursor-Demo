export const getEnvConfig = () => {
    return {
        baseUrl: import.meta.env.VITE_BASE_URL,
        apiUrl: import.meta.env.VITE_API_URL,
        env: import.meta.env.VITE_ENV
    }
}

export const isDev = () => import.meta.env.VITE_ENV === 'development'
export const isTest = () => import.meta.env.VITE_ENV === 'test'
export const isUat = () => import.meta.env.VITE_ENV === 'uat'
export const isProd = () => import.meta.env.VITE_ENV === 'production' 