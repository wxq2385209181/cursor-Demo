<template>
    <div class="handle-canvas-container">
        <el-card class="canvas-card">
            <template #header>
                <div class="card-header">
                    <span>电子签名</span>
                    <div class="tools">
                        <el-select v-model="lineWidth" placeholder="线条粗细">
                            <el-option
                                v-for="item in lineWidthOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                        <el-color-picker v-model="lineColor" size="small" @change="handleColorChange"/>
                    </div>
                </div>
            </template>
            
            <SignaturePad
                ref="signaturePadRef"
                :width="800"
                :height="400"
                :line-width="lineWidth"
                :line-color="lineColor"
                @save="handleSave"
            />

            <div class="preview" v-if="signatureImage">
                <h3>签名预览</h3>
                <img :src="signatureImage" alt="签名预览" />
                <div class="preview-actions">
                    <el-button type="primary" @click="downloadSignature">
                        <el-icon><Download /></el-icon>
                        下载签名
                    </el-button>
                    <el-button @click="clearPreview">
                        <el-icon><Delete /></el-icon>
                        清除预览
                    </el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SignaturePad from '@/components/SignaturePad.vue'

// 签名板引用
const signaturePadRef = ref<InstanceType<typeof SignaturePad> | null>(null)

// 线条样式
const lineWidth = ref(2)
const lineColor = ref('#000000')

// 线条粗细选项
const lineWidthOptions = [
    { value: 1, label: '细' },
    { value: 2, label: '中' },
    { value: 4, label: '粗' },
    { value: 6, label: '特粗' }
]

// 签名图片
const signatureImage = ref('')

// 处理保存
const handleSave = (dataUrl: string) => {
    signatureImage.value = dataUrl
    ElMessage.success('签名已保存')

    // for (let i=100; i<1000;i++) {
    //     let a = i%10;
    //     let b= (i-a)/10%10;                                                                                                                                                                 ;                                                                                                                                                                                                                                                                                                          
    //     let c = (i-(b*10+a))/100;
    //     if (a*a*a+b*b*b+ c*c*c === i) {
    //       console.log(i);
    //     }
    //   }

    for (let i = 1; i<10;i++) {
        for (let j = 1; j<=i; j++ ) {
             console.log(i + 'X' + j + '=' + i*j)
             if (i == j) {

             }
        }
}
}

// 处理颜色变化
const handleColorChange = (color: string) => {
    console.log('color--', color);
    lineColor.value = color
    // 可选：重置画布
    // resetCanvas()    
}

// 下载签名
const downloadSignature = () => {
    if (!signatureImage.value) {
        ElMessage.warning('请先签名')
        return
    }

    const link = document.createElement('a')
    link.href = signatureImage.value
    link.download = `signature_${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    ElMessage.success('签名已下载')
}

// 清除预览
const clearPreview = () => {
    signatureImage.value = ''
    ElMessage.success('预览已清除')
}

// 在父组件中添加重置方法
// const resetCanvas = () => {
//     signaturePadRef.value?.reset()
//     signatureImage.value = ''
// }
</script>

<style scoped>
.handle-canvas-container {
    padding: 20px;
}

.canvas-card {
    max-width: 1000px;
    margin: 0 auto;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tools {
    display: flex;
    gap: 10px;
    align-items: center;
}

.preview {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.preview h3 {
    margin-bottom: 10px;
    color: #333;
}

.preview img {
    max-width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
}

.preview-actions {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
}

:deep(.el-select) {
    width: 100px;
}
</style>