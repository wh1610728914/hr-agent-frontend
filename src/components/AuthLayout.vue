<template>
  <!-- 外层容器：使用渐变背景代替纯灰，让居中的卡片更突出 -->
  <div class="h-screen w-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
    
    <!-- 背景装饰性光斑 (让居中后的页面不显得单调) -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-indigo-400/20 rounded-full blur-3xl"></div>

    <!-- 居中的卡片容器 -->
    <!-- max-w-lg 让卡片比原来稍微宽一点，适合放较多字段的表单 -->
    <div class="w-full max-w-xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 z-10 mx-4">
      
      <!-- 头部标题区 -->
      <div class="text-center mb-8">
        <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
        <p class="text-gray-500 mt-2">请{{ type }}您的账户</p>
      </div>
      
      <!-- 表单插槽 -->
      <slot></slot>
      
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