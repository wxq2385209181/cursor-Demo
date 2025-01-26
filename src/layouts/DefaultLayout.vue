<template>
    <el-container class="layout-container">
        <el-aside :width="isCollapse ? '64px' : '200px'" class="menu-aside">
            <el-menu
                :default-active="route.path"
                class="el-menu-vertical"
                :collapse="isCollapse"
                router
            >
                <template v-for="item in menuItems" :key="item.path">
                    <el-menu-item :index="item.path">
                        <el-icon>
                            <component :is="item.icon" />
                        </el-icon>
                        <template #title>
                            <span>{{ item.name }}</span>
                        </template>
                    </el-menu-item>                                                                                                          
                </template>
            </el-menu>
        </el-aside>

        <el-container>
            <el-header>
                <div class="left-icon">
                    <el-icon 
                        @click="toggleCollapse"
                    >
                        <Fold v-if="!isCollapse"/>
                        <Expand v-else/>
                    </el-icon>
                </div>
                <div class="breadcrumb">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ currentMenu?.name }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
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
import { ref, computed } from 'vue'
import { ArrowDown, Fold, Expand } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { menuItems } from '../config/menu'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 菜单折叠控制
const isCollapse = ref(false)
const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
}

// 获取当前菜单项
const currentMenu = computed(() => {
    return menuItems.find(item => item.path === route.path)
})

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

.menu-aside {
    background-color: #304156;
    transition: width 0.3s;
}

.menu-header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 16px;
    border-bottom: 1px solid #1f2d3d;
}

.collapse-icon {
    color: #fff;
    cursor: pointer;
    font-size: 20px;
}

.el-menu {
    border-right: none;
}

.el-header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    gap: 10px;

}

.breadcrumb {
    font-size: 14px;
    flex: 1;
}

.header-right {
    color: #333;
}

.el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
}
.left-icon {
    display: flex;
}

:deep(.el-menu-vertical:not(.el-menu--collapse)) {
    width: 200px;
}
</style> 