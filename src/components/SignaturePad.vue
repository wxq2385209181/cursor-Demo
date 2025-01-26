<template>
    <div class="signature-pad-container">
        <!-- 画布容器 -->
         <div v-if="!dataUrl">
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
        </div>
        <div v-else>
            <img :src="dataUrl" alt="签名">
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'

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
const emit = defineEmits(['save', 'draw', 'start', 'stop', 'clearFn'])

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

// 开始绘制
const startDrawing = (e: MouseEvent | TouchEvent) => {
    isDrawing.value = true
    const { x, y } = getCoordinates(e)
    lastX.value = x
    lastY.value = y
    emit('start', { x, y })
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
    emit('draw', { x, y })
}

// 停止绘制
const stopDrawing = () => {
    isDrawing.value = false
    emit('stop')
}



// 清除画布
const clear = () => {
    if (!ctx.value || !canvasRef.value) return
    ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    emit('clearFn')
}

const dataUrl=ref('');
// 添加判断画布是否为空的方法
const isCanvasEmpty = () => {
    if (!ctx.value || !canvasRef.value) return true
    
    const pixelBuffer = ctx.value.getImageData(
        0, 0, 
        canvasRef.value.width, 
        canvasRef.value.height
    ).data

    // 检查是否所有像素都是透明的
    return !pixelBuffer.some(x => x !== 0)
}

// 修改保存方法
const save = () => {
    if (!canvasRef.value) return
    
    // 判断画布是否为空
    if (isCanvasEmpty()) {
        ElMessage.warning('请先签名后再保存')
        return
    }
    
    dataUrl.value = canvasRef.value.toDataURL('image/png')
    emit('save', dataUrl.value)
}

// 暴露方法给父组件
defineExpose({
    clear,
    isCanvasEmpty // 暴露判断方法
})
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