// 埋点事件类型定义
export interface TrackEvent {
    eventName: string
    eventType: string
    timestamp: number
    extra?: Record<string, any>
}

class TrackService {
    private events: TrackEvent[] = []

    // 记录事件
    track(eventName: string, eventType: string, extra?: Record<string, any>) {
        const event: TrackEvent = {
            eventName,
            eventType,
            timestamp: Date.now(),
            extra
        }
        this.events.push(event)
        this.log(event)
        // 这里可以添加上报逻辑
    }

    // 记录带浏览器信息的事件
    trackWithBrowser(eventName: string, eventType: string, extra?: Record<string, any>) {
        this.track(eventName, eventType, {
            ...extra,
            browserInfo: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language
            }
        })
    }

    // 获取所有事件
    getEvents() {
        return this.events
    }

    // 清空事件
    clearEvents() {
        this.events = []
    }

    // 打印事件日志
    private log(event: TrackEvent) {
        console.log('Track Event:', event)
    }
}

// 创建单例
export const trackService = new TrackService() 