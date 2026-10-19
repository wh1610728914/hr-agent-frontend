<template>
    <AuthLayout title="欢迎回来" type="登录">
        <!-- 表单 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
          size="large"
        >
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="用户名 / 邮箱"
              clearable
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              show-password
              clearable
              :prefix-icon="Lock"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <!-- 记住我 & 忘记密码 -->
          <div class="flex items-center justify-between mb-6">
            <!-- <el-checkbox v-model="loginForm.remember">记住我</el-checkbox> -->
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              class="w-full"
              :loading="loading"
              @click="handleLogin"
            >
              {{ loading ? '登录中...' : '登 录' }}
            </el-button>
          </el-form-item>

          <!-- 分割线 -->
          <el-divider>或</el-divider>

          <!-- 注册链接 -->
          <div class="text-center text-sm text-gray-500">
            <span>还没有账户？</span>
            <el-link type="primary" :underline="false" class="ml-1"
             @click="router.push('/register')"
            >立即注册</el-link>
          </div>
        </el-form>
    </AuthLayout>
  
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import AuthLayout from '@/components/AuthLayout.vue'
import {loginApi, type LoginDataRequest} from '@/api/auth'
import { useRouter } from 'vue-router'
const loading = ref(false)
const router = useRouter()
// 没有初始值，所以得传类型！
// FormInstance 是el-form组件的实例
const loginFormRef = ref<FormInstance>() // 这个ref里面装的是

const loginForm = reactive({
  email: '',
  password: '',
  // remember: false,
})

const loginRules: FormRules<typeof loginForm> = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
        pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change'],
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为 6 到 20 个字符', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
    if(!loginFormRef.value) return
    const valid = await loginFormRef.value.validate().catch(() => false)
    if(!valid) return
    loading.value = true
    try{
      const res = await loginApi(loginForm as LoginDataRequest)
      console.log(res);
      
      if(res.code === 200){
        ElMessage.success('登录成功')  
        router.push('/homePage')
      } else {
        ElMessage.error(res.message || '登录错误，请重新登录')
      }
    } catch {
      // 只有 try 里面的代码发生了“致命错误”（比如断网、代码写错报错），才会进这里
      ElMessage.error('登录错误，请重新登录')
    } 
    finally{
      loading.value = false
    }
    
}
</script>