<template>
    <div class="signature-pad-container">
        <!-- 画布容器 -->
        <canvas
            ref="canvasRef"
            :width="width"
            :height="height"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart="startDrawing"
            @touchmove="draw"
            @touchend="stopDrawing"
        ></canvas>
        <!-- 操作按钮 -->
        <div class="button-container">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="clear">清除</el-button>
        </div>
        <div></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// 定义props
const props = defineProps({
    width: {
        type: Number,
        default: 400
    },
    height: {
        type: Number,
        default: 200
    },
    lineWidth: {
        type: Number,
        default: 2
    },
    lineColor: {
        type: String,
        default: '#000'
    }
})

// 定义emit
const emit = defineEmits(['save'])

// 画布相关变量
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const isDrawing = ref(false)
const lastX = ref(0)
const lastY = ref(0)

// 更新画笔样式
const updateStyle = () => {
    if (!ctx.value) return
    ctx.value.strokeStyle = props.lineColor
    ctx.value.lineWidth = props.lineWidth
}

// 监听 props 变化
watch(() => props.lineColor, (newColor) => {
    updateStyle()
}, { immediate: true })

watch(() => props.lineWidth, (newWidth) => {
    updateStyle()
}, { immediate: true })




// 初始化画布
onMounted(() => {
    if (!canvasRef.value) return
    ctx.value = canvasRef.value.getContext('2d')
    if (!ctx.value) return
    
    // 初始化画笔样式
    ctx.value.lineCap = 'round'
    ctx.value.lineJoin = 'round'
    updateStyle()
})

// 开始绘制
const startDrawing = (e: MouseEvent | TouchEvent) => {
    isDrawing.value = true
    const { x, y } = getCoordinates(e)
    lastX.value = x
    lastY.value = y
}

// 绘制过程
const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing.value || !ctx.value) return
    e.preventDefault()

    const { x, y } = getCoordinates(e)
    
    ctx.value.beginPath()
    updateStyle()
    ctx.value.moveTo(lastX.value, lastY.value)
    ctx.value.lineTo(x, y)
    ctx.value.stroke()
    
    lastX.value = x
    lastY.value = y
}

// 停止绘制
const stopDrawing = () => {
    isDrawing.value = false
}

// 获取坐标
const getCoordinates = (e: MouseEvent | TouchEvent) => {
    if (!canvasRef.value) return { x: 0, y: 0 }
    
    const rect = canvasRef.value.getBoundingClientRect()
    if (e instanceof MouseEvent) {
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    } else {
        const touch = e.touches[0]
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        }
    }
}

// 清除画布
const clear = () => {
    if (!ctx.value || !canvasRef.value) return
    ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

// 保存签名
const save = () => {
    if (!canvasRef.value) return
    const dataUrl = canvasRef.value.toDataURL('image/png')
    emit('save', dataUrl)
}
</script>

<style scoped>
.signature-pad-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

canvas {
    border: 1px solid #ccc;
    cursor: crosshair;
}

.button-container {
    display: flex;
    gap: 10px;
}
</style>