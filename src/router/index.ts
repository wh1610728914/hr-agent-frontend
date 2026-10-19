import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/manager',
      name: 'Layout',
      component: () => import('@/components/HomeLayout.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/HomePage.vue'),
          meta: { title: '首页' }
        },
        {
          path: 'job',
          name: 'Job',
          component: () => import('@/views/Job.vue'),
          meta: { title: '职位管理' }
        },
        {
          path: 'candidates',
          name: 'Candidate',
          component: () => import('@/views/Candidates.vue'),
          meta: { title: '候选人管理' }
        },
        {
          path: 'employees',
          name: 'Employees',
          component: () => import('@/views/Employees.vue'),
          meta: { title: '员工管理' }
        },
        {
          path: 'hr',
          name: 'Hr',
          component: () => import("@/views/Hr.vue"),
          meta: { title: 'HR管理' }
        }
      ]
    },

  ],
})

export default router
