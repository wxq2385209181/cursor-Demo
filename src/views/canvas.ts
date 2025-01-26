import { ref } from 'vue'



export interface SignatureEvent {
    type: 'draw' | 'clear'
    points?: {
        fromX: number
        fromY: number
        toX: number
        toY: number
    }
    timestamp: number
}

interface Event {
    type: string
    field: string
    value: any
    timestamp: number
}
// 添加签名事件数组
export const signatureEvents = ref<SignatureEvent[]>([])

export const isRecording = ref(false)

let lastX = 0
let lastY = 0
export const events = ref<Event[]>([])

export const handleClear = () => {
    console.log('handleClear')
    if (isRecording.value) {
            signatureEvents.value.push({
                type: 'clear',
                timestamp: Date.now()
            })
        }
}



// draw 事件
export const handleDraw = (event: any) => {
    const { x, y } = event

    if (isRecording.value) {
        signatureEvents.value.push({
            type: 'draw',
            points: {
                fromX: lastX,
                fromY: lastY,
                toX: x,
                toY: y
            },
            timestamp: Date.now()
        })
    }
    
    // 更新坐标
    lastX = x
    lastY = y
}

// 记录事件
export const recordEvent = (type: string, field: string, value: any) => {
    events.value.push({
        type,
        field,
        value,
        timestamp: Date.now()
    })
}
export const handleStart = (event: any) => {
    const { x, y } = event
    lastX = x
    lastY = y
    
    recordEvent('signature_start', '签名', { x, y })
}

export const handleStop = (event: any) => {
    recordEvent('signature_end', '签名', null);
}
