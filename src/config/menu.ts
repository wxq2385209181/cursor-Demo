import { HomeFilled, InfoFilled, Edit, VideoCamera, VideoPlay } from '@element-plus/icons-vue'

export interface MenuItem {
    path: string
    name: string
    icon: any
    requiresAuth: boolean
    children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
    {
        path: '/home',
        name: '首页',
        icon: HomeFilled,
        requiresAuth: true
    },
    {
        path: '/about',
        name: '关于',
        icon: InfoFilled,
        requiresAuth: true
    },
    {
        path: '/handle-cavans',
        name: '签名',
        icon: Edit,
        requiresAuth: true
    },
    {
        path: '/event-record',
        name: '事件记录',
        icon: VideoCamera,
        requiresAuth: true
    },
    {
        path: '/vedio',
        name: '事件回放',
        icon: VideoPlay,
        requiresAuth: true
    }
] 