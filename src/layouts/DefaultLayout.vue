<template>
    <el-container class="layout-container">
        <el-aside width="200px">
            <el-menu
                :default-active="route.path"
                class="el-menu-vertical"
                router
            >
                <el-menu-item index="/home">
                    <el-icon><HomeFilled /></el-icon>
                    <span>首页</span>
                </el-menu-item>
                <el-menu-item index="/about">
                    <el-icon><InfoFilled /></el-icon>
                    <span>关于</span>
                </el-menu-item>
                <el-menu-item index="/handle-cavans">
                    <el-icon><InfoFilled /></el-icon>
                    <span>签名</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header>
                <div class="header-right">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            {{ userStore.userInfo?.username }}
                            <el-icon><ArrowDown /></el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { HomeFilled, InfoFilled, ArrowDown } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const handleCommand = (command: string) => {
    if (command === 'logout') {
        userStore.logout()
        router.push(`${import.meta.env.VITE_BASE_URL}/login`)
    }
}
</script>

<style scoped>
.layout-container {
    height: 100vh;
}

.el-header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
}

.el-aside {
    background-color: #304156;
}

.el-menu {
    border-right: none;
}

.header-right {
    color: #333;
}

.el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
}
</style> 