import { events, signatureEvents, isRecording } from '@/views/canvas'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as rrweb from 'rrweb'
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'
import { newVedio } from '@/stores/vedio'
import { trackService } from '@/utils/track'
import { maskSensitiveInfo, maskIDCard } from '@/utils/mask'

export const replayEl = ref<HTMLElement | null>(null)
export const recordingEvents = ref<any[]>([])
export let stopFn: (() => void) | null | undefined = null
export let player: any | null = null

const vedioStore = newVedio()
const handleStore = newVedio()

// 播放速度控制
const playbackSpeed = ref(1) // 默认速度为 1

// 添加埋点类型定义
interface TrackEvent {
    eventName: string
    eventType: string
    timestamp: number
    extra?: Record<string, any>
}

// 添加埋点事件数组
export const trackEvents = ref<TrackEvent[]>([])

// 开始录制
export const startRecording = () => {
    console.log('开始录制----');
    recordingEvents.value = []
    signatureEvents.value = []
    isRecording.value = true
    
    trackService.trackWithBrowser('开始录制', 'record_start')
    
    stopFn = rrweb.record({
        emit(event) {
            console.log('stopFn-------', event);
            // 检查是否是输入事件
            if (event.type === 2 && event.data?.text) {
                const target = event.data.target as any
                // 检查是否是身份证输入框
                const isCardInput = target?.attributes?.find((attr: any) => 
                    attr.name === 'prop' && attr.value === 'card'
                )
                if (isCardInput) {
                    console.log('身份证输入:', event.data.text)
                    event.data.text = maskIDCard(event.data.text)
                }
            }
            recordingEvents.value.push(event)
        },
        sampling: {
            input: true, // 记录所有输入事件
            mousemove: false,
            scroll: true,
            media: true
        },
        recordCanvas: true,
        inlineStylesheet: true,
        // 不要屏蔽任何输入
        maskAllInputs: false,
        // 不要脱敏任何文本
        maskTextSelector: false,
        // 只对身份证输入框进行脱敏
        maskInputFn: (element) => {
            return (element as HTMLElement)?.getAttribute('prop') === 'card'
        }
    })
    
    ElMessage.success('开始录制')
}

// 停止录制
export const stopRecording = () => {
    if (stopFn) {
        stopFn()
        stopFn = null
    }
    isRecording.value = false
    
    // 使用埋点服务记录事件
    trackService.track('停止录制', 'record_stop', {
        recordDuration: Date.now() - trackService.getEvents()[0]?.timestamp || 0,
        eventsCount: recordingEvents.value.length
    })
    
    vedioStore.setUserVedio(recordingEvents.value)
    handleStore.setHandleInfo(events.value)
    ElMessage.success('录制已停止')
}

// 回放录制
export const replayRecording = () => {
    console.log('replayRecording', recordingEvents.value, replayEl.value)
    if (!replayEl.value || recordingEvents.value.length === 0) return
    
    // 清空回放区域
    if (replayEl.value) {
        replayEl.value.innerHTML = ''
    }

    // 创建回放画布，并设置样式
    const replayCanvas = document.createElement('canvas')
    replayCanvas.width = 400
    replayCanvas.height = 200
    replayCanvas.style.cssText = `
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 10px auto;
        display: block;
    `
    const replayCtx = replayCanvas.getContext('2d')

    if (replayCtx) {
        replayCtx.strokeStyle = '#000'
        replayCtx.lineWidth = 2
        replayCtx.lineCap = 'round'
        replayCtx.lineJoin = 'round'
    }

    // 创建 rrweb 播放器容器
    const rrwebContainer = document.createElement('div')
    rrwebContainer.className = 'rrweb-container'
    replayEl.value.appendChild(rrwebContainer)

    // 创建播放器
    player = new (rrwebPlayer as any)({
        target: rrwebContainer,
        data: {
            events: recordingEvents.value,
            autoPlay: true,
            speed: playbackSpeed.value
        }
    })

    // 回放签名事件的逻辑
    let currentIndex = 0
    const events = signatureEvents.value
    
    // 计算事件之间的实际时间间隔
    const timeIntervals = events.map((event, index) => {
        if (index === 0) return 0
        return events[index].timestamp - events[index - 1].timestamp
    })

    const replaySignature = () => {
        if (currentIndex >= events.length) return
        
        const event = events[currentIndex]
        const delay = currentIndex === 0 ? 0 : Math.min(timeIntervals[currentIndex] / playbackSpeed.value, 16)

        setTimeout(() => {
            if (event.type === 'draw' && event.points && replayCtx) {
                console.log('Drawing:', {
                    fromX: event.points.fromX,
                    fromY: event.points.fromY,
                    toX: event.points.toX,
                    toY: event.points.toY
                })

                replayCtx.beginPath()
                replayCtx.moveTo(event.points.fromX, event.points.fromY)
                replayCtx.lineTo(event.points.toX, event.points.toY)
                replayCtx.stroke()
            } else if (event.type === 'clear' && replayCtx) {
                replayCtx.clearRect(0, 0, replayCanvas.width, replayCanvas.height)
            }

            currentIndex++
            replaySignature()
        }, delay)
    }

    replaySignature()
}

// 保存录制
export const saveRecording = () => {
    const recordingData = {
        rrwebEvents: recordingEvents.value, 
        signatureEvents: signatureEvents.value
    }

    const blob = new Blob(
        [JSON.stringify(recordingData)], 
        { type: 'application/json' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recording-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success('录制已保存')
}
