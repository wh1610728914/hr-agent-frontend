<template>
  
  <el-container style="min-height: 100vh;">
    <el-header
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
      "
    >
      <div>智能实验室预约系统</div>
      <div style="display: flex; align-items: center">
        <el-dropdown size="large" @command="handleCommand">
          <div style="margin-right: 10px; display: flex; align-items: center">
            <el-avatar :src="userInfo?.avatar" style="margin-right: 10px" />
            <span>{{userInfo?.name}}</span>
            
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="personal" >个人信息</el-dropdown-item>
              <el-dropdown-item command="pwd" >修改密码</el-dropdown-item>
              <el-dropdown-item divided command="logout" >退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="$route.path" router class="el-menu-vertical-demo">
          <el-menu-item index="/manager/home">
            <el-icon><Menu /></el-icon>
            <span>系统首页</span>
          </el-menu-item>
          <el-menu-item index="/manager/job">
            <el-icon><Menu /></el-icon>
            <span>职位管理</span>
          </el-menu-item>
          <el-menu-item index="/manager/candidates" >
            <el-icon><Menu /></el-icon>
            <span>候选人管理</span>
          </el-menu-item>
          <el-menu-item index="/manager/employees" >
            <el-icon><Menu /></el-icon>
            <span>员工管理</span>
          </el-menu-item>
          
          <el-menu-item index="/manager/hr" >
            <el-icon><document /></el-icon>
            <span>HR管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="flex: 1; width: 0;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container> 
</template>
<script setup lang="js">

</script>
<style scoped>

</style>
