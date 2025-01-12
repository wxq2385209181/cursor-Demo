<template>
    <div class="login-container">
        <el-card class="login-card">
            <template #header>
                <h2>登录系统</h2>
            </template>
            <el-form
                ref="formRef"
                :model="loginForm"
                :rules="rules"
                label-width="80px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        show-password
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()

const loginForm = reactive({
    username: '',
    password: ''
})

const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

const handleLogin = async () => {
    if (!formRef.value) return
    await formRef.value.validate((valid) => {
        if (valid) {
            userStore.setUserInfo({
                username: loginForm.username,
                roles: ['user']
            })
            userStore.setToken('dummy-token')
            router.push(`${import.meta.env.VITE_BASE_URL}/home`)
        }
    })
}
</script>

<style scoped>
.login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
}

.login-card {
    width: 400px;
}
</style> 