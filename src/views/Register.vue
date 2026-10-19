<template>
    <!-- 标题改为注册相关的文案 -->
    <AuthLayout title="招聘系统" type="注册">
        <!-- 表单 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-position="top"
        >
          <!-- 1. 邮箱 -->
          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱地址"
              clearable
              :prefix-icon="Message" 
            />
          </el-form-item>

          <!-- 2. 邀请码 -->
          <el-form-item prop="invite_code" label="邀请码">
            <el-input
              v-model="registerForm.invite_code"
              placeholder="请输入邀请码"
              clearable
              :prefix-icon="Key"
            />
          </el-form-item>

          <!-- 3 & 4. 用户名 & 真实姓名 (两列布局) -->
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item prop="username" label="用户名">
                <el-input
                  v-model="registerForm.username"
                  placeholder="请输入用户名"
                  clearable
                  :prefix-icon="User"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="realname" label="真实姓名">
                <el-input
                  v-model="registerForm.realname"
                  placeholder="请输入真实姓名"
                  clearable
                  :prefix-icon="Avatar"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 5 & 6. 密码 & 确认密码 (两列布局) -->
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item prop="password" label="密码">
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请设置密码"
                  show-password
                  :prefix-icon="Lock"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmPassword" label="确认密码">
                <el-input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  show-password
                  :prefix-icon="Lock"
                  @keyup.enter="handleRegister"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 注册按钮 -->
          <el-form-item class="mt-2">
            <el-button
              type="primary"
              class="w-full"
              size="large"
              :loading="loading"
              @click="handleRegister"
            >
              {{ loading ? '注册中...' : '注 册' }}
            </el-button>
          </el-form-item>

          <!-- 分割线 -->
          <el-divider>或</el-divider>

          <!-- 登录链接 -->
          <div class="text-center text-sm text-gray-500">
            <span>已有账户？</span>
            <el-link type="primary" :underline="false" class="ml-1"
            @click="router.push('/login')"
            >立即登录</el-link>
          </div>
        </el-form>
    </AuthLayout>
  
</template>

<script setup lang="ts">
// 补充引入了需要用到的图标
import { Lock, User, Message, Key, Avatar } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import AuthLayout from '@/components/AuthLayout.vue'
// 注意：这里你需要引入真实的注册 API，此处假设为 registerApi
// import { registerApi, type RegisterDataRequest } from '@/api/auth' 
import router from '@/router'
import { registerApi, type RegisterDataRequest } from '@/api/auth'

const loading = ref(false)
const registerFormRef = ref<FormInstance>()

// 定义表单数据，匹配截图中的 6 个字段
const registerForm = reactive({
  email: '',
  invite_code: '',
  username: '',
  realname: '',
  password: '',
  confirmPassword: '',
})

// 自定义校验规则：确认密码是否一致
const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// 定义校验规则
const registerRules: FormRules<typeof registerForm> = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
        pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change'],
    },
  ],
  invite_code: [
    { required: true, message: '请输入邀请码', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度应为 3 到 15 个字符', trigger: 'blur' }
  ],
  realname: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' } // 绑定自定义校验
  ],
}

// 提交注册逻辑
const handleRegister = async () => {
    if(!registerFormRef.value) return
    
    // 验证表单
    const valid = await registerFormRef.value.validate().catch(() => false)
    if(!valid) return

    loading.value = true
    try{
      // 剔除 confirmPassword，因为后端通常不需要这个字段
      const { confirmPassword, ...submitData } = registerForm 
      
      // 调用注册 API (你需要把 loginApi 改成你的注册Api)
      const res = await registerApi(submitData as RegisterDataRequest) 
      
      if (res.code === 200){
        ElMessage.success('注册成功，请去登录')
        // 注册成功后跳转到登录页
        router.push('/login')
      }
    } catch (error) {
        // 可以在这里打印错误或显示后端返回的错误信息
        ElMessage.error('注册失败，请稍后重试')
    } finally{
      loading.value = false
    }
}
</script>
<style scoped>
.el-form-item{
    --el-form-item-margin-bottom:16px
}
</style>