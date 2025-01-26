import { defineStore } from 'pinia'
import { ref } from 'vue'


export const newVedio = defineStore('vedio', () => {
    const vedioInfo = ref<any>(null);
    const handleInfo = ref<any>(null);

    const setUserVedio = (info: any) => {
        vedioInfo.value = info
    }

    const setHandleInfo = (info: any) => {
        handleInfo.value = info
    }

    return {
        vedioInfo,
        handleInfo,
        setUserVedio,
        setHandleInfo
    }
}) 