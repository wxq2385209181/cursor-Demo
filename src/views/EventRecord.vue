<template>
    <div class="event-record-container">
        <el-form :model="form" label-width="120px" :rules="rules">
            <el-form-item label="姓名">
                <el-input v-model="form.name" @input="recordEvent('input', '姓名', $event)" />
            </el-form-item>
            <el-form-item label="身份证" prop="card">
                <el-input v-model="form.card" @change="recordEvent('input', '身份证', $event)" />
            </el-form-item>
            <el-form-item label="地区">
                <el-select 
                    v-model="form.region" 
                    placeholder="请选择地区"
                    @change="recordEvent('select', '地区', $event)"
                >
                    <el-option label="区域一" value="shanghai" />
                    <el-option label="区域二" value="beijing" />
                </el-select>
            </el-form-item>
            

            <SignaturePad 
                ref="signaturePadRef"
                @draw="handleDraw" 
                @start="handleStart" 
                @stop="handleStop" 
                @clearFn="handleClear"
            />

            <el-form-item>
                <el-button 
                    type="primary" 
                    @click="startRecording" 
                    v-if="!isRecording"
                >
                    开始录制
                </el-button>
                <el-button 
                    type="danger" 
                    @click="stopRecording" 
                    v-else
                >
                    停止录制
                </el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 回放区域 -->
        <!-- <div v-if="events.length > 0" class="playback-area">
            <div class="replay-container" v-if="recordingEvents.length > 0">
              <Vedio />
            </div>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount, watch, onMounted } from 'vue'

import 'rrweb-player/dist/style.css'
import SignaturePad from '@/components/SignaturePad.vue'
import { events, signatureEvents, isRecording, handleDraw, handleClear, handleStart, handleStop } from '@/views/canvas'
import {stopFn, recordingEvents, player, startRecording, stopRecording, trackEvents} from '@/components/evenetRecord'
import { trackService } from '@/utils/track'
import { maskSensitiveInfo } from '@/utils/mask'

interface FormState {
    name: string
    region: string
    card: number | string
}

const form = reactive<FormState>({
    name: '',
    region: '',
    card: '',
})

// 修改事件记录方法
const recordEvent = (type: string, field: string, value: any) => {
    console.log('修改------', type, field, value);
    let maskedValue = value
    
    // // 对敏感字段进行脱敏
    // if (field === '身份证') {
    //     maskedValue = maskSensitiveInfo(value, 'idCard')
    // } else {
    //     maskedValue = value
    // }

    console.log('maskedValue-----', maskedValue);
    
    events.value.push({
        type,
        field,
        value: maskedValue,
        timestamp: Date.now()
    })
}

// 修改表单验证规则
const rules = ref({
    card: [
        { 
            validator: (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入身份证号码'))
                }
                if (!/^\d{17}[\dXx]$/.test(value)) {
                    return callback(new Error('身份证号码格式不正确'))
                }
                // 在验证通过后，记录脱敏后的值
                // recordEvent('input', '身份证', maskSensitiveInfo(value, 'idCard'))
                callback()
            }, 
            trigger: 'blur' 
        }
    ]
})

// 1. 添加对子组件的引用
const signaturePadRef = ref<InstanceType<typeof SignaturePad> | null>(null)

// 组件销毁前清理
onBeforeUnmount(() => {
    if (stopFn) {
        stopFn()
    }
    if (player) {
        player.destroy()
    }
})

// 添加埋点数据监听
watch(trackEvents, (newEvents) => {
    console.log('Track Events:', newEvents)
    // 这里可以将埋点数据发送到后端或分析系统
}, { deep: true })

// 重置
const resetForm = () => {   
    form.name = ''
    form.region = ''
    
    // 调用子组件的 clear 方法
    if (signaturePadRef.value) {
        signaturePadRef.value.clear()
        // 同时记录清除事件
        handleClear()                                                         
    }
    
    events.value = []
    recordingEvents.value = []          
    signatureEvents.value = []
    trackEvents.value = [] // 清理埋点数据
    if (player) {
        player.destroy()
    }
    
    trackService.clearEvents()
}

// 如果需要监听埋点事件
onMounted(() => {
    // 示例：每5秒获取一次埋点数据
    setInterval(() => {
        const events = trackService.getEvents()
        // 这里可以处理埋点数据，比如上报到服务器
    }, 5000)
})

</script>

<style scoped>
.event-record-container {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
}

.signature-area {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
}

canvas {
    border: 1px solid #ccc;
    cursor: crosshair;
}

.canvas-controls {
    margin-top: 10px;
}

.playback-area {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.replay-container {
    margin-top: 20px;
}

.replay-container h3 {
    margin-bottom: 10px;
}

#replay {
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
}

.replay-controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}
</style> 