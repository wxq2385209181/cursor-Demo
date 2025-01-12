import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../stores/user'

const baseUrl = import.meta.env.VITE_BASE_URL

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: 'home'
    },
    {
        path: '/',
        component: () => import('../layouts/DefaultLayout.vue'),
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/Home.vue'),
                meta: {
                    title: '首页',
                    requiresAuth: true
                }
            },
            {
                path: 'about',
                name: 'About',
                component: () => import('../views/About.vue'),
                meta: {
                    title: '关于',
                    requiresAuth: true
                }
            },
            {
                path: 'handle-cavans',
                name: 'HandleCavans',
                component: () => import('../views/HandleCavans.vue'),
                meta: {
                    title: '签名',
                    requiresAuth: true
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    }
]

const router = createRouter({
    history: createWebHistory(baseUrl),
    routes
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    
    // if (to.meta.requiresAuth && !userStore.token) {
    //     next('/wxq/login')
    // } else {
    //     next()
    // }
    next()
})

export default router 