<template>
  <!-- 使用 h-screen 强制撑满屏幕，w-full 撑满宽度 -->
  <div class="h-screen w-screen flex bg-gray-100 overflow-hidden">
    
    <!-- 左侧品牌区域 (占据 50% 宽度) -->
    <div class="hidden md:flex md:w-1/2 bg-linear-to-br from-blue-600 to-indigo-700 items-center justify-center relative overflow-hidden">
      <div class="text-center text-white z-10">
        <el-icon :size="64"><Platform /></el-icon>
        <h1 class="text-3xl font-bold mt-4">Element Plus</h1>
        <p class="text-blue-100 mt-2">基于 Vue 3 的组件库</p>
      </div>
      <!-- 装饰性光斑 -->
      <div class="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
    </div>

    <!-- 右侧表单区域 (占据 50% 宽度，内容居中) -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-6 relative">
      <!-- 卡片 -->
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 z-10">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
          <p class="text-gray-500 mt-2">请{{ type }}您的账户</p>
        </div>
        
        <!-- 插槽放表单 -->
        <slot></slot>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { Platform } from '@element-plus/icons-vue'

withDefaults(defineProps<{
  title: string
  type: string
}>(), {
  title: '欢迎回来',
  type: '登录',
})
</script>