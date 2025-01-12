import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IUserInfo } from '../types'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<IUserInfo | null>(null)
    const token = ref<string>('')

    const setUserInfo = (info: IUserInfo) => {
        userInfo.value = info
    }

    const setToken = (newToken: string) => {
        token.value = newToken
    }

    const logout = () => {
        userInfo.value = null
        token.value = ''
    }

    return {
        userInfo,
        token,
        setUserInfo,
        setToken,
        logout
    }
}) 